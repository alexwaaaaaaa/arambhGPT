#!/bin/bash

echo "🔍 Checking ArambhGPT Server Status..."

echo ""
echo "🔧 Backend Server (Port 8000):"
if curl -s http://localhost:8000/health > /dev/null 2>&1; then
    echo "   ✅ Backend is running"
    echo "   📚 API Docs: http://localhost:8000/docs"
else
    echo "   ❌ Backend is not responding"
fi

echo ""
echo "📱 Frontend Server (Port 3000):"
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "   ✅ Frontend is running"
    echo "   🌐 App: http://localhost:3000"
else
    echo "   ❌ Frontend is not responding"
fi

echo ""
echo "🎯 Test URLs:"
echo "   • Home: http://localhost:3000"
echo "   • Professionals: http://localhost:3000/professionals"
echo "   • Communication Demo: http://localhost:3000/test-communication"
echo "   • Professional Signin: http://localhost:3000/professional/signin"
echo "   • About: http://localhost:3000/about"

echo ""
echo "🔧 Backend API:"
echo "   • Health Check: http://localhost:8000/health"
echo "   • API Documentation: http://localhost:8000/docs"