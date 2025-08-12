from fastapi import APIRouter, Depends, HTTPException
from typing import Dict, List, Optional
from .auth import verify_token, get_user_by_email
from .database import get_db_connection
from .ai_memory import ConversationMemory
import json
from datetime import datetime, timedelta

router = APIRouter(prefix="/feedback", tags=["feedback"])
memory = ConversationMemory()

class FeedbackAnalyzer:
    """Analyze user feedback to improve AI responses"""
    
    def __init__(self):
        self.feedback_categories = {
            'response_quality': ['helpful', 'not_helpful', 'partially_helpful'],
            'cultural_sensitivity': ['culturally_appropriate', 'needs_improvement', 'offensive'],
            'language_accuracy': ['perfect_language', 'good_language', 'poor_language'],
            'emotional_understanding': ['understood_well', 'partially_understood', 'misunderstood'],
            'practical_advice': ['very_practical', 'somewhat_practical', 'not_practical']
        }
    
    def analyze_feedback_patterns(self, user_id: str) -> Dict:
        """Analyze user's feedback patterns to improve personalization"""
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Get recent feedback
        cursor.execute('''
            SELECT feedback_type, rating, feedback_text, response_context, timestamp
            FROM user_feedback 
            WHERE user_id = ? AND timestamp > datetime('now', '-30 days')
            ORDER BY timestamp DESC
        ''', (user_id,))
        
        feedback_data = cursor.fetchall()
        conn.close()
        
        if not feedback_data:
            return {'status': 'no_feedback', 'recommendations': []}
        
        # Analyze patterns
        patterns = {
            'avg_rating': 0,
            'common_issues': [],
            'strengths': [],
            'improvement_areas': []
        }
        
        total_rating = 0
        rating_count = 0
        issue_counts = {}
        
        for feedback in feedback_data:
            feedback_type, rating, text, context, timestamp = feedback
            
            if rating:
                total_rating += rating
                rating_count += 1
            
            # Analyze feedback text for common issues
            if text:
                text_lower = text.lower()
                if 'language' in text_lower or 'hindi' in text_lower or 'english' in text_lower:
                    issue_counts['language_preference'] = issue_counts.get('language_preference', 0) + 1
                if 'culture' in text_lower or 'family' in text_lower:
                    issue_counts['cultural_context'] = issue_counts.get('cultural_context', 0) + 1
                if 'advice' in text_lower or 'suggestion' in text_lower:
                    issue_counts['advice_quality'] = issue_counts.get('advice_quality', 0) + 1
        
        if rating_count > 0:
            patterns['avg_rating'] = total_rating / rating_count
        
        # Identify top issues
        patterns['common_issues'] = sorted(issue_counts.items(), key=lambda x: x[1], reverse=True)[:3]
        
        return patterns

@router.post("/submit")
async def submit_feedback(
    feedback_data: Dict,
    email: str = Depends(verify_token)
):
    """Submit user feedback on AI response"""
    try:
        user = get_user_by_email(email)
        user_id = str(user['id'])
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Create feedback table if not exists
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS user_feedback (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT NOT NULL,
                conversation_id TEXT,
                message_id TEXT,
                feedback_type TEXT NOT NULL,
                rating INTEGER,
                feedback_text TEXT,
                response_context TEXT,
                improvement_suggestions TEXT,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        ''')
        
        # Insert feedback
        cursor.execute('''
            INSERT INTO user_feedback 
            (user_id, conversation_id, message_id, feedback_type, rating, 
             feedback_text, response_context, improvement_suggestions)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            user_id,
            feedback_data.get('conversation_id'),
            feedback_data.get('message_id'),
            feedback_data.get('type', 'general'),
            feedback_data.get('rating'),
            feedback_data.get('text', ''),
            json.dumps(feedback_data.get('context', {})),
            feedback_data.get('suggestions', '')
        ))
        
        conn.commit()
        conn.close()
        
        # Analyze feedback and update user preferences
        analyzer = FeedbackAnalyzer()
        patterns = analyzer.analyze_feedback_patterns(user_id)
        
        # Update user personality based on feedback
        if patterns.get('common_issues'):
            personality_updates = {}
            
            for issue, count in patterns['common_issues']:
                if issue == 'language_preference':
                    # User has language preference issues
                    preferred_lang = feedback_data.get('preferred_language', 'hinglish')
                    personality_updates['preferred_language'] = preferred_lang
                elif issue == 'cultural_context':
                    # User wants more cultural sensitivity
                    personality_updates['communication_style'] = 'culturally_sensitive'
            
            if personality_updates:
                memory.update_user_personality(user_id, personality_updates)
        
        return {
            'status': 'success',
            'message': 'Feedback submitted successfully',
            'analysis': patterns
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/analytics")
async def get_feedback_analytics(email: str = Depends(verify_token)):
    """Get user's feedback analytics and AI improvement suggestions"""
    try:
        user = get_user_by_email(email)
        user_id = str(user['id'])
        
        analyzer = FeedbackAnalyzer()
        patterns = analyzer.analyze_feedback_patterns(user_id)
        
        # Generate personalized recommendations
        recommendations = []
        
        if patterns.get('avg_rating', 0) < 3:
            recommendations.append({
                'type': 'improvement_needed',
                'message': 'AI responses need improvement based on your feedback',
                'action': 'We are adjusting response style based on your preferences'
            })
        
        for issue, count in patterns.get('common_issues', []):
            if issue == 'language_preference':
                recommendations.append({
                    'type': 'language_adjustment',
                    'message': 'Language preference will be better matched',
                    'action': 'AI will use your preferred language style more consistently'
                })
            elif issue == 'cultural_context':
                recommendations.append({
                    'type': 'cultural_sensitivity',
                    'message': 'Cultural context understanding will be improved',
                    'action': 'AI will be more sensitive to cultural nuances'
                })
        
        return {
            'patterns': patterns,
            'recommendations': recommendations,
            'status': 'success'
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/quick-rating")
async def quick_rating(
    rating_data: Dict,
    email: str = Depends(verify_token)
):
    """Quick thumbs up/down rating for responses"""
    try:
        user = get_user_by_email(email)
        user_id = str(user['id'])
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Create quick ratings table if not exists
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS quick_ratings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT NOT NULL,
                message_id TEXT,
                rating TEXT NOT NULL,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        ''')
        
        # Insert quick rating
        cursor.execute('''
            INSERT INTO quick_ratings (user_id, message_id, rating)
            VALUES (?, ?, ?)
        ''', (
            user_id,
            rating_data.get('message_id'),
            rating_data.get('rating')  # 'thumbs_up' or 'thumbs_down'
        ))
        
        conn.commit()
        conn.close()
        
        return {'status': 'success', 'message': 'Rating submitted'}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/improvement-suggestions")
async def get_improvement_suggestions(email: str = Depends(verify_token)):
    """Get AI improvement suggestions based on user feedback"""
    try:
        user = get_user_by_email(email)
        user_id = str(user['id'])
        
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Get recent negative feedback
        cursor.execute('''
            SELECT feedback_text, improvement_suggestions, timestamp
            FROM user_feedback 
            WHERE user_id = ? AND rating < 3 AND timestamp > datetime('now', '-7 days')
            ORDER BY timestamp DESC
            LIMIT 5
        ''', (user_id,))
        
        negative_feedback = cursor.fetchall()
        
        # Get quick ratings
        cursor.execute('''
            SELECT rating, COUNT(*) as count
            FROM quick_ratings 
            WHERE user_id = ? AND timestamp > datetime('now', '-7 days')
            GROUP BY rating
        ''', (user_id,))
        
        rating_stats = dict(cursor.fetchall())
        conn.close()
        
        suggestions = []
        
        # Analyze negative feedback
        if negative_feedback:
            suggestions.append({
                'category': 'response_quality',
                'suggestion': 'AI will focus on providing more helpful and relevant responses',
                'based_on': f'{len(negative_feedback)} recent feedback items'
            })
        
        # Analyze rating patterns
        thumbs_down = rating_stats.get('thumbs_down', 0)
        thumbs_up = rating_stats.get('thumbs_up', 0)
        
        if thumbs_down > thumbs_up:
            suggestions.append({
                'category': 'overall_satisfaction',
                'suggestion': 'AI response style will be adjusted based on your preferences',
                'based_on': f'{thumbs_down} negative vs {thumbs_up} positive ratings'
            })
        
        return {
            'suggestions': suggestions,
            'feedback_summary': {
                'recent_negative_feedback': len(negative_feedback),
                'rating_stats': rating_stats
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))