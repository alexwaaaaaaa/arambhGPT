from fastapi import APIRouter, HTTPException, Depends, WebSocket, WebSocketDisconnect
from typing import List, Optional, Dict
from datetime import datetime
import json
import uuid
from .database import get_db_connection
from .auth import verify_token, get_user_by_email
from .models import User
from pydantic import BaseModel

router = APIRouter()

# WebSocket connection manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}
        self.session_connections: Dict[str, List[str]] = {}  # session_id -> [user_ids]
    
    async def connect(self, websocket: WebSocket, user_id: str, session_id: str):
        await websocket.accept()
        self.active_connections[user_id] = websocket
        
        if session_id not in self.session_connections:
            self.session_connections[session_id] = []
        if user_id not in self.session_connections[session_id]:
            self.session_connections[session_id].append(user_id)
    
    def disconnect(self, user_id: str, session_id: str):
        if user_id in self.active_connections:
            del self.active_connections[user_id]
        
        if session_id in self.session_connections:
            if user_id in self.session_connections[session_id]:
                self.session_connections[session_id].remove(user_id)
            if not self.session_connections[session_id]:
                del self.session_connections[session_id]
    
    async def send_personal_message(self, message: str, user_id: str):
        if user_id in self.active_connections:
            await self.active_connections[user_id].send_text(message)
    
    async def broadcast_to_session(self, message: str, session_id: str, exclude_user: str = None):
        if session_id in self.session_connections:
            for user_id in self.session_connections[session_id]:
                if user_id != exclude_user and user_id in self.active_connections:
                    await self.active_connections[user_id].send_text(message)

manager = ConnectionManager()

# Pydantic models
class ChatMessage(BaseModel):
    session_id: str
    sender_id: str
    sender_type: str  # 'patient' or 'professional'
    message: str
    message_type: str = 'text'  # 'text', 'image', 'file', 'voice'
    timestamp: Optional[str] = None

class SessionParticipant(BaseModel):
    user_id: str
    user_type: str  # 'patient' or 'professional'
    name: str
    avatar: Optional[str] = None

# Database setup
def init_communication_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Chat sessions table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS chat_sessions (
            id TEXT PRIMARY KEY,
            patient_id TEXT NOT NULL,
            professional_id TEXT NOT NULL,
            session_type TEXT NOT NULL,
            status TEXT DEFAULT 'active',
            start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            end_time TIMESTAMP,
            total_cost REAL DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Chat messages table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS chat_messages (
            id TEXT PRIMARY KEY,
            session_id TEXT NOT NULL,
            sender_id TEXT NOT NULL,
            sender_type TEXT NOT NULL,
            message TEXT NOT NULL,
            message_type TEXT DEFAULT 'text',
            timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            is_read BOOLEAN DEFAULT FALSE,
            FOREIGN KEY (session_id) REFERENCES chat_sessions (id)
        )
    ''')
    
    # Session participants table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS session_participants (
            id TEXT PRIMARY KEY,
            session_id TEXT NOT NULL,
            user_id TEXT NOT NULL,
            user_type TEXT NOT NULL,
            joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            left_at TIMESTAMP,
            FOREIGN KEY (session_id) REFERENCES chat_sessions (id)
        )
    ''')
    
    conn.commit()
    conn.close()

# Initialize database on import
init_communication_db()

# WebSocket endpoint
@router.websocket("/ws/{session_id}/{user_id}")
async def websocket_endpoint(websocket: WebSocket, session_id: str, user_id: str):
    await manager.connect(websocket, user_id, session_id)
    try:
        while True:
            data = await websocket.receive_text()
            message_data = json.loads(data)
            
            # Save message to database
            message_id = str(uuid.uuid4())
            conn = get_db_connection()
            cursor = conn.cursor()
            
            cursor.execute('''
                INSERT INTO chat_messages 
                (id, session_id, sender_id, sender_type, message, message_type)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', (
                message_id,
                session_id,
                user_id,
                message_data.get('sender_type', 'patient'),
                message_data.get('message', ''),
                message_data.get('message_type', 'text')
            ))
            
            conn.commit()
            conn.close()
            
            # Broadcast message to other participants
            broadcast_data = {
                "id": message_id,
                "session_id": session_id,
                "sender_id": user_id,
                "sender_type": message_data.get('sender_type', 'patient'),
                "message": message_data.get('message', ''),
                "message_type": message_data.get('message_type', 'text'),
                "timestamp": datetime.now().isoformat()
            }
            
            await manager.broadcast_to_session(
                json.dumps(broadcast_data), 
                session_id, 
                exclude_user=user_id
            )
            
    except WebSocketDisconnect:
        manager.disconnect(user_id, session_id)

# REST API endpoints
@router.post("/sessions/create")
async def create_chat_session(
    professional_id: str,
    session_type: str,
    email: str = Depends(verify_token)
):
    """Create a new chat session between patient and professional"""
    try:
        user = get_user_by_email(email)
        patient_id = str(user['id'])
        session_id = str(uuid.uuid4())
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Create session
        cursor.execute('''
            INSERT INTO chat_sessions 
            (id, patient_id, professional_id, session_type)
            VALUES (?, ?, ?, ?)
        ''', (session_id, patient_id, professional_id, session_type))
        
        # Add participants
        cursor.execute('''
            INSERT INTO session_participants 
            (id, session_id, user_id, user_type)
            VALUES (?, ?, ?, ?)
        ''', (str(uuid.uuid4()), session_id, patient_id, 'patient'))
        
        cursor.execute('''
            INSERT INTO session_participants 
            (id, session_id, user_id, user_type)
            VALUES (?, ?, ?, ?)
        ''', (str(uuid.uuid4()), session_id, professional_id, 'professional'))
        
        conn.commit()
        conn.close()
        
        return {
            "session_id": session_id,
            "status": "created",
            "participants": [
                {"user_id": patient_id, "user_type": "patient"},
                {"user_id": professional_id, "user_type": "professional"}
            ]
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create session: {str(e)}")

@router.get("/sessions/{session_id}/messages")
async def get_session_messages(
    session_id: str,
    limit: int = 50,
    offset: int = 0,
    email: str = Depends(verify_token)
):
    """Get messages for a specific session"""
    try:
        user = get_user_by_email(email)
        user_id = str(user['id'])
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Verify user is participant in session
        cursor.execute('''
            SELECT COUNT(*) FROM session_participants 
            WHERE session_id = ? AND user_id = ?
        ''', (session_id, user_id))
        
        if cursor.fetchone()[0] == 0:
            raise HTTPException(status_code=403, detail="Access denied to this session")
        
        # Get messages
        cursor.execute('''
            SELECT * FROM chat_messages 
            WHERE session_id = ? 
            ORDER BY timestamp DESC 
            LIMIT ? OFFSET ?
        ''', (session_id, limit, offset))
        
        messages = cursor.fetchall()
        conn.close()
        
        return {
            "session_id": session_id,
            "messages": [
                {
                    "id": msg['id'],
                    "sender_id": msg['sender_id'],
                    "sender_type": msg['sender_type'],
                    "message": msg['message'],
                    "message_type": msg['message_type'],
                    "timestamp": msg['timestamp'],
                    "is_read": bool(msg['is_read'])
                }
                for msg in messages
            ],
            "total_count": len(messages)
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get messages: {str(e)}")

@router.post("/sessions/{session_id}/messages")
async def send_message(
    session_id: str,
    message_data: ChatMessage,
    email: str = Depends(verify_token)
):
    """Send a message in a session (REST fallback)"""
    try:
        user = get_user_by_email(email)
        user_id = str(user['id'])
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Verify user is participant
        cursor.execute('''
            SELECT COUNT(*) FROM session_participants 
            WHERE session_id = ? AND user_id = ?
        ''', (session_id, user_id))
        
        if cursor.fetchone()[0] == 0:
            raise HTTPException(status_code=403, detail="Access denied to this session")
        
        # Save message
        message_id = str(uuid.uuid4())
        cursor.execute('''
            INSERT INTO chat_messages 
            (id, session_id, sender_id, sender_type, message, message_type)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (
            message_id,
            session_id,
            user_id,
            message_data.sender_type,
            message_data.message,
            message_data.message_type
        ))
        
        conn.commit()
        conn.close()
        
        return {
            "message_id": message_id,
            "status": "sent",
            "timestamp": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to send message: {str(e)}")

@router.get("/sessions")
async def get_user_sessions(
    email: str = Depends(verify_token)
):
    """Get all sessions for a user"""
    try:
        user = get_user_by_email(email)
        user_id = str(user['id'])
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            SELECT DISTINCT cs.*, 
                   CASE 
                       WHEN cs.patient_id = ? THEN cs.professional_id 
                       ELSE cs.patient_id 
                   END as other_user_id
            FROM chat_sessions cs
            JOIN session_participants sp ON cs.id = sp.session_id
            WHERE sp.user_id = ?
            ORDER BY cs.created_at DESC
        ''', (user_id, user_id))
        
        sessions = cursor.fetchall()
        conn.close()
        
        return {
            "sessions": [
                {
                    "session_id": session['id'],
                    "other_user_id": session['other_user_id'],
                    "session_type": session['session_type'],
                    "status": session['status'],
                    "start_time": session['start_time'],
                    "total_cost": session['total_cost']
                }
                for session in sessions
            ]
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get sessions: {str(e)}")

@router.put("/sessions/{session_id}/end")
async def end_session(
    session_id: str,
    email: str = Depends(verify_token)
):
    """End a chat session"""
    try:
        user = get_user_by_email(email)
        user_id = str(user['id'])
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Verify user is participant
        cursor.execute('''
            SELECT COUNT(*) FROM session_participants 
            WHERE session_id = ? AND user_id = ?
        ''', (session_id, user_id))
        
        if cursor.fetchone()[0] == 0:
            raise HTTPException(status_code=403, detail="Access denied to this session")
        
        # End session
        cursor.execute('''
            UPDATE chat_sessions 
            SET status = 'ended', end_time = CURRENT_TIMESTAMP
            WHERE id = ?
        ''', (session_id,))
        
        conn.commit()
        conn.close()
        
        return {
            "session_id": session_id,
            "status": "ended",
            "end_time": datetime.now().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to end session: {str(e)}")

@router.post("/sessions/{session_id}/typing")
async def send_typing_indicator(
    session_id: str,
    is_typing: bool,
    email: str = Depends(verify_token)
):
    """Send typing indicator to other participants"""
    try:
        user = get_user_by_email(email)
        user_id = str(user['id'])
        
        # Broadcast typing indicator via WebSocket
        typing_data = {
            "type": "typing",
            "session_id": session_id,
            "user_id": user_id,
            "is_typing": is_typing,
            "timestamp": datetime.now().isoformat()
        }
        
        await manager.broadcast_to_session(
            json.dumps(typing_data), 
            session_id, 
            exclude_user=user_id
        )
        
        return {"status": "sent"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to send typing indicator: {str(e)}")