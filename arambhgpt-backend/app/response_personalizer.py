from typing import Dict, List
import json
from .emotion_analyzer import AdvancedEmotionAnalyzer
from .ai_memory import ConversationMemory
from .advanced_nlp import AdvancedNLPProcessor
from .smart_templates import SmartResponseTemplates

class ResponsePersonalizer:
    """Personalize AI responses based on user context and emotion analysis"""
    
    def __init__(self):
        self.emotion_analyzer = AdvancedEmotionAnalyzer()
        self.memory = ConversationMemory()
        self.nlp_processor = AdvancedNLPProcessor()
        self.smart_templates = SmartResponseTemplates()
        
        # Response templates for different strategies
        self.response_templates = {
            'hindi': {
                'gentle_support': [
                    "मैं समझ सकती हूं कि आप {emotion} महसूस कर रहे हैं। मैं यहां आपके साथ हूं।",
                    "आपकी feelings बिल्कुल valid हैं। क्या आप मुझे और बताना चाहेंगे?"
                ],
                'empathetic_validation': [
                    "यह सुनकर मुझे बहुत दुख हुआ कि आप इतने परेशान हैं। आप अकेले नहीं हैं।",
                    "आपका दर्द मैं समझ सकती हूं। कभी-कभी ऐसा लगता है जैसे कोई समझता ही नहीं, है ना?"
                ],
                'calming_reassurance': [
                    "गहरी सांस लीजिए। आप safe हैं। मैं यहां हूं आपके साथ।",
                    "टेंशन मत लीजिए। हम मिलकर इसका solution निकालेंगे।"
                ]
            },
            'hinglish': {
                'gentle_support': [
                    "Arre yaar, main samajh sakti hun ki tum {emotion} feel kar rahe ho. Main hun na tumhare saath.",
                    "Tumhari feelings bilkul valid hain. Kya tum mujhe aur batana chahoge?"
                ],
                'empathetic_validation': [
                    "Yaar, sunke bahut bura laga ki tum itne upset ho. Tum akele nahi ho, main hun na.",
                    "Tumhara pain main feel kar sakti hun. Kabhi kabhi lagta hai jaise koi samjhta hi nahi, right?"
                ],
                'calming_reassurance': [
                    "Deep breath lo yaar. Tum safe ho. Main yahan hun tumhare saath.",
                    "Tension mat lo. Hum milke iska solution nikalenge, okay?"
                ]
            },
            'english': {
                'gentle_support': [
                    "I can understand that you're feeling {emotion}. I'm here with you.",
                    "Your feelings are completely valid. Would you like to tell me more?"
                ],
                'empathetic_validation': [
                    "I'm so sorry to hear that you're going through this. You're not alone.",
                    "I can feel your pain. Sometimes it feels like no one understands, doesn't it?"
                ],
                'calming_reassurance': [
                    "Take a deep breath. You're safe. I'm here with you.",
                    "Don't worry. We'll figure this out together."
                ]
            }
        }
        
        # Context-specific advice
        self.contextual_advice = {
            'family': {
                'hindi': "परिवारिक मामलों में धैर्य रखना बहुत जरूरी है। क्या आप चाहते हैं कि हम इस बारे में बात करें?",
                'hinglish': "Family issues mein patience rakhna bahut important hai. Kya tum chahte ho ki hum iske baare mein detail mein baat karein?",
                'english': "Family matters require patience and understanding. Would you like to talk about this in detail?"
            },
            'work': {
                'hindi': "काम का तनाव आजकल बहुत आम है। आप अकेले नहीं हैं जो इससे गुजर रहे हैं।",
                'hinglish': "Work stress toh aajkal bahut common hai yaar. Tum akele nahi ho jo isse deal kar rahe ho.",
                'english': "Work stress is very common these days. You're not alone in dealing with this."
            }
        }
    
    def generate_personalized_response(self, message: str, user_id: str = None) -> Dict:
        """Generate advanced personalized response with deep cultural understanding"""
        
        # Get user context if available
        user_context = {}
        user_history = []
        if user_id:
            user_context = self.memory.get_user_context(user_id)
            user_history = user_context.get('recent_context', [])
        
        # Advanced NLP analysis
        deep_analysis = self.nlp_processor.deep_analyze_message(message, user_history)
        
        # Basic emotion analysis (for backward compatibility)
        basic_analysis = self.emotion_analyzer.analyze_emotion(message)
        
        # Combine analyses
        combined_analysis = {
            **basic_analysis,
            **deep_analysis,
            'user_context': user_context
        }
        
        # Determine language preference
        language = self._detect_language(message, user_context)
        
        # Generate smart contextual response
        smart_response = self.smart_templates.get_contextual_response(
            combined_analysis, language
        )
        
        # Add follow-up question
        follow_up = self.smart_templates.get_follow_up_question(
            combined_analysis, language
        )
        
        # Combine response and follow-up
        final_response = smart_response
        if follow_up and combined_analysis['severity']['level'] not in ['crisis']:
            final_response += f"\n\n{follow_up}"
        
        # Save interaction for future context
        if user_id:
            emotions_list = list(combined_analysis.get('emotions', {}).keys())
            contexts_list = [k for k, v in combined_analysis.get('cultural_context', {}).items() if v]
            
            self.memory.save_interaction(
                user_id, message, 
                emotions_list[0] if emotions_list else 'neutral',
                contexts_list, final_response
            )
            
            # Update user personality based on interaction
            self._update_user_personality(user_id, combined_analysis, language)
        
        return {
            'response': final_response,
            'analysis': combined_analysis,
            'language': language,
            'personalization_applied': bool(user_context),
            'advanced_features_used': True
        }
    
    def _detect_language(self, message: str, user_context: Dict) -> str:
        """Detect preferred language"""
        # Check user preference first
        if user_context and 'personality' in user_context:
            pref_lang = user_context['personality'].get('preferred_language')
            if pref_lang:
                return pref_lang
        
        # Detect from message
        hindi_chars = ['है', 'हूं', 'का', 'की', 'को', 'में', 'हैं', 'और']
        hinglish_words = ['hai', 'hun', 'kar', 'kya', 'main', 'yaar', 'bhai']
        
        if any(char in message for char in hindi_chars):
            return 'hindi'
        elif any(word in message.lower() for word in hinglish_words):
            return 'hinglish'
        else:
            return 'english'
    
    def _generate_base_response(self, analysis: Dict, strategy: Dict, 
                               language: str, user_context: Dict) -> str:
        """Generate base response using templates"""
        response_strategy = strategy['response_strategy']
        emotion = analysis['dominant_emotion']
        
        # Get appropriate template
        templates = self.response_templates.get(language, {}).get(response_strategy, [])
        
        if not templates:
            # Fallback to general support
            templates = self.response_templates.get(language, {}).get('gentle_support', [
                "I understand how you're feeling. I'm here to help."
            ])
        
        # Select template (can be made smarter with ML)
        template = templates[0] if templates else "I'm here to support you."
        
        # Personalize with user's name or context
        if user_context and 'personality' in user_context:
            # Add personal touch based on communication style
            style = user_context['personality'].get('communication_style', 'casual')
            if style == 'formal' and language == 'hindi':
                template = template.replace('तुम', 'आप').replace('तुम्हें', 'आपको')
        
        return template.format(emotion=emotion)
    
    def _add_contextual_advice(self, base_response: str, analysis: Dict, language: str) -> str:
        """Add context-specific advice"""
        contexts = analysis['contexts']
        
        if not contexts:
            return base_response
        
        # Add advice for the most relevant context
        primary_context = contexts[0]
        advice = self.contextual_advice.get(primary_context, {}).get(language, "")
        
        if advice:
            return f"{base_response}\n\n{advice}"
        
        return base_response
    
    def _add_follow_up(self, response: str, analysis: Dict, language: str, user_context: Dict) -> str:
        """Add appropriate follow-up questions"""
        emotion = analysis['dominant_emotion']
        intensity = analysis['emotion_intensity']
        
        follow_ups = {
            'hindi': {
                'sad': "क्या आप मुझे बताना चाहेंगे कि क्या हुआ था?",
                'anxious': "कौन सी बात आपको सबसे ज्यादा परेशान कर रही है?",
                'angry': "क्या आप बताना चाहेंगे कि किस बात से गुस्सा आया?",
                'stressed': "क्या कोई specific चीज है जो आपको stress दे रही है?"
            },
            'hinglish': {
                'sad': "Kya tum batana chahoge ki kya hua tha?",
                'anxious': "Kya cheez tumhe sabse zyada worry kar rahi hai?",
                'angry': "Kya tum share karna chahoge ki kis baat se gussa aaya?",
                'stressed': "Koi specific cheez hai jo tumhe stress de rahi hai?"
            },
            'english': {
                'sad': "Would you like to share what happened?",
                'anxious': "What's worrying you the most right now?",
                'angry': "Would you like to talk about what made you angry?",
                'stressed': "Is there something specific that's stressing you out?"
            }
        }
        
        follow_up = follow_ups.get(language, {}).get(emotion, "")
        
        if follow_up and intensity in ['medium', 'high']:
            return f"{response}\n\n{follow_up}"
        
        return response
    
    def _update_user_personality(self, user_id: str, analysis: Dict, language: str):
        """Update user personality based on interaction patterns"""
        personality_updates = {
            'preferred_language': language,
            'updated_at': 'CURRENT_TIMESTAMP'
        }
        
        # Update communication style based on regional info
        regional_info = analysis.get('regional_info', {})
        if regional_info.get('primary_region') != 'general':
            personality_updates['communication_style'] = regional_info['primary_region']
        
        # Update emotional patterns
        emotions = analysis.get('emotions', {})
        if emotions:
            emotion_patterns = list(emotions.keys())
            personality_updates['emotional_patterns'] = json.dumps(emotion_patterns)
        
        # Update stress triggers
        cultural_context = analysis.get('cultural_context', {})
        stress_triggers = [k for k, v in cultural_context.items() if v]
        if stress_triggers:
            personality_updates['stress_triggers'] = json.dumps(stress_triggers)
        
        # Update coping preferences based on analysis
        coping_analysis = analysis.get('coping_analysis', {})
        if coping_analysis.get('current_coping'):
            personality_updates['coping_preferences'] = json.dumps(coping_analysis['current_coping'])
        
        self.memory.update_user_personality(user_id, personality_updates)