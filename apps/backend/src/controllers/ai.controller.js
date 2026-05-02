import { sendResponse } from "../utils/response.js";
import { generateIncidentSuggestion, generateIncidentSeverity } from "../services/groq.service.js";

export const suggestIncident = async (req, res) => {
    const { userInput } = req.body;

    if(!userInput){
        sendResponse(res, 400, false, "User input is required");
    }

    if(userInput.length > 2000){
        sendResponse(res, 400, false, "User input should be less than 2000 characters");  
    }
    try{
        const result = await generateIncidentSuggestion(userInput);
        sendResponse(res, 200, true, "Incident suggestion generated successfully", {
        suggestion: result
    });
    } catch (error) {
        sendResponse(res, 500, false, "Error generating incident suggestion");
        return;
    }

}

export const suggestSeverity = async (req, res) => {
    const {title, description} = req.body;

    if(!title || !description){
        sendResponse(res, 400, false, "Title and description are required");
        return;
    }

    try{
        const result = await generateIncidentSeverity(title, description);
        sendResponse(res, 200, true, "Severity suggestion generated successfully", {
            severity: result.severity
        });
    } catch (error) {
        sendResponse(res, 500, false, "Error generating severity suggestion");
    }
};
