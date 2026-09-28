FROM node:20-alpine AS deps
WORKDIR /app

COPY package*.json ./
COPY prisma.config.ts ./
COPY prisma ./prisma/

RUN npm ci
RUN npx prisma generate

# Dev target — all dependencies (including devDeps like tsx) are available
FROM deps AS dev
COPY tsconfig.json ./
COPY src ./src

# Production build
FROM dev AS builder
RUN npm run build
RUN npm prune --production

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

USER node

EXPOSE 4000

CMD ["node", "dist/server.js"]

