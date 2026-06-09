# ═══════════════════════════════════════════
# STAGE 1: Build Vite App + Compile Server
# ═══════════════════════════════════════════
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Build frontend
RUN npm run build

# Compile server.ts → server.js (no tsx needed at runtime)
RUN npx esbuild server.ts --bundle --platform=node --outfile=server.js --format=esm --packages=external

# ═══════════════════════════════════════════
# STAGE 2: Production (Clean, no esbuild!)
# ═══════════════════════════════════════════
FROM node:22-alpine

LABEL org.opencontainers.image.source="https://github.com/burhanudinnuban/portfolio"

WORKDIR /app

RUN apk update && apk upgrade --no-cache

# Production deps only — NO tsx, NO esbuild
COPY package*.json ./
RUN npm ci --omit=dev

# Copy compiled server + built frontend
COPY --from=builder /app/server.js ./
COPY --from=builder /app/dist ./dist

# Create data files
RUN mkdir -p src && \
  echo '{}' > src/data.json && \
  echo '[]' > src/messages.json

# Security: non-root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup && \
  chown -R appuser:appgroup /app
USER appuser

ENV NODE_ENV=production
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3000/api/cms/load || exit 1

CMD ["node", "server.js"]