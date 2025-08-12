# Backend Integration Guide

## 🔗 Ready for Integration!

The ArambhGPT frontend is **100% ready** to integrate with your backend. Here's what you need to do:

## 📋 Integration Checklist

### **1. Environment Setup**
- [ ] Update `.env.local` with your backend URL
- [ ] Configure JWT secret (should match backend)
- [ ] Set production environment variables

### **2. Backend API Endpoints Required**

#### **Authentication Endpoints**
```
POST /api/auth/signup
POST /api/auth/login  
GET  /api/auth/me
```

#### **Chat Endpoints**
```
POST /api/chat
GET  /api/history/conversations
POST /api/history/conversations
GET  /api/history/conversations/:id
PUT  /api/history/conversations/:id
DELETE /api/history/conversations/:id
POST /api/history/conversations/:id/messages
```

#### **Advanced Features**
```
POST /api/history/search
POST /api/history/export
GET  /api/history/stats
```

### **3. Expected API Response Formats**

#### **Authentication Response**
```json
{
  "access_token": "jwt-token-here",
  "token_type": "Bearer",
  "user": {
    "id": "user-id",
    "name": "User Name",
    "email": "user@example.com"
  }
}
```

#### **Chat Response**
```json
{
  "message": {
    "id": "msg-id",
    "content": "AI response",
    "sender": "ai",
    "ai_provider": "openai",
    "created_at": "2024-01-01T00:00:00Z"
  },
  "conversation": {
    "id": "conv-id",
    "title": "Conversation Title",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

#### **Conversations List Response**
```json
{
  "conversations": [
    {
      "id": "conv-id",
      "title": "Conversation Title",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z",
      "message_count": 5,
      "last_message_preview": "Last message...",
      "last_message_timestamp": "2024-01-01T00:00:00Z",
      "is_archived": false
    }
  ],
  "total_count": 10,
  "page": 1,
  "limit": 20,
  "has_more": false
}
```

### **4. CORS Configuration**

Make sure your backend allows requests from frontend:

```python
# FastAPI CORS example
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

### **5. JWT Token Handling**

Backend should:
- Accept `Authorization: Bearer <token>` header
- Return 401 for invalid/expired tokens
- Include user info in token payload

### **6. Error Response Format**

```json
{
  "detail": "Error message",
  "code": "ERROR_CODE",
  "status": 400
}
```

## 🚀 Integration Steps

### **Step 1: Start Backend Server**
```bash
# Make sure your backend is running on port 7777
# Or update NEXT_PUBLIC_API_BASE_URL in .env.local
```

### **Step 2: Start Frontend**
```bash
cd arambhgpt-frontend
npm install
npm run dev
```

### **Step 3: Test Integration**
1. **Authentication Flow**
   - Try signup/signin
   - Check if JWT tokens work
   - Verify protected routes

2. **Chat Functionality**
   - Send a message
   - Check if AI responds
   - Verify conversation creation

3. **Advanced Features**
   - Test search functionality
   - Try export features
   - Check statistics

## 🔧 Configuration Files

### **API Client Configuration**
The API client is already configured in `src/lib/api.ts`:
- Base URL from environment
- JWT token handling
- Error handling
- Retry logic

### **Type Definitions**
All TypeScript types are defined in `src/types/`:
- `auth.ts` - Authentication types
- `chat.ts` - Chat and conversation types
- `history.ts` - Search, export, stats types

## 🐛 Troubleshooting

### **Common Issues**

1. **CORS Errors**
   - Check backend CORS configuration
   - Verify frontend URL is allowed

2. **Authentication Issues**
   - Check JWT secret matches
   - Verify token format
   - Check token expiration

3. **API Response Format**
   - Ensure response matches expected format
   - Check property names (sender vs role)
   - Verify data types

### **Debug Mode**
Set `NEXT_PUBLIC_DEBUG=true` to see:
- API request/response logs
- Authentication state changes
- Error details

## ✅ Integration Complete!

Once backend is connected:
- [ ] All authentication flows work
- [ ] Chat messages send/receive properly
- [ ] Conversations save and load
- [ ] Search functionality works
- [ ] Export features function
- [ ] Statistics display correctly
- [ ] Mobile interface works
- [ ] Error handling works

## 🎉 Ready for Production!

After successful integration:
1. Update environment variables for production
2. Build and deploy frontend
3. Configure production CORS
4. Set up monitoring and logging

**Frontend is 100% ready - just connect your backend! 🚀**