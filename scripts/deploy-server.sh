#!/bin/bash
# Deploy script to run manually on your server
# This pulls the latest image and restarts the container

set -e

IMAGE_NAME="ghcr.io/$(git config --get remote.origin.url | sed 's|.*github.com[:/]\(.*\)\.git|\1|'):latest"
CONTAINER_NAME="metropolia"
PORT="${1:-80}"

echo "📦 Pulling latest Docker image: $IMAGE_NAME"
sudo docker pull "$IMAGE_NAME"

echo "🛑 Stopping old container..."
sudo docker stop "$CONTAINER_NAME" 2>/dev/null || true
sudo docker rm "$CONTAINER_NAME" 2>/dev/null || true

echo "🚀 Starting new container on port $PORT..."
sudo docker run -d \
  --name "$CONTAINER_NAME" \
  --restart unless-stopped \
  -p "$PORT":80 \
  "$IMAGE_NAME"

echo "🧹 Cleaning up old images..."
sudo docker image prune -af --filter "until=24h"

echo "✅ Deployment complete!"
