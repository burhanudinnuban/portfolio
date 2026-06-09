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
# STAGE 2: Production Server (Express + Vite)
# ═══════════════════════════════════════════
FROM node:20-alpine AS production

WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy built frontend
COPY --from=builder /app/dist ./dist

# Copy server & source files needed at runtime
COPY server.ts ./
COPY tsconfig.json ./
COPY src/data.json ./src/data.json
COPY src/messages.json ./src/messages.json

# Install tsx for running TypeScript directly
RUN npx tsx --version || npm install -g tsx

# Security: create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
RUN chown -R appuser:appgroup /app
USER appuser

ENV NODE_ENV=production
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3000/api/cms/load || exit 1

CMD ["npx", "tsx", "server.ts"]