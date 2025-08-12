from typing import Dict, List, Tuple
import re

class CulturalContextAnalyzer:
    """Understanding Indian perspectives on sexuality and relationships"""
    
    def __init__(self):
        # Indian cultural contexts for sexuality
        self.cultural_contexts = {
            'traditional_values': [
                'family values', 'traditional marriage', 'arranged marriage', 'joint family',
                'cultural restrictions', 'religious beliefs', 'conservative family',
                'पारंपरिक मूल्य', 'पारिवारिक मर्यादा', 'धार्मिक मान्यता'
            ],
            'modern_indian_values': [
                'modern relationship', 'dating culture', 'live-in relationship', 'career first',
                'independent choice', 'western influence', 'urban lifestyle',
                'आधुनिक रिश्ते', 'स्वतंत्र विकल्प', 'शहरी जीवनशैली'
            ],
            'social_taboos': [
                'society judgment', 'log kya kahenge', 'reputation concern', 'family honor',
                'social stigma', 'community pressure', 'gossip fear',
                'समाज का डर', 'लोग क्या कहेंगे', 'इज्जत का सवाल'
            ],
            'generational_conflicts': [
                'generation gap', 'parents don\'t understand', 'old vs new thinking',
                'traditional vs modern', 'family expectations', 'cultural clash',
                'पीढ़ियों का अंतर', 'पुराने और नए विचार', 'पारिवारिक अपेक्षाएं'
            ],
            'gender_specific_issues': [
                'women empowerment', 'male dominance', 'gender roles', 'patriarchal society',
                'women safety', 'sexual autonomy', 'consent culture',
                'महिला सशक्तिकरण', 'लैंगिक भूमिकाएं', 'पितृसत्तात्मक समाज'
            ],
            'regional_differences': [
                'north indian culture', 'south indian values', 'metro vs rural',
                'urban vs village', 'state specific customs', 'regional traditions',
                'उत्तर भारतीय संस्कृति', 'दक्षिण भारतीय मूल्य', 'शहरी बनाम ग्रामीण'
            ]
        }
        
        # Cultural challenges in sexual health
        self.cultural_challenges = {
            'communication_barriers': [
                'can\'t talk to parents', 'family won\'t understand', 'shame discussing sex',
                'cultural silence', 'taboo topics', 'conservative upbringing',
                'माता-पिता से बात नहीं कर सकते', 'शर्म की बात', 'वर्जित विषय'
            ],
            'marriage_pressure': [
                'marriage pressure', 'biological clock', 'family expectations',
                'suitable boy/girl', 'caste considerations', 'dowry issues',
                'शादी का दबाव', 'जाति की समस्या', 'दहेज की समस्या'
            ],
            'sexual_education_gaps': [
                'no sex education', 'lack of awareness', 'myths and misconceptions',
                'religious restrictions', 'cultural ignorance', 'taboo subjects',
                'यौन शिक्षा की कमी', 'भ्रांतियां', 'धार्मिक पाबंदियां'
            ]
        }
        
        # Cultural solutions and approaches
        self.cultural_solutions = {
            'respectful_communication': [
                'gradual family education', 'finding supportive relatives',
                'using cultural examples', 'religious context', 'health perspective',
                'धीरे-धीरे परिवार को समझाना', 'सहायक रिश्तेदार', 'स्वास्थ्य के नजरिए से'
            ],
            'balancing_traditions': [
                'respecting values while being modern', 'finding middle ground',
                'cultural adaptation', 'selective modernization', 'family harmony',
                'परंपरा और आधुनिकता का संतुलन', 'पारिवारिक सामंजस्य'
            ],
            'community_support': [
                'finding like-minded people', 'support groups', 'counseling services',
                'online communities', 'professional help', 'peer support',
                'समान विचारधारा वाले लोग', 'सहायता समूह', 'व्यावसायिक मदद'
            ]
        }
        
        # Regional cultural nuances
        self.regional_nuances = {
            'north_indian': {
                'characteristics': ['joint family system', 'traditional gender roles', 'arranged marriages'],
                'challenges': ['conservative mindset', 'family interference', 'social pressure'],
                'approaches': ['family elder involvement', 'gradual change', 'respect for traditions']
            },
            'south_indian': {
                'characteristics': ['education focused', 'cultural pride', 'traditional values'],
                'challenges': ['caste considerations', 'family honor', 'conservative views'],
                'approaches': ['education-based discussions', 'cultural context', 'family respect']
            },
            'metro_cities': {
                'characteristics': ['modern outlook', 'career focused', 'individual freedom'],
                'challenges': ['work-life balance', 'relationship complexity', 'family distance'],
                'approaches': ['professional counseling', 'peer support', 'modern solutions']
            },
            'rural_areas': {
                'characteristics': ['traditional values', 'community influence', 'limited resources'],
                'challenges': ['lack of awareness', 'social taboos', 'limited healthcare'],
                'approaches': ['community health workers', 'traditional healers', 'gradual education']
            }
        }
    
    def analyze_cultural_context(self, message: str, user_context: Dict = None) -> Dict:
        """Analyze cultural context in user's message"""
        message_lower = message.lower()
        
        analysis = {
            'cultural_contexts': [],
            'cultural_challenges': [],
            'regional_context': 'general',
            'traditional_vs_modern': 'balanced',
            'family_involvement_level': 'medium',
            'social_pressure_level': 'medium',
            'cultural_sensitivity_needed': False,
            'recommended_approach': []
        }
        
        # Identify cultural contexts
        for context, patterns in self.cultural_contexts.items():
            if any(pattern in message_lower for pattern in patterns):
                analysis['cultural_contexts'].append(context)
                analysis['cultural_sensitivity_needed'] = True
        
        # Identify cultural challenges
        for challenge, patterns in self.cultural_challenges.items():
            if any(pattern in message_lower for pattern in patterns):
                analysis['cultural_challenges'].append(challenge)
        
        # Determine traditional vs modern leaning
        traditional_indicators = ['family values', 'arranged marriage', 'traditional', 'conservative']
        modern_indicators = ['modern', 'independent', 'dating', 'career', 'western']
        
        traditional_count = sum(1 for indicator in traditional_indicators if indicator in message_lower)
        modern_count = sum(1 for indicator in modern_indicators if indicator in message_lower)
        
        if traditional_count > modern_count:
            analysis['traditional_vs_modern'] = 'traditional'
        elif modern_count > traditional_count:
            analysis['traditional_vs_modern'] = 'modern'
        
        # Determine family involvement level
        family_indicators = ['family', 'parents', 'relatives', 'joint family', 'ghar wale']
        family_mentions = sum(1 for indicator in family_indicators if indicator in message_lower)
        
        if family_mentions >= 3:
            analysis['family_involvement_level'] = 'high'
        elif family_mentions >= 1:
            analysis['family_involvement_level'] = 'medium'
        else:
            analysis['family_involvement_level'] = 'low'
        
        # Determine social pressure level
        pressure_indicators = ['society', 'log kya kahenge', 'reputation', 'judgment', 'pressure']
        pressure_mentions = sum(1 for indicator in pressure_indicators if indicator in message_lower)
        
        if pressure_mentions >= 2:
            analysis['social_pressure_level'] = 'high'
        elif pressure_mentions >= 1:
            analysis['social_pressure_level'] = 'medium'
        
        # Recommend cultural approach
        analysis['recommended_approach'] = self._get_cultural_approach(analysis)
        
        return analysis
    
    def _get_cultural_approach(self, analysis: Dict) -> List[str]:
        """Get culturally appropriate approach recommendations"""
        approaches = []
        
        if analysis['traditional_vs_modern'] == 'traditional':
            approaches.extend(['respect_family_values', 'gradual_education', 'cultural_context'])
        elif analysis['traditional_vs_modern'] == 'modern':
            approaches.extend(['direct_communication', 'professional_help', 'peer_support'])
        else:
            approaches.extend(['balanced_approach', 'family_respect', 'modern_solutions'])
        
        if analysis['family_involvement_level'] == 'high':
            approaches.append('family_inclusive_approach')
        
        if analysis['social_pressure_level'] == 'high':
            approaches.extend(['privacy_focused', 'discrete_help', 'social_support'])
        
        return approaches
    
    def get_cultural_guidance(self, analysis: Dict, language: str = 'hinglish') -> Dict:
        """Get culturally sensitive guidance"""
        contexts = analysis.get('cultural_contexts', [])
        challenges = analysis.get('cultural_challenges', [])
        approach = analysis.get('recommended_approach', [])
        
        guidance = {
            'cultural_understanding': '',
            'sensitive_advice': [],
            'family_communication_tips': [],
            'social_navigation': [],
            'cultural_resources': []
        }
        
        # Generate cultural understanding
        guidance['cultural_understanding'] = self._get_cultural_understanding(contexts, language)
        
        # Add sensitive advice
        guidance['sensitive_advice'] = self._get_sensitive_advice(challenges, language)
        
        # Add family communication tips
        if 'family_inclusive_approach' in approach:
            guidance['family_communication_tips'] = self._get_family_communication_tips(language)
        
        # Add social navigation advice
        if analysis.get('social_pressure_level') == 'high':
            guidance['social_navigation'] = self._get_social_navigation_tips(language)
        
        # Add cultural resources
        guidance['cultural_resources'] = self._get_cultural_resources(language)
        
        return guidance
    
    def _get_cultural_understanding(self, contexts: List[str], language: str) -> str:
        """Get cultural understanding message"""
        understanding_messages = {
            'hindi': {
                'traditional_values': "मैं समझ सकती हूं कि पारंपरिक मूल्यों और आधुनिक विचारों के बीच संतुलन बनाना कठिन है। आपकी cultural background को respect करते हुए, healthy approach अपना सकते हैं।",
                'social_taboos': "समाज के डर और judgment का सामना करना मुश्किल है। लेकिन आपकी health और happiness भी important है। धीरे-धीरे positive changes ला सकते हैं।",
                'generational_conflicts': "Generation gap की वजह से family के साथ communication में problem होना natural है। Patience और understanding से इसे handle कर सकते हैं।"
            },
            'hinglish': {
                'traditional_values': "Main samajh sakti hun ki traditional values aur modern thoughts ke beech balance banana tough hai. Tumhari cultural background ko respect karte hue, healthy approach apna sakte hain.",
                'social_taboos': "Society ke dar aur judgment ka samna karna mushkil hai. Lekin tumhari health aur happiness bhi important hai. Dhire-dhire positive changes la sakte hain.",
                'generational_conflicts': "Generation gap ki wajah se family ke saath communication mein problem hona natural hai. Patience aur understanding se ise handle kar sakte hain."
            },
            'english': {
                'traditional_values': "I understand it's challenging to balance traditional values with modern thoughts. While respecting your cultural background, we can adopt a healthy approach.",
                'social_taboos': "Facing societal fear and judgment is difficult. But your health and happiness are also important. We can gradually bring positive changes.",
                'generational_conflicts': "Having communication problems with family due to generation gap is natural. This can be handled with patience and understanding."
            }
        }
        
        if contexts:
            primary_context = contexts[0]
            return understanding_messages[language].get(primary_context, 
                understanding_messages[language].get('traditional_values', ''))
        
        default_messages = {
            'hindi': "मैं आपकी cultural background को समझती हूं और respect करती हूं। हम एक balanced approach अपना सकते हैं।",
            'hinglish': "Main tumhari cultural background ko samajhti hun aur respect karti hun. Hum ek balanced approach apna sakte hain.",
            'english': "I understand and respect your cultural background. We can adopt a balanced approach."
        }
        
        return default_messages.get(language, default_messages['english'])
    
    def _get_sensitive_advice(self, challenges: List[str], language: str) -> List[str]:
        """Get culturally sensitive advice"""
        advice = {
            'hindi': {
                'communication_barriers': [
                    "Family के साथ direct sexual topics discuss करना uncomfortable हो सकता है। Health के perspective से approach करें।",
                    "Trusted family member या elder cousin से बात कर सकते हैं।",
                    "Professional counselor से help लें जो cultural context समझते हों।"
                ],
                'marriage_pressure': [
                    "Marriage pressure handle करना tough है। अपनी readiness और concerns clearly communicate करें।",
                    "Family को समझाएं कि healthy relationship के लिए time चाहिए।",
                    "Professional pre-marital counseling suggest कर सकते हैं।"
                ],
                'sexual_education_gaps': [
                    "Proper sexual education की कमी common problem है। Reliable sources से information लें।",
                    "Myths और misconceptions को clear करना जरूरी है।",
                    "Healthcare professionals से guidance लें।"
                ]
            },
            'hinglish': {
                'communication_barriers': [
                    "Family ke saath direct sexual topics discuss karna uncomfortable ho sakta hai. Health ke perspective se approach karo.",
                    "Trusted family member ya elder cousin se baat kar sakte ho.",
                    "Professional counselor se help lo jo cultural context samjhte hon."
                ],
                'marriage_pressure': [
                    "Marriage pressure handle karna tough hai. Apni readiness aur concerns clearly communicate karo.",
                    "Family ko samjhao ki healthy relationship ke liye time chahiye.",
                    "Professional pre-marital counseling suggest kar sakte ho."
                ],
                'sexual_education_gaps': [
                    "Proper sexual education ki kami common problem hai. Reliable sources se information lo.",
                    "Myths aur misconceptions ko clear karna zaroori hai.",
                    "Healthcare professionals se guidance lo."
                ]
            },
            'english': {
                'communication_barriers': [
                    "Discussing sexual topics directly with family can be uncomfortable. Approach from a health perspective.",
                    "You can talk to a trusted family member or elder cousin.",
                    "Seek help from professional counselors who understand cultural context."
                ],
                'marriage_pressure': [
                    "Handling marriage pressure is tough. Clearly communicate your readiness and concerns.",
                    "Explain to family that healthy relationships need time.",
                    "You can suggest professional pre-marital counseling."
                ],
                'sexual_education_gaps': [
                    "Lack of proper sexual education is a common problem. Get information from reliable sources.",
                    "It's important to clear myths and misconceptions.",
                    "Seek guidance from healthcare professionals."
                ]
            }
        }
        
        advice_list = []
        for challenge in challenges:
            if challenge in advice[language]:
                advice_list.extend(advice[language][challenge])
        
        return advice_list[:3]  # Return top 3 pieces of advice
    
    def _get_family_communication_tips(self, language: str) -> List[str]:
        """Get family communication tips"""
        tips = {
            'hindi': [
                "Health और wellness के angle से बात करें, sexual details में न जाएं",
                "Trusted family elder को mediator बनाएं",
                "Gradual approach अपनाएं, एक साथ सब कुछ न कहें",
                "Cultural examples और religious context use करें",
                "Doctor की advice का reference दें"
            ],
            'hinglish': [
                "Health aur wellness ke angle se baat karo, sexual details mein na jao",
                "Trusted family elder ko mediator banao",
                "Gradual approach apnao, ek saath sab kuch na kaho",
                "Cultural examples aur religious context use karo",
                "Doctor ki advice ka reference do"
            ],
            'english': [
                "Approach from health and wellness angle, avoid sexual details",
                "Make a trusted family elder a mediator",
                "Adopt a gradual approach, don't say everything at once",
                "Use cultural examples and religious context",
                "Reference doctor's advice"
            ]
        }
        
        return tips.get(language, tips['english'])
    
    def _get_social_navigation_tips(self, language: str) -> List[str]:
        """Get social navigation tips"""
        tips = {
            'hindi': [
                "Privacy maintain करें, सबको सब कुछ बताने की जरूरत नहीं",
                "Supportive friends circle बनाएं",
                "Online communities में anonymous help ले सकते हैं",
                "Professional counseling confidential होती है",
                "अपनी mental health को priority दें"
            ],
            'hinglish': [
                "Privacy maintain karo, sabko sab kuch batane ki zaroorat nahi",
                "Supportive friends circle banao",
                "Online communities mein anonymous help le sakte ho",
                "Professional counseling confidential hoti hai",
                "Apni mental health ko priority do"
            ],
            'english': [
                "Maintain privacy, no need to tell everyone everything",
                "Build a supportive circle of friends",
                "You can get anonymous help in online communities",
                "Professional counseling is confidential",
                "Prioritize your mental health"
            ]
        }
        
        return tips.get(language, tips['english'])
    
    def _get_cultural_resources(self, language: str) -> List[str]:
        """Get cultural resources"""
        resources = {
            'hindi': [
                "Indian Association of Sexology - culturally sensitive professionals",
                "Vandrevala Foundation - mental health support",
                "Local NGOs working on sexual health awareness",
                "Online platforms like Practo for finding doctors",
                "Cultural counseling centers in major cities"
            ],
            'hinglish': [
                "Indian Association of Sexology - culturally sensitive professionals",
                "Vandrevala Foundation - mental health support",
                "Local NGOs working on sexual health awareness",
                "Online platforms like Practo for finding doctors",
                "Cultural counseling centers in major cities"
            ],
            'english': [
                "Indian Association of Sexology - culturally sensitive professionals",
                "Vandrevala Foundation - mental health support",
                "Local NGOs working on sexual health awareness",
                "Online platforms like Practo for finding doctors",
                "Cultural counseling centers in major cities"
            ]
        }
        
        return resources.get(language, resources['english'])