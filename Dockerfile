# Monorepo: install with pnpm, build marketing site for Express static, run API.
# Railway uses this automatically when present (replaces Railpack build issues with corepack/pnpm).

FROM node:22-bookworm-slim

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9.15.4 --activate

# Root + workspaces
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY apps ./apps
COPY packages ./packages

# Native deps (e.g. bcrypt) may need a compiler on some platforms
RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

RUN pnpm install --frozen-lockfile || pnpm install

ENV NODE_ENV=production

RUN pnpm run build

EXPOSE 8080

CMD ["node", "apps/backend/server.js"]
