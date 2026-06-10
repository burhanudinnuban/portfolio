# ═══════════════════════════════════════════
# STAGE 1: Build Vite App + Compile Server
# ═══════════════════════════════════════════
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ═══════════════════════════════════════════
# STAGE 2: Production Dependencies Only
# ═══════════════════════════════════════════
FROM node:22-alpine AS deps

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev && \
  npm cache clean --force && \
  rm -rf /tmp/* ~/.npm

# ═══════════════════════════════════════════
# STAGE 3: Final Production Image (minimal)
# ═══════════════════════════════════════════
FROM node:22-alpine

LABEL org.opencontainers.image.source="https://github.com/burhanudinnuban/portfolio"

WORKDIR /app

# Security updates (no leftover cache)
RUN apk --no-cache upgrade

# Copy ONLY production node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy built files from builder
COPY --from=builder /app/dist ./dist

# Copy package.json (for node to resolve modules)
COPY package.json ./

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