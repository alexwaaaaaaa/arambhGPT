#!/bin/bash

echo "🔄 Restarting ArambhGPT Servers..."

# Kill existing processes
echo "🛑 Stopping existing servers..."
pkill -f "uvicorn"
pkill -f "next"
pkill -f "npm run dev"

# Wait a moment for processes to stop
sleep 2

echo "🚀 Starting Backend Server..."
# Start backend in background
cd arambhgpt-backend
source .venv/bin/activate 2>/dev/null || echo "Virtual environment not found, continuing..."
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!
echo "Backend started with PID: $BACKEND_PID"

# Wait a moment for backend to start
sleep 3

echo "🚀 Starting Frontend Server..."
# Start frontend in background
cd ../arambhgpt-frontend
npm run dev &
FRONTEND_PID=$!
echo "Frontend started with PID: $FRONTEND_PID"

echo "✅ Both servers are starting up..."
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend: http://localhost:8000"
echo "📚 API Docs: http://localhost:8000/docs"

echo ""
echo "🎯 Quick Test URLs:"
echo "   • Home: http://localhost:3000"
echo "   • Professionals: http://localhost:3000/professionals"
echo "   • Communication Demo: http://localhost:3000/test-communication"
echo "   • Professional Signin: http://localhost:3000/professional/signin"
echo "   • About: http://localhost:3000/about"

echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user to stop
wait