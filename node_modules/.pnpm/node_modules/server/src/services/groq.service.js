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

export const generateIncidentSuggestion = async (userInput) => {
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

export const generatePostmortem = async (incidentId) => {
    const incidentUpdates = await incidentUpdateModel.find({ incidentId }).sort({ createdAt: 1 });

    const updatesText = incidentUpdates.map(update => {
        return `Time: ${update.createdAt}\nStatus: ${update.status}\nMessage: ${update.message}\nPosted by: ${update.postedBy}\n\n`;
    }).join("\n");

    const groq = getGroq();
    const response = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [
            {
                role: "system",
                content: "You are an expert incident management assistant. Generate a postmortem analysis based on the incident updates. Return pure JSON with a single field 'postmortem' containing the analysis. No markdown, no backticks, no extra text."
            },
            {
                role: "user",
                content: `Analyze the following incident updates and generate a postmortem analysis covering:
- Summary of the incident timeline(field should be only 'summary')
- Root cause analysis(field should be only 'rootCause')
- What the solution worked in solving the issue by reading all the timeline's messages(field should be only 'whatWorked')
- What are the recommendations to prevent it next time(field should be only 'recommendations')
Incident Updates:\n\n${updatesText}
Rules:
- NO nested object, each field should be a string.
- Always in English, even if the input is in another language
- there should be direct mentioned field no nested. no poostmortem field, direct mentioned field.
`

            }
        ],
        temperature: 0,
    });

    const content = response.choices[0].message.content;
    const result = JSON.parse(content);
    return result;
    // Here you can save the postmortem analysis back to the database if needed, e.g.:
    // await incidentModel.findByIdAndUpdate(incidentId, { postmortem: result.postmortem });
}