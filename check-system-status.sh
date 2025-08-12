#!/bin/bash

echo "🔍 ArambhGPT System Status Check"
echo "==============================="

# Check Backend
echo ""
echo "🐍 Backend Status:"
if curl -s http://localhost:8000/health > /dev/null 2>&1; then
    echo "   ✅ Backend is running on http://localhost:8000"
    echo "   📚 API Docs: http://localhost:8000/docs"
else
    echo "   ❌ Backend is not running"
fi

# Check Frontend
echo ""
echo "⚛️  Frontend Status:"
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "   ✅ Frontend is running on http://localhost:3000"
else
    echo "   ❌ Frontend is not running"
fi

# Check Database
echo ""
echo "🗄️  Database Status:"
if [ -f "arambhgpt-backend/arambhgpt.db" ]; then
    echo "   ✅ Database file exists"
    
    # Check if demo users exist
    cd arambhgpt-backend
    USER_COUNT=$(python -c "
import sqlite3
conn = sqlite3.connect('arambhgpt.db')
cursor = conn.cursor()
cursor.execute('SELECT COUNT(*) FROM users')
count = cursor.fetchone()[0]
print(count)
conn.close()
" 2>/dev/null)
    cd ..
    
    if [ "$USER_COUNT" -gt 0 ]; then
        echo "   ✅ Database has $USER_COUNT users"
    else
        echo "   ⚠️  Database is empty"
    fi
else
    echo "   ❌ Database file not found"
fi

# Check Environment
echo ""
echo "🔧 Environment:"
if [ -f "arambhgpt-backend/.env" ]; then
    echo "   ✅ Backend .env file exists"
else
    echo "   ⚠️  Backend .env file missing"
fi

if [ -f "arambhgpt-frontend/.env.local" ]; then
    echo "   ✅ Frontend .env.local file exists"
else
    echo "   ⚠️  Frontend .env.local file missing"
fi

# Check Dependencies
echo ""
echo "📦 Dependencies:"
if command -v python &> /dev/null; then
    PYTHON_VERSION=$(python --version 2>&1)
    echo "   ✅ Python: $PYTHON_VERSION"
else
    echo "   ❌ Python not found"
fi

if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version 2>&1)
    echo "   ✅ Node.js: $NODE_VERSION"
else
    echo "   ❌ Node.js not found"
fi

if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version 2>&1)
    echo "   ✅ npm: $NPM_VERSION"
else
    echo "   ❌ npm not found"
fi

echo ""
echo "🎯 Quick Actions:"
echo "   Start System: ./start-full-system.sh"
echo "   Test Language: ./test-language-matching.sh"
echo "   Test Complete: ./test-complete-system.js"
echo ""