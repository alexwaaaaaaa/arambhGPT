# Missing Backend Features for Full Integration

## 🔍 Advanced Search (Priority: HIGH)

### Required Endpoint:
```python
POST /api/history/search
```

### Request Format:
```json
{
  "query": "search text",
  "page": 1,
  "limit": 20,
  "date_from": "2024-01-01",
  "date_to": "2024-12-31",
  "archived": false
}
```

### Response Format:
```json
{
  "results": [
    {
      "conversation": {
        "id": "conv-id",
        "title": "Conversation Title",
        "created_at": "2024-01-01T00:00:00Z",
        "updated_at": "2024-01-01T00:00:00Z",
        "message_count": 5,
        "last_message_preview": "Last message...",
        "is_archived": false
      },
      "highlights": ["highlighted", "search", "terms"],
      "relevance_score": 0.95
    }
  ],
  "total_count": 10,
  "page": 1,
  "limit": 20,
  "has_more": false
}
```

## 📊 Export Features (Priority: HIGH)

### Required Endpoint:
```python
POST /api/history/export
```

### Request Format:
```json
{
  "options": {
    "format": "pdf|json|txt",
    "conversation_ids": ["id1", "id2"],
    "date_from": "2024-01-01",
    "date_to": "2024-12-31"
  }
}
```

### Response:
- Return file as blob/binary data
- Set appropriate Content-Type header
- Set Content-Disposition header for download

## 📈 Statistics (Priority: MEDIUM)

### Required Endpoint:
```python
GET /api/history/stats
```

### Response Format:
```json
{
  "total_conversations": 25,
  "total_messages": 150,
  "active_days": 12,
  "average_messages_per_conversation": 6.0,
  "most_active_day": "2024-01-15",
  "conversation_frequency": {
    "2024-01-01": 3,
    "2024-01-02": 5,
    "2024-01-03": 2
  }
}
```

## 🗂️ Conversation Management (Priority: MEDIUM)

### Required Endpoints:

#### Update Conversation:
```python
PUT /api/history/conversations/{id}
```

#### Request Format:
```json
{
  "title": "New Title",
  "is_archived": true
}
```

#### Delete Conversation:
```python
DELETE /api/history/conversations/{id}
```

## 👤 User Profile Management (Priority: LOW)

### Update Profile:
```python
PUT /api/auth/profile
```

#### Request Format:
```json
{
  "name": "New Name",
  "email": "new@email.com"
}
```

### Change Password:
```python
PUT /api/auth/password
```

#### Request Format:
```json
{
  "current_password": "old_password",
  "new_password": "new_password"
}
```

### Delete Account:
```python
DELETE /api/auth/account
```

## 🔧 Implementation Priority:

### **Phase 1 (Essential for MVP):**
1. ✅ Basic chat functionality (Already done)
2. ✅ Authentication (Already done)
3. ✅ Conversation list (Already done)

### **Phase 2 (Advanced Features):**
1. 🔍 Search functionality
2. 📊 Export features
3. 🗂️ Conversation management (rename, delete, archive)

### **Phase 3 (Nice to Have):**
1. 📈 Statistics dashboard
2. 👤 Profile management
3. 🔐 Password change

## 🚀 Current Integration Status:

### **✅ Can Work Now:**
- User signup/signin
- Basic chat messaging
- Conversation creation
- Message history

### **⚠️ Will Show Errors:**
- Search functionality
- Export buttons
- Statistics page
- Profile editing
- Conversation rename/delete

### **💡 Temporary Solution:**
Frontend has graceful error handling, so missing features will:
- Show "Feature not available" messages
- Disable buttons for missing endpoints
- Log errors in development mode

## 🎯 Recommendation:

**Start with Phase 1 features working, then gradually add Phase 2 and 3.**

Frontend is designed to work progressively - basic features work now, advanced features can be added later without breaking existing functionality.