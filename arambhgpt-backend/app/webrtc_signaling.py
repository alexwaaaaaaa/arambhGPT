from fastapi import APIRouter, WebSocket, WebSocketDisconnect, HTTPException, Depends
from typing import Dict, List, Optional
import json
import uuid
from datetime import datetime
from .database import get_db_connection
from .auth import verify_token, get_user_by_email
from pydantic import BaseModel

router = APIRouter()

# WebRTC Signaling Server
class WebRTCSignalingManager:
    def __init__(self):
        self.connections: Dict[str, WebSocket] = {}  # user_id -> websocket
        self.call_sessions: Dict[str, Dict] = {}     # call_id -> session_info
        self.user_sessions: Dict[str, str] = {}      # user_id -> call_id
    
    async def connect(self, websocket: WebSocket, user_id: str):
        await websocket.accept()
        self.connections[user_id] = websocket
        print(f"User {user_id} connected to WebRTC signaling")
    
    def disconnect(self, user_id: str):
        if user_id in self.connections:
            del self.connections[user_id]
        
        # End any active calls
        if user_id in self.user_sessions:
            call_id = self.user_sessions[user_id]
            if call_id in self.call_sessions:
                self.call_sessions[call_id]['status'] = 'ended'
            del self.user_sessions[user_id]
        
        print(f"User {user_id} disconnected from WebRTC signaling")
    
    async def send_to_user(self, user_id: str, message: dict):
        if user_id in self.connections:
            await self.connections[user_id].send_text(json.dumps(message))
    
    def create_call_session(self, caller_id: str, callee_id: str, call_type: str):
        call_id = str(uuid.uuid4())
        self.call_sessions[call_id] = {
            'call_id': call_id,
            'caller_id': caller_id,
            'callee_id': callee_id,
            'call_type': call_type,  # 'audio' or 'video'
            'status': 'calling',
            'start_time': datetime.now().isoformat(),
            'end_time': None
        }
        
        self.user_sessions[caller_id] = call_id
        self.user_sessions[callee_id] = call_id
        
        return call_id
    
    def end_call_session(self, call_id: str):
        if call_id in self.call_sessions:
            session = self.call_sessions[call_id]
            session['status'] = 'ended'
            session['end_time'] = datetime.now().isoformat()
            
            # Remove user sessions
            if session['caller_id'] in self.user_sessions:
                del self.user_sessions[session['caller_id']]
            if session['callee_id'] in self.user_sessions:
                del self.user_sessions[session['callee_id']]

signaling_manager = WebRTCSignalingManager()

# Pydantic models
class CallRequest(BaseModel):
    callee_id: str
    call_type: str  # 'audio' or 'video'

class CallResponse(BaseModel):
    call_id: str
    action: str  # 'accept' or 'reject'

class ICECandidate(BaseModel):
    candidate: str
    sdpMLineIndex: int
    sdpMid: str

class SessionDescription(BaseModel):
    type: str  # 'offer' or 'answer'
    sdp: str

# Database setup for call logs
def init_webrtc_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS call_logs (
            id TEXT PRIMARY KEY,
            caller_id TEXT NOT NULL,
            callee_id TEXT NOT NULL,
            call_type TEXT NOT NULL,
            status TEXT NOT NULL,
            start_time TIMESTAMP NOT NULL,
            end_time TIMESTAMP,
            duration_seconds INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    conn.commit()
    conn.close()

init_webrtc_db()

# WebSocket endpoint for WebRTC signaling
@router.websocket("/webrtc/{user_id}")
async def webrtc_signaling(websocket: WebSocket, user_id: str):
    await signaling_manager.connect(websocket, user_id)
    
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            message_type = message.get('type')
            
            if message_type == 'call_request':
                # Initiate a call
                callee_id = message.get('callee_id')
                call_type = message.get('call_type', 'audio')
                
                call_id = signaling_manager.create_call_session(user_id, callee_id, call_type)
                
                # Send call request to callee
                await signaling_manager.send_to_user(callee_id, {
                    'type': 'incoming_call',
                    'call_id': call_id,
                    'caller_id': user_id,
                    'call_type': call_type
                })
                
                # Confirm to caller
                await signaling_manager.send_to_user(user_id, {
                    'type': 'call_initiated',
                    'call_id': call_id,
                    'status': 'calling'
                })
            
            elif message_type == 'call_response':
                # Accept or reject call
                call_id = message.get('call_id')
                action = message.get('action')  # 'accept' or 'reject'
                
                if call_id in signaling_manager.call_sessions:
                    session = signaling_manager.call_sessions[call_id]
                    caller_id = session['caller_id']
                    
                    if action == 'accept':
                        session['status'] = 'connected'
                        await signaling_manager.send_to_user(caller_id, {
                            'type': 'call_accepted',
                            'call_id': call_id
                        })
                    else:
                        session['status'] = 'rejected'
                        signaling_manager.end_call_session(call_id)
                        await signaling_manager.send_to_user(caller_id, {
                            'type': 'call_rejected',
                            'call_id': call_id
                        })
            
            elif message_type == 'offer':
                # WebRTC offer
                call_id = message.get('call_id')
                offer = message.get('offer')
                
                if call_id in signaling_manager.call_sessions:
                    session = signaling_manager.call_sessions[call_id]
                    target_user = session['callee_id'] if user_id == session['caller_id'] else session['caller_id']
                    
                    await signaling_manager.send_to_user(target_user, {
                        'type': 'offer',
                        'call_id': call_id,
                        'offer': offer
                    })
            
            elif message_type == 'answer':
                # WebRTC answer
                call_id = message.get('call_id')
                answer = message.get('answer')
                
                if call_id in signaling_manager.call_sessions:
                    session = signaling_manager.call_sessions[call_id]
                    target_user = session['caller_id'] if user_id == session['callee_id'] else session['callee_id']
                    
                    await signaling_manager.send_to_user(target_user, {
                        'type': 'answer',
                        'call_id': call_id,
                        'answer': answer
                    })
            
            elif message_type == 'ice_candidate':
                # ICE candidate exchange
                call_id = message.get('call_id')
                candidate = message.get('candidate')
                
                if call_id in signaling_manager.call_sessions:
                    session = signaling_manager.call_sessions[call_id]
                    target_user = session['callee_id'] if user_id == session['caller_id'] else session['caller_id']
                    
                    await signaling_manager.send_to_user(target_user, {
                        'type': 'ice_candidate',
                        'call_id': call_id,
                        'candidate': candidate
                    })
            
            elif message_type == 'end_call':
                # End call
                call_id = message.get('call_id')
                
                if call_id in signaling_manager.call_sessions:
                    session = signaling_manager.call_sessions[call_id]
                    target_user = session['callee_id'] if user_id == session['caller_id'] else session['caller_id']
                    
                    # Notify other user
                    await signaling_manager.send_to_user(target_user, {
                        'type': 'call_ended',
                        'call_id': call_id
                    })
                    
                    # Save call log
                    await save_call_log(call_id, session)
                    
                    # End session
                    signaling_manager.end_call_session(call_id)
    
    except WebSocketDisconnect:
        signaling_manager.disconnect(user_id)

# REST API endpoints
@router.post("/call/initiate")
async def initiate_call(
    call_request: CallRequest,
    email: str = Depends(verify_token)
):
    """Initiate a call (REST fallback)"""
    try:
        user = get_user_by_email(email)
        caller_id = str(user['id'])
        
        call_id = signaling_manager.create_call_session(
            caller_id, 
            call_request.callee_id, 
            call_request.call_type
        )
        
        # Try to notify callee via WebSocket
        await signaling_manager.send_to_user(call_request.callee_id, {
            'type': 'incoming_call',
            'call_id': call_id,
            'caller_id': caller_id,
            'call_type': call_request.call_type
        })
        
        return {
            'call_id': call_id,
            'status': 'calling',
            'caller_id': caller_id,
            'callee_id': call_request.callee_id,
            'call_type': call_request.call_type
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to initiate call: {str(e)}")

@router.post("/call/{call_id}/respond")
async def respond_to_call(
    call_id: str,
    response: CallResponse,
    email: str = Depends(verify_token)
):
    """Respond to a call (accept/reject)"""
    try:
        user = get_user_by_email(email)
        user_id = str(user['id'])
        
        if call_id not in signaling_manager.call_sessions:
            raise HTTPException(status_code=404, detail="Call not found")
        
        session = signaling_manager.call_sessions[call_id]
        
        if user_id != session['callee_id']:
            raise HTTPException(status_code=403, detail="Not authorized to respond to this call")
        
        if response.action == 'accept':
            session['status'] = 'connected'
            await signaling_manager.send_to_user(session['caller_id'], {
                'type': 'call_accepted',
                'call_id': call_id
            })
        else:
            session['status'] = 'rejected'
            await signaling_manager.send_to_user(session['caller_id'], {
                'type': 'call_rejected',
                'call_id': call_id
            })
            signaling_manager.end_call_session(call_id)
        
        return {
            'call_id': call_id,
            'status': session['status'],
            'action': response.action
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to respond to call: {str(e)}")

@router.post("/call/{call_id}/end")
async def end_call(
    call_id: str,
    email: str = Depends(verify_token)
):
    """End a call"""
    try:
        user = get_user_by_email(email)
        user_id = str(user['id'])
        
        if call_id not in signaling_manager.call_sessions:
            raise HTTPException(status_code=404, detail="Call not found")
        
        session = signaling_manager.call_sessions[call_id]
        
        if user_id not in [session['caller_id'], session['callee_id']]:
            raise HTTPException(status_code=403, detail="Not authorized to end this call")
        
        # Notify other user
        target_user = session['callee_id'] if user_id == session['caller_id'] else session['caller_id']
        await signaling_manager.send_to_user(target_user, {
            'type': 'call_ended',
            'call_id': call_id
        })
        
        # Save call log
        await save_call_log(call_id, session)
        
        # End session
        signaling_manager.end_call_session(call_id)
        
        return {
            'call_id': call_id,
            'status': 'ended'
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to end call: {str(e)}")

@router.get("/call/history")
async def get_call_history(
    limit: int = 20,
    offset: int = 0,
    email: str = Depends(verify_token)
):
    """Get user's call history"""
    try:
        user = get_user_by_email(email)
        user_id = str(user['id'])
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT * FROM call_logs 
            WHERE caller_id = ? OR callee_id = ?
            ORDER BY start_time DESC
            LIMIT ? OFFSET ?
        ''', (user_id, user_id, limit, offset))
        
        calls = cursor.fetchall()
        conn.close()
        
        return {
            'calls': [
                {
                    'call_id': call['id'],
                    'caller_id': call['caller_id'],
                    'callee_id': call['callee_id'],
                    'call_type': call['call_type'],
                    'status': call['status'],
                    'start_time': call['start_time'],
                    'end_time': call['end_time'],
                    'duration_seconds': call['duration_seconds']
                }
                for call in calls
            ],
            'total_count': len(calls)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get call history: {str(e)}")

async def save_call_log(call_id: str, session: dict):
    """Save call log to database"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        start_time = datetime.fromisoformat(session['start_time'])
        end_time = datetime.now()
        duration = int((end_time - start_time).total_seconds())
        
        cursor.execute('''
            INSERT INTO call_logs 
            (id, caller_id, callee_id, call_type, status, start_time, end_time, duration_seconds)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            call_id,
            session['caller_id'],
            session['callee_id'],
            session['call_type'],
            session['status'],
            session['start_time'],
            end_time.isoformat(),
            duration
        ))
        
        conn.commit()
        conn.close()
        
    except Exception as e:
        print(f"Error saving call log: {e}")

@router.get("/call/active")
async def get_active_call(
    email: str = Depends(verify_token)
):
    """Get user's active call if any"""
    try:
        user = get_user_by_email(email)
        user_id = str(user['id'])
        
        if user_id in signaling_manager.user_sessions:
            call_id = signaling_manager.user_sessions[user_id]
            session = signaling_manager.call_sessions.get(call_id)
            
            if session and session['status'] in ['calling', 'connected']:
                return {
                    'has_active_call': True,
                    'call_id': call_id,
                    'call_type': session['call_type'],
                    'status': session['status'],
                    'other_user_id': session['callee_id'] if user_id == session['caller_id'] else session['caller_id']
                }
        
        return {'has_active_call': False}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get active call: {str(e)}")