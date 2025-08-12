#!/bin/bash

echo "🚀 ArambhGPT CLI Deployment"
echo "=========================="

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}This script will deploy your ArambhGPT platform using CLI tools.${NC}"
echo -e "${YELLOW}Make sure you have accounts on Railway and Vercel.${NC}"
echo ""

# Check CLI tools
echo -e "${YELLOW}🔧 Checking CLI tools...${NC}"

if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}Installing Vercel CLI...${NC}"
    npm install -g vercel
fi

if ! command -v railway &> /dev/null; then
    echo -e "${YELLOW}Installing Railway CLI...${NC}"
    npm install -g @railway/cli
fi

echo -e "${GREEN}✅ CLI tools ready${NC}"
echo ""

# Step 1: Backend Deployment
echo -e "${BLUE}🔧 Step 1: Backend Deployment (Railway)${NC}"
echo "======================================"
echo ""
echo -e "${YELLOW}Instructions for Railway deployment:${NC}"
echo "1. Run: railway login"
echo "2. Run: cd arambhgpt-backend"
echo "3. Run: railway init"
echo "4. Select 'Create new project'"
echo "5. Name it 'arambhgpt-backend'"
echo "6. Run: railway add postgresql"
echo "7. Set environment variables:"
echo ""

# Generate JWT secret
JWT_SECRET=$(python3 -c "import secrets; print(secrets.token_urlsafe(32))")

echo -e "${GREEN}Copy these commands:${NC}"
echo "railway variables set SECRET_KEY=\"$JWT_SECRET\""
echo "railway variables set DEBUG=\"False\""
echo "railway variables set GEMINI_API_KEY=\"your-gemini-api-key-here\""
echo ""
echo "8. Run: railway up"
echo "9. Get your backend URL from Railway dashboard"
echo ""

# Step 2: Frontend Deployment
echo -e "${BLUE}🎨 Step 2: Frontend Deployment (Vercel)${NC}"
echo "====================================="
echo ""
echo -e "${YELLOW}Instructions for Vercel deployment:${NC}"
echo "1. Run: vercel login"
echo "2. Run: cd arambhgpt-frontend"
echo "3. Run: vercel"
echo "4. Follow the prompts:"
echo "   - Link to existing project? No"
echo "   - Project name: arambhgpt-frontend"
echo "   - Directory: ./"
echo "5. Set environment variables in Vercel dashboard:"
echo "   - NEXT_PUBLIC_API_URL=https://your-backend.railway.app"
echo "   - NEXT_PUBLIC_WS_URL=wss://your-backend.railway.app"
echo "6. Run: vercel --prod"
echo ""

# Step 3: Manual Commands
echo -e "${BLUE}📋 Manual Deployment Commands${NC}"
echo "============================="
echo ""
echo -e "${GREEN}Backend (Railway):${NC}"
echo "cd arambhgpt-backend"
echo "railway login"
echo "railway init"
echo "railway add postgresql"
echo "railway variables set SECRET_KEY=\"$JWT_SECRET\""
echo "railway variables set DEBUG=\"False\""
echo "railway variables set GEMINI_API_KEY=\"your-key-here\""
echo "railway up"
echo ""
echo -e "${GREEN}Frontend (Vercel):${NC}"
echo "cd arambhgpt-frontend"
echo "vercel login"
echo "vercel"
echo "# Set environment variables in dashboard"
echo "vercel --prod"
echo ""

# Create environment files
echo -e "${BLUE}📄 Creating environment templates...${NC}"

# Backend environment template
cat > arambhgpt-backend/.env.production << EOF
# Production Environment Variables for Railway
SECRET_KEY=$JWT_SECRET
DEBUG=False
HOST=0.0.0.0
PORT=8000
GEMINI_API_KEY=your-gemini-api-key-here
DATABASE_URL=postgresql://... # Railway provides this automatically
ALLOWED_ORIGINS=https://your-frontend.vercel.app
EOF

# Frontend environment template
cat > arambhgpt-frontend/.env.production << EOF
# Production Environment Variables for Vercel
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
NEXT_PUBLIC_WS_URL=wss://your-backend.railway.app
NEXT_PUBLIC_ENABLE_PWA=true
EOF

echo -e "${GREEN}✅ Environment templates created${NC}"
echo ""

# Railway configuration
cat > arambhgpt-backend/railway.toml << EOF
[build]
builder = "NIXPACKS"

[deploy]
startCommand = "python -m uvicorn app.main:app --host 0.0.0.0 --port \$PORT"
healthcheckPath = "/health"
healthcheckTimeout = 300
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10

[variables]
PORT = "8000"
EOF

# Vercel configuration
cat > arambhgpt-frontend/vercel.json << EOF
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
EOF

echo -e "${GREEN}✅ Configuration files created${NC}"
echo ""

# Final instructions
echo -e "${BLUE}🎯 Quick Start Commands${NC}"
echo "======================"
echo ""
echo -e "${YELLOW}1. Get Gemini API Key:${NC}"
echo "   Visit: https://makersuite.google.com/app/apikey"
echo ""
echo -e "${YELLOW}2. Deploy Backend:${NC}"
echo "   cd arambhgpt-backend"
echo "   railway login"
echo "   railway init"
echo "   railway add postgresql"
echo "   railway variables set SECRET_KEY=\"$JWT_SECRET\""
echo "   railway variables set GEMINI_API_KEY=\"your-key\""
echo "   railway up"
echo ""
echo -e "${YELLOW}3. Deploy Frontend:${NC}"
echo "   cd arambhgpt-frontend"
echo "   vercel login"
echo "   vercel --prod"
echo ""
echo -e "${YELLOW}4. Update CORS:${NC}"
echo "   railway variables set ALLOWED_ORIGINS=\"https://your-frontend.vercel.app\""
echo ""

echo -e "${GREEN}🎉 Ready for deployment!${NC}"
echo -e "${BLUE}Your ArambhGPT platform will be live in minutes! 🚀${NC}"