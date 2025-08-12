#!/bin/bash

echo "🚀 Starting ArambhGPT Full System"
echo "================================="

# Function to cleanup processes on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down services..."
    if [ ! -z "$BACKEND_PID" ]; then
        kill $BACKEND_PID 2>/dev/null
        echo "✅ Backend stopped"
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill $FRONTEND_PID 2>/dev/null
        echo "✅ Frontend stopped"
    fi
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM EXIT

# Check if ports are available
check_port() {
    local port=$1
    local service=$2
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
        echo "⚠️  Port $port is already in use by another process"
        echo "   Killing existing process on port $port..."
        lsof -ti:$port | xargs kill -9 2>/dev/null
        sleep 2
    fi
}

echo "🔍 Checking ports..."
check_port 8000 "Backend"
check_port 3000 "Frontend"

# Start Backend
echo ""
echo "🐍 Starting Backend (Python FastAPI)..."
echo "   Port: 8000"
echo "   API Docs: http://localhost:8000/docs"

cd arambhgpt-backend
python -m uvicorn app.main:app --reload --port 8000 --host 0.0.0.0 > ../backend.log 2>&1 &
BACKEND_PID=$!
cd ..

# Wait for backend to start
echo "   Waiting for backend to initialize..."
for i in {1..30}; do
    if curl -s http://localhost:8000/health > /dev/null 2>&1; then
        echo "✅ Backend is running (PID: $BACKEND_PID)"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "❌ Backend failed to start within 30 seconds"
        echo "   Check backend.log for errors"
        exit 1
    fi
    sleep 1
done

# Start Frontend
echo ""
echo "⚛️  Starting Frontend (Next.js)..."
echo "   Port: 3000"
echo "   URL: http://localhost:3000"

cd arambhgpt-frontend
npm run dev > ../frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

# Wait for frontend to start
echo "   Waiting for frontend to initialize..."
for i in {1..60}; do
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        echo "✅ Frontend is running (PID: $FRONTEND_PID)"
        break
    fi
    if [ $i -eq 60 ]; then
        echo "❌ Frontend failed to start within 60 seconds"
        echo "   Check frontend.log for errors"
        exit 1
    fi
    sleep 1
done

# System ready
echo ""
echo "🎉 ArambhGPT System is Ready!"
echo "============================="
echo ""
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:8000"
echo "📚 API Docs: http://localhost:8000/docs"
echo ""
echo "👤 Demo Users:"
echo "   📧 Email: demo@arambhgpt.com"
echo "   🔑 Password: demo123"
echo ""
echo "   📧 Email: test@example.com"
echo "   🔑 Password: password123"
echo ""
echo "🔥 Features Available:"
echo "   • 🤖 AI Chat with Language Matching (Hindi/English/Hinglish)"
echo "   • 👨‍⚕️ Professional Search & Booking"
echo "   • 📊 Mood Tracking & Analytics"
echo "   • 👥 Community Groups & Support"
echo "   • 🧘 Wellness Tools & Meditation"
echo "   • 📱 Mobile Responsive Design"
echo ""
echo "📋 Quick Test Commands:"
echo "   ./test-language-matching.sh    # Test AI language matching"
echo "   ./test-complete-system.js      # Full system integration test"
echo "   ./test-professional-search.sh  # Test professional search"
echo ""
echo "📝 Logs:"
echo "   Backend: tail -f backend.log"
echo "   Frontend: tail -f frontend.log"
echo ""
echo "⏹️  Press Ctrl+C to stop all services"
echo ""

# Keep script running and show live status
while true; do
    # Check if processes are still running
    if ! kill -0 $BACKEND_PID 2>/dev/null; then
        echo "❌ Backend process died unexpectedly"
        echo "   Check backend.log for errors"
        break
    fi
    
    if ! kill -0 $FRONTEND_PID 2>/dev/null; then
        echo "❌ Frontend process died unexpectedly"
        echo "   Check frontend.log for errors"
        break
    fi
    
    # Show status every 30 seconds
    sleep 30
    echo "💚 System Status: Backend ✅ | Frontend ✅ | $(date '+%H:%M:%S')"
done

# Cleanup will be called automatically by trap