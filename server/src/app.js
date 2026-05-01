import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import inviteRouter from "./routes/invite.route.js";
import incidentRouter from "./routes/incident.route.js";
import teamRouter from "./routes/team.routes.js";
import aiRouter from "./routes/ai.routes.js";
import organizationRouter from "./routes/organization.route.js";

const app = express();

app.use(cookieParser());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/invite', inviteRouter);
app.use('/api/incident', incidentRouter);
app.use('/api/team', teamRouter);
app.use('/api/ai', aiRouter);
app.use('/api/organization', organizationRouter);

export default app;