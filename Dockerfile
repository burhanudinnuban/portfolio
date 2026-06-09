# ═══════════════════════════════════════════
# STAGE 1: Build Vite App
# ═══════════════════════════════════════════
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies first (cache layer)
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# ═══════════════════════════════════════════
# STAGE 2: Serve with Nginx (ultra lightweight)
# ═══════════════════════════════════════════
FROM nginx:stable-alpine

LABEL org.opencontainers.image.source="https://github.com/burhanudinnuban/portfolio"

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx config (SPA routing)
COPY nginx/default.conf /etc/nginx/conf.d/

# Copy built files from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Security: non-root (nginx alpine supports this)
RUN chown -R nginx:nginx /usr/share/nginx/html && \
  chown -R nginx:nginx /var/cache/nginx && \
  chown -R nginx:nginx /var/log/nginx && \
  touch /var/run/nginx.pid && \
  chown -R nginx:nginx /var/run/nginx.pid

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1

CMD ["nginx", "-g", "daemon off;"]