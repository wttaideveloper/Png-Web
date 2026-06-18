# ─── Stage 1: Build Strapi admin panel ────────────────────────────────────────
FROM node:20-alpine AS builder

RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Build-time dummy values required by Strapi
ENV NODE_ENV=production \
    APP_KEYS=buildkey1,buildkey2,buildkey3,buildkey4 \
    API_TOKEN_SALT=buildsalt \
    ADMIN_JWT_SECRET=buildsecret \
    TRANSFER_TOKEN_SALT=buildsalt2 \
    JWT_SECRET=buildsecret2 \
    DATABASE_FILENAME=.tmp/data.db \
    NODE_OPTIONS=--max-old-space-size=3072

RUN npm run build

# ─── Stage 2: Runtime image ───────────────────────────────────────────────────
FROM node:20-alpine AS runner

RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

# Application files
COPY --from=builder /app/src ./src
COPY --from=builder /app/config ./config
COPY --from=builder /app/types ./types
COPY --from=builder /app/package.json ./package.json

# Strapi build output
COPY --from=builder /app/build ./build
COPY --from=builder /app/.strapi ./.strapi

# Runtime directories
RUN mkdir -p /app/public/uploads /data

COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh

RUN apk add --no-cache dos2unix \
    && dos2unix /usr/local/bin/docker-entrypoint.sh \
    && chmod +x /usr/local/bin/docker-entrypoint.sh \
    && apk del dos2unix

EXPOSE 1337

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["npm", "run", "start"]