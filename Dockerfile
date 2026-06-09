# ═══════════════════════════════════════════
# STAGE 1: Build Vite App + Compile Server
# ═══════════════════════════════════════════
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build
# ↑ This runs: vite build && esbuild server.ts → dist/server.cjs

# ═══════════════════════════════════════════
# STAGE 2: Production (No esbuild, no tsx!)
# ═══════════════════════════════════════════
FROM node:22-alpine

LABEL org.opencontainers.image.source="https://github.com/burhanudinnuban/portfolio"

WORKDIR /app

RUN apk update && apk upgrade --no-cache

# Production deps only (no devDependencies = no esbuild/tsx)
COPY package*.json ./
RUN npm ci --omit=dev

# Copy everything from dist (frontend + compiled server)
COPY --from=builder /app/dist ./dist

# Create runtime data files
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

CMD ["node", "dist/server.cjs"]