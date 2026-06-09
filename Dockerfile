# ═══════════════════════════════════════════
# STAGE 1: Build
# ═══════════════════════════════════════════
FROM node:22-alpine AS builder  # ← Upgrade from 20 to 22

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ═══════════════════════════════════════════
# STAGE 2: Production
# ═══════════════════════════════════════════
FROM node:22-alpine AS production  # ← Upgrade here too

WORKDIR /app

# Update ALL system packages to get security patches
RUN apk update && apk upgrade --no-cache

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY server.ts ./
COPY tsconfig.json ./

RUN mkdir -p src && \
  echo '{}' > src/data.json && \
  echo '[]' > src/messages.json

RUN npm install -g tsx

ENV NODE_ENV=production
EXPOSE 3000

CMD ["npx", "tsx", "server.ts"]