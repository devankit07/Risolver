# Resolver | Incident Response Platform

Resolver is a monorepo for an incident management system with:
- a public website (`apps/website`)
- an authenticated manage app (`apps/resolver-manage-system`)
- a backend API (`apps/backend`)
- shared UI components (`packages/ui`)

## Deployment

- Manage app: [https://resolver-manage-system.vercel.app](https://resolver-manage-system.vercel.app)
- Website: [https://risolver.vercel.app](https://risolver.vercel.app)
- API: [https://risolver.onrender.com/api](https://risolver.onrender.com/api)

## Current Product Flow

### 1) Auth and entry flow
- Users register/login from the website.
- After auth, users can access the manage app workspace.
- Admin and manager sessions are supported across website/manage flows.

### 2) Role behavior
- `admin` and `manager` can invite members and manage approvals.
- Members (responder/creator/etc.) can work incidents assigned to them.
- Incident visibility is role-scoped in backend queries.

### 3) Incident lifecycle
- Create incident (optionally with image evidence).
- Assign to member.
- Work the incident in `Workspace`.
- Use AI summary / AI fix suggestion.
- Resolve and submit postmortem.
- Admin/manager approve or request changes.

### 4) AI in workspace
- Endpoints:
  - `GET /api/ai/:id/summarize`
  - `GET /api/ai/:id/suggest-fix`
- Groq is used when configured.
- If Groq fails or returns malformed JSON, backend returns safe fallback summary/fix so workspace remains usable.

### 5) Real-time notifications
- Socket events update incidents, statuses, messages, and broadcasts.
- Floating toasts are shown for new notifications.
- Message send now creates and emits notification events to the receiver.
- Postmortem approval workflow emits notification events for pending/approved/changes.

### 6) Topbar quick actions
In manage app topbar:
- `+` -> open incidents
- `Filter` -> open incidents list view
- `Download` -> open reports
- `Bell` -> open messages
- Bell dot uses unread notification count from backend/user notifications cache.

## Monorepo Structure

- `apps/website` - marketing site + auth entry points
- `apps/resolver-manage-system` - internal incident management dashboard
- `apps/backend` - Express + MongoDB + Socket.io + AI integrations
- `packages/ui` - shared React UI components

## Tech Stack

- Frontend: React, Vite, Redux Toolkit, Tailwind CSS, Framer Motion
- Backend: Node.js, Express, Mongoose, Socket.io, groq-sdk, Cloudinary, Nodemailer
- Infra: Vercel (frontends), Render (API)

## Local Development

### Prerequisites
- Node.js 18+
- pnpm 9+
- MongoDB

### Install

```bash
pnpm install
```

### Environment

Create `.env` files for:
- `apps/backend`
- `apps/website`
- `apps/resolver-manage-system`

Important backend vars include:
- `MONGO_URI`
- `JWT_SECRET`
- `GROQ_API_KEY` (required for live AI responses; fallback logic still keeps workspace functional)

### Run

From repo root:

```bash
pnpm run dev
```

### Build

Root build currently runs website build:

```bash
pnpm run build
```

To run backend in dev only:

```bash
pnpm run dev:backend
```
