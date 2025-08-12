#!/bin/bash

echo "🚀 ArambhGPT Production Deployment Script"
echo "=========================================="

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${YELLOW}📋 Pre-deployment Checklist${NC}"
echo "1. ✅ GitHub repository: https://github.com/alexwaaaaaaa/arambhGPT"
echo "2. ✅ Code committed and pushed"
echo "3. ✅ Environment variables ready"
echo ""

echo -e "${YELLOW}🎯 Deployment Steps:${NC}"
echo ""

echo -e "${GREEN}Step 1: Backend Deployment (Railway)${NC}"
echo "1. Go to https://railway.app"
echo "2. Sign up/Login with GitHub"
echo "3. Create new project"
echo "4. Connect GitHub repository: alexwaaaaaaa/arambhGPT"
echo "5. Select 'arambhgpt-backend' as root directory"
echo "6. Add PostgreSQL service"
echo "7. Set environment variables:"
echo "   - SECRET_KEY=your-jwt-secret-key"
echo "   - GEMINI_API_KEY=your-gemini-api-key"
echo "   - DEBUG=False"
echo "8. Deploy automatically"
echo ""

echo -e "${GREEN}Step 2: Frontend Deployment (Vercel)${NC}"
echo "1. Go to https://vercel.com"
echo "2. Sign up/Login with GitHub"
echo "3. Import project: alexwaaaaaaa/arambhGPT"
echo "4. Select 'arambhgpt-frontend' as root directory"
echo "5. Framework: Next.js"
echo "6. Set environment variables:"
echo "   - NEXT_PUBLIC_API_URL=https://your-backend.railway.app"
echo "   - NEXT_PUBLIC_WS_URL=wss://your-backend.railway.app"
echo "7. Deploy automatically"
echo ""

echo -e "${GREEN}Step 3: Testing${NC}"
echo "1. Test backend health: curl https://your-backend.railway.app/health"
echo "2. Test frontend: https://your-app.vercel.app"
echo "3. Test features: signup, login, chat, professionals"
echo ""

echo -e "${YELLOW}🔧 Required API Keys:${NC}"
echo "1. Google Gemini API Key:"
echo "   - Go to https://makersuite.google.com/app/apikey"
echo "   - Create new API key"
echo "   - Copy and use in Railway environment variables"
echo ""
echo "2. JWT Secret Key:"
echo "   - Generate: python -c \"import secrets; print(secrets.token_urlsafe(32))\""
echo "   - Use output as SECRET_KEY"
echo ""

echo -e "${GREEN}✅ Production Features Ready:${NC}"
echo "• AI Chat System with Honey assistant"
echo "• Professional consultation platform"
echo "• Video/Audio calling with WebRTC"
echo "• Digital wallet and payments"
echo "• Mood tracking and wellness tools"
echo "• Community support features"
echo "• Multi-language support (Hindi/Hinglish/English)"
echo "• Mobile-responsive PWA"
echo "• Real-time communication"
echo "• Comprehensive testing suite"
echo ""

echo -e "${YELLOW}📊 Expected Performance:${NC}"
echo "• Frontend Load Time: < 3 seconds"
echo "• API Response Time: < 500ms"
echo "• Uptime: > 99.9%"
echo "• Mobile Performance: Excellent"
echo ""

echo -e "${GREEN}🎉 Your ArambhGPT platform will be live at:${NC}"
echo "• Frontend: https://your-app.vercel.app"
echo "• Backend: https://your-backend.railway.app"
echo "• API Docs: https://your-backend.railway.app/docs"
echo ""

echo -e "${YELLOW}💡 Post-Deployment:${NC}"
echo "1. Configure custom domain (optional)"
echo "2. Set up monitoring alerts"
echo "3. Add SSL certificates (automatic)"
echo "4. Configure CDN (optional)"
echo "5. Set up backup strategy"
echo ""

echo -e "${GREEN}🚀 Ready to help people with mental health! 🧠💚${NC}"