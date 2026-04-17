#!/bin/bash

echo "==> Running database migrations..."
pnpm --filter @workspace/db run push-force || echo "Warning: DB migration step failed, continuing anyway..."

echo "==> Starting server..."
node --enable-source-maps ./artifacts/api-server/dist/index.mjs
