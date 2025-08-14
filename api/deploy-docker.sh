#!/bin/bash

# Resume API Docker Deployment Script
# For VPS with Caddy running in Docker

set -e  # Exit on error

# Configuration
CONTAINER_NAME="resume-api"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting Resume API Docker Deployment...${NC}"

# 1. Verify we're in the right directory
echo -e "${YELLOW}Step 1: Checking current directory...${NC}"
if [ ! -f "api/docker-compose.vps.yml" ]; then
    echo -e "${RED}Error: Not in the resume-api directory or files are missing${NC}"
    echo "Please run this script from the resume-api root directory"
    exit 1
fi
echo -e "${GREEN}Found API files in current directory${NC}"

# Optional: Pull latest changes
echo -e "${YELLOW}Pulling latest changes from git...${NC}"
git pull origin main || echo "Could not pull latest changes (may not be needed)"

# 2. Check Docker network
echo -e "${YELLOW}Step 2: Checking Docker network...${NC}"
CADDY_NETWORK=$(docker network ls --format "{{.Name}}" | grep -E "caddy|default" | head -1)
if [ -z "$CADDY_NETWORK" ]; then
    echo -e "${RED}Could not find Caddy network. Please check your Docker networks with: docker network ls${NC}"
    exit 1
fi
echo -e "${GREEN}Found network: $CADDY_NETWORK${NC}"

# 3. Update docker-compose file with correct network
echo -e "${YELLOW}Step 3: Updating Docker network configuration...${NC}"
sed -i "s/name: caddy_default/name: $CADDY_NETWORK/" api/docker-compose.vps.yml

# 4. Stop existing container if running
echo -e "${YELLOW}Step 4: Checking for existing container...${NC}"
if docker ps -a | grep -q $CONTAINER_NAME; then
    echo "Stopping and removing existing container..."
    docker-compose -f api/docker-compose.vps.yml down
fi

# 5. Build and start container
echo -e "${YELLOW}Step 5: Building and starting container...${NC}"
docker-compose -f api/docker-compose.vps.yml up -d --build

# 6. Wait for container to be healthy
echo -e "${YELLOW}Step 6: Waiting for container to be healthy...${NC}"
sleep 10
if docker ps | grep -q $CONTAINER_NAME; then
    # Test the health endpoint
    if docker exec $CONTAINER_NAME curl -f http://localhost:8000/health > /dev/null 2>&1; then
        echo -e "${GREEN}Container is healthy!${NC}"
    else
        echo -e "${RED}Health check failed! Check logs with: docker logs $CONTAINER_NAME${NC}"
        exit 1
    fi
else
    echo -e "${RED}Container failed to start! Check logs with: docker logs $CONTAINER_NAME${NC}"
    exit 1
fi

# 7. Instructions for Caddy configuration
echo -e "${YELLOW}Step 7: Caddy Configuration${NC}"
echo -e "${YELLOW}========================================${NC}"
echo "Add the following to your Caddyfile:"
echo ""
cat api/caddy-snippet.txt
echo ""
echo -e "${YELLOW}========================================${NC}"
echo "After adding, reload Caddy with:"
echo "  docker exec caddy caddy reload --config /etc/caddy/Caddyfile"
echo ""

# 8. DNS Instructions
echo -e "${YELLOW}Step 8: DNS Configuration${NC}"
echo "Please add an A record in VentraIP control panel:"
echo "  Subdomain: api.resume"
echo "  Type: A"
echo "  Value: Your VPS IP address"
echo ""

echo -e "${GREEN}✅ API Container Deployed!${NC}"
echo ""
echo "Useful commands:"
echo "  View logs:         docker logs $CONTAINER_NAME"
echo "  View logs (live):  docker logs -f $CONTAINER_NAME"
echo "  Restart API:       docker-compose -f api/docker-compose.vps.yml restart"
echo "  Stop API:          docker-compose -f api/docker-compose.vps.yml down"
echo "  Rebuild & start:   docker-compose -f api/docker-compose.vps.yml up -d --build"
echo ""
echo "Test locally on VPS:"
echo "  docker exec resume-api curl http://localhost:8000/health"