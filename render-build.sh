#!/bin/bash
set -e

echo "==> Installing pnpm..."
npm install -g pnpm

echo "==> Installing dependencies..."
pnpm install --frozen-lockfile

echo "==> Building frontend..."
BASE_PATH=/ pnpm --filter @workspace/techy-mc run build

echo "==> Building API server..."
pnpm --filter @workspace/api-server run build

echo "==> Running database migrations..."
pnpm --filter @workspace/db run push-force

echo "==> Build complete!"
