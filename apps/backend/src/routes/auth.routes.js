import express from 'express';
import { adminRegister, registerWithInvite, login, getMe, logout } from "../controllers/auth.controller.js";
import {adminRegisterValidation, inviteRegisterValidation, loginValidation } from "../validators/auth.validator.js";
import { authenticateUser } from '../middleware/auth.middleware.js';



const authRouter = express.Router();

authRouter.post('/register', adminRegisterValidation, adminRegister);
authRouter.post('/invite-register', inviteRegisterValidation, registerWithInvite);
authRouter.post('/login', loginValidation, login);
authRouter.get('/logout', authenticateUser, logout);
authRouter.get('/me', authenticateUser, getMe);

export default authRouter;