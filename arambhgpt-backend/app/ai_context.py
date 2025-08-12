from fastapi import APIRouter, HTTPException, Depends, status
from typing import List, Optional
from datetime import datetime
import sqlite3
import json
from .auth import verify_token, get_user_by_email
from .database import get_db_connection

router = APIRouter(prefix="/ai-context", tags=["ai-context"])

def init_ai_context_tables():
    """Initialize AI context tables"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Create ai_context table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS ai_context (
            user_id TEXT PRIMARY KEY,
            communication_style TEXT DEFAULT 'empathetic',
            language TEXT DEFAULT 'hinglish',
            topics TEXT,
            stressors TEXT,
            coping_mechanisms TEXT,
            goals TEXT,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    # Create conversation_history table for AI context
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS conversation_history (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            topic TEXT,
            sentiment TEXT,
            urgency TEXT DEFAULT 'low',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    conn.commit()
    conn.close()

@router.get("/")
async def get_ai_context(
    email: str = Depends(verify_token)
):
    """Get AI context for the current user"""
    user = get_user_by_email(email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute(
            "SELECT * FROM ai_context WHERE user_id = ?",
            (str(user['id']),)
        )
        
        row = cursor.fetchone()
        if not row:
            # Create default context
            cursor.execute('''
                INSERT INTO ai_context (user_id) VALUES (?)
            ''', (str(user['id']),))
            conn.commit()
            
            return {
                "user_id": str(user['id']),
                "communication_style": "empathetic",
                "language": "hinglish",
                "topics": [],
                "stressors": [],
                "coping_mechanisms": [],
                "goals": [],
                "updated_at": datetime.now().isoformat()
            }
        
        return {
            "user_id": row[0],
            "communication_style": row[1],
            "language": row[2],
            "topics": json.loads(row[3]) if row[3] else [],
            "stressors": json.loads(row[4]) if row[4] else [],
            "coping_mechanisms": json.loads(row[5]) if row[5] else [],
            "goals": json.loads(row[6]) if row[6] else [],
            "updated_at": row[7]
        }
        
    finally:
        conn.close()

@router.put("/")
async def update_ai_context(
    context_update: dict,
    email: str = Depends(verify_token)
):
    """Update AI context for the current user"""
    user = get_user_by_email(email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Get current context
        cursor.execute(
            "SELECT * FROM ai_context WHERE user_id = ?",
            (str(user['id']),)
        )
        
        current_context = cursor.fetchone()
        if not current_context:
            # Create new context
            cursor.execute('''
                INSERT INTO ai_context (user_id) VALUES (?)
            ''', (str(user['id']),))
            current_context = (str(user['id']), 'empathetic', 'hinglish', '[]', '[]', '[]', '[]', datetime.now().isoformat())
        
        # Update fields that are provided
        communication_style = context_update.get('communication_style', current_context[1])
        language = context_update.get('language', current_context[2])
        topics = json.dumps(context_update.get('topics', json.loads(current_context[3]) if current_context[3] else []))
        stressors = json.dumps(context_update.get('stressors', json.loads(current_context[4]) if current_context[4] else []))
        coping_mechanisms = json.dumps(context_update.get('coping_mechanisms', json.loads(current_context[5]) if current_context[5] else []))
        goals = json.dumps(context_update.get('goals', json.loads(current_context[6]) if current_context[6] else []))
        
        cursor.execute('''
            UPDATE ai_context 
            SET communication_style = ?, language = ?, topics = ?, stressors = ?,
                coping_mechanisms = ?, goals = ?, updated_at = CURRENT_TIMESTAMP
            WHERE user_id = ?
        ''', (
            communication_style, language, topics, stressors,
            coping_mechanisms, goals, str(user['id'])
        ))
        
        conn.commit()
        
        return {
            "user_id": str(user['id']),
            "communication_style": communication_style,
            "language": language,
            "topics": json.loads(topics),
            "stressors": json.loads(stressors),
            "coping_mechanisms": json.loads(coping_mechanisms),
            "goals": json.loads(goals),
            "updated_at": datetime.now().isoformat()
        }
        
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to update AI context: {str(e)}")
    finally:
        conn.close()

@router.post("/conversation-history")
async def add_conversation_history(
    history_data: dict,
    email: str = Depends(verify_token)
):
    """Add conversation history entry for AI context"""
    user = get_user_by_email(email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        history_id = f"hist_{user['id']}_{int(datetime.now().timestamp())}"
        
        cursor.execute('''
            INSERT INTO conversation_history 
            (id, user_id, topic, sentiment, urgency)
            VALUES (?, ?, ?, ?, ?)
        ''', (
            history_id, str(user['id']), 
            history_data.get('topic'),
            history_data.get('sentiment'),
            history_data.get('urgency', 'low')
        ))
        
        conn.commit()
        return {"message": "Conversation history added successfully"}
        
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to add conversation history: {str(e)}")
    finally:
        conn.close()

@router.get("/conversation-history")
async def get_conversation_history(
    limit: int = 10,
    email: str = Depends(verify_token)
):
    """Get recent conversation history for AI context"""
    user = get_user_by_email(email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute('''
            SELECT topic, sentiment, urgency, created_at
            FROM conversation_history 
            WHERE user_id = ?
            ORDER BY created_at DESC LIMIT ?
        ''', (str(user['id']), limit))
        
        rows = cursor.fetchall()
        history = []
        
        for row in rows:
            history.append({
                "topic": row[0],
                "sentiment": row[1],
                "urgency": row[2],
                "created_at": row[3]
            })
        
        return {"history": history}
        
    finally:
        conn.close()

@router.post("/analyze-message")
async def analyze_message(
    message_data: dict,
    email: str = Depends(verify_token)
):
    """Analyze message for sentiment, topics, and urgency"""
    user = get_user_by_email(email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    message = message_data.get('message', '')
    
    # Simple analysis (in production, you'd use NLP libraries)
    message_lower = message.lower()
    
    # Sentiment analysis
    positive_words = ['happy', 'good', 'great', 'excellent', 'wonderful', 'amazing', 'better', 'khush', 'accha', 'badhiya']
    negative_words = ['sad', 'bad', 'terrible', 'awful', 'worse', 'depressed', 'anxious', 'udas', 'bura', 'pareshaan']
    
    positive_count = sum(1 for word in positive_words if word in message_lower)
    negative_count = sum(1 for word in negative_words if word in message_lower)
    
    if positive_count > negative_count:
        sentiment = "positive"
    elif negative_count > positive_count:
        sentiment = "negative"
    else:
        sentiment = "neutral"
    
    # Topic extraction
    topic_keywords = {
        'work': ['work', 'job', 'office', 'boss', 'colleague', 'kaam', 'naukri'],
        'family': ['family', 'parents', 'mother', 'father', 'sister', 'brother', 'ghar', 'maa', 'papa'],
        'health': ['health', 'sick', 'doctor', 'medicine', 'sehat', 'bimari'],
        'relationships': ['friend', 'relationship', 'love', 'partner', 'dost', 'pyaar'],
        'stress': ['stress', 'pressure', 'tension', 'worried', 'chinta', 'pareshani']
    }
    
    topics = []
    for topic, keywords in topic_keywords.items():
        if any(keyword in message_lower for keyword in keywords):
            topics.append(topic)
    
    # Urgency detection
    urgent_words = ['emergency', 'crisis', 'help', 'urgent', 'suicide', 'harm', 'danger']
    urgency = "high" if any(word in message_lower for word in urgent_words) else "medium" if negative_count > 2 else "low"
    
    # Store in conversation history
    if topics:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        try:
            for topic in topics:
                history_id = f"hist_{user['id']}_{topic}_{int(datetime.now().timestamp())}"
                cursor.execute('''
                    INSERT INTO conversation_history 
                    (id, user_id, topic, sentiment, urgency)
                    VALUES (?, ?, ?, ?, ?)
                ''', (history_id, str(user['id']), topic, sentiment, urgency))
            
            conn.commit()
        finally:
            conn.close()
    
    return {
        "sentiment": sentiment,
        "topics": topics,
        "urgency": urgency,
        "analysis": {
            "positive_indicators": positive_count,
            "negative_indicators": negative_count,
            "detected_topics": len(topics)
        }
    }

# Initialize tables when module is imported
init_ai_context_tables()