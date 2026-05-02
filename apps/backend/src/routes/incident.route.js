
import express from 'express';
import { createIncident, getAllIncidents, getMyIncidents, getIncidentById, assignIncident, updateIncident } from '../controllers/incident.controller.js';
import { authenticateUser, authorizeRoles } from '../middleware/auth.middleware.js';
import {
	createIncidentValidation,
	assignIncidentValidation,
	getIncidentByIdValidation,
    incidentUpdateValidation,
} from '../validators/incident.validator.js';


const incidentRouter = express.Router();

incidentRouter.post('/create-incident', authenticateUser, authorizeRoles('creator'), createIncidentValidation, createIncident);
incidentRouter.get('/get-all-incidents', authenticateUser, authorizeRoles('admin', 'manager'),getAllIncidents,);
incidentRouter.get('/get-incidents/mine', authenticateUser, authorizeRoles('creator', 'responder'), getMyIncidents);
incidentRouter.get('/:incidentId', authenticateUser, getIncidentByIdValidation, getIncidentById);
incidentRouter.post('/:incidentId/assign', authenticateUser, authorizeRoles('manager'), assignIncidentValidation, assignIncident);
incidentRouter.post('/:incidentId/update', authenticateUser, authorizeRoles('responder'), incidentUpdateValidation, updateIncident);

export default incidentRouter;