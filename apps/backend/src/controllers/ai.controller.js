import { sendResponse } from "../utils/response.js";
import incidentModel from "../models/incident.model.js";
import { 
  generateIncidentSuggestion, 
  generateIncidentSeverity, 
  generateIncidentSummary, 
  generateIncidentFixSuggestion 
} from "../services/groq.service.js";

export const suggestIncident = async (req, res) => {
    const { userInput } = req.body;
    if(!userInput) return sendResponse(res, 400, false, "User input is required");
    try {
        const result = await generateIncidentSuggestion(userInput);
        sendResponse(res, 200, true, "Incident suggestion generated successfully", { suggestion: result });
    } catch (error) {
        sendResponse(res, 500, false, "Error generating incident suggestion");
    }
}

export const suggestSeverity = async (req, res) => {
    const {title, description} = req.body;
    if(!title || !description) return sendResponse(res, 400, false, "Title and description are required");
    try {
        const result = await generateIncidentSeverity(title, description);
        sendResponse(res, 200, true, "Severity suggestion generated successfully", { severity: result.severity });
    } catch (error) {
        sendResponse(res, 500, false, "Error generating severity suggestion");
    }
};

export const summarizeIncident = async (req, res) => {
    try {
        const incident = await incidentModel.findOne({ _id: req.params.id, organizationId: req.user.organizationId });
        if (!incident) return sendResponse(res, 404, false, "Incident not found");
        const result = await generateIncidentSummary(incident);
        sendResponse(res, 200, true, "Summary generated", result);
    } catch (err) {
        sendResponse(res, 500, false, "Error generating summary");
    }
};

export const suggestFix = async (req, res) => {
    try {
        const incident = await incidentModel.findOne({ _id: req.params.id, organizationId: req.user.organizationId });
        if (!incident) return sendResponse(res, 404, false, "Incident not found");
        const result = await generateIncidentFixSuggestion(incident);
        sendResponse(res, 200, true, "Fix suggestion generated", result);
    } catch (err) {
        sendResponse(res, 500, false, "Error generating fix suggestion");
    }
};

