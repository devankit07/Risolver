# API only — no website static build. Marketing + manage UIs deploy on Vercel.
# Monorepo: pnpm workspace; install from root, run apps/backend.

FROM node:22-bookworm-slim

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9.15.4 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY apps ./apps
COPY packages ./packages

RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

RUN pnpm install --frozen-lockfile || pnpm install

ENV NODE_ENV=production

EXPOSE 8080

CMD ["node", "apps/backend/server.js"]
