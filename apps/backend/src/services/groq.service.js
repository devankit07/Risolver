import Groq from "groq-sdk";
import { config } from "../config/config.js";
import incidentUpdateModel from "../models/incidentUpdate.model.js";

let groqClient = null;

function getGroq() {
  if (!config.GROQ_API_KEY?.trim()) {
    throw new Error("GROQ_API_KEY is not configured — add it to .env for AI features");
  }
  if (!groqClient) {
    groqClient = new Groq({ apiKey: config.GROQ_API_KEY });
  }
  return groqClient;
}

function parseJsonFromModel(rawContent) {
  if (!rawContent || typeof rawContent !== "string") return null;
  const trimmed = rawContent.trim();

  try {
    return JSON.parse(trimmed);
  } catch {
    // continue
  }

  const fenced = trimmed
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
  try {
    return JSON.parse(fenced);
  } catch {
    // continue
  }

  const firstBrace = fenced.indexOf("{");
  const lastBrace = fenced.lastIndexOf("}");
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    const candidate = fenced.slice(firstBrace, lastBrace + 1);
    try {
      return JSON.parse(candidate);
    } catch {
      return null;
    }
  }

  return null;
}

function buildFallbackSummary(incident) {
  const description = (incident?.description || "").trim();
  const points = description
    .split(/[\n\.]+/)
    .map((p) => p.trim())
    .filter(Boolean)
    .slice(0, 4);

  return {
    summary:
      points.length > 0
        ? points
        : [
            `Incident detected in ${incident?.service || "the affected service"}.`,
            `Severity marked as ${incident?.severity || "unknown"}.`,
            "Investigation and mitigation steps are required to restore normal behavior.",
          ],
  };
}

function buildFallbackFix(incident) {
  return {
    approach: `Stabilize ${incident?.service || "the service"}, identify the failing component, and deploy a safe rollback or targeted fix.`,
    steps: [
      "Collect logs, traces, and recent deploy/config changes around the incident window.",
      "Isolate the root cause and apply the smallest safe mitigation first.",
      "Validate recovery with health checks and user-path smoke tests.",
      "Document the final fix and preventive follow-up actions.",
    ],
  };
}

export const generateIncidentSuggestion = async (userInput) => {
  const groq = getGroq();
  const response = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "system",
        content:
          "You are an incident management assistant. Return pure JSON only. No markdown, no backticks, no extra text. Write detail description based on error logs.",
      },
      {
        role: "user",
        content: `You are an expert incident management assistant used in tools like Jira and PagerDuty.

Analyze the following input — it may be raw error logs, a bug description, or a behavioural issue.

Generate a professional incident report with:

- title: Clear and concise, max 8 words
- description: Write in bullet points covering:
  * What went wrong
  * Where exactly it happened (route, service, component, line number if available)
  * What the expected behaviour was
  * What the actual behaviour is
  * What is the impact on users or system
- severity: one of low / medium / high / critical

Rules:
- write bullet but not with colon, just start in next line. donot do this (- What went wrong: the server crashed) but do this (The server crashed)
- Always in English, even if the input is in another language
- Be specific, do not be vague
- Use only the information provided, do not assume
- Write like a senior engineer filing an incident
- Return pure JSON only. No markdown, no backticks, no extra text.

Input: ${userInput}`,
      },
    ],
    temperature: 0,
  });

  const content = response.choices[0].message.content;
  return JSON.parse(content);
};

export const generateIncidentSeverity = async (title, description) => {
  const groq = getGroq();
  const response = await groq.chat.completions.create({
    model: "llama-3.1-8b-instant",
    messages: [
      {
        role: "system",
        content:
          "You are an incident management assistant. Return pure JSON only. No markdown, no backticks, no extra text. Determine the most appropriate severity from the title and description.",
      },
      {
        role: "user",
        content: `You are an expert incident management assistant used in tools like Jira and PagerDuty.

Analyze the following incident title and description.

Generate a JSON response with:

- severity: one of low / medium / high / critical

Rules:
- Always in English, even if the input is in another language
- Be specific, do not be vague
- Use only the information provided, do not assume
- Return pure JSON only. No markdown, no backticks, no extra text.

Title: ${title}
Description: ${description}`,
      },
    ],
    temperature: 0,
  });

  const content = response.choices[0].message.content;
  return JSON.parse(content);
};

export const generateIncidentSummary = async (incident) => {
  try {
    const groq = getGroq();
    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content:
            "You are an incident management assistant. Summarize the incident in a few clear bullet points. Return pure JSON with a 'summary' field (array of strings).",
        },
        {
          role: "user",
          content: `Summarize this incident:
Title: ${incident.title}
Description: ${incident.description}
Severity: ${incident.severity}
Service: ${incident.service}`,
        },
      ],
      temperature: 0,
    });

    const parsed = parseJsonFromModel(response.choices?.[0]?.message?.content);
    if (!parsed || !Array.isArray(parsed.summary)) {
      return buildFallbackSummary(incident);
    }
    return { summary: parsed.summary.filter(Boolean) };
  } catch {
    return buildFallbackSummary(incident);
  }
};

export const generateIncidentFixSuggestion = async (incident) => {
  try {
    const groq = getGroq();
    const response = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content:
            "You are a senior engineer. Suggest an approach to fix this incident. Return pure JSON with 'approach' and 'steps' (array) fields.",
        },
        {
          role: "user",
          content: `Incident: ${incident.title}
Description: ${incident.description}
Service: ${incident.service}`,
        },
      ],
      temperature: 0,
    });

    const parsed = parseJsonFromModel(response.choices?.[0]?.message?.content);
    if (!parsed || typeof parsed.approach !== "string") {
      return buildFallbackFix(incident);
    }
    return {
      approach: parsed.approach.trim(),
      steps: Array.isArray(parsed.steps) ? parsed.steps.filter(Boolean) : [],
    };
  } catch {
    return buildFallbackFix(incident);
  }
};

export const generatePostmortem = async (incident, timeline, solver) => {
    const timelineText = timeline.map(t => `[${t.createdAt}] ${t.content}`).join("\n");

    const groq = getGroq();
    const response = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [
            {
                role: "system",
                content: "You are an expert incident management assistant. Generate a detailed postmortem analysis. Return pure JSON."
            },
            {
                role: "user",
                content: `Generate a postmortem for:
Title: ${incident.title}
Service: ${incident.service}
Resolved by: ${solver.name}
Timeline:
${timelineText}

JSON structure:
{
  "summary": "...",
  "rootCause": "...",
  "whatWorked": "...",
  "whatDidntWork": "...",
  "recommendations": "...",
  "impact": "..."
}`
            }
        ],
        temperature: 0,
    });

    return JSON.parse(response.choices[0].message.content);
}
