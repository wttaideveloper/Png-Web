# ─── Stage 1: build Strapi admin panel ────────────────────────────────────────
FROM node:20-alpine AS builder

# Build tools required for better-sqlite3 native compilation
RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Strapi build reads env vars at build time for validation.
# These are dummy build-time values only.
ENV NODE_ENV=production \
    APP_KEYS=buildkey1,buildkey2,buildkey3,buildkey4 \
    API_TOKEN_SALT=buildsalt \
    ADMIN_JWT_SECRET=buildsecret \
    TRANSFER_TOKEN_SALT=buildsalt2 \
    JWT_SECRET=buildsecret2 \
    DATABASE_FILENAME=.tmp/data.db

# Increase Node memory for Strapi admin build
ENV NODE_OPTIONS=--max-old-space-size=3072

RUN npm run build

# ─── Stage 2: production image ────────────────────────────────────────────────
FROM node:20-alpine AS runner

# Runtime dependencies for better-sqlite3
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Install production dependencies only
COPY package*.json ./
RUN npm ci --omit=dev

# Copy application source
COPY --from=builder /app/src ./src
COPY --from=builder /app/config ./config
COPY --from=builder /app/public ./public
COPY --from=builder /app/database ./database
COPY --from=builder /app/package.json ./package.json

# Copy Strapi build output
COPY --from=builder /app/build ./build
COPY --from=builder /app/.strapi ./.strapi

# Create runtime folders
RUN mkdir -p /app/public/uploads /data

# Entrypoint
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh

RUN apk add --no-cache dos2unix \
    && dos2unix /usr/local/bin/docker-entrypoint.sh \
    && chmod +x /usr/local/bin/docker-entrypoint.sh \
    && apk del dos2unix

EXPOSE 1337

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["npm", "run", "start"]