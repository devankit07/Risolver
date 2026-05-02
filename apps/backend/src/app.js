import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import inviteRouter from "./routes/invite.route.js";
import incidentRouter from "./routes/incident.route.js";
import teamRouter from "./routes/team.routes.js";
import aiRouter from "./routes/ai.routes.js";
import organizationRouter from "./routes/organization.route.js";

const app = express();

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "resolver-api" });
});

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
        callback(null, true);
        return;
      }
      callback(null, false);
    },
    credentials: true,
  }),
);

app.use(cookieParser());
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/invite', inviteRouter);
app.use('/api/incident', incidentRouter);
app.use('/api/team', teamRouter);
app.use('/api/ai', aiRouter);
app.use('/api/organization', organizationRouter);

export default app;