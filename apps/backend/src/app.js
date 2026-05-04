import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

function isAllowedCorsOrigin(origin) {
  if (!origin) return true;
  if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin)) return true;
  if (origin === "https://server-production-a2c4.up.railway.app") return true;
  /* Manage UI on Vercel (production + preview) */
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
app.use(express.json());

/* ── API Routes ── */
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

/* ── API 404 — must come before static files ── */
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

/* ── Static files (marketing website only — manage UI is hosted on Vercel) ── */
const WEBSITE_DIST = path.join(__dirname, "../../../apps/website/dist");

app.use("/", express.static(WEBSITE_DIST));

/* ── SPA fallback (website) ── */
app.use((_req, res) => {
  res.sendFile(path.join(WEBSITE_DIST, "index.html"));
});

export default app;
