#!/bin/sh
set -e

# Ensure persistent volume mount points exist at runtime
mkdir -p /app/public/uploads
mkdir -p /data

# DATABASE_FILENAME may be set to /data/data.db via env.
# Ensure the directory portion of that path also exists.
if [ -n "$DATABASE_FILENAME" ]; then
  DB_DIR=$(dirname "$DATABASE_FILENAME")
  mkdir -p "$DB_DIR"
fi

exec "$@"
