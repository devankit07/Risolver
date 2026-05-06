# Resolver deployment (Render API + two Vercel frontends)

## 1. Render — backend (`server`)

### Root directory (required)

This repo is a **pnpm workspace**. Lockfile and `pnpm-workspace.yaml` live at the **repository root**.

- In the Render service settings: **Root Directory** must be **empty** (build from repo root).
- If it is set to `apps/backend` (or any subfolder), the Docker build **fails** — remove it and redeploy.

### What runs

- **Build:** root `Dockerfile` — installs the monorepo and **does not** build Vite frontends; Render is **API-only**.
- **Start:** `node apps/backend/server.js`
- **Health check:** `GET /health`
- **Root** `GET /` returns a small JSON payload. The website and manage app **only** live on Vercel.

### Environment variables

| Variable | Example / notes |
|----------|------------------|
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Strong random string |
| `NODE_ENV` | `production` |
| `GROQ_API_KEY` | Groq key for AI routes |
| `MANAGE_URL` | **Manage app** public URL, e.g. `https://risolver-resolver-manage-system.vercel.app` |
| `CORS_EXTRA_ORIGINS` | Optional: comma-separated extra origins |

---

## 2. Vercel — marketing website (project root `apps/website`)

In the Vercel project, set **Root Directory** to `apps/website`.

### Production environment variables

| Variable | Purpose |
|----------|---------|
| `VITE_API_URL` | `https://risolver.onrender.com/api` |
| `VITE_MANAGE_URL` | **Manage** app origin (no path), e.g. `https://<manage>.vercel.app` |

After changing variables, **redeploy** so Vite bakes them into the build.

---

## 3. Vercel — manage system (project root `apps/resolver-manage-system`)

Set **Root Directory** to `apps/resolver-manage-system`.

### Production environment variables

| Variable | Purpose |
|----------|---------|
| `VITE_API_URL` | `https://risolver.onrender.com/api` |
| `VITE_WEBSITE_URL` | **Marketing** site origin, e.g. `https://<website>.vercel.app` |

Redeploy after changes.

---

## 4. Align URLs everywhere

1. Render **`MANAGE_URL`** = same origin as **manage** app (invite links).  
2. Website **`VITE_MANAGE_URL`** = same (login/register redirect).  
3. Manage **`VITE_WEBSITE_URL`** = marketing site origin (logout).  
4. All three frontends’ API calls use the same **`VITE_API_URL`** (Render `/api` base).

The backend allows **credentials** from `localhost`, your Render host, and **`*.vercel.app`**.

---

## 5. Troubleshooting

### Wrong API hostname in the browser

If DevTools shows requests to `localhost:5173/api` on the deployed site:

1. Open the **manage** (and **website**) project on Vercel → **Settings → Environment Variables**.
2. Set **`VITE_API_URL`** to `https://risolver.onrender.com/api`.
3. **Redeploy** the Vercel project after saving (env is applied at **build** time).

### Render build failures

Your deploy should use the repo’s **`Dockerfile`**. In **Render → Settings**, ensure the **Docker Path** is set to `Dockerfile` at the root, and **Root Directory** is empty.
