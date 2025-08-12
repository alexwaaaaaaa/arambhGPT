from typing import Dict, List
import random

class MatureHealthTemplates:
    """Mature, educational sexual health response templates"""
    
    def __init__(self):
        # Comprehensive sexual health templates
        self.health_templates = {
            'hindi': {
                'anatomy_basic': [
                    "शरीर रचना को समझना sexual health का foundation है। Male reproductive system में penis, testicles, prostate शामिल हैं। Female system में vagina, clitoris, uterus, ovaries हैं। हर organ का अपना function है।",
                    "Sexual anatomy की proper knowledge से confidence बढ़ता है। यह normal biological process है और इसके बारे में जानना जरूरी है।"
                ],
                'performance_guidance': [
                    "Performance anxiety से निपटने के लिए relaxation techniques use करें। Deep breathing, meditation, और partner के साथ communication helpful है। यह mostly psychological issue है।",
                    "Sexual stamina improve करने के लिए regular exercise, healthy diet, और stress management जरूरी है। Kegel exercises भी beneficial हैं।"
                ],
                'pleasure_education': [
                    "Sexual pleasure mutual satisfaction के बारे में है। Foreplay बहुत important है - यह intimacy बढ़ाता है और arousal में help करता है। Communication से preferences पता चलती हैं।",
                    "Orgasm achieve करने के लिए patience और exploration जरूरी है। हर person different है, इसलिए अपने body को समझना important है।"
                ],
                'relationship_intimacy': [
                    "Healthy sexual relationship में communication, trust, और mutual respect होना चाहिए। Sexual compatibility develop होने में time लगता है।",
                    "Intimacy केवल physical नहीं है - emotional connection भी equally important है। Partner के साथ open discussion करें।"
                ]
            },
            'hinglish': {
                'anatomy_basic': [
                    "Body anatomy samajhna sexual health ka foundation hai. Male reproductive system mein penis, testicles, prostate shamil hain. Female system mein vagina, clitoris, uterus, ovaries hain. Har organ ka apna function hai.",
                    "Sexual anatomy ki proper knowledge se confidence badhta hai. Yeh normal biological process hai aur iske baare mein jaanna zaroori hai."
                ],
                'performance_guidance': [
                    "Performance anxiety se nipatne ke liye relaxation techniques use karo. Deep breathing, meditation, aur partner ke saath communication helpful hai. Yeh mostly psychological issue hai.",
                    "Sexual stamina improve karne ke liye regular exercise, healthy diet, aur stress management zaroori hai. Kegel exercises bhi beneficial hain."
                ],
                'pleasure_education': [
                    "Sexual pleasure mutual satisfaction ke baare mein hai. Foreplay bahut important hai - yeh intimacy badhata hai aur arousal mein help karta hai. Communication se preferences pata chalti hain.",
                    "Orgasm achieve karne ke liye patience aur exploration zaroori hai. Har person different hai, isliye apne body ko samajhna important hai."
                ],
                'relationship_intimacy': [
                    "Healthy sexual relationship mein communication, trust, aur mutual respect hona chahiye. Sexual compatibility develop hone mein time lagta hai.",
                    "Intimacy sirf physical nahi hai - emotional connection bhi equally important hai. Partner ke saath open discussion karo."
                ]
            },
            'english': {
                'anatomy_basic': [
                    "Understanding body anatomy is the foundation of sexual health. The male reproductive system includes penis, testicles, and prostate. The female system includes vagina, clitoris, uterus, and ovaries. Each organ has its specific function.",
                    "Proper knowledge of sexual anatomy builds confidence. This is a normal biological process and it's important to understand it."
                ],
                'performance_guidance': [
                    "To deal with performance anxiety, use relaxation techniques. Deep breathing, meditation, and communication with your partner are helpful. This is mostly a psychological issue.",
                    "To improve sexual stamina, regular exercise, healthy diet, and stress management are essential. Kegel exercises are also beneficial."
                ],
                'pleasure_education': [
                    "Sexual pleasure is about mutual satisfaction. Foreplay is very important - it enhances intimacy and helps with arousal. Communication helps understand preferences.",
                    "To achieve orgasm, patience and exploration are necessary. Every person is different, so understanding your own body is important."
                ],
                'relationship_intimacy': [
                    "A healthy sexual relationship should have communication, trust, and mutual respect. Sexual compatibility takes time to develop.",
                    "Intimacy isn't just physical - emotional connection is equally important. Have open discussions with your partner."
                ]
            }
        }
        
        # Wellness and health tips
        self.wellness_tips = {
            'hindi': {
                'general_health': [
                    "Sexual health के लिए overall fitness जरूरी है। Regular exercise से blood circulation improve होता है।",
                    "Healthy diet libido boost करती है। Zinc, vitamin D, और omega-3 beneficial हैं।",
                    "Adequate sleep sexual hormone production के लिए important है।"
                ],
                'stress_management': [
                    "Stress sexual performance को affect करता है। Meditation और yoga helpful हैं।",
                    "Work-life balance maintain करना sexual wellness के लिए जरूरी है।"
                ],
                'communication': [
                    "Partner के साथ sexual preferences discuss करना healthy है।",
                    "Sexual problems के बारे में openly बात करने से relationship improve होती है।"
                ]
            },
            'hinglish': {
                'general_health': [
                    "Sexual health ke liye overall fitness zaroori hai. Regular exercise se blood circulation improve hota hai.",
                    "Healthy diet libido boost karti hai. Zinc, vitamin D, aur omega-3 beneficial hain.",
                    "Adequate sleep sexual hormone production ke liye important hai."
                ],
                'stress_management': [
                    "Stress sexual performance ko affect karta hai. Meditation aur yoga helpful hain.",
                    "Work-life balance maintain karna sexual wellness ke liye zaroori hai."
                ],
                'communication': [
                    "Partner ke saath sexual preferences discuss karna healthy hai.",
                    "Sexual problems ke baare mein openly baat karne se relationship improve hoti hai."
                ]
            },
            'english': {
                'general_health': [
                    "Overall fitness is essential for sexual health. Regular exercise improves blood circulation.",
                    "A healthy diet boosts libido. Zinc, vitamin D, and omega-3 are beneficial.",
                    "Adequate sleep is important for sexual hormone production."
                ],
                'stress_management': [
                    "Stress affects sexual performance. Meditation and yoga are helpful.",
                    "Maintaining work-life balance is necessary for sexual wellness."
                ],
                'communication': [
                    "Discussing sexual preferences with your partner is healthy.",
                    "Talking openly about sexual problems improves relationships."
                ]
            }
        }
        
        # Safe practices and contraception
        self.safety_education = {
            'hindi': {
                'safe_practices': [
                    "Safe sex practices STDs से protection देते हैं। Condoms का proper use जरूरी है।",
                    "Regular STD testing responsible sexual behavior का part है।",
                    "Multiple partners के साथ extra precautions लेना चाहिए।"
                ],
                'contraception': [
                    "Birth control के कई options हैं - condoms, pills, IUDs। Doctor से consult करके choose करें।",
                    "Emergency contraception के बारे में जानकारी रखना जरूरी है।"
                ]
            },
            'hinglish': {
                'safe_practices': [
                    "Safe sex practices STDs se protection dete hain. Condoms ka proper use zaroori hai.",
                    "Regular STD testing responsible sexual behavior ka part hai.",
                    "Multiple partners ke saath extra precautions lena chahiye."
                ],
                'contraception': [
                    "Birth control ke kai options hain - condoms, pills, IUDs. Doctor se consult karke choose karo.",
                    "Emergency contraception ke baare mein jaankari rakhna zaroori hai."
                ]
            },
            'english': {
                'safe_practices': [
                    "Safe sex practices provide protection from STDs. Proper use of condoms is essential.",
                    "Regular STD testing is part of responsible sexual behavior.",
                    "Extra precautions should be taken with multiple partners."
                ],
                'contraception': [
                    "There are many birth control options - condoms, pills, IUDs. Choose after consulting with a doctor.",
                    "It's important to have knowledge about emergency contraception."
                ]
            }
        }
    
    def get_mature_health_response(self, analysis: Dict, language: str = 'hinglish') -> str:
        """Get mature, educational sexual health response"""
        topic_categories = analysis.get('topic_categories', [])
        maturity_level = analysis.get('maturity_level', 'basic')
        
        response_parts = []
        
        # Handle different topic categories
        for category in topic_categories:
            if category in ['anatomy_education']:
                response = random.choice(self.health_templates[language]['anatomy_basic'])
                response_parts.append(response)
            
            elif category in ['performance_concerns']:
                response = random.choice(self.health_templates[language]['performance_guidance'])
                response_parts.append(response)
            
            elif category in ['pleasure_education']:
                response = random.choice(self.health_templates[language]['pleasure_education'])
                response_parts.append(response)
            
            elif category in ['relationship_intimacy']:
                response = random.choice(self.health_templates[language]['relationship_intimacy'])
                response_parts.append(response)
            
            elif category in ['contraception_safety']:
                response = random.choice(self.safety_education[language]['safe_practices'])
                response_parts.append(response)
        
        # Add wellness tips based on maturity level
        if maturity_level in ['intermediate', 'advanced']:
            wellness_tip = random.choice(self.wellness_tips[language]['general_health'])
            response_parts.append(f"\n💡 Health Tip: {wellness_tip}")
        
        # Combine responses
        if response_parts:
            final_response = '\n\n'.join(response_parts)
        else:
            # Default educational response
            default_responses = {
                'hindi': "यह sexual health का important topic है। Proper education और understanding से healthy decisions ले सकते हैं।",
                'hinglish': "Yeh sexual health ka important topic hai. Proper education aur understanding se healthy decisions le sakte hain.",
                'english': "This is an important topic of sexual health. With proper education and understanding, you can make healthy decisions."
            }
            final_response = default_responses.get(language, default_responses['english'])
        
        # Add educational disclaimer
        disclaimer = self._get_educational_disclaimer(language)
        return f"{final_response}\n\n{disclaimer}"
    
    def _get_educational_disclaimer(self, language: str) -> str:
        """Get educational disclaimer"""
        disclaimers = {
            'hindi': "📚 यह educational information है। Specific medical concerns के लिए healthcare professional से consult करें।",
            'hinglish': "📚 Yeh educational information hai. Specific medical concerns ke liye healthcare professional se consult karo.",
            'english': "📚 This is educational information. For specific medical concerns, consult a healthcare professional."
        }
        
        return disclaimers.get(language, disclaimers['english'])
    
    def get_follow_up_questions(self, analysis: Dict, language: str = 'hinglish') -> List[str]:
        """Get appropriate follow-up questions for sexual health topics"""
        topic_categories = analysis.get('topic_categories', [])
        
        follow_ups = {
            'hindi': {
                'anatomy_education': "क्या आप किसी specific anatomy के बारे में और जानना चाहते हैं?",
                'performance_concerns': "क्या यह problem recent है या long-term issue है?",
                'pleasure_education': "क्या आप relationship communication के बारे में जानना चाहते हैं?",
                'contraception_safety': "क्या आप specific contraception method के बारे में पूछना चाहते हैं?"
            },
            'hinglish': {
                'anatomy_education': "Kya tum kisi specific anatomy ke baare mein aur jaanna chahte ho?",
                'performance_concerns': "Kya yeh problem recent hai ya long-term issue hai?",
                'pleasure_education': "Kya tum relationship communication ke baare mein jaanna chahte ho?",
                'contraception_safety': "Kya tum specific contraception method ke baare mein poochna chahte ho?"
            },
            'english': {
                'anatomy_education': "Would you like to know more about any specific anatomy?",
                'performance_concerns': "Is this a recent problem or a long-term issue?",
                'pleasure_education': "Would you like to know about relationship communication?",
                'contraception_safety': "Would you like to ask about a specific contraception method?"
            }
        }
        
        questions = []
        for category in topic_categories:
            if category in follow_ups[language]:
                questions.append(follow_ups[language][category])
        
        return questions[:2]  # Return max 2 follow-up questions