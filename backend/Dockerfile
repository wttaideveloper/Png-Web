# ─── Stage 1: build Strapi admin panel ────────────────────────────────────────
FROM node:20-alpine AS builder

# Build tools required for better-sqlite3 native compilation
RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Strapi build reads env vars at build time for validation.
# These dummy values are build-time only — real secrets are injected at runtime.
ENV NODE_ENV=production \
    APP_KEYS=buildkey1,buildkey2,buildkey3,buildkey4 \
    API_TOKEN_SALT=buildsalt \
    ADMIN_JWT_SECRET=buildsecret \
    TRANSFER_TOKEN_SALT=buildsalt2 \
    JWT_SECRET=buildsecret2 \
    DATABASE_FILENAME=.tmp/data.db

RUN npm run build

# ─── Stage 2: lean production image ──────────────────────────────────────────
FROM node:20-alpine AS runner

# Runtime build tools needed so better-sqlite3 .node binary loads correctly
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Install production deps only
COPY package*.json ./
RUN npm ci --omit=dev

# Copy application source
COPY --from=builder /app/src ./src
COPY --from=builder /app/config ./config
COPY --from=builder /app/public ./public
COPY --from=builder /app/database ./database

# Copy Strapi compiled admin build output
COPY --from=builder /app/build ./build
COPY --from=builder /app/.strapi ./.strapi

# Ensure upload dir exists in image (volume will overlay this at runtime)
RUN mkdir -p /app/public/uploads /data

COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN apk add --no-cache dos2unix \
    && dos2unix /usr/local/bin/docker-entrypoint.sh \
    && chmod +x /usr/local/bin/docker-entrypoint.sh \
    && apk del dos2unix

EXPOSE 1337

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["npm", "run", "start"]
