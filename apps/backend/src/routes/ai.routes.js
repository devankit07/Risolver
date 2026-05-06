import express from "express";
import { authenticateUser } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/auth.middleware.js";
import { suggestIncident, suggestSeverity, summarizeIncident, suggestFix } from "../controllers/ai.controller.js";
import { suggestIncidentValidation, suggestSeverityValidation } from "../validators/ai.validator.js";

const aiRouter = express.Router();

aiRouter.get('/suggest-incident', authenticateUser, authorizeRoles('creator'), suggestIncidentValidation, suggestIncident);
aiRouter.get('/suggest-severity', authenticateUser, authorizeRoles('creator'), suggestSeverityValidation, suggestSeverity);
aiRouter.get('/:id/summarize', authenticateUser, summarizeIncident);
aiRouter.get('/:id/suggest-fix', authenticateUser, suggestFix);

export default aiRouter;