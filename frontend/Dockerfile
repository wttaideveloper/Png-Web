# ─── Stage 1: build React app ─────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# VITE_STRAPI_API_URL must be passed at build time:
#   docker build --build-arg VITE_STRAPI_API_URL=https://yourdomain.com/api .
# docker-compose.yml passes it via build.args automatically from .env
ARG VITE_STRAPI_API_URL
ENV VITE_STRAPI_API_URL=$VITE_STRAPI_API_URL

RUN npm run build

# ─── Stage 2: serve with nginx ────────────────────────────────────────────────
FROM nginx:1.27-alpine AS runner

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
