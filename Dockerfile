FROM --platform=linux/amd64 node:20-alpine AS base

RUN corepack enable && corepack prepare pnpm@latest --activate

FROM --platform=linux/amd64 base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM --platform=linux/amd64 base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

FROM --platform=linux/amd64 base AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json

EXPOSE 8080

ENV PORT=8080

CMD ["node", "dist/main.js"]
