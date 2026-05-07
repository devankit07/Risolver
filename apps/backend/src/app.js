import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import inviteRouter from "./routes/invite.route.js";
import inviteCredRouter from "./routes/inviteCredential.routes.js";
import incidentRouter from "./routes/incident.route.js";
import teamRouter from "./routes/team.routes.js";
import aiRouter from "./routes/ai.routes.js";
import organizationRouter from "./routes/organization.route.js";
import contactRouter from "./routes/contact.routes.js";
import dashboardRouter from "./routes/dashboard.routes.js";
import userRouter from "./routes/user.routes.js";
import messageRouter from "./routes/message.routes.js";
import broadcastRouter from "./routes/broadcast.routes.js";
import incidentsRouter from "./routes/incidents.routes.js";
import postmortemsRouter from "./routes/postmortems.routes.js";
import projectRouter from "./routes/project.routes.js";

const app = express();

function isAllowedCorsOrigin(origin) {
  if (!origin) return true;
  if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin)) return true;
  if (/^https:\/\/([a-z0-9-]+)\.onrender\.com$/i.test(origin)) return true;
  /* Frontends on Vercel (production + preview) */
  if (/^https:\/\/([a-z0-9-]+\.)*vercel\.app$/i.test(origin)) return true;
  const extra = (process.env.CORS_EXTRA_ORIGINS ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return extra.includes(origin);
}

/* ── health check (no auth, no DB needed) ── */
app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "resolver-api", ts: new Date().toISOString() });
});

/* Root: API only — marketing + manage apps are on Vercel */
app.get("/", (_req, res) => {
  res.json({
    service: "resolver-api",
    health: "/health",
    api: "/api",
    note: "Web apps are deployed separately (e.g. Vercel).",
  });
});

/* ── CORS ── */
app.use(
  cors({
    origin(origin, callback) {
      callback(null, isAllowedCorsOrigin(origin));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

/* ── API routes ── */
app.use("/api/auth", authRouter);
app.use("/api/invite", inviteRouter);
app.use("/api/invites", inviteCredRouter);
app.use("/api/incident", incidentRouter);
app.use("/api/team", teamRouter);
app.use("/api/ai", aiRouter);
app.use("/api/organization", organizationRouter);
app.use("/api/contact", contactRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/users", userRouter);
app.use("/api/messages", messageRouter);
app.use("/api/broadcasts", broadcastRouter);
app.use("/api/incidents", incidentsRouter);
app.use("/api/postmortems", postmortemsRouter);
app.use("/api/projects", projectRouter);

/* ── API 404 ── */
app.use("/api", (_req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

/* ── Global error handler ── */
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error("[unhandled error]", err);
  const status = err.status ?? err.statusCode ?? 500;
  res.status(status).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

/* Non-API paths: no static frontends (those are on Vercel) */
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "Not found. This host is API-only; use your Vercel URL for the web app.",
  });
});

export default app;
