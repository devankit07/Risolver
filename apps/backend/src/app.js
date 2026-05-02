import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import inviteRouter from "./routes/invite.route.js";
import incidentRouter from "./routes/incident.route.js";
import teamRouter from "./routes/team.routes.js";
import aiRouter from "./routes/ai.routes.js";
import organizationRouter from "./routes/organization.route.js";
import contactRouter from "./routes/contact.routes.js";

const app = express();

/* ── health check (no auth, no DB needed) ── */
app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "resolver-api", ts: new Date().toISOString() });
});

/* ── CORS ── */
app.use(
  cors({
    origin(origin, callback) {
      /* allow same-machine requests and no-origin (curl, Postman) */
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

/* ── Routes ── */
app.use("/api/auth", authRouter);
app.use("/api/invite", inviteRouter);
app.use("/api/incident", incidentRouter);
app.use("/api/team", teamRouter);
app.use("/api/ai", aiRouter);
app.use("/api/organization", organizationRouter);
app.use("/api/contact", contactRouter);

/* ── 404 ── */
app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

/* ── Global error handler (always returns JSON, never HTML) ── */
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error("[unhandled error]", err);
  const status = err.status ?? err.statusCode ?? 500;
  res.status(status).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

export default app;
