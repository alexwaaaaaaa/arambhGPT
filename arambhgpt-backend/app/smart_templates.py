from typing import Dict, List
import random
from .sensitive_response_templates import SensitiveResponseTemplates
from .sensitive_topics_analyzer import SensitiveTopicsAnalyzer
from .comprehensive_wellness_system import ComprehensiveWellnessSystem

class SmartResponseTemplates:
    """Smart response templates with cultural and contextual awareness"""
    
    def __init__(self):
        self.sensitive_templates = SensitiveResponseTemplates()
        self.sensitive_analyzer = SensitiveTopicsAnalyzer()
        self.wellness_system = ComprehensiveWellnessSystem()
        # Crisis intervention templates
        self.crisis_templates = {
            'hindi': [
                "मैं समझ सकती हूं कि आप बहुत मुश्किल दौर से गुजर रहे हैं। आप अकेले नहीं हैं। कृपया किसी professional से बात करें - National Suicide Prevention Helpline: 9152987821",
                "आपकी जिंदगी बहुत कीमती है। यह दर्द temporary है। Please तुरंत किसी counselor या doctor से मिलें।"
            ],
            'hinglish': [
                "Yaar, main samajh sakti hun ki tum bahut tough phase se guzar rahe ho. But please remember, tum akele nahi ho. Immediately kisi professional se baat karo - Helpline: 9152987821",
                "Tumhari life precious hai yaar. Yeh pain temporary hai. Please abhi ke abhi kisi counselor se contact karo."
            ],
            'english': [
                "I understand you're going through an extremely difficult time. You're not alone. Please reach out to a mental health professional immediately - National Suicide Prevention Helpline: 9152987821",
                "Your life is precious. This pain is temporary. Please contact a counselor or therapist right away."
            ]
        }
        
        # Family pressure templates
        self.family_pressure_templates = {
            'hindi': [
                "परिवारिक दबाव से निपटना बहुत मुश्किल होता है। आपकी feelings valid हैं। क्या आप चाहते हैं कि हम इस बारे में detail में बात करें?",
                "मैं समझ सकती हूं कि घर वाले कभी-कभी समझ नहीं पाते। आप अपनी boundaries set कर सकते हैं।"
            ],
            'hinglish': [
                "Family pressure handle karna bahut tough hota hai yaar. Tumhari feelings bilkul valid hain. Kya tum chahte ho ki hum iske baare mein detail mein discuss karein?",
                "Main samajh sakti hun ki ghar wale kabhi kabhi samjhte nahi. Tum apni boundaries set kar sakte ho."
            ],
            'english': [
                "Dealing with family pressure can be incredibly challenging. Your feelings are completely valid. Would you like to discuss this in more detail?",
                "I understand that family members sometimes don't understand. You have the right to set healthy boundaries."
            ]
        }
        
        # Career stress templates
        self.career_templates = {
            'hindi': [
                "करियर की tension आजकल बहुत common है। Competition तो है, लेकिन आप अपनी pace में grow कर सकते हैं।",
                "Job market tough है, लेकिन आप हार मत मानिए। Skills develop करते रहिए और opportunities आएंगी।"
            ],
            'hinglish': [
                "Career ki tension toh aajkal sabko hoti hai yaar. Competition hai, but tum apne pace mein grow kar sakte ho.",
                "Job market tough hai, but don't give up. Skills develop karte raho, opportunities zaroor aayengi."
            ],
            'english': [
                "Career stress is very common these days. While competition exists, you can grow at your own pace.",
                "The job market is challenging, but don't give up. Keep developing your skills and opportunities will come."
            ]
        }
        
        # Relationship advice templates
        self.relationship_templates = {
            'hindi': [
                "रिश्तों में problems होना normal है। Communication और understanding से बहुत कुछ solve हो सकता है।",
                "Breakup का दर्द बहुत होता है। Time लगेगा heal होने में, लेकिन आप strong हैं।"
            ],
            'hinglish': [
                "Relationships mein problems hona normal hai yaar. Communication aur understanding se bahut kuch solve ho sakta hai.",
                "Breakup ka pain bahut hota hai. Time lagega heal hone mein, but tum strong ho."
            ],
            'english': [
                "Problems in relationships are normal. Many things can be resolved through communication and understanding.",
                "Breakup pain is intense. It will take time to heal, but you are strong."
            ]
        }
        
        # Regional specific templates
        self.regional_templates = {
            'punjabi': {
                'support': "Yaar, tension na le. Sab theek ho jayega. Main hun na tere saath.",
                'motivation': "Chak de phatte! Tu kar sakta hai. Himmat rakh."
            },
            'gujarati': {
                'support': "Bhai, fikar na kar. Sab saras thase. Hu chu tara saath mein.",
                'motivation': "Dhiraj rakh bhai. Tu kari sakish."
            },
            'marathi': {
                'support': "Arre, tension gheun nako. Sarvakahi bara hoil. Mi aahe tujhya sobat.",
                'motivation': "Himmat thev. Tu karu shaktos."
            }
        }
        
        # Coping mechanism suggestions
        self.coping_suggestions = {
            'hindi': {
                'breathing': "गहरी सांस लेने की technique try करिए: 4 count में सांस लें, 4 count रोकें, 4 count में छोड़ें।",
                'grounding': "5-4-3-2-1 technique करिए: 5 चीजें देखिए, 4 सुनिए, 3 छूकर feel करिए, 2 smell करिए, 1 taste करिए।",
                'physical': "थोड़ी walk करिए या light exercise। Physical activity से mood better होता है।"
            },
            'hinglish': {
                'breathing': "Deep breathing try karo: 4 count mein breathe in, 4 count hold, 4 count mein breathe out.",
                'grounding': "5-4-3-2-1 technique karo: 5 cheezein dekho, 4 suno, 3 touch karo, 2 smell karo, 1 taste karo.",
                'physical': "Thodi walk karo ya light exercise. Physical activity se mood better hota hai."
            },
            'english': {
                'breathing': "Try deep breathing: Breathe in for 4 counts, hold for 4, breathe out for 4.",
                'grounding': "Use the 5-4-3-2-1 technique: See 5 things, hear 4, touch 3, smell 2, taste 1.",
                'physical': "Take a short walk or do light exercise. Physical activity improves mood."
            }
        }
    
    def get_contextual_response(self, analysis: Dict, language: str = 'hinglish') -> str:
        """Get contextual response based on analysis"""
        response_parts = []
        
        # Handle comprehensive wellness queries first
        sexual_health = analysis.get('sexual_health', {})
        if sexual_health.get('is_sexual_health_query'):
            # Use comprehensive wellness system for sexual health queries
            comprehensive_analysis = self.wellness_system.analyze_comprehensive_query(str(analysis))
            comprehensive_response = self.wellness_system.generate_comprehensive_response(
                comprehensive_analysis, language
            )
            
            # Add follow-up suggestions
            follow_ups = self.wellness_system.get_follow_up_suggestions(comprehensive_analysis, language)
            if follow_ups:
                follow_up_text = '\n\n🤔 ' + ' | '.join(follow_ups[:2])
                comprehensive_response += follow_up_text
            
            return comprehensive_response
        
        # Handle sensitive content
        sensitive_content = analysis.get('sensitive_content', {})
        if sensitive_content.get('contains_sensitive_content'):
            sensitive_response = self.sensitive_templates.get_sensitive_response(sensitive_content, language)
            
            # Add professional resources if needed
            if sensitive_content.get('requires_professional_help'):
                resources = self.sensitive_analyzer.get_professional_resources(
                    sensitive_content.get('topic_categories', []), language
                )
                professional_help = self.sensitive_templates.get_professional_help_message(resources, language)
                return f"{sensitive_response}\n\n{professional_help}"
            
            return sensitive_response
        
        # Handle crisis situations
        if analysis['severity']['level'] == 'crisis':
            crisis_response = random.choice(self.crisis_templates.get(language, self.crisis_templates['english']))
            return crisis_response
        
        # Handle specific cultural contexts
        emotions = analysis.get('emotions', {})
        cultural_context = analysis.get('cultural_context', {})
        
        # Family pressure
        if 'family_stress' in emotions and cultural_context.get('family_dynamics'):
            family_response = random.choice(self.family_pressure_templates.get(language, self.family_pressure_templates['english']))
            response_parts.append(family_response)
        
        # Career stress
        if 'career_anxiety' in emotions and cultural_context.get('career_pressure'):
            career_response = random.choice(self.career_templates.get(language, self.career_templates['english']))
            response_parts.append(career_response)
        
        # Relationship issues
        if 'relationship_issues' in emotions:
            relationship_response = random.choice(self.relationship_templates.get(language, self.relationship_templates['english']))
            response_parts.append(relationship_response)
        
        # Add regional touch if detected
        regional_info = analysis.get('regional_info', {})
        if regional_info.get('primary_region') != 'general':
            region = regional_info['primary_region']
            if region in self.regional_templates:
                regional_response = self.regional_templates[region]['support']
                response_parts.append(regional_response)
        
        # Add coping suggestions if needed
        if analysis['severity']['level'] in ['medium', 'high']:
            coping_suggestion = self._get_coping_suggestion(analysis, language)
            if coping_suggestion:
                response_parts.append(coping_suggestion)
        
        # Combine responses
        if response_parts:
            return "\n\n".join(response_parts)
        else:
            # Default supportive response
            default_responses = {
                'hindi': "मैं यहां आपकी मदद के लिए हूं। आप जो भी feel कर रहे हैं, वो valid है।",
                'hinglish': "Main yahan hun tumhari help ke liye. Jo bhi tum feel kar rahe ho, woh valid hai.",
                'english': "I'm here to help you. Whatever you're feeling is valid."
            }
            return default_responses.get(language, default_responses['english'])
    
    def _get_coping_suggestion(self, analysis: Dict, language: str) -> str:
        """Get appropriate coping mechanism suggestion"""
        coping_analysis = analysis.get('coping_analysis', {})
        
        # If user is using unhealthy coping mechanisms
        if coping_analysis.get('needs_guidance'):
            suggestions = []
            
            # Add breathing technique
            suggestions.append(self.coping_suggestions[language]['breathing'])
            
            # Add grounding technique for anxiety
            if 'career_anxiety' in analysis.get('emotions', {}):
                suggestions.append(self.coping_suggestions[language]['grounding'])
            
            # Add physical activity suggestion
            suggestions.append(self.coping_suggestions[language]['physical'])
            
            return random.choice(suggestions)
        
        return ""
    
    def get_follow_up_question(self, analysis: Dict, language: str = 'hinglish') -> str:
        """Get appropriate follow-up question"""
        emotions = analysis.get('emotions', {})
        
        follow_ups = {
            'hindi': {
                'family_stress': "क्या आप बताना चाहेंगे कि परिवार की तरफ से कैसा pressure आ रहा है?",
                'career_anxiety': "आपको career में सबसे ज्यादा कौन सी चीज worry कर रही है?",
                'relationship_issues': "क्या आप इस relationship issue के बारे में और बताना चाहेंगे?",
                'social_pressure': "समाज का pressure आपको कैसे affect कर रहा है?"
            },
            'hinglish': {
                'family_stress': "Kya tum batana chahoge ki family ki taraf se kaisa pressure aa raha hai?",
                'career_anxiety': "Career mein tumhe sabse zyada kya worry kar raha hai?",
                'relationship_issues': "Kya tum is relationship issue ke baare mein aur batana chahoge?",
                'social_pressure': "Society ka pressure tumhe kaise affect kar raha hai?"
            },
            'english': {
                'family_stress': "Would you like to share more about the family pressure you're experiencing?",
                'career_anxiety': "What aspect of your career is worrying you the most?",
                'relationship_issues': "Would you like to talk more about this relationship issue?",
                'social_pressure': "How is social pressure affecting you?"
            }
        }
        
        # Get the most relevant follow-up
        for emotion_type in emotions.keys():
            if emotion_type in follow_ups[language]:
                return follow_ups[language][emotion_type]
        
        # Default follow-up
        defaults = {
            'hindi': "क्या आप इसके बारे में और detail में बताना चाहेंगे?",
            'hinglish': "Kya tum iske baare mein aur detail mein batana chahoge?",
            'english': "Would you like to share more details about this?"
        }
        
        return defaults.get(language, defaults['english'])