#!/bin/bash
set -e

echo "==> Installing pnpm..."
npm install -g pnpm@latest

echo "==> Installing dependencies..."
pnpm install --no-frozen-lockfile

echo "==> Building lib packages and API server..."
pnpm run build

echo "==> Building frontend..."
BASE_PATH=/ pnpm --filter @workspace/techy-mc run build

echo "==> Build complete!"
