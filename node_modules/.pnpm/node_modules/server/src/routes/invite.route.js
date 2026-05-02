import express from 'express';
import { generateInvite, getInvite } from '../controllers/invite.controller.js';
import { authenticateUser, authorizeRoles } from '../middleware/auth.middleware.js';
import { generateInviteValidation } from '../validators/invite.validator.js';

const inviteRouter = express.Router();

inviteRouter.post('/generate', authenticateUser, authorizeRoles('admin'), generateInviteValidation, generateInvite);
inviteRouter.get('/:token', getInvite);
    

export default inviteRouter;