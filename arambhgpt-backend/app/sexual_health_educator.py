from typing import Dict, List, Tuple
import re

class SexualHealthEducator:
    """Comprehensive sexual health education system for mature, educational discussions"""
    
    def __init__(self):
        # Sexual health education topics
        self.health_topics = {
            'anatomy_education': [
                'male anatomy', 'female anatomy', 'reproductive system', 'sexual organs',
                'penis', 'vagina', 'clitoris', 'prostate', 'cervix', 'uterus',
                'पुरुष अंग', 'महिला अंग', 'प्रजनन तंत्र', 'यौन अंग'
            ],
            'sexual_wellness': [
                'sexual health', 'sexual wellness', 'libido', 'sexual desire',
                'arousal', 'sexual satisfaction', 'sexual function',
                'यौन स्वास्थ्य', 'यौन कल्याण', 'कामेच्छा'
            ],
            'performance_concerns': [
                'performance anxiety', 'premature ejaculation', 'erectile dysfunction',
                'low libido', 'sexual stamina', 'lasting longer', 'performance issues',
                'प्रदर्शन चिंता', 'शीघ्रपतन', 'स्तंभन दोष'
            ],
            'pleasure_education': [
                'orgasm', 'climax', 'sexual pleasure', 'satisfaction', 'arousal',
                'foreplay', 'intimacy', 'sexual techniques', 'pleasure tips',
                'संभोग', 'यौन आनंद', 'संतुष्टि', 'पूर्व क्रीड़ा'
            ],
            'relationship_intimacy': [
                'intimacy', 'sexual communication', 'relationship satisfaction',
                'emotional connection', 'sexual compatibility', 'couple intimacy',
                'अंतरंगता', 'यौन संवाद', 'रिश्ते में संतुष्टि'
            ],
            'contraception_safety': [
                'contraception', 'birth control', 'condoms', 'safe sex',
                'pregnancy prevention', 'STD prevention', 'sexual safety',
                'गर्भनिरोधक', 'जन्म नियंत्रण', 'सुरक्षित यौन संबंध'
            ],
            'sexual_problems': [
                'sexual dysfunction', 'pain during sex', 'vaginismus', 'dyspareunia',
                'sexual disorders', 'sexual health issues',
                'यौन समस्याएं', 'यौन विकार', 'संभोग में दर्द'
            ]
        }
        
        # Age-appropriate response levels
        self.maturity_levels = {
            'basic': ['what is sex', 'sexual education', 'puberty', 'reproduction'],
            'intermediate': ['sexual health', 'contraception', 'safe sex', 'relationships'],
            'advanced': ['sexual techniques', 'performance', 'pleasure', 'intimacy']
        }
        
        # Cultural context patterns
        self.cultural_contexts = {
            'indian_traditional': [
                'arranged marriage', 'first night', 'wedding night', 'marital duties',
                'family planning', 'traditional values'
            ],
            'modern_indian': [
                'dating', 'premarital sex', 'live-in relationship', 'sexual freedom',
                'modern relationships'
            ],
            'conservative_concerns': [
                'family values', 'cultural restrictions', 'social taboos',
                'religious concerns', 'parental approval'
            ]
        }
    
    def analyze_sexual_health_query(self, message: str) -> Dict:
        """Analyze sexual health related queries for educational response"""
        message_lower = message.lower()
        
        analysis = {
            'is_sexual_health_query': False,
            'topic_categories': [],
            'maturity_level': 'basic',
            'cultural_context': [],
            'educational_approach': 'general',
            'requires_medical_disclaimer': False,
            'age_appropriate': True
        }
        
        # Check for sexual health topics
        for category, patterns in self.health_topics.items():
            if any(pattern in message_lower for pattern in patterns):
                analysis['is_sexual_health_query'] = True
                analysis['topic_categories'].append(category)
        
        # Determine maturity level
        for level, indicators in self.maturity_levels.items():
            if any(indicator in message_lower for indicator in indicators):
                analysis['maturity_level'] = level
                break
        
        # Check cultural context
        for context, patterns in self.cultural_contexts.items():
            if any(pattern in message_lower for pattern in patterns):
                analysis['cultural_context'].append(context)
        
        # Determine educational approach
        if analysis['topic_categories']:
            if 'sexual_problems' in analysis['topic_categories']:
                analysis['educational_approach'] = 'medical_focused'
                analysis['requires_medical_disclaimer'] = True
            elif 'pleasure_education' in analysis['topic_categories']:
                analysis['educational_approach'] = 'wellness_focused'
            elif 'anatomy_education' in analysis['topic_categories']:
                analysis['educational_approach'] = 'educational_basic'
            else:
                analysis['educational_approach'] = 'holistic_health'
        
        return analysis
    
    def get_educational_content(self, analysis: Dict, language: str = 'hinglish') -> Dict:
        """Get appropriate educational content based on analysis"""
        topic_categories = analysis.get('topic_categories', [])
        maturity_level = analysis.get('maturity_level', 'basic')
        
        content = {
            'main_response': '',
            'educational_points': [],
            'health_tips': [],
            'when_to_consult_doctor': [],
            'resources': []
        }
        
        # Generate content based on topics
        for category in topic_categories:
            category_content = self._get_category_content(category, maturity_level, language)
            content['main_response'] += category_content['response'] + '\n\n'
            content['educational_points'].extend(category_content.get('points', []))
            content['health_tips'].extend(category_content.get('tips', []))
        
        # Add medical consultation advice
        if analysis.get('requires_medical_disclaimer'):
            content['when_to_consult_doctor'] = self._get_medical_consultation_advice(language)
        
        # Add resources
        content['resources'] = self._get_educational_resources(topic_categories, language)
        
        return content
    
    def _get_category_content(self, category: str, maturity_level: str, language: str) -> Dict:
        """Get content for specific category"""
        content_library = {
            'anatomy_education': {
                'hindi': {
                    'response': "शरीर रचना को समझना यौन स्वास्थ्य का महत्वपूर्ण हिस्सा है। पुरुष और महिला दोनों के reproductive system को समझना जरूरी है।",
                    'points': [
                        "Male और female anatomy की basic जानकारी",
                        "Reproductive organs की functioning",
                        "Sexual response cycle की समझ"
                    ]
                },
                'hinglish': {
                    'response': "Body anatomy samajhna sexual health ka important part hai. Male aur female dono ke reproductive system ko understand karna zaroori hai.",
                    'points': [
                        "Male aur female anatomy ki basic knowledge",
                        "Reproductive organs ki functioning",
                        "Sexual response cycle ki understanding"
                    ]
                },
                'english': {
                    'response': "Understanding body anatomy is an important part of sexual health. It's essential to understand both male and female reproductive systems.",
                    'points': [
                        "Basic knowledge of male and female anatomy",
                        "Understanding reproductive organ functioning",
                        "Knowledge of sexual response cycle"
                    ]
                }
            },
            'sexual_wellness': {
                'hindi': {
                    'response': "यौन कल्याण overall health का हिस्सा है। Healthy lifestyle, proper nutrition, और exercise से sexual wellness improve होती है।",
                    'points': [
                        "Regular exercise से blood circulation बेहतर होता है",
                        "Stress management sexual health के लिए जरूरी है",
                        "Healthy diet libido को बढ़ाता है"
                    ]
                },
                'hinglish': {
                    'response': "Sexual wellness overall health ka part hai. Healthy lifestyle, proper nutrition, aur exercise se sexual wellness improve hoti hai.",
                    'points': [
                        "Regular exercise se blood circulation better hota hai",
                        "Stress management sexual health ke liye zaroori hai",
                        "Healthy diet libido ko badhata hai"
                    ]
                },
                'english': {
                    'response': "Sexual wellness is part of overall health. A healthy lifestyle, proper nutrition, and exercise improve sexual wellness.",
                    'points': [
                        "Regular exercise improves blood circulation",
                        "Stress management is essential for sexual health",
                        "A healthy diet boosts libido"
                    ]
                }
            },
            'performance_concerns': {
                'hindi': {
                    'response': "Performance anxiety बहुत common है। यह psychological और physical दोनों factors से हो सकती है। Relaxation techniques और communication से help मिल सकती है।",
                    'points': [
                        "Performance anxiety mostly psychological होती है",
                        "Deep breathing और relaxation techniques helpful हैं",
                        "Partner के साथ open communication जरूरी है"
                    ]
                },
                'hinglish': {
                    'response': "Performance anxiety bahut common hai. Yeh psychological aur physical dono factors se ho sakti hai. Relaxation techniques aur communication se help mil sakti hai.",
                    'points': [
                        "Performance anxiety mostly psychological hoti hai",
                        "Deep breathing aur relaxation techniques helpful hain",
                        "Partner ke saath open communication zaroori hai"
                    ]
                },
                'english': {
                    'response': "Performance anxiety is very common. It can be caused by both psychological and physical factors. Relaxation techniques and communication can help.",
                    'points': [
                        "Performance anxiety is mostly psychological",
                        "Deep breathing and relaxation techniques are helpful",
                        "Open communication with partner is essential"
                    ]
                }
            },
            'pleasure_education': {
                'hindi': {
                    'response': "Sexual pleasure mutual satisfaction के बारे में है। Foreplay, communication, और patience से better experience मिलता है।",
                    'points': [
                        "Foreplay intimacy बढ़ाता है",
                        "Communication से preferences पता चलती हैं",
                        "Patience और understanding जरूरी है"
                    ]
                },
                'hinglish': {
                    'response': "Sexual pleasure mutual satisfaction ke baare mein hai. Foreplay, communication, aur patience se better experience milta hai.",
                    'points': [
                        "Foreplay intimacy badhata hai",
                        "Communication se preferences pata chalti hain",
                        "Patience aur understanding zaroori hai"
                    ]
                },
                'english': {
                    'response': "Sexual pleasure is about mutual satisfaction. Foreplay, communication, and patience lead to better experiences.",
                    'points': [
                        "Foreplay enhances intimacy",
                        "Communication helps understand preferences",
                        "Patience and understanding are essential"
                    ]
                }
            }
        }
        
        return content_library.get(category, {}).get(language, {
            'response': "This is an important aspect of sexual health that requires understanding and care.",
            'points': ["Consult healthcare professionals for detailed guidance"]
        })
    
    def _get_medical_consultation_advice(self, language: str) -> List[str]:
        """Get medical consultation advice"""
        advice = {
            'hindi': [
                "यदि कोई persistent problem है तो doctor से consult करें",
                "Sexologist या urologist से professional advice लें",
                "Regular health checkups जरूरी हैं"
            ],
            'hinglish': [
                "Agar koi persistent problem hai to doctor se consult karo",
                "Sexologist ya urologist se professional advice lo",
                "Regular health checkups zaroori hain"
            ],
            'english': [
                "Consult a doctor if you have persistent problems",
                "Seek professional advice from a sexologist or urologist",
                "Regular health checkups are important"
            ]
        }
        
        return advice.get(language, advice['english'])
    
    def _get_educational_resources(self, topics: List[str], language: str) -> List[str]:
        """Get educational resources"""
        resources = [
            "WHO Sexual Health Guidelines",
            "American Sexual Health Association",
            "Planned Parenthood Educational Materials",
            "Indian Association of Sexology"
        ]
        
        return resources