# Resolver deployment (Railway API + two Vercel frontends)

## 1. Railway — backend (`server`)

### Root directory (required)

This repo is a **pnpm workspace**. Lockfile and `pnpm-workspace.yaml` live at the **repository root**.

- In the Railway service: **Settings → Build → Root Directory** must be **empty** (build from repo root).  
- If it is set to `apps/backend` (or any subfolder), the Docker build **fails** — remove it and redeploy.

### What runs

- **Build:** root `Dockerfile` — installs the monorepo and **does not** build Vite frontends; Railway is **API-only**.
- **Start:** `node apps/backend/server.js`
- **Health check:** `GET /health`
- **Root** `GET /` returns a small JSON payload (not the marketing site). The website and manage app **only** live on Vercel.

### Environment variables (Variables tab)

| Variable | Example / notes |
|----------|------------------|
| `MONGO_URI` | MongoDB Atlas or Railway MongoDB connection string |
| `JWT_SECRET` | Strong random string |
| `NODE_ENV` | `production` |
| `GROQ_API_KEY` | Groq key for AI routes (optional for boot if you use the relaxed config) |
| `MANAGE_URL` | **Manage app** public URL, no trailing slash, e.g. `https://risolver-resolver-manage-system.vercel.app` (used for invite links: `{MANAGE_URL}/join?id=…`) |
| `CORS_EXTRA_ORIGINS` | Optional: comma-separated extra origins (custom domains not matching `*.vercel.app`) |

**Do not set `PORT` unless** you also align **Settings → Networking** to the same port. Prefer **removing** `PORT` and use Railway’s generated port + default public URL.

---

## 2. Vercel — marketing website (project root `apps/website`)

In the Vercel project, set **Root Directory** to `apps/website` (or connect monorepo and select that app).

### Production environment variables

| Variable | Purpose |
|----------|---------|
| `VITE_API_URL` | `https://<your-railway>.up.railway.app/api` |
| `VITE_MANAGE_URL` | **Manage** app origin (no path), e.g. `https://<manage>.vercel.app` |

After changing variables, **redeploy** so Vite bakes them into the build.

`apps/website/vercel.json` provides SPA fallback for client-side routes.

---

## 3. Vercel — manage system (project root `apps/resolver-manage-system`)

Set **Root Directory** to `apps/resolver-manage-system`.

### Production environment variables

| Variable | Purpose |
|----------|---------|
| `VITE_API_URL` | `https://<your-railway>.up.railway.app/api` |
| `VITE_WEBSITE_URL` | **Marketing** site origin (logout redirect), e.g. `https://<website>.vercel.app` |

Redeploy after changes.

---

## 4. Preview vs production URLs on Vercel

Preview deployments use URLs like `*-git-<branch>-<team>.vercel.app`. Production uses your **Production** domain (`*.vercel.app` or a custom domain).

Set **Preview** env vars in Vercel if you need previews to hit Railway + sibling previews.

---

## 5. Align URLs everywhere

1. Railway **`MANAGE_URL`** = same origin as **manage** app (invite links).  
2. Website **`VITE_MANAGE_URL`** = same (login/register redirect).  
3. Manage **`VITE_WEBSITE_URL`** = marketing site origin (logout).  
4. All three frontends’ API calls use the same **`VITE_API_URL`** (Railway `/api` base).

The backend allows **credentials** from `localhost`, your Railway host, and **`*.vercel.app`**. Custom domains: add **`CORS_EXTRA_ORIGINS`** on Railway.
