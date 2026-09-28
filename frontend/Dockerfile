FROM node:20-alpine AS deps
WORKDIR /app

COPY package*.json ./
RUN npm ci

# Dev target — all dependencies available for next dev
FROM deps AS dev
COPY . .

# Production build
FROM dev AS builder
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["npm", "run", "start"]

