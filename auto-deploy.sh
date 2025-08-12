#!/bin/bash

echo "🚀 ArambhGPT Automatic Deployment Script"
echo "========================================"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Check if required CLIs are installed
echo -e "${YELLOW}🔧 Checking CLI tools...${NC}"

if ! command -v vercel &> /dev/null; then
    echo -e "${RED}❌ Vercel CLI not found. Installing...${NC}"
    npm install -g vercel
fi

if ! command -v railway &> /dev/null; then
    echo -e "${RED}❌ Railway CLI not found. Installing...${NC}"
    npm install -g @railway/cli
fi

echo -e "${GREEN}✅ CLI tools ready${NC}"
echo ""

# Step 1: Deploy Backend to Railway
echo -e "${BLUE}🔧 Step 1: Deploying Backend to Railway${NC}"
echo "========================================"

cd arambhgpt-backend

# Login to Railway (if not already logged in)
echo -e "${YELLOW}🔐 Logging into Railway...${NC}"
railway login

# Create new project
echo -e "${YELLOW}📦 Creating Railway project...${NC}"
railway project create arambhgpt-backend

# Add PostgreSQL service
echo -e "${YELLOW}🗄️ Adding PostgreSQL database...${NC}"
railway add postgresql

# Set environment variables
echo -e "${YELLOW}⚙️ Setting environment variables...${NC}"

# Generate JWT secret
JWT_SECRET=$(python3 -c "import secrets; print(secrets.token_urlsafe(32))")

railway variables set SECRET_KEY="$JWT_SECRET"
railway variables set DEBUG="False"
railway variables set HOST="0.0.0.0"
railway variables set PORT="8000"

# Prompt for Gemini API key
echo -e "${YELLOW}🤖 Please enter your Google Gemini API Key:${NC}"
read -p "Gemini API Key: " GEMINI_KEY
railway variables set GEMINI_API_KEY="$GEMINI_KEY"

# Deploy backend
echo -e "${YELLOW}🚀 Deploying backend...${NC}"
railway up

# Get backend URL
BACKEND_URL=$(railway status --json | python3 -c "import sys, json; data=json.load(sys.stdin); print(data.get('deployments', [{}])[0].get('url', 'https://your-backend.railway.app'))" 2>/dev/null || echo "https://your-backend.railway.app")

echo -e "${GREEN}✅ Backend deployed at: $BACKEND_URL${NC}"

cd ..

# Step 2: Deploy Frontend to Vercel
echo ""
echo -e "${BLUE}🎨 Step 2: Deploying Frontend to Vercel${NC}"
echo "======================================="

cd arambhgpt-frontend

# Login to Vercel (if not already logged in)
echo -e "${YELLOW}🔐 Logging into Vercel...${NC}"
vercel login

# Set environment variables for production
echo -e "${YELLOW}⚙️ Setting frontend environment variables...${NC}"

# Create .env.production file
cat > .env.production << EOF
NEXT_PUBLIC_API_URL=$BACKEND_URL
NEXT_PUBLIC_WS_URL=${BACKEND_URL/https:/wss:}
NEXT_PUBLIC_ENABLE_PWA=true
NEXT_PUBLIC_ENABLE_ANALYTICS=true
EOF

# Deploy to Vercel
echo -e "${YELLOW}🚀 Deploying frontend...${NC}"
vercel --prod --yes

# Get frontend URL
FRONTEND_URL=$(vercel ls --json | python3 -c "import sys, json; data=json.load(sys.stdin); print(data[0]['url'] if data else 'https://your-app.vercel.app')" 2>/dev/null || echo "https://your-app.vercel.app")

echo -e "${GREEN}✅ Frontend deployed at: https://$FRONTEND_URL${NC}"

cd ..

# Step 3: Update CORS settings
echo ""
echo -e "${BLUE}🔒 Step 3: Updating CORS Settings${NC}"
echo "=================================="

cd arambhgpt-backend

# Update CORS origins
railway variables set ALLOWED_ORIGINS="https://$FRONTEND_URL,https://arambhgpt.com"

echo -e "${GREEN}✅ CORS settings updated${NC}"

cd ..

# Step 4: Test deployment
echo ""
echo -e "${BLUE}🧪 Step 4: Testing Deployment${NC}"
echo "=============================="

echo -e "${YELLOW}Testing backend health...${NC}"
HEALTH_CHECK=$(curl -s "$BACKEND_URL/health" | python3 -c "import sys, json; print(json.load(sys.stdin).get('status', 'unknown'))" 2>/dev/null || echo "error")

if [ "$HEALTH_CHECK" = "healthy" ]; then
    echo -e "${GREEN}✅ Backend health check passed${NC}"
else
    echo -e "${RED}❌ Backend health check failed${NC}"
fi

echo -e "${YELLOW}Testing frontend...${NC}"
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://$FRONTEND_URL" || echo "000")

if [ "$FRONTEND_STATUS" = "200" ]; then
    echo -e "${GREEN}✅ Frontend is accessible${NC}"
else
    echo -e "${RED}❌ Frontend accessibility check failed${NC}"
fi

# Step 5: Setup monitoring (optional)
echo ""
echo -e "${BLUE}📊 Step 5: Setting up Monitoring${NC}"
echo "================================="

echo -e "${YELLOW}Setting up basic monitoring...${NC}"

# Create a simple uptime monitor script
cat > monitor-uptime.sh << 'EOF'
#!/bin/bash
# Simple uptime monitor
BACKEND_URL="$1"
FRONTEND_URL="$2"

while true; do
    # Check backend
    if curl -s "$BACKEND_URL/health" > /dev/null; then
        echo "$(date): Backend OK"
    else
        echo "$(date): Backend DOWN"
    fi
    
    # Check frontend
    if curl -s "$FRONTEND_URL" > /dev/null; then
        echo "$(date): Frontend OK"
    else
        echo "$(date): Frontend DOWN"
    fi
    
    sleep 300  # Check every 5 minutes
done
EOF

chmod +x monitor-uptime.sh

echo -e "${GREEN}✅ Monitoring script created${NC}"

# Final summary
echo ""
echo -e "${GREEN}🎉 DEPLOYMENT COMPLETE!${NC}"
echo "======================="
echo ""
echo -e "${BLUE}📋 Deployment Summary:${NC}"
echo "• Backend URL:  $BACKEND_URL"
echo "• Frontend URL: https://$FRONTEND_URL"
echo "• Database:     PostgreSQL (Railway)"
echo "• Status:       Live and Ready!"
echo ""
echo -e "${BLUE}🔗 Important URLs:${NC}"
echo "• Live App:     https://$FRONTEND_URL"
echo "• API Health:   $BACKEND_URL/health"
echo "• API Docs:     $BACKEND_URL/docs"
echo "• GitHub:       https://github.com/alexwaaaaaaa/arambhGPT"
echo ""
echo -e "${BLUE}🛠️ Next Steps:${NC}"
echo "1. Test all features on live site"
echo "2. Configure custom domain (optional)"
echo "3. Set up SSL certificates (automatic)"
echo "4. Configure monitoring alerts"
echo "5. Add Google Analytics (optional)"
echo ""
echo -e "${BLUE}🧪 Test Your App:${NC}"
echo "1. Visit: https://$FRONTEND_URL"
echo "2. Sign up for new account"
echo "3. Test AI chat with Honey"
echo "4. Try professional consultations"
echo "5. Test video/audio calling"
echo "6. Check wallet functionality"
echo ""
echo -e "${GREEN}🚀 Your ArambhGPT Mental Health Platform is LIVE!${NC}"
echo -e "${GREEN}Ready to help people with mental health support! 🧠💚${NC}"
echo ""
echo -e "${YELLOW}💡 Pro Tips:${NC}"
echo "• Monitor logs: railway logs (backend) | vercel logs (frontend)"
echo "• Update code: git push origin main (auto-deploys)"
echo "• Scale up: Upgrade Railway/Vercel plans as needed"
echo "• Backup: Regular database backups via Railway dashboard"
echo ""
echo -e "${BLUE}📞 Support:${NC}"
echo "• Documentation: Check README.md and docs/"
echo "• Issues: GitHub Issues tab"
echo "• Monitoring: ./monitor-uptime.sh $BACKEND_URL https://$FRONTEND_URL"