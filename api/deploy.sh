#!/bin/bash

# Resume API Deployment Script
# Deploy to Hostinger VPS with Docker and Caddy

set -e  # Exit on error

# Configuration
REPO_URL="https://github.com/michael-borck/resume.michaelborck.dev.git"
DEPLOY_DIR="/var/www/resume-api"
CONTAINER_NAME="resume-api"
IMAGE_NAME="resume-api"
API_PORT=8000

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting Resume API Deployment...${NC}"

# 1. Update system packages
echo -e "${YELLOW}Step 1: Updating system packages...${NC}"
sudo apt-get update -qq

# 2. Check Docker installation
echo -e "${YELLOW}Step 2: Checking Docker...${NC}"
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Docker not found! Please install Docker first.${NC}"
    exit 1
fi
echo -e "${GREEN}Docker is installed${NC}"

# 3. Check Caddy installation
echo -e "${YELLOW}Step 3: Checking Caddy...${NC}"
if ! command -v caddy &> /dev/null; then
    echo -e "${RED}Caddy not found! Please install Caddy first.${NC}"
    exit 1
fi
echo -e "${GREEN}Caddy is installed${NC}"

# 4. Clone or update repository
echo -e "${YELLOW}Step 4: Setting up repository...${NC}"
if [ -d "$DEPLOY_DIR" ]; then
    echo "Repository exists, pulling latest changes..."
    cd $DEPLOY_DIR
    git pull origin main
else
    echo "Cloning repository..."
    sudo mkdir -p $DEPLOY_DIR
    sudo git clone $REPO_URL $DEPLOY_DIR
    cd $DEPLOY_DIR
fi

# 5. Stop existing container if running
echo -e "${YELLOW}Step 5: Checking for existing container...${NC}"
if docker ps -a | grep -q $CONTAINER_NAME; then
    echo "Stopping and removing existing container..."
    docker stop $CONTAINER_NAME || true
    docker rm $CONTAINER_NAME || true
fi

# 6. Build new Docker image
echo -e "${YELLOW}Step 6: Building Docker image...${NC}"
docker build -f api/Dockerfile -t $IMAGE_NAME .

# 7. Run new container
echo -e "${YELLOW}Step 7: Starting new container...${NC}"
docker run -d \
    --name $CONTAINER_NAME \
    --restart unless-stopped \
    -p 127.0.0.1:$API_PORT:8000 \
    -e ENV=production \
    -e LOG_LEVEL=info \
    $IMAGE_NAME

# 8. Wait for container to be healthy
echo -e "${YELLOW}Step 8: Waiting for container to be healthy...${NC}"
sleep 5
if docker ps | grep -q $CONTAINER_NAME; then
    # Test the health endpoint
    if curl -f http://localhost:$API_PORT/health > /dev/null 2>&1; then
        echo -e "${GREEN}Container is healthy!${NC}"
    else
        echo -e "${RED}Health check failed! Check logs with: docker logs $CONTAINER_NAME${NC}"
        exit 1
    fi
else
    echo -e "${RED}Container failed to start! Check logs with: docker logs $CONTAINER_NAME${NC}"
    exit 1
fi

# 9. Update Caddy configuration
echo -e "${YELLOW}Step 9: Updating Caddy configuration...${NC}"
if [ -f "api/Caddyfile" ]; then
    # Backup existing Caddy config
    sudo cp /etc/caddy/Caddyfile /etc/caddy/Caddyfile.backup.$(date +%Y%m%d_%H%M%S)
    
    # Check if API config already exists
    if ! grep -q "api.resume.michaelborck.dev" /etc/caddy/Caddyfile; then
        echo "Adding API configuration to Caddy..."
        echo "" | sudo tee -a /etc/caddy/Caddyfile
        sudo cat api/Caddyfile | sudo tee -a /etc/caddy/Caddyfile
    else
        echo "API configuration already exists in Caddy"
    fi
    
    # Reload Caddy
    sudo caddy reload --config /etc/caddy/Caddyfile
    echo -e "${GREEN}Caddy configuration updated${NC}"
else
    echo -e "${YELLOW}Warning: Caddyfile not found in api/ directory${NC}"
fi

# 10. Clean up old Docker images
echo -e "${YELLOW}Step 10: Cleaning up old images...${NC}"
docker image prune -f

echo -e "${GREEN}✅ Deployment Complete!${NC}"
echo -e "${GREEN}API should be accessible at: https://api.resume.michaelborck.dev${NC}"
echo ""
echo "Useful commands:"
echo "  View logs:        docker logs $CONTAINER_NAME"
echo "  View logs (live): docker logs -f $CONTAINER_NAME"
echo "  Restart API:      docker restart $CONTAINER_NAME"
echo "  Stop API:         docker stop $CONTAINER_NAME"
echo "  Start API:        docker start $CONTAINER_NAME"