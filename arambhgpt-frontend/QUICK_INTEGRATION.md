# Quick Integration Guide - Core Features Only

## 🎯 **Ready to Deploy Now!**

Core features that work immediately with your existing backend:

### **✅ Working Features:**
- 🔐 User signup/signin
- 💬 Chat messaging with AI
- 📚 Conversation history
- 📱 Mobile responsive interface
- 🔒 Protected routes

### **⚠️ Disabled Features (Until Backend Ready):**
- 🔍 Search (shows "Coming Soon")
- 📊 Export (buttons disabled)
- 📈 Statistics (shows placeholder)
- 🗂️ Rename/Delete conversations (hidden)

## 🚀 **Integration Steps:**

### **1. Environment Setup**
```bash
# Update .env.local with your backend URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:7777
```

### **2. Backend CORS Setup**
```python
# Add to your FastAPI backend:
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### **3. Start Both Servers**
```bash
# Terminal 1 - Backend
cd arambhgpt-backend
uvicorn main:app --reload --port 7777

# Terminal 2 - Frontend  
cd arambhgpt-frontend
npm install
npm run dev
```

### **4. Test Core Features**
1. **Go to:** http://localhost:3000
2. **Sign Up:** Create new account
3. **Sign In:** Login with credentials
4. **Chat:** Send message to AI
5. **History:** Check conversation sidebar

## 🔧 **Expected API Endpoints (Already Working):**

```
✅ POST /api/auth/signup
✅ POST /api/auth/login  
✅ GET  /api/auth/me
✅ POST /api/chat
✅ GET  /api/history/conversations
✅ POST /api/history/conversations
✅ GET  /api/history/conversations/{id}
```

## 🎉 **What Users Will See:**

### **✅ Fully Working:**
- Beautiful landing page
- Smooth signup/signin flow
- Real-time chat interface
- Conversation history sidebar
- Mobile-optimized experience
- Professional UI/UX

### **🚧 Coming Soon Messages:**
- Search: "Search feature coming soon!"
- Export: Buttons show as disabled
- Stats: "Statistics will be available soon"
- Profile editing: Basic info only

## 🔄 **Adding Advanced Features Later:**

When ready, just add these backend endpoints:
```python
# Phase 2 - Advanced Features
POST /api/history/search      # Enable search
POST /api/history/export      # Enable export  
GET  /api/history/stats       # Enable statistics
PUT  /api/history/conversations/{id}  # Enable rename/delete
```

Frontend will automatically detect and enable these features!

## 🐛 **Troubleshooting:**

### **Common Issues:**
1. **CORS Error:** Check backend CORS settings
2. **Auth Issues:** Verify JWT token format
3. **Connection Error:** Check backend URL in .env.local

### **Debug Mode:**
```bash
# Enable debug logging
NEXT_PUBLIC_DEBUG=true
```

## ✅ **Success Checklist:**

- [ ] Backend running on port 7777
- [ ] Frontend running on port 3000
- [ ] CORS configured properly
- [ ] Can signup new user
- [ ] Can signin existing user
- [ ] Can send chat messages
- [ ] Can see conversation history
- [ ] Mobile interface works

## 🎯 **Result:**

**Professional mental health AI platform with:**
- ✅ Complete authentication system
- ✅ Real-time AI chat
- ✅ Conversation management
- ✅ Mobile-responsive design
- ✅ Production-ready UI/UX

**Advanced features can be added incrementally without breaking existing functionality!**

## 🚀 **Deploy Now, Enhance Later!**