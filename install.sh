#!/bin/bash

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Lelong App Auto-Installer ===${NC}"
echo "This script will set up Node.js, Nginx, SSL, and deploy the app."
echo ""

# 1. Ask for Configuration
read -p "Enter your Domain Name (e.g., pawnshop.group): " DOMAIN_NAME
read -p "Enter Database URL (mysql://user:pass@host:3306/db): " DB_URL

if [ -z "$DOMAIN_NAME" ] || [ -z "$DB_URL" ]; then
    echo -e "${RED}Error: Domain and Database URL are required.${NC}"
    exit 1
fi

echo -e "${YELLOW}Updating system...${NC}"
sudo apt update && sudo apt upgrade -y

# 2. Install Dependencies
echo -e "${YELLOW}Installing system dependencies...${NC}"
sudo apt install -y curl git nginx certbot python3-certbot-nginx build-essential

# 3. Install Node.js 20 (LTS)
echo -e "${YELLOW}Installing Node.js...${NC}"
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# 4. Setup Application
echo -e "${YELLOW}Setting up application...${NC}"
APP_DIR=$(pwd)

# Create .env file
echo "DATABASE_URL=\"$DB_URL\"" > .env

# Install Project Deps
echo -e "${YELLOW}Installing project dependencies...${NC}"
npm install

# Generate Prisma
echo -e "${YELLOW}Generating Prisma Client...${NC}"
npx prisma generate

# Database Migration/Push
echo -e "${YELLOW}Setting up database schema...${NC}"
npx prisma db push

# Build Next.js
echo -e "${YELLOW}Building application...${NC}"
npm run build

# 5. Setup PM2
echo -e "${YELLOW}Setting up Process Manager (PM2)...${NC}"
sudo npm install -g pm2
pm2 start ecosystem.config.js
pm2 save
pm2 startup | tail -n 1 | bash # Execute the command PM2 tells us to

# 6. Configure Nginx
echo -e "${YELLOW}Configuring Nginx...${NC}"
NGINX_CONF="/etc/nginx/sites-available/$DOMAIN_NAME"

sudo bash -c "cat > $NGINX_CONF" <<EOF
server {
    server_name $DOMAIN_NAME www.$DOMAIN_NAME;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

# Enable Site
sudo ln -sf $NGINX_CONF /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl restart nginx

# 7. Setup SSL (Let's Encrypt)
echo -e "${YELLOW}Setting up SSL with Let's Encrypt...${NC}"
sudo certbot --nginx -d $DOMAIN_NAME -d www.$DOMAIN_NAME --non-interactive --agree-tos -m admin@$DOMAIN_NAME --redirect

# 8. Setup Uploads Directory Permission
echo -e "${YELLOW}Fixing upload permissions...${NC}"
mkdir -p public/uploads
chmod -R 777 public/uploads

echo -e "${GREEN}=== Installation Complete! ===${NC}"
echo "Your app should be live at https://$DOMAIN_NAME"
