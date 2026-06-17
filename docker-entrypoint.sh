#!/bin/sh
set -e

echo "Starting entrypoint..."

echo "Applying database migrations..."

if ! npm run prisma:deploy -w @infra/backend; then
  echo "Database migration failed! Exiting container..." >&2
  exit 1
fi
echo "Migrations applied."

echo "Entrypoint completed; starting app."
exec "$@"
