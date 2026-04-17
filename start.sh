#!/bin/bash
set -e

export PORT=5000
export BASE_PATH=/
export API_PORT=3001
export NODE_ENV=development

# Build and start API server in background
echo "Building API server..."
pnpm --filter @workspace/api-server run build

echo "Starting API server on port $API_PORT..."
PORT=$API_PORT pnpm --filter @workspace/api-server run start &
API_PID=$!

# Give API server a moment to start
sleep 2

echo "Starting frontend on port $PORT..."
pnpm --filter @workspace/techy-mc run dev &
FRONTEND_PID=$!

# Wait for either process to exit
wait $API_PID $FRONTEND_PID
