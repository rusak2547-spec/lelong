#!/bin/bash

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}=== Lelong App Auto-Installer (Drizzle Edition) ===${NC}"
# Enable logging to install.log
exec > >(tee -i install.log)
exec 2>&1

# Read domain from server.config
DOMAIN_NAME=$(grep '^DOMAIN_NAME=' server.config | cut -d'=' -f2)
APP_DIR=$(grep '^APP_DIR=' server.config | cut -d'=' -f2)
PM2_NAME=$(grep '^PM2_NAME=' server.config | cut -d'=' -f2)
# Helper for sudo (Standard interactive)
# No auto-password injection to prevent pipe conflicts

if [ -z "$DOMAIN_NAME" ]; then
    DOMAIN_NAME="pawnshop.group"
fi

echo "Domain: $DOMAIN_NAME"
echo ""


echo -e "${YELLOW}Installing system dependencies (Node.js 20, Nginx, Certbot)...${NC}"
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git unzip build-essential

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs nginx certbot python3-certbot-nginx

# Verify Node version
echo -e "${GREEN}Node version: $(node -v)${NC}"

echo -e "${YELLOW}Installing project dependencies...${NC}"
npm install

# Database Schema Sync (Drizzle)
echo -e "${YELLOW}Syncing database schema with Drizzle...${NC}"
npx drizzle-kit push --force

# Build Next.js
echo -e "${YELLOW}Building application...${NC}"
npm run build

# Setup PM2
echo -e "${YELLOW}Setting up Process Manager (PM2)...${NC}"
sudo npm install -g pm2
pm2 delete lelong 2>/dev/null
pm2 start ecosystem.config.js
pm2 save
pm2 startup | tail -n 1 | bash

# Configure Nginx
echo -e "${YELLOW}Configuring Nginx...${NC}"
NGINX_CONF="/etc/nginx/sites-available/$DOMAIN_NAME"

# Create Nginx config
echo "server {
    server_name $DOMAIN_NAME;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}" | sudo tee $NGINX_CONF > /dev/null

sudo ln -sf $NGINX_CONF /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl restart nginx

# Setup SSL
echo -e "${YELLOW}Setting up SSL with Let's Encrypt...${NC}"
sudo certbot --nginx -d $DOMAIN_NAME --non-interactive --agree-tos -m admin@$DOMAIN_NAME --redirect

# Fix permissions
echo -e "${YELLOW}Fixing upload permissions...${NC}"
mkdir -p public/uploads
chmod -R 777 public/uploads

echo -e "${GREEN}=== Installation Complete! ===${NC}"
echo "Your app should be live at https://$DOMAIN_NAME"
