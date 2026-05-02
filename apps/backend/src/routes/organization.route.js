import express from "express";
import { authenticateUser, authorizeRoles } from "../middleware/auth.middleware.js";
import { getOrganizationSpecializations, addSpecialization, deleteSpecialization } from "../controllers/organization.controller.js";
import { addSpecializationValidation } from "../validators/organization.validator.js";

const organizationRouter = express.Router();

organizationRouter.get('/specializations', authenticateUser, authorizeRoles('admin'), getOrganizationSpecializations);
organizationRouter.post('/specialization', authenticateUser, authorizeRoles('admin'), addSpecializationValidation, addSpecialization);
organizationRouter.delete('/specialization', authenticateUser, authorizeRoles('admin'), addSpecializationValidation, deleteSpecialization);

export default organizationRouter;