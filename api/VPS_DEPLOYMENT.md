# VPS Deployment Guide - Resume API

## Overview
This guide explains how to deploy the Resume API to your Hostinger VPS where Caddy is running in a Docker container.

## Your Current Setup
- **Caddy**: Running in Docker container
- **Firewall**: Only ports 80 and 443 open
- **DNS**: 
  - `serveur.au` → Cloudflare
  - `michaelborck.dev` → VentraIP
- **Network**: Tailscale configured

## Deployment Steps

### 1. DNS Setup (VentraIP)
First, add an A record in your VentraIP control panel:
- **Subdomain**: `api.resume` (creates api.resume.michaelborck.dev)
- **Type**: A
- **Value**: Your Hostinger VPS IP address

### 2. SSH to your VPS
```bash
ssh your-vps
```

### 3. Clone the Repository
```bash
cd ~
git clone https://github.com/michael-borck/resume.michaelborck.dev.git resume-api
cd resume-api
```

### 4. Run Deployment Script
```bash
chmod +x api/deploy-docker.sh
./api/deploy-docker.sh
```

This script will:
- Build the Docker container
- Connect it to Caddy's network
- Start the API service

### 5. Update Caddyfile
Add this to your existing Caddyfile (following the same pattern as n8n):

```caddy
api.resume.michaelborck.dev {
    reverse_proxy resume-api:8000
}
```

This is for public access - Caddy will automatically handle TLS certificates using HTTP challenge.

### 6. Reload Caddy
```bash
docker exec caddy caddy reload --config /etc/caddy/Caddyfile
```

## Testing

### Local test on VPS:
```bash
# Test the API directly
docker exec resume-api curl http://localhost:8000/health

# Check container status
docker ps | grep resume-api

# View logs
docker logs resume-api
```

### Remote test (after DNS propagates):
```bash
curl https://api.resume.michaelborck.dev/health
```

## Docker Network Note

The API container needs to be on the same network as Caddy. The deployment script tries to detect this automatically. If it fails, you can check your networks:

```bash
# List all networks
docker network ls

# See which network Caddy is using
docker inspect caddy | grep NetworkMode
```

Then update `api/docker-compose.vps.yml` with the correct network name.

## Troubleshooting

### Container won't start
```bash
docker logs resume-api
docker-compose -f api/docker-compose.vps.yml down
docker-compose -f api/docker-compose.vps.yml up -d --build
```

### Caddy can't reach the API
Check they're on the same network:
```bash
docker network inspect [network-name]
```

### DNS not working
- Check A record in VentraIP
- Wait for DNS propagation (can take up to 48 hours)
- Test with: `nslookup api.resume.michaelborck.dev`

## Management Commands

```bash
# Start/Stop/Restart
docker-compose -f api/docker-compose.vps.yml stop
docker-compose -f api/docker-compose.vps.yml start
docker-compose -f api/docker-compose.vps.yml restart

# Rebuild after code changes
cd ~/resume-api
git pull
docker-compose -f api/docker-compose.vps.yml up -d --build

# View real-time logs
docker logs -f resume-api

# Check health
docker exec resume-api curl http://localhost:8000/health
```

## Security Notes

- The API only exposes port 8000 internally to Docker network
- Caddy handles SSL/TLS termination
- No ports need to be opened on the firewall
- All traffic goes through Caddy on ports 80/443

## Alternative: Using Tailscale

If you want to access the API via Tailscale instead of public internet:

1. Don't add the DNS record
2. Access via: `http://[tailscale-ip]:8000`
3. Or add to Caddyfile with Tailscale hostname