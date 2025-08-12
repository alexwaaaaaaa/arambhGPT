# 🚀 ArambhGPT Backend-Frontend Integration Guide

## 🎯 Overview
This guide helps you run both the backend and frontend together with full API integration.

## 📋 Prerequisites
- Python 3.8+ (for backend)
- Node.js 18+ (for frontend)
- SQLite (included with Python)

## 🔧 Backend Setup

### 1. Navigate to Backend Directory
```bash
cd arambhgpt-backend
```

### 2. Create Virtual Environment
```bash
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Start Backend Server
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The backend will be available at: `http://localhost:8000`

### 5. Verify Backend
Visit `http://localhost:8000/docs` to see the API documentation.

## 🎨 Frontend Setup

### 1. Navigate to Frontend Directory
```bash
cd arambhgpt-frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Frontend Development Server
```bash
npm run dev
```

The frontend will be available at: `http://localhost:3000`

## 🧪 Test Integration

### 1. Run Backend Integration Test
```bash
cd arambhgpt-frontend
node test-backend-integration.js
```

This will test all API endpoints and verify connectivity.

### 2. Manual Testing
1. Open `http://localhost:3000`
2. Sign up for a new account
3. Try logging mood entries
4. Check notifications
5. Test chat functionality

## 🔗 API Endpoints Now Available

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user

### Mood Tracking
- `POST /mood/entries` - Create/update mood entry
- `GET /mood/entries` - Get mood history
- `GET /mood/stats` - Get mood statistics
- `DELETE /mood/entries/{date}` - Delete mood entry

### Notifications
- `GET /notifications` - Get user notifications
- `PUT /notifications/{id}/read` - Mark as read
- `PUT /notifications/mark-all-read` - Mark all as read
- `GET /notifications/settings` - Get notification settings
- `PUT /notifications/settings` - Update settings
- `GET /notifications/unread-count` - Get unread count

### Social Features
- `GET /social/groups` - Get support groups
- `POST /social/groups` - Create support group
- `POST /social/groups/{id}/join` - Join group
- `GET /social/groups/{id}/messages` - Get group messages
- `POST /social/groups/{id}/messages` - Send message

### AI Context
- `GET /ai-context` - Get AI preferences
- `PUT /ai-context` - Update AI context
- `POST /ai-context/analyze-message` - Analyze message

### Chat
- `POST /chat` - Send chat message

## 🎯 Key Features Now Working

### ✅ Real-Time Features
- **Mood Tracking**: Full CRUD operations with statistics
- **Smart Notifications**: Background tasks for reminders
- **AI Context**: Personalized responses based on user data
- **Social Groups**: Community support features
- **Advanced Analytics**: Mood correlations and trends

### ✅ Background Tasks
- Daily mood reminders (8 PM)
- Wellness tips (every 4 hours)
- Achievement notifications
- Streak calculations

### ✅ Data Persistence
- SQLite database for all user data
- Automatic table initialization
- Data relationships and foreign keys

## 🔍 Troubleshooting

### Backend Issues
```bash
# Check if backend is running
curl http://localhost:8000/

# Check logs
tail -f backend.log
```

### Frontend Issues
```bash
# Clear Next.js cache
rm -rf .next
npm run dev

# Check environment variables
cat .env.local
```

### Database Issues
```bash
# Check if database file exists
ls -la arambhgpt-backend/*.db

# Reset database (if needed)
rm arambhgpt-backend/*.db
# Restart backend to recreate tables
```

## 🚀 Production Deployment

### Backend
```bash
# Install production dependencies
pip install gunicorn

# Run with Gunicorn
gunicorn app.main:app -w 4 -k uvicorn.workers.UnicornWorker --bind 0.0.0.0:8000
```

### Frontend
```bash
# Build for production
npm run build

# Start production server
npm start
```

## 📊 Monitoring

### Backend Health Check
```bash
curl http://localhost:8000/health
```

### Frontend Health Check
```bash
curl http://localhost:3000/api/health
```

## 🎉 Success!

If everything is working correctly, you should see:
- ✅ Backend API responding at port 8000
- ✅ Frontend UI loading at port 3000
- ✅ User registration and login working
- ✅ Mood tracking with real data persistence
- ✅ Notifications system active
- ✅ AI context analysis working
- ✅ Chat functionality integrated

## 🔧 Next Steps

1. **Customize AI Responses**: Update the chat endpoint with your preferred AI service
2. **Add Email Notifications**: Integrate with email service for notifications
3. **Deploy to Cloud**: Use services like Heroku, Vercel, or AWS
4. **Add Monitoring**: Implement logging and error tracking
5. **Scale Database**: Consider PostgreSQL for production

Happy coding! 🎯✨