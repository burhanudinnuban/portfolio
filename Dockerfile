# ═══════════════════════════════════════════
# STAGE 1: Build Vite App
# ═══════════════════════════════════════════
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ═══════════════════════════════════════════
# STAGE 2: Production Server (Express API + Static)
# ═══════════════════════════════════════════
FROM node:20-alpine

LABEL org.opencontainers.image.source="https://github.com/burhanudinnuban/portfolio"

WORKDIR /app

# System security patches (fixes CVEs like Go stdlib)
RUN apk update && apk upgrade --no-cache

# Install production dependencies only
COPY package*.json ./
RUN npm ci --omit=dev && npm install tsx

# Copy built frontend from Stage 1
COPY --from=builder /app/dist ./dist

# Copy server + required source files
COPY server.ts ./
COPY tsconfig.json ./
RUN mkdir -p src && \
  echo '{}' > src/data.json && \
  echo '[]' > src/messages.json

# Security: non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup && \
  chown -R appuser:appgroup /app
USER appuser

ENV NODE_ENV=production
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3000/api/cms/load || exit 1

CMD ["npx", "tsx", "server.ts"]