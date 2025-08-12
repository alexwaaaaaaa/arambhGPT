# 🗣️ Communication System Backend Documentation

## Overview
Complete real-time communication system backend for patient-professional consultations with WebSocket support, message storage, and session management.

## 🏗️ Architecture

### Core Components

1. **WebSocket Manager** - Real-time message broadcasting
2. **Session Management** - Chat session lifecycle
3. **Message Storage** - Persistent message history
4. **Authentication Integration** - Secure access control
5. **REST API Fallback** - HTTP endpoints for reliability

## 📊 Database Schema

### Tables Created

```sql
-- Chat sessions
CREATE TABLE chat_sessions (
    id TEXT PRIMARY KEY,
    patient_id TEXT NOT NULL,
    professional_id TEXT NOT NULL,
    session_type TEXT NOT NULL,
    status TEXT DEFAULT 'active',
    start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP,
    total_cost REAL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chat messages
CREATE TABLE chat_messages (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL,
    sender_id TEXT NOT NULL,
    sender_type TEXT NOT NULL,
    message TEXT NOT NULL,
    message_type TEXT DEFAULT 'text',
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN DEFAULT FALSE
);

-- Session participants
CREATE TABLE session_participants (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    user_type TEXT NOT NULL,
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    left_at TIMESTAMP
);
```

## 🔌 WebSocket API

### Connection Endpoint
```
ws://localhost:8000/api/communication/ws/{session_id}/{user_id}
```

### Message Format
```json
{
    "sender_type": "patient|professional",
    "message": "Message content",
    "message_type": "text|image|file|voice"
}
```

### Broadcast Format
```json
{
    "id": "message_id",
    "session_id": "session_id",
    "sender_id": "user_id",
    "sender_type": "patient|professional",
    "message": "Message content",
    "message_type": "text",
    "timestamp": "2024-01-01T12:00:00"
}
```

## 🛠️ REST API Endpoints

### Session Management

#### Create Session
```http
POST /api/communication/sessions/create
Authorization: Bearer {token}
Content-Type: application/json

{
    "professional_id": "prof_123",
    "session_type": "chat|voice|video"
}
```

#### Get User Sessions
```http
GET /api/communication/sessions
Authorization: Bearer {token}
```

#### End Session
```http
PUT /api/communication/sessions/{session_id}/end
Authorization: Bearer {token}
```

### Message Management

#### Send Message (REST Fallback)
```http
POST /api/communication/sessions/{session_id}/messages
Authorization: Bearer {token}
Content-Type: application/json

{
    "session_id": "session_123",
    "sender_id": "user_456",
    "sender_type": "patient",
    "message": "Hello doctor",
    "message_type": "text"
}
```

#### Get Messages
```http
GET /api/communication/sessions/{session_id}/messages?limit=50&offset=0
Authorization: Bearer {token}
```

### Real-time Features

#### Typing Indicator
```http
POST /api/communication/sessions/{session_id}/typing
Authorization: Bearer {token}
Content-Type: application/json

{
    "is_typing": true
}
```

## 🔐 Security Features

1. **JWT Authentication** - All endpoints require valid tokens
2. **Session Validation** - Users can only access their own sessions
3. **Participant Verification** - Only session participants can send/receive messages
4. **CORS Protection** - Configured for frontend domains

## 🚀 Usage Examples

### Frontend Integration

```javascript
// WebSocket connection
const ws = new WebSocket(`ws://localhost:8000/api/communication/ws/${sessionId}/${userId}`);

ws.onopen = () => {
    console.log('Connected to chat');
};

ws.onmessage = (event) => {
    const message = JSON.parse(event.data);
    displayMessage(message);
};

// Send message
const sendMessage = (text) => {
    const message = {
        sender_type: 'patient',
        message: text,
        message_type: 'text'
    };
    ws.send(JSON.stringify(message));
};
```

### REST API Usage

```javascript
// Create session
const createSession = async (professionalId) => {
    const response = await fetch('/api/communication/sessions/create', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            professional_id: professionalId,
            session_type: 'chat'
        })
    });
    return response.json();
};

// Get messages
const getMessages = async (sessionId) => {
    const response = await fetch(`/api/communication/sessions/${sessionId}/messages`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    return response.json();
};
```

## 🧪 Testing

### Run Backend Tests
```bash
# Test REST API endpoints
./test-communication-backend.sh

# Test WebSocket connection
python3 test-websocket-client.py
```

### Test Scenarios

1. **Session Creation** ✅
2. **Message Sending** ✅
3. **Message Retrieval** ✅
4. **Session Listing** ✅
5. **Session Termination** ✅
6. **WebSocket Connection** ✅
7. **Real-time Broadcasting** ✅
8. **Authentication** ✅

## 🔄 Integration with Existing Systems

### Wallet Integration
- Sessions automatically create billing records
- Cost calculation based on session duration
- Transaction history includes consultation details

### Professional System
- Integrates with existing professional profiles
- Uses professional availability status
- Supports multiple session types (chat/voice/video)

### Notification System
- Real-time message notifications
- Session start/end notifications
- Typing indicators

## 📈 Performance Considerations

1. **Connection Pooling** - Efficient WebSocket management
2. **Message Batching** - Optimized database writes
3. **Session Cleanup** - Automatic cleanup of inactive sessions
4. **Rate Limiting** - Prevents message spam

## 🔧 Configuration

### Environment Variables
```env
# WebSocket settings
WS_MAX_CONNECTIONS=1000
WS_PING_INTERVAL=30
WS_PING_TIMEOUT=10

# Message settings
MAX_MESSAGE_LENGTH=5000
MESSAGE_RETENTION_DAYS=90
```

## 🚀 Deployment Notes

1. **WebSocket Support** - Ensure server supports WebSocket upgrades
2. **Load Balancing** - Use sticky sessions for WebSocket connections
3. **Database Indexing** - Index session_id and timestamp columns
4. **Monitoring** - Monitor WebSocket connection counts and message throughput

## 🔮 Future Enhancements

1. **File Upload** - Support for images, documents, voice notes
2. **Message Encryption** - End-to-end encryption for sensitive conversations
3. **Video Calling** - WebRTC integration for video consultations
4. **Message Reactions** - Emoji reactions and message status
5. **Group Sessions** - Support for group therapy sessions
6. **AI Moderation** - Automatic content moderation and safety checks

## 📞 Support

For issues or questions about the communication system:
1. Check the test scripts for debugging
2. Review WebSocket connection logs
3. Verify authentication tokens
4. Check database connectivity

---

**Status**: ✅ **Production Ready**
**Last Updated**: December 2024
**Version**: 1.0.0