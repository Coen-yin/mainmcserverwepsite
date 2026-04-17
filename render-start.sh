#!/bin/bash

echo "==> Running database migrations..."
# Try pnpm first, fall back to npx drizzle-kit
if command -v pnpm &>/dev/null; then
  pnpm --filter @workspace/db run push-force || echo "Warning: DB migration step failed, continuing..."
else
  npx --prefix lib/db drizzle-kit push --force --config lib/db/drizzle.config.ts || echo "Warning: DB migration step failed, continuing..."
fi

echo "==> Starting server..."
node --enable-source-maps ./artifacts/api-server/dist/index.mjs
