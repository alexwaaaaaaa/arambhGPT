from typing import Dict, List, Optional
from datetime import datetime, timedelta
import json
from .database import get_db_connection

class ConversationMemory:
    """AI memory system for better context awareness"""
    
    def __init__(self):
        self.init_memory_tables()
    
    def init_memory_tables(self):
        """Initialize memory tables"""
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # User personality and preferences
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS user_personality (
                user_id TEXT PRIMARY KEY,
                communication_style TEXT DEFAULT 'casual',
                preferred_language TEXT DEFAULT 'hinglish',
                emotional_patterns TEXT,
                topics_of_interest TEXT,
                stress_triggers TEXT,
                coping_preferences TEXT,
                personality_traits TEXT,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Conversation context
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS conversation_context (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT,
                session_id TEXT,
                message_summary TEXT,
                emotion_detected TEXT,
                topics_discussed TEXT,
                advice_given TEXT,
                user_response_sentiment TEXT,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # AI learning from interactions
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS ai_learning (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT,
                interaction_type TEXT,
                user_feedback TEXT,
                response_effectiveness INTEGER,
                improvement_notes TEXT,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        conn.commit()
        conn.close()
    
    def get_user_context(self, user_id: str) -> Dict:
        """Get user's conversation context and personality"""
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Get personality
        cursor.execute(
            "SELECT * FROM user_personality WHERE user_id = ?", 
            (user_id,)
        )
        personality = cursor.fetchone()
        
        # Get recent conversation context (last 5 interactions)
        cursor.execute('''
            SELECT message_summary, emotion_detected, topics_discussed, advice_given
            FROM conversation_context 
            WHERE user_id = ? 
            ORDER BY timestamp DESC 
            LIMIT 5
        ''', (user_id,))
        recent_context = cursor.fetchall()
        
        conn.close()
        
        return {
            'personality': dict(personality) if personality else {},
            'recent_context': [dict(row) for row in recent_context],
            'context_summary': self._generate_context_summary(recent_context)
        }
    
    def save_interaction(self, user_id: str, message: str, emotion: str, 
                        topics: List[str], ai_response: str):
        """Save interaction for future context"""
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO conversation_context 
            (user_id, message_summary, emotion_detected, topics_discussed, advice_given)
            VALUES (?, ?, ?, ?, ?)
        ''', (
            user_id,
            message[:200],  # Summary of message
            emotion,
            json.dumps(topics),
            ai_response[:300]  # Summary of advice
        ))
        
        conn.commit()
        conn.close()
    
    def update_user_personality(self, user_id: str, updates: Dict):
        """Update user personality based on interactions"""
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Check if personality exists
        cursor.execute("SELECT user_id FROM user_personality WHERE user_id = ?", (user_id,))
        exists = cursor.fetchone()
        
        if exists:
            # Update existing
            set_clause = ", ".join([f"{key} = ?" for key in updates.keys()])
            values = list(updates.values()) + [user_id]
            cursor.execute(f"UPDATE user_personality SET {set_clause} WHERE user_id = ?", values)
        else:
            # Insert new
            columns = ", ".join(["user_id"] + list(updates.keys()))
            placeholders = ", ".join(["?"] * (len(updates) + 1))
            values = [user_id] + list(updates.values())
            cursor.execute(f"INSERT INTO user_personality ({columns}) VALUES ({placeholders})", values)
        
        conn.commit()
        conn.close()
    
    def _generate_context_summary(self, recent_context: List) -> str:
        """Generate summary of recent conversations"""
        if not recent_context:
            return "New user, no previous context"
        
        emotions = [ctx['emotion_detected'] for ctx in recent_context if ctx['emotion_detected']]
        topics = []
        for ctx in recent_context:
            if ctx['topics_discussed']:
                topics.extend(json.loads(ctx['topics_discussed']))
        
        return f"Recent emotions: {', '.join(set(emotions))}. Topics: {', '.join(set(topics))}"