#!/bin/bash

# SagarSaathi Local Setup Script
# This script updates .env files and starts Docker Compose

set -e  # Exit on error

echo "🚀 SagarSaathi Local Setup"
echo "=========================="
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Generate JWT Secret
echo "📝 Generating secure JWT_SECRET..."
JWT_SECRET=$(openssl rand -base64 32)
echo -e "${GREEN}✓ JWT_SECRET generated${NC}"
echo ""

# Create backend .env
echo "📝 Creating backend/.env..."
cat > backend/.env << EOF
# MongoDB Configuration
MONGODB_URI=mongodb://mongodb:27017/sagarsaathi

# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Secret - Auto-generated
JWT_SECRET=${JWT_SECRET}

# Twilio Configuration (Optional)
TWILIO_ACCOUNT_SID=your_account_sid_here
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=your_twilio_phone_number_here
EOF
echo -e "${GREEN}✓ backend/.env created${NC}"
echo ""

# Create frontend .env.local
echo "📝 Creating frontend/.env.local..."
cat > frontend/.env.local << EOF
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000

# Socket.io Configuration
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
EOF
echo -e "${GREEN}✓ frontend/.env.local created${NC}"
echo ""

# Stop existing containers
echo "🛑 Stopping existing Docker containers..."
docker stop sagarsaathi-backend sagarsaathi-frontend sagarsaathi-mongodb 2>/dev/null || true
echo -e "${GREEN}✓ Existing containers stopped${NC}"
echo ""

# Start Docker Compose
echo "🐳 Starting Docker Compose..."
echo -e "${YELLOW}This may take a few minutes on first run...${NC}"
echo ""

docker-compose up --build -d

echo ""
echo -e "${GREEN}✅ SagarSaathi is starting!${NC}"
echo ""
echo "📍 Access URLs:"
echo "   Frontend: http://localhost:3000"
echo "   Backend:  http://localhost:5000"
echo ""
echo "📊 View logs:"
echo "   docker-compose logs -f"
echo ""
echo "🛑 Stop services:"
echo "   docker-compose down"
echo ""
echo "⏳ Services may take 30-60 seconds to be fully ready..."
echo ""
