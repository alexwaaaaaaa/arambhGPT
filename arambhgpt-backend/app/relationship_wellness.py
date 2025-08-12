from typing import Dict, List, Tuple
import re

class RelationshipWellnessSupport:
    """Comprehensive relationship wellness and intimacy support system"""
    
    def __init__(self):
        # Relationship wellness topics
        self.relationship_topics = {
            'communication_skills': [
                'communication problems', 'not talking', 'misunderstanding', 'arguments',
                'partner doesn\'t listen', 'can\'t express feelings', 'communication gap',
                'बात नहीं करते', 'गलतफहमी', 'बहस', 'संवाद की समस्या'
            ],
            'emotional_intimacy': [
                'emotional connection', 'feeling distant', 'not close anymore', 'emotional intimacy',
                'partner doesn\'t understand', 'feeling disconnected', 'emotional gap',
                'भावनात्मक दूरी', 'रिश्ते में दूरी', 'समझ नहीं आता'
            ],
            'physical_intimacy': [
                'physical intimacy', 'sexual compatibility', 'intimacy issues', 'bedroom problems',
                'physical connection', 'romance missing', 'no physical affection',
                'शारीरिक निकटता', 'रोमांस नहीं', 'स्पर्श की कमी'
            ],
            'trust_issues': [
                'trust issues', 'don\'t trust partner', 'betrayal', 'cheating', 'infidelity',
                'suspicious', 'jealousy', 'insecurity', 'doubt',
                'भरोसे की कमी', 'धोखा', 'शक', 'ईर्ष्या'
            ],
            'conflict_resolution': [
                'always fighting', 'constant arguments', 'can\'t resolve issues', 'disagreements',
                'conflict resolution', 'compromise problems', 'stubborn partner',
                'हमेशा लड़ाई', 'झगड़े', 'समझौता नहीं'
            ],
            'relationship_stages': [
                'new relationship', 'long distance', 'living together', 'marriage problems',
                'engagement issues', 'commitment problems', 'relationship goals',
                'नया रिश्ता', 'शादी की समस्या', 'प्रतिबद्धता'
            ]
        }
        
        # Indian cultural relationship contexts
        self.cultural_contexts = {
            'arranged_marriage': [
                'arranged marriage', 'family arranged', 'getting to know spouse',
                'arranged relationship', 'family pressure marriage',
                'व्यवस्थित विवाह', 'पारिवारिक विवाह'
            ],
            'love_marriage': [
                'love marriage', 'family opposition', 'convincing parents',
                'inter-caste marriage', 'different religion',
                'प्रेम विवाह', 'परिवार का विरोध'
            ],
            'premarital_relationship': [
                'dating', 'boyfriend girlfriend', 'premarital relationship',
                'live-in relationship', 'commitment before marriage',
                'शादी से पहले रिश्ता', 'लिव-इन'
            ],
            'joint_family_issues': [
                'joint family problems', 'in-laws issues', 'family interference',
                'privacy issues', 'extended family pressure',
                'संयुक्त परिवार', 'सास-ससुर', 'पारिवारिक हस्तक्षेप'
            ]
        }
        
        # Relationship wellness strategies
        self.wellness_strategies = {
            'communication_improvement': [
                'active listening', 'expressing feelings clearly', 'non-violent communication',
                'regular check-ins', 'honest conversations', 'empathy building'
            ],
            'intimacy_building': [
                'quality time together', 'physical affection', 'emotional sharing',
                'surprise gestures', 'date nights', 'shared activities'
            ],
            'trust_building': [
                'transparency', 'keeping promises', 'consistent behavior',
                'open communication', 'rebuilding trust', 'patience'
            ],
            'conflict_management': [
                'healthy arguing', 'compromise', 'finding middle ground',
                'taking breaks', 'focusing on solutions', 'respect boundaries'
            ]
        }
    
    def analyze_relationship_query(self, message: str) -> Dict:
        """Analyze relationship wellness queries"""
        message_lower = message.lower()
        
        analysis = {
            'is_relationship_query': False,
            'relationship_topics': [],
            'cultural_context': [],
            'relationship_stage': 'general',
            'urgency_level': 'normal',
            'support_type_needed': [],
            'wellness_focus': []
        }
        
        # Check for relationship topics
        for topic, patterns in self.relationship_topics.items():
            if any(pattern in message_lower for pattern in patterns):
                analysis['is_relationship_query'] = True
                analysis['relationship_topics'].append(topic)
        
        # Check cultural context
        for context, patterns in self.cultural_contexts.items():
            if any(pattern in message_lower for pattern in patterns):
                analysis['cultural_context'].append(context)
        
        # Determine support type needed
        if analysis['relationship_topics']:
            for topic in analysis['relationship_topics']:
                if topic in ['communication_skills', 'conflict_resolution']:
                    analysis['support_type_needed'].append('communication_coaching')
                elif topic in ['emotional_intimacy', 'physical_intimacy']:
                    analysis['support_type_needed'].append('intimacy_guidance')
                elif topic in ['trust_issues']:
                    analysis['support_type_needed'].append('trust_rebuilding')
        
        # Determine wellness focus
        analysis['wellness_focus'] = self._determine_wellness_focus(analysis['relationship_topics'])
        
        return analysis
    
    def _determine_wellness_focus(self, topics: List[str]) -> List[str]:
        """Determine wellness focus areas"""
        focus_areas = []
        
        if any(topic in ['communication_skills', 'conflict_resolution'] for topic in topics):
            focus_areas.append('communication_enhancement')
        
        if any(topic in ['emotional_intimacy', 'physical_intimacy'] for topic in topics):
            focus_areas.append('intimacy_development')
        
        if any(topic in ['trust_issues'] for topic in topics):
            focus_areas.append('trust_restoration')
        
        if any(topic in ['relationship_stages'] for topic in topics):
            focus_areas.append('relationship_growth')
        
        return focus_areas if focus_areas else ['general_relationship_support']
    
    def get_relationship_guidance(self, analysis: Dict, language: str = 'hinglish') -> Dict:
        """Get comprehensive relationship guidance"""
        topics = analysis.get('relationship_topics', [])
        cultural_context = analysis.get('cultural_context', [])
        
        guidance = {
            'main_advice': '',
            'practical_tips': [],
            'communication_strategies': [],
            'cultural_considerations': [],
            'action_steps': []
        }
        
        # Generate main advice based on topics
        for topic in topics:
            topic_guidance = self._get_topic_guidance(topic, language)
            guidance['main_advice'] += topic_guidance['advice'] + '\n\n'
            guidance['practical_tips'].extend(topic_guidance.get('tips', []))
        
        # Add cultural considerations
        if cultural_context:
            guidance['cultural_considerations'] = self._get_cultural_guidance(cultural_context, language)
        
        # Add communication strategies
        guidance['communication_strategies'] = self._get_communication_strategies(topics, language)
        
        # Add action steps
        guidance['action_steps'] = self._get_action_steps(topics, language)
        
        return guidance
    
    def _get_topic_guidance(self, topic: str, language: str) -> Dict:
        """Get guidance for specific relationship topic"""
        guidance_library = {
            'communication_skills': {
                'hindi': {
                    'advice': "Communication relationship की foundation है। Active listening practice करें - partner की बात पूरी सुनें बिना interrupt किए। अपनी feelings clearly express करें, blame game avoid करें।",
                    'tips': [
                        "Daily 15 minutes quality conversation time निकालें",
                        "'I' statements use करें 'You' statements के बजाय",
                        "Phone/TV off करके बात करें"
                    ]
                },
                'hinglish': {
                    'advice': "Communication relationship ki foundation hai. Active listening practice karo - partner ki baat poori suno bina interrupt kiye. Apni feelings clearly express karo, blame game avoid karo.",
                    'tips': [
                        "Daily 15 minutes quality conversation time nikalo",
                        "'I' statements use karo 'You' statements ke bajay",
                        "Phone/TV off karke baat karo"
                    ]
                },
                'english': {
                    'advice': "Communication is the foundation of relationships. Practice active listening - listen to your partner completely without interrupting. Express your feelings clearly and avoid blame games.",
                    'tips': [
                        "Set aside 15 minutes daily for quality conversation",
                        "Use 'I' statements instead of 'You' statements",
                        "Turn off phones/TV while talking"
                    ]
                }
            },
            'emotional_intimacy': {
                'hindi': {
                    'advice': "Emotional intimacy build करने के लिए vulnerability share करना जरूरी है। अपने fears, dreams, और feelings partner के साथ share करें। Empathy और understanding develop करें।",
                    'tips': [
                        "Daily gratitude practice - partner की 3 अच्छी बातें बताएं",
                        "Deep conversations के लिए time निकालें",
                        "Physical touch बढ़ाएं - hugs, hand holding"
                    ]
                },
                'hinglish': {
                    'advice': "Emotional intimacy build karne ke liye vulnerability share karna zaroori hai. Apne fears, dreams, aur feelings partner ke saath share karo. Empathy aur understanding develop karo.",
                    'tips': [
                        "Daily gratitude practice - partner ki 3 acchi baatein batao",
                        "Deep conversations ke liye time nikalo",
                        "Physical touch badhao - hugs, hand holding"
                    ]
                },
                'english': {
                    'advice': "To build emotional intimacy, sharing vulnerability is essential. Share your fears, dreams, and feelings with your partner. Develop empathy and understanding.",
                    'tips': [
                        "Daily gratitude practice - tell 3 good things about partner",
                        "Make time for deep conversations",
                        "Increase physical touch - hugs, hand holding"
                    ]
                }
            },
            'trust_issues': {
                'hindi': {
                    'advice': "Trust rebuild करना time लेता है। Consistency और transparency जरूरी है। Past mistakes को repeatedly discuss न करें, future पर focus करें। Professional counseling भी helpful हो सकती है।",
                    'tips': [
                        "Small promises keep करके trust build करें",
                        "Open communication maintain करें",
                        "Patience रखें - trust time लेता है"
                    ]
                },
                'hinglish': {
                    'advice': "Trust rebuild karna time leta hai. Consistency aur transparency zaroori hai. Past mistakes ko repeatedly discuss na karo, future par focus karo. Professional counseling bhi helpful ho sakti hai.",
                    'tips': [
                        "Small promises keep karke trust build karo",
                        "Open communication maintain karo",
                        "Patience rakho - trust time leta hai"
                    ]
                },
                'english': {
                    'advice': "Rebuilding trust takes time. Consistency and transparency are essential. Don't repeatedly discuss past mistakes, focus on the future. Professional counseling can also be helpful.",
                    'tips': [
                        "Build trust by keeping small promises",
                        "Maintain open communication",
                        "Be patient - trust takes time"
                    ]
                }
            }
        }
        
        return guidance_library.get(topic, {}).get(language, {
            'advice': "This is an important aspect of relationship wellness that requires attention and care.",
            'tips': ["Consider seeking professional relationship counseling"]
        })
    
    def _get_cultural_guidance(self, contexts: List[str], language: str) -> List[str]:
        """Get culturally sensitive guidance"""
        cultural_advice = {
            'hindi': {
                'arranged_marriage': "Arranged marriage में patience और understanding जरूरी है। धीरे-धीरे एक-दूसरे को जानें। Family support भी important है।",
                'joint_family_issues': "Joint family में privacy और boundaries maintain करना challenging है। Partner के साथ united front present करें।",
                'love_marriage': "Love marriage में family acceptance के लिए time और patience चाहिए। Respect और understanding से approach करें।"
            },
            'hinglish': {
                'arranged_marriage': "Arranged marriage mein patience aur understanding zaroori hai. Dhire-dhire ek-dusre ko jaano. Family support bhi important hai.",
                'joint_family_issues': "Joint family mein privacy aur boundaries maintain karna challenging hai. Partner ke saath united front present karo.",
                'love_marriage': "Love marriage mein family acceptance ke liye time aur patience chahiye. Respect aur understanding se approach karo."
            },
            'english': {
                'arranged_marriage': "In arranged marriages, patience and understanding are essential. Get to know each other gradually. Family support is also important.",
                'joint_family_issues': "Maintaining privacy and boundaries in joint families is challenging. Present a united front with your partner.",
                'love_marriage': "Love marriages require time and patience for family acceptance. Approach with respect and understanding."
            }
        }
        
        advice_list = []
        for context in contexts:
            if context in cultural_advice[language]:
                advice_list.append(cultural_advice[language][context])
        
        return advice_list
    
    def _get_communication_strategies(self, topics: List[str], language: str) -> List[str]:
        """Get communication strategies"""
        strategies = {
            'hindi': [
                "Weekly relationship check-ins करें",
                "Appreciation regularly express करें",
                "Conflicts को respectfully handle करें",
                "Quality time together spend करें"
            ],
            'hinglish': [
                "Weekly relationship check-ins karo",
                "Appreciation regularly express karo",
                "Conflicts ko respectfully handle karo",
                "Quality time together spend karo"
            ],
            'english': [
                "Conduct weekly relationship check-ins",
                "Express appreciation regularly",
                "Handle conflicts respectfully",
                "Spend quality time together"
            ]
        }
        
        return strategies.get(language, strategies['english'])
    
    def _get_action_steps(self, topics: List[str], language: str) -> List[str]:
        """Get actionable steps"""
        steps = {
            'hindi': [
                "आज ही partner से 30 minutes quality time spend करें",
                "एक specific issue पर honest conversation करें",
                "Daily gratitude practice start करें",
                "Weekly date night plan करें"
            ],
            'hinglish': [
                "Aaj hi partner se 30 minutes quality time spend karo",
                "Ek specific issue par honest conversation karo",
                "Daily gratitude practice start karo",
                "Weekly date night plan karo"
            ],
            'english': [
                "Spend 30 minutes of quality time with partner today",
                "Have an honest conversation about a specific issue",
                "Start a daily gratitude practice",
                "Plan a weekly date night"
            ]
        }
        
        return steps.get(language, steps['english'])