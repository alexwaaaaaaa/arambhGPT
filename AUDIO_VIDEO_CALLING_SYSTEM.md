# Audio/Video Calling System - ArambhGPT

## 🎥 Overview

Complete WebRTC-based audio and video calling system for patient-professional consultations with real-time communication, signaling server, and comprehensive call management.

## 🏗️ Architecture

### Backend Components

1. **WebRTC Signaling Server** (`webrtc_signaling.py`)
   - WebSocket-based signaling for call setup
   - ICE candidate exchange
   - SDP offer/answer exchange
   - Call state management

2. **Communication System** (`communication.py`)
   - Text chat during calls
   - Message storage and retrieval
   - Session management

3. **Database Schema**
   ```sql
   -- Call logs table
   CREATE TABLE call_logs (
       id TEXT PRIMARY KEY,
       caller_id TEXT NOT NULL,
       callee_id TEXT NOT NULL,
       call_type TEXT NOT NULL,  -- 'audio' or 'video'
       status TEXT NOT NULL,     -- 'calling', 'connected', 'ended', 'rejected'
       start_time TIMESTAMP NOT NULL,
       end_time TIMESTAMP,
       duration_seconds INTEGER DEFAULT 0
   );
   
   -- Chat sessions table
   CREATE TABLE chat_sessions (
       id TEXT PRIMARY KEY,
       patient_id TEXT NOT NULL,
       professional_id TEXT NOT NULL,
       session_type TEXT NOT NULL,
       status TEXT DEFAULT 'active',
       start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   
   -- Chat messages table
   CREATE TABLE chat_messages (
       id TEXT PRIMARY KEY,
       session_id TEXT NOT NULL,
       sender_id TEXT NOT NULL,
       sender_type TEXT NOT NULL,  -- 'patient' or 'professional'
       message TEXT NOT NULL,
       message_type TEXT DEFAULT 'text',
       timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

### Frontend Components

1. **CallInterface Component** (`CallInterface.tsx`)
   - Complete call UI with video/audio controls
   - Incoming call handling
   - Call status display

2. **useWebRTCCall Hook** (`useWebRTCCall.ts`)
   - WebRTC connection management
   - Media stream handling
   - Signaling message handling

3. **VideoCallInterface Component** (`VideoCallInterface.tsx`)
   - Enhanced video call interface
   - Screen sharing support
   - Recording capabilities

## 🚀 Features

### Core Calling Features
- ✅ Audio-only calls
- ✅ Video calls with camera
- ✅ Screen sharing
- ✅ Mute/unmute audio
- ✅ Enable/disable video
- ✅ Call duration tracking
- ✅ Connection quality indicators

### Call Management
- ✅ Incoming call notifications
- ✅ Call accept/reject
- ✅ Call history logging
- ✅ Active call status
- ✅ Call end handling

### Real-time Features
- ✅ WebSocket signaling
- ✅ ICE candidate exchange
- ✅ SDP offer/answer exchange
- ✅ Connection state monitoring
- ✅ Typing indicators (for chat)

### Integration Features
- ✅ Authentication integration
- ✅ Professional booking system
- ✅ Wallet/payment integration
- ✅ Chat during calls
- ✅ Call recording (UI ready)

## 📡 API Endpoints

### WebRTC Signaling
```
WebSocket: /api/webrtc/webrtc/{user_id}
```

### REST API Endpoints
```
POST   /api/webrtc/call/initiate          # Start a call
POST   /api/webrtc/call/{call_id}/respond # Accept/reject call
POST   /api/webrtc/call/{call_id}/end     # End call
GET    /api/webrtc/call/active            # Get active call
GET    /api/webrtc/call/history           # Get call history
```

### Communication Endpoints
```
WebSocket: /api/communication/ws/{session_id}/{user_id}

POST   /api/communication/sessions/create                    # Create chat session
GET    /api/communication/sessions/{session_id}/messages     # Get messages
POST   /api/communication/sessions/{session_id}/messages     # Send message
GET    /api/communication/sessions                           # Get user sessions
PUT    /api/communication/sessions/{session_id}/end          # End session
```

## 🔧 Technical Implementation

### WebRTC Flow

1. **Call Initiation**
   ```javascript
   // Caller initiates call
   websocket.send({
     type: 'call_request',
     callee_id: 'user_123',
     call_type: 'video'
   });
   ```

2. **Call Response**
   ```javascript
   // Callee responds
   websocket.send({
     type: 'call_response',
     call_id: 'call_456',
     action: 'accept'  // or 'reject'
   });
   ```

3. **WebRTC Negotiation**
   ```javascript
   // Offer/Answer exchange
   websocket.send({
     type: 'offer',
     call_id: 'call_456',
     offer: sdpOffer
   });
   
   websocket.send({
     type: 'answer',
     call_id: 'call_456',
     answer: sdpAnswer
   });
   ```

4. **ICE Candidates**
   ```javascript
   // ICE candidate exchange
   websocket.send({
     type: 'ice_candidate',
     call_id: 'call_456',
     candidate: iceCandidate
   });
   ```

### Media Stream Handling

```javascript
// Get user media
const stream = await navigator.mediaDevices.getUserMedia({
  video: callType === 'video',
  audio: true
});

// Add to peer connection
stream.getTracks().forEach(track => {
  peerConnection.addTrack(track, stream);
});

// Handle remote stream
peerConnection.ontrack = (event) => {
  remoteVideo.srcObject = event.streams[0];
};
```

### Connection Management

```javascript
// Peer connection configuration
const peerConnection = new RTCPeerConnection({
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' }
  ]
});

// Handle connection state
peerConnection.onconnectionstatechange = () => {
  console.log('Connection state:', peerConnection.connectionState);
  if (peerConnection.connectionState === 'connected') {
    setCallActive(true);
  }
};
```

## 🧪 Testing

### Run Backend Tests
```bash
# Test communication system
./test-communication-backend.sh

# Test audio/video calling
./test-audio-video-calling.sh

# Test WebSocket client
python3 test-websocket-client.py
```

### Manual Testing Steps

1. **Start Backend Server**
   ```bash
   cd arambhgpt-backend
   python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

2. **Start Frontend**
   ```bash
   cd arambhgpt-frontend
   npm run dev
   ```

3. **Test Call Flow**
   - Open two browser tabs
   - Login as different users
   - Initiate call from one tab
   - Accept call from other tab
   - Test audio/video controls

## 🔒 Security Features

- ✅ JWT token authentication
- ✅ User session validation
- ✅ WebSocket connection security
- ✅ Media stream permissions
- ✅ Call participant verification

## 📱 Mobile Support

- ✅ Responsive design
- ✅ Touch-friendly controls
- ✅ Mobile camera/microphone access
- ✅ Portrait/landscape orientation
- ✅ Mobile WebRTC support

## 🌐 Browser Compatibility

- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari (iOS/macOS)
- ✅ Edge
- ⚠️ Requires HTTPS for production

## 🚀 Deployment Considerations

### Production Requirements

1. **HTTPS Required**
   - WebRTC requires secure context
   - Camera/microphone permissions need HTTPS

2. **TURN Server**
   ```javascript
   // Add TURN server for NAT traversal
   const peerConnection = new RTCPeerConnection({
     iceServers: [
       { urls: 'stun:stun.l.google.com:19302' },
       {
         urls: 'turn:your-turn-server.com:3478',
         username: 'username',
         credential: 'password'
       }
     ]
   });
   ```

3. **WebSocket Scaling**
   - Use Redis for WebSocket session storage
   - Load balancer with sticky sessions
   - Horizontal scaling support

### Environment Variables
```bash
# Backend
TURN_SERVER_URL=turn:your-turn-server.com:3478
TURN_USERNAME=your-username
TURN_PASSWORD=your-password
WEBSOCKET_REDIS_URL=redis://localhost:6379

# Frontend
NEXT_PUBLIC_WS_URL=wss://your-domain.com/api/webrtc
NEXT_PUBLIC_API_URL=https://your-domain.com/api
```

## 📊 Performance Metrics

### Call Quality Indicators
- Connection state monitoring
- ICE connection state
- Media stream statistics
- Bandwidth usage tracking
- Latency measurements

### Monitoring
```javascript
// Get connection stats
const stats = await peerConnection.getStats();
stats.forEach(report => {
  if (report.type === 'inbound-rtp') {
    console.log('Bytes received:', report.bytesReceived);
    console.log('Packets lost:', report.packetsLost);
  }
});
```

## 🔄 Future Enhancements

### Planned Features
- [ ] Group video calls (multiple participants)
- [ ] Call recording and playback
- [ ] Virtual backgrounds
- [ ] Noise cancellation
- [ ] Call analytics dashboard
- [ ] Integration with calendar systems
- [ ] Automated call transcription
- [ ] Call quality feedback system

### Technical Improvements
- [ ] WebRTC statistics collection
- [ ] Adaptive bitrate streaming
- [ ] Network quality adaptation
- [ ] Fallback to audio on poor connection
- [ ] Call reconnection handling
- [ ] Advanced error handling

## 📞 Usage Examples

### Basic Video Call
```typescript
import { CallInterface } from '@/components/communication/CallInterface';

function ConsultationPage() {
  return (
    <CallInterface
      otherUserId="professional_123"
      otherUserName="Dr. Priya Sharma"
      callType="video"
      isInitiator={true}
      onCallEnd={() => router.push('/dashboard')}
    />
  );
}
```

### Audio-Only Call
```typescript
<CallInterface
  otherUserId="professional_123"
  otherUserName="Dr. Priya Sharma"
  callType="audio"
  isInitiator={false}
  onCallEnd={() => setShowCall(false)}
/>
```

### Using WebRTC Hook
```typescript
import { useWebRTCCall } from '@/hooks/useWebRTCCall';

function MyComponent() {
  const {
    currentCall,
    startCall,
    endCall,
    toggleAudio,
    toggleVideo
  } = useWebRTCCall({
    onIncomingCall: (call) => setIncomingCall(call),
    onCallEnded: () => setCallActive(false)
  });

  const handleStartCall = () => {
    startCall('user_123', 'video');
  };

  return (
    <div>
      {currentCall ? (
        <div>Call active with {currentCall.otherUserId}</div>
      ) : (
        <button onClick={handleStartCall}>Start Call</button>
      )}
    </div>
  );
}
```

## 🆘 Troubleshooting

### Common Issues

1. **Camera/Microphone Not Working**
   - Check browser permissions
   - Ensure HTTPS in production
   - Verify device availability

2. **Connection Failed**
   - Check STUN/TURN server configuration
   - Verify network connectivity
   - Check firewall settings

3. **WebSocket Connection Issues**
   - Verify backend server running
   - Check WebSocket endpoint URL
   - Ensure authentication token valid

4. **No Audio/Video**
   - Check media stream constraints
   - Verify peer connection state
   - Check ICE connection state

### Debug Commands
```bash
# Check WebSocket connection
wscat -c ws://localhost:8000/api/webrtc/webrtc/test_user

# Test STUN server
curl -I https://stun.l.google.com:19302

# Check backend logs
tail -f backend.log

# Test API endpoints
curl -X GET http://localhost:8000/api/webrtc/call/active \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📝 Summary

The ArambhGPT Audio/Video Calling System provides a complete WebRTC-based solution for real-time communication between patients and healthcare professionals. With comprehensive call management, real-time messaging, and robust error handling, it offers a professional-grade telemedicine calling experience.

**Key Benefits:**
- 🎥 High-quality video calls
- 🎤 Crystal-clear audio
- 💬 Integrated chat system
- 📱 Mobile-responsive design
- 🔒 Secure and authenticated
- 📊 Call analytics and history
- 🚀 Production-ready architecture