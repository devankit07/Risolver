import express from "express";
import { getTeam, removeMember, changeRole } from "../controllers/team.controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/auth.middleware.js";

const teamRouter = express.Router();

teamRouter.get("/team", authenticateUser, getTeam);
teamRouter.delete('/remove/:userId', authenticateUser, authorizeRoles('admin'), removeMember);
teamRouter.patch('/role/:userId', authenticateUser, authorizeRoles('admin'), changeRole);

export default teamRouter;
