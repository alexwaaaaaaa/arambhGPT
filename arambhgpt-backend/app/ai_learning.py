from fastapi import APIRouter, Depends
from typing import Dict, Optional
from .auth import verify_token, get_user_by_email
from .database import get_db_connection
from .ai_memory import ConversationMemory

router = APIRouter(prefix="/ai-learning", tags=["ai-learning"])
memory = ConversationMemory()

@router.post("/feedback")
async def provide_feedback(
    feedback_data: Dict,
    email: str = Depends(verify_token)
):
    """User provides feedback on AI response quality"""
    try:
        user = get_user_by_email(email)
        user_id = str(user['id'])
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO ai_learning 
            (user_id, interaction_type, user_feedback, response_effectiveness, improvement_notes)
            VALUES (?, ?, ?, ?, ?)
        ''', (
            user_id,
            feedback_data.get('type', 'response_quality'),
            feedback_data.get('feedback', ''),
            feedback_data.get('rating', 3),  # 1-5 scale
            feedback_data.get('notes', '')
        ))
        
        conn.commit()
        conn.close()
        
        # Update user personality based on feedback
        if feedback_data.get('rating', 3) >= 4:
            # Good response, reinforce current approach
            personality_updates = {
                'communication_style': feedback_data.get('preferred_style', 'casual'),
                'preferred_language': feedback_data.get('preferred_language', 'hinglish')
            }
            memory.update_user_personality(user_id, personality_updates)
        
        return {"status": "success", "message": "Feedback recorded"}
        
    except Exception as e:
        return {"status": "error", "message": str(e)}

@router.get("/user-insights")
async def get_user_insights(email: str = Depends(verify_token)):
    """Get AI insights about user's emotional patterns"""
    try:
        user = get_user_by_email(email)
        user_id = str(user['id'])
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Get emotional patterns
        cursor.execute('''
            SELECT emotion_detected, COUNT(*) as frequency
            FROM conversation_context 
            WHERE user_id = ? AND timestamp > datetime('now', '-30 days')
            GROUP BY emotion_detected
            ORDER BY frequency DESC
        ''', (user_id,))
        
        emotion_patterns = [{"emotion": row[0], "frequency": row[1]} for row in cursor.fetchall()]
        
        # Get topic patterns
        cursor.execute('''
            SELECT topics_discussed, COUNT(*) as frequency
            FROM conversation_context 
            WHERE user_id = ? AND timestamp > datetime('now', '-30 days')
            GROUP BY topics_discussed
            ORDER BY frequency DESC
            LIMIT 5
        ''', (user_id,))
        
        topic_patterns = [{"topics": row[0], "frequency": row[1]} for row in cursor.fetchall()]
        
        conn.close()
        
        return {
            "emotion_patterns": emotion_patterns,
            "topic_patterns": topic_patterns,
            "insights": generate_insights(emotion_patterns, topic_patterns)
        }
        
    except Exception as e:
        return {"status": "error", "message": str(e)}

def generate_insights(emotions: list, topics: list) -> Dict:
    """Generate insights from user patterns"""
    insights = {
        "dominant_emotions": [],
        "stress_triggers": [],
        "positive_trends": [],
        "recommendations": []
    }
    
    if emotions:
        # Find dominant emotions
        total_interactions = sum(e['frequency'] for e in emotions)
        for emotion in emotions[:3]:  # Top 3 emotions
            percentage = (emotion['frequency'] / total_interactions) * 100
            insights["dominant_emotions"].append({
                "emotion": emotion['emotion'],
                "percentage": round(percentage, 1)
            })
        
        # Identify stress patterns
        stress_emotions = ['sad', 'anxious', 'angry', 'stressed']
        stress_count = sum(e['frequency'] for e in emotions if e['emotion'] in stress_emotions)
        stress_percentage = (stress_count / total_interactions) * 100
        
        if stress_percentage > 60:
            insights["recommendations"].append("Consider stress management techniques")
        elif stress_percentage > 40:
            insights["recommendations"].append("Monitor stress levels regularly")
    
    return insights

# Endpoint for manual AI training (admin only)
@router.post("/train-response")
async def train_ai_response(
    training_data: Dict,
    email: str = Depends(verify_token)
):
    """Train AI with better response examples"""
    # This would be used to improve AI responses based on successful interactions
    # Implementation would depend on your ML pipeline
    return {"status": "training_queued", "message": "Response training initiated"}