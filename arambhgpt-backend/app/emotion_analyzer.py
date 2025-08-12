import re
from typing import Dict, List, Tuple
from datetime import datetime

class AdvancedEmotionAnalyzer:
    """Advanced emotion and sentiment analysis for Indian context"""
    
    def __init__(self):
        self.emotion_keywords = {
            # Primary emotions with intensity levels
            'happy': {
                'low': ['okay', 'fine', 'theek', 'ठीक', 'accha', 'अच्छा'],
                'medium': ['good', 'happy', 'khush', 'खुश', 'better', 'nice'],
                'high': ['amazing', 'awesome', 'fantastic', 'bahut khush', 'बहुत खुश', 'great']
            },
            'sad': {
                'low': ['little sad', 'thoda udaas', 'थोड़ा उदास', 'not good'],
                'medium': ['sad', 'udaas', 'उदास', 'dukhi', 'दुखी', 'down'],
                'high': ['very sad', 'bahut udaas', 'बहुत उदास', 'depressed', 'hopeless']
            },
            'anxious': {
                'low': ['little worried', 'thoda tension', 'थोड़ी टेंशन'],
                'medium': ['worried', 'tension', 'टेंशन', 'anxiety', 'nervous'],
                'high': ['panic', 'bahut tension', 'बहुत टेंशन', 'very anxious', 'scared']
            },
            'angry': {
                'low': ['annoyed', 'irritated', 'thoda gussa', 'थोड़ा गुस्सा'],
                'medium': ['angry', 'gussa', 'गुस्सा', 'frustrated', 'mad'],
                'high': ['furious', 'bahut gussa', 'बहुत गुस्सा', 'rage', 'very angry']
            },
            'stressed': {
                'low': ['busy', 'thoda stress', 'थोड़ा स्ट्रेस'],
                'medium': ['stress', 'स्ट्रेस', 'pressure', 'प्रेशर', 'overwhelmed'],
                'high': ['burnout', 'bahut stress', 'बहुत स्ट्रेस', 'breaking down']
            },
            'lonely': {
                'low': ['alone', 'akela', 'अकेला'],
                'medium': ['lonely', 'isolated', 'koi nahi', 'कोई नहीं'],
                'high': ['very lonely', 'bahut akela', 'बहुत अकेला', 'abandoned']
            }
        }
        
        # Context-specific patterns
        self.context_patterns = {
            'family': ['family', 'ghar', 'घर', 'parents', 'mummy', 'papa', 'bhai', 'behen'],
            'work': ['job', 'office', 'work', 'boss', 'colleague', 'salary', 'career'],
            'relationship': ['girlfriend', 'boyfriend', 'partner', 'love', 'breakup', 'relationship'],
            'studies': ['exam', 'study', 'college', 'university', 'marks', 'result'],
            'health': ['health', 'sick', 'doctor', 'medicine', 'pain', 'hospital'],
            'money': ['money', 'paisa', 'पैसा', 'financial', 'loan', 'debt', 'salary']
        }
        
        # Indian cultural expressions
        self.cultural_expressions = {
            'family_pressure': ['ghar wale', 'family pressure', 'parents force', 'shaadi pressure'],
            'social_anxiety': ['log kya kahenge', 'society', 'reputation', 'izzat'],
            'career_stress': ['competition', 'rat race', 'job market', 'placement'],
            'emotional_suppression': ['kuch nahi', 'sab theek', 'manage kar lunga']
        }
    
    def analyze_emotion(self, message: str) -> Dict:
        """Comprehensive emotion analysis"""
        message_lower = message.lower()
        
        # Detect primary emotion and intensity
        emotion_scores = {}
        for emotion, intensities in self.emotion_keywords.items():
            score = 0
            intensity = 'low'
            
            for level, keywords in intensities.items():
                for keyword in keywords:
                    if keyword in message_lower:
                        level_score = {'low': 1, 'medium': 2, 'high': 3}[level]
                        if level_score > score:
                            score = level_score
                            intensity = level
            
            if score > 0:
                emotion_scores[emotion] = {'score': score, 'intensity': intensity}
        
        # Get dominant emotion
        dominant_emotion = 'neutral'
        max_score = 0
        emotion_intensity = 'low'
        
        if emotion_scores:
            dominant_emotion = max(emotion_scores.keys(), key=lambda x: emotion_scores[x]['score'])
            max_score = emotion_scores[dominant_emotion]['score']
            emotion_intensity = emotion_scores[dominant_emotion]['intensity']
        
        # Detect context/topic
        contexts = []
        for context, keywords in self.context_patterns.items():
            if any(keyword in message_lower for keyword in keywords):
                contexts.append(context)
        
        # Detect cultural patterns
        cultural_issues = []
        for issue, patterns in self.cultural_expressions.items():
            if any(pattern in message_lower for pattern in patterns):
                cultural_issues.append(issue)
        
        # Sentiment analysis
        sentiment = self._analyze_sentiment(message_lower)
        
        # Urgency detection
        urgency = self._detect_urgency(message_lower, dominant_emotion, emotion_intensity)
        
        return {
            'dominant_emotion': dominant_emotion,
            'emotion_intensity': emotion_intensity,
            'emotion_confidence': max_score / 3.0,  # Normalize to 0-1
            'all_emotions': emotion_scores,
            'sentiment': sentiment,
            'contexts': contexts,
            'cultural_issues': cultural_issues,
            'urgency': urgency,
            'needs_immediate_attention': urgency == 'high' and dominant_emotion in ['sad', 'anxious']
        }
    
    def _analyze_sentiment(self, message: str) -> Dict:
        """Analyze overall sentiment"""
        positive_words = ['good', 'better', 'happy', 'great', 'awesome', 'khush', 'accha']
        negative_words = ['bad', 'worse', 'sad', 'terrible', 'awful', 'kharab', 'bura']
        
        positive_count = sum(1 for word in positive_words if word in message)
        negative_count = sum(1 for word in negative_words if word in message)
        
        if positive_count > negative_count:
            polarity = 'positive'
            score = (positive_count - negative_count) / max(len(message.split()), 1)
        elif negative_count > positive_count:
            polarity = 'negative'
            score = (negative_count - positive_count) / max(len(message.split()), 1)
        else:
            polarity = 'neutral'
            score = 0.0
        
        return {'polarity': polarity, 'score': min(abs(score), 1.0)}
    
    def _detect_urgency(self, message: str, emotion: str, intensity: str) -> str:
        """Detect urgency level"""
        crisis_keywords = ['suicide', 'kill myself', 'end it all', 'can\'t take it', 'give up']
        high_urgency_keywords = ['help me', 'emergency', 'urgent', 'crisis', 'breaking down']
        
        if any(keyword in message for keyword in crisis_keywords):
            return 'crisis'
        elif any(keyword in message for keyword in high_urgency_keywords):
            return 'high'
        elif emotion in ['sad', 'anxious', 'angry'] and intensity == 'high':
            return 'high'
        elif emotion in ['sad', 'anxious', 'angry'] and intensity == 'medium':
            return 'medium'
        else:
            return 'low'
    
    def get_response_strategy(self, analysis: Dict) -> Dict:
        """Get AI response strategy based on analysis"""
        emotion = analysis['dominant_emotion']
        intensity = analysis['emotion_intensity']
        urgency = analysis['urgency']
        
        strategies = {
            'sad': {
                'low': 'gentle_support',
                'medium': 'empathetic_validation',
                'high': 'crisis_intervention'
            },
            'anxious': {
                'low': 'calming_reassurance',
                'medium': 'breathing_techniques',
                'high': 'immediate_grounding'
            },
            'angry': {
                'low': 'understanding_acknowledgment',
                'medium': 'anger_validation',
                'high': 'de_escalation'
            },
            'stressed': {
                'low': 'practical_advice',
                'medium': 'stress_management',
                'high': 'immediate_relief'
            }
        }
        
        strategy = strategies.get(emotion, {}).get(intensity, 'general_support')
        
        return {
            'response_strategy': strategy,
            'tone': 'urgent' if urgency == 'high' else 'supportive',
            'focus_areas': analysis['contexts'],
            'cultural_sensitivity': analysis['cultural_issues'],
            'immediate_action_needed': analysis['needs_immediate_attention']
        }