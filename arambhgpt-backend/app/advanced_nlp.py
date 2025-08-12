import re
from typing import Dict, List, Tuple
from datetime import datetime, timedelta
import json
from .sensitive_topics_analyzer import SensitiveTopicsAnalyzer
from .sexual_health_educator import SexualHealthEducator

class AdvancedNLPProcessor:
    """Advanced NLP for Indian languages and cultural context"""
    
    def __init__(self):
        self.sensitive_analyzer = SensitiveTopicsAnalyzer()
        self.health_educator = SexualHealthEducator()
        # Extended emotion patterns with cultural context
        self.cultural_emotion_patterns = {
            # Family-related emotions
            'family_stress': [
                'ghar wale samjhte nahi', 'family pressure', 'parents force kar rahe',
                'shaadi ka pressure', 'relatives taunt karte', 'gharwale pareshan karte',
                'मां-बाप समझते नहीं', 'परिवार का दबाव', 'रिश्तेदार ताना मारते'
            ],
            'career_anxiety': [
                'job nahi mil rahi', 'placement tension', 'career mein confusion',
                'competition bahut hai', 'salary kam hai', 'boss toxic hai',
                'नौकरी नहीं मिल रही', 'करियर में कन्फ्यूजन', 'कंपटीशन बहुत है'
            ],
            'social_pressure': [
                'log kya kahenge', 'society judge karti', 'reputation kharab',
                'izzat ka sawal', 'social media pressure', 'comparison ho rahi',
                'लोग क्या कहेंगे', 'समाज जजमेंट करता', 'इज्जत का सवाल'
            ],
            'relationship_issues': [
                'breakup hua hai', 'love life mein problem', 'partner samjhta nahi',
                'arranged marriage pressure', 'commitment issues', 'trust issues',
                'ब्रेकअप हुआ है', 'लव लाइफ में प्रॉब्लम', 'पार्टनर समझता नहीं'
            ],
            'financial_stress': [
                'paisa nahi hai', 'financial problem', 'loan repay karna hai',
                'ghar chalana mushkil', 'EMI bharni hai', 'budget tight hai',
                'पैसा नहीं है', 'फाइनेंशियल प्रॉब्लम', 'घर चलाना मुश्किल'
            ]
        }
        
        # Intensity markers
        self.intensity_markers = {
            'extreme': [
                'bahut zyada', 'बहुत ज्यादा', 'extremely', 'unbearable', 'can\'t take it',
                'breaking point', 'limit cross ho gayi', 'हद पार हो गई'
            ],
            'high': [
                'bahut', 'बहुत', 'very', 'really', 'too much', 'zyada',
                'ज्यादा', 'kaafi', 'काफी'
            ],
            'medium': [
                'thoda zyada', 'थोड़ा ज्यादा', 'somewhat', 'kinda', 'little bit more'
            ],
            'low': [
                'thoda', 'थोड़ा', 'little', 'slightly', 'kam', 'कम'
            ]
        }
        
        # Coping mechanism indicators
        self.coping_indicators = {
            'healthy': [
                'exercise kar raha', 'meditation karta', 'friends se baat karta',
                'music sunta', 'books padhta', 'walk pe jata'
            ],
            'unhealthy': [
                'smoking kar raha', 'drinking kar raha', 'junk food khata',
                'social media scroll karta', 'overthinking karta'
            ],
            'seeking_help': [
                'kisi se baat karna chahta', 'help chahiye', 'guidance chahiye',
                'counseling lena chahiye', 'therapy karna chahiye'
            ]
        }
        
        # Regional language patterns
        self.regional_patterns = {
            'punjabi': ['yaar', 'bhai', 'paaji', 'veer', 'chak de'],
            'gujarati': ['bhai', 'ben', 'su che', 'kem cho'],
            'marathi': ['arre', 'kay re', 'bhau', 'tai'],
            'bengali': ['dada', 'didi', 'ki korbo', 'bhalo nei'],
            'tamil': ['anna', 'akka', 'enna da', 'seri'],
            'telugu': ['anna', 'akka', 'enti ra', 'bagundi']
        }
    
    def deep_analyze_message(self, message: str, user_history: List = None) -> Dict:
        """Deep analysis with cultural and contextual understanding"""
        message_lower = message.lower()
        
        # Basic emotion detection
        emotions = self._detect_emotions_with_intensity(message_lower)
        
        # Cultural context detection
        cultural_context = self._detect_cultural_context(message_lower)
        
        # Regional language detection
        regional_info = self._detect_regional_language(message_lower)
        
        # Coping mechanism analysis
        coping_analysis = self._analyze_coping_mechanisms(message_lower)
        
        # Temporal analysis (time-based patterns)
        temporal_context = self._analyze_temporal_context(message, user_history)
        
        # Severity assessment
        severity = self._assess_severity(emotions, cultural_context, message_lower)
        
        # Sensitive content analysis
        sensitive_analysis = self.sensitive_analyzer.analyze_sensitive_content(message)
        
        # Sexual health education analysis
        health_analysis = self.health_educator.analyze_sexual_health_query(message)
        
        # Response strategy
        strategy = self._determine_response_strategy(
            emotions, cultural_context, severity, coping_analysis, sensitive_analysis
        )
        
        return {
            'emotions': emotions,
            'cultural_context': cultural_context,
            'regional_info': regional_info,
            'coping_analysis': coping_analysis,
            'temporal_context': temporal_context,
            'severity': severity,
            'sensitive_content': sensitive_analysis,
            'sexual_health': health_analysis,
            'response_strategy': strategy,
            'personalization_hints': self._get_personalization_hints(
                emotions, cultural_context, regional_info
            )
        }
    
    def _detect_emotions_with_intensity(self, message: str) -> Dict:
        """Detect emotions with intensity levels"""
        detected_emotions = {}
        
        for emotion_type, patterns in self.cultural_emotion_patterns.items():
            if any(pattern in message for pattern in patterns):
                # Determine intensity
                intensity = 'medium'  # default
                for level, markers in self.intensity_markers.items():
                    if any(marker in message for marker in markers):
                        intensity = level
                        break
                
                detected_emotions[emotion_type] = {
                    'intensity': intensity,
                    'confidence': 0.8  # Can be improved with ML
                }
        
        return detected_emotions
    
    def _detect_cultural_context(self, message: str) -> Dict:
        """Detect cultural and social context"""
        contexts = {
            'family_dynamics': False,
            'social_expectations': False,
            'career_pressure': False,
            'financial_concerns': False,
            'relationship_status': False
        }
        
        # Family context
        family_keywords = ['family', 'ghar', 'parents', 'mummy', 'papa', 'relatives']
        if any(keyword in message for keyword in family_keywords):
            contexts['family_dynamics'] = True
        
        # Social context
        social_keywords = ['society', 'log', 'reputation', 'izzat', 'judge']
        if any(keyword in message for keyword in social_keywords):
            contexts['social_expectations'] = True
        
        # Career context
        career_keywords = ['job', 'career', 'office', 'work', 'salary', 'boss']
        if any(keyword in message for keyword in career_keywords):
            contexts['career_pressure'] = True
        
        return contexts
    
    def _detect_regional_language(self, message: str) -> Dict:
        """Detect regional language patterns"""
        detected_regions = []
        
        for region, patterns in self.regional_patterns.items():
            if any(pattern in message for pattern in patterns):
                detected_regions.append(region)
        
        return {
            'regions': detected_regions,
            'primary_region': detected_regions[0] if detected_regions else 'general'
        }
    
    def _analyze_coping_mechanisms(self, message: str) -> Dict:
        """Analyze user's coping mechanisms"""
        coping_types = []
        
        for coping_type, indicators in self.coping_indicators.items():
            if any(indicator in message for indicator in indicators):
                coping_types.append(coping_type)
        
        return {
            'current_coping': coping_types,
            'needs_guidance': 'unhealthy' in coping_types,
            'seeking_help': 'seeking_help' in coping_types
        }
    
    def _analyze_temporal_context(self, message: str, user_history: List) -> Dict:
        """Analyze temporal patterns and context"""
        # Time-based keywords
        time_indicators = {
            'immediate': ['right now', 'abhi', 'अभी', 'urgent', 'emergency'],
            'recent': ['today', 'aaj', 'आज', 'yesterday', 'kal', 'कल'],
            'ongoing': ['always', 'hamesha', 'हमेशा', 'daily', 'roz', 'रोज'],
            'past': ['used to', 'pehle', 'पहले', 'before', 'earlier']
        }
        
        temporal_context = 'general'
        for time_type, indicators in time_indicators.items():
            if any(indicator in message.lower() for indicator in indicators):
                temporal_context = time_type
                break
        
        return {
            'time_context': temporal_context,
            'urgency_level': 'high' if temporal_context == 'immediate' else 'normal'
        }
    
    def _assess_severity(self, emotions: Dict, cultural_context: Dict, message: str) -> Dict:
        """Assess severity of the situation"""
        severity_score = 0
        
        # Emotion-based severity
        for emotion, details in emotions.items():
            intensity_scores = {'low': 1, 'medium': 2, 'high': 3, 'extreme': 4}
            severity_score += intensity_scores.get(details['intensity'], 2)
        
        # Crisis keywords
        crisis_keywords = [
            'suicide', 'kill myself', 'end it all', 'no point living',
            'give up', 'can\'t go on', 'hopeless', 'worthless'
        ]
        
        if any(keyword in message for keyword in crisis_keywords):
            severity_score += 10
        
        # Determine severity level
        if severity_score >= 10:
            level = 'crisis'
        elif severity_score >= 6:
            level = 'high'
        elif severity_score >= 3:
            level = 'medium'
        else:
            level = 'low'
        
        return {
            'level': level,
            'score': severity_score,
            'needs_professional_help': level in ['crisis', 'high']
        }
    
    def _determine_response_strategy(self, emotions: Dict, cultural_context: Dict, 
                                   severity: Dict, coping_analysis: Dict, sensitive_analysis: Dict) -> Dict:
        """Determine the best response strategy"""
        strategies = []
        
        # Crisis intervention
        if severity['level'] == 'crisis' or sensitive_analysis.get('crisis_intervention_needed'):
            strategies.append('crisis_intervention')
        
        # Sensitive content handling
        if sensitive_analysis.get('contains_sensitive_content'):
            strategies.append('sensitive_content_response')
            if sensitive_analysis.get('requires_professional_help'):
                strategies.append('professional_referral')
        
        # Cultural sensitivity
        if cultural_context.get('family_dynamics'):
            strategies.append('family_counseling')
        if cultural_context.get('social_expectations'):
            strategies.append('social_pressure_guidance')
        
        # Coping mechanism guidance
        if coping_analysis.get('needs_guidance'):
            strategies.append('healthy_coping_techniques')
        
        # Default supportive strategy
        if not strategies:
            strategies.append('general_emotional_support')
        
        return {
            'primary_strategies': strategies,
            'tone': 'urgent' if severity['level'] in ['crisis', 'high'] else 'supportive',
            'approach': 'directive' if severity['level'] == 'crisis' else 'collaborative'
        }
    
    def _get_personalization_hints(self, emotions: Dict, cultural_context: Dict, 
                                 regional_info: Dict) -> Dict:
        """Get hints for personalizing the response"""
        hints = {
            'use_regional_terms': regional_info.get('primary_region', 'general'),
            'cultural_sensitivity_needed': any(cultural_context.values()),
            'family_context': cultural_context.get('family_dynamics', False),
            'professional_context': cultural_context.get('career_pressure', False)
        }
        
        return hints