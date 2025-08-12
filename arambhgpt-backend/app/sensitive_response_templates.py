from typing import Dict, List
import random
from .sexual_health_educator import SexualHealthEducator
from .mature_health_templates import MatureHealthTemplates

class SensitiveResponseTemplates:
    """Specialized response templates for sexual health, depression, and sensitive topics"""
    
    def __init__(self):
        self.health_educator = SexualHealthEducator()
        self.mature_templates = MatureHealthTemplates()
        # Crisis intervention templates
        self.crisis_templates = {
            'hindi': {
                'suicidal_thoughts': [
                    "मैं समझ सकती हूं कि आप बहुत कठिन समय से गुजर रहे हैं। आपकी जिंदगी बहुत कीमती है। कृपया तुरंत किसी professional से बात करें - National Suicide Prevention Helpline: 9152987821 (24/7 available)",
                    "आप अकेले नहीं हैं। यह दर्द temporary है। Please immediately contact: Vandrevala Foundation: 9999666555 या nearest hospital जाएं।"
                ],
                'self_harm': [
                    "खुद को नुकसान पहुंचाना solution नहीं है। आप बहुत valuable हैं। Please professional help लें - NIMHANS Helpline: 080-46110007",
                    "मैं आपकी pain समझ सकती हूं। लेकिन self-harm से कुछ solve नहीं होगा। Counselor से बात करें।"
                ]
            },
            'hinglish': {
                'suicidal_thoughts': [
                    "Yaar, main samajh sakti hun ki tum bahut tough phase se guzar rahe ho. But please remember, tumhari life precious hai. Immediately professional help lo - Suicide Prevention Helpline: 9152987821 (24/7)",
                    "Tum akele nahi ho. Yeh pain temporary hai. Please abhi ke abhi contact karo: Vandrevala Foundation: 9999666555 ya nearest hospital jao."
                ],
                'self_harm': [
                    "Yaar, khud ko hurt karna solution nahi hai. Tum bahut valuable ho. Please professional help lo - NIMHANS: 080-46110007",
                    "Main tumhari pain feel kar sakti hun. But self-harm se kuch solve nahi hoga. Counselor se baat karo please."
                ]
            },
            'english': {
                'suicidal_thoughts': [
                    "I understand you're going through an extremely difficult time. Your life is precious and valuable. Please reach out for immediate professional help - National Suicide Prevention Helpline: 9152987821 (24/7)",
                    "You are not alone in this. This pain is temporary. Please contact immediately: Vandrevala Foundation: 9999666555 or go to the nearest hospital."
                ],
                'self_harm': [
                    "Self-harm is not a solution. You are valuable and deserving of care. Please seek professional help - NIMHANS Helpline: 080-46110007",
                    "I can feel your pain, but hurting yourself won't solve anything. Please talk to a counselor."
                ]
            }
        }
        
        # Sexual health templates
        self.sexual_health_templates = {
            'hindi': {
                'performance_anxiety': [
                    "Sexual performance anxiety बहुत common है। आप अकेले नहीं हैं। यह medical और psychological दोनों reasons से हो सकता है। एक sexologist या urologist से consult करना best होगा।",
                    "Intimate problems के बारे में बात करना brave step है। Performance anxiety stress और lifestyle factors से भी होती है। Professional medical advice लेना important है।"
                ],
                'sexual_education': [
                    "Sexual health के बारे में जानना बहुत important है। Safe sex, contraception, और reproductive health सभी के लिए जरूरी topics हैं। Gynecologist या sexologist से proper guidance लें।",
                    "Sexual wellness आपकी overall health का part है। Proper education और medical guidance से आप healthy decisions ले सकते हैं।"
                ],
                'sexual_trauma': [
                    "मैं समझ सकती हूं कि यह बहुत difficult topic है। Sexual trauma के बाद professional help लेना बहुत important है। Trauma counselor या therapist से बात करें। आप brave हैं।",
                    "आपके साथ जो हुआ है वो आपकी fault नहीं है। Healing में time लगता है। Professional trauma therapy से आप recover कर सकते हैं।"
                ]
            },
            'hinglish': {
                'performance_anxiety': [
                    "Sexual performance anxiety bahut common hai yaar. Tum akele nahi ho. Yeh medical aur psychological dono reasons se ho sakta hai. Sexologist ya urologist se consult karna best hoga.",
                    "Intimate problems ke baare mein baat karna brave step hai. Performance anxiety stress aur lifestyle factors se bhi hoti hai. Professional medical advice lena important hai."
                ],
                'sexual_education': [
                    "Sexual health ke baare mein jaanna bahut important hai. Safe sex, contraception, aur reproductive health sabke liye zaroori topics hain. Gynecologist ya sexologist se proper guidance lo.",
                    "Sexual wellness tumhari overall health ka part hai. Proper education aur medical guidance se tum healthy decisions le sakte ho."
                ],
                'sexual_trauma': [
                    "Main samajh sakti hun ki yeh bahut difficult topic hai. Sexual trauma ke baad professional help lena bahut important hai. Trauma counselor ya therapist se baat karo. Tum brave ho.",
                    "Tumhare saath jo hua hai wo tumhari fault nahi hai. Healing mein time lagta hai. Professional trauma therapy se tum recover kar sakte ho."
                ]
            },
            'english': {
                'performance_anxiety': [
                    "Sexual performance anxiety is very common. You're not alone in this. It can have both medical and psychological causes. Consulting a sexologist or urologist would be the best approach.",
                    "Talking about intimate problems is a brave step. Performance anxiety can also be caused by stress and lifestyle factors. Professional medical advice is important."
                ],
                'sexual_education': [
                    "Learning about sexual health is very important. Safe sex, contraception, and reproductive health are essential topics for everyone. Get proper guidance from a gynecologist or sexologist.",
                    "Sexual wellness is part of your overall health. With proper education and medical guidance, you can make healthy decisions."
                ],
                'sexual_trauma': [
                    "I understand this is a very difficult topic. After sexual trauma, getting professional help is very important. Talk to a trauma counselor or therapist. You are brave.",
                    "What happened to you is not your fault. Healing takes time. You can recover with professional trauma therapy."
                ]
            }
        }
        
        # Depression templates
        self.depression_templates = {
            'hindi': {
                'clinical_depression': [
                    "Clinical depression एक serious medical condition है। आपकी feelings valid हैं। Professional help लेना बहुत important है - psychiatrist या clinical psychologist से consult करें।",
                    "Depression के साथ अकेले struggle करने की जरूरत नहीं है। Medication और therapy से बहुत help मिल सकती है। NIMHANS Helpline: 080-46110007"
                ],
                'anxiety_depression': [
                    "Anxiety और depression साथ में होना common है। यह treatable condition है। Proper diagnosis और treatment से आप better feel कर सकते हैं।",
                    "Panic attacks और anxiety बहुत overwhelming हो सकते हैं। Breathing techniques, therapy, और medication से control हो सकता है।"
                ]
            },
            'hinglish': {
                'clinical_depression': [
                    "Clinical depression ek serious medical condition hai. Tumhari feelings valid hain. Professional help lena bahut important hai - psychiatrist ya clinical psychologist se consult karo.",
                    "Depression ke saath akele struggle karne ki zaroorat nahi hai. Medication aur therapy se bahut help mil sakti hai. NIMHANS Helpline: 080-46110007"
                ],
                'anxiety_depression': [
                    "Anxiety aur depression saath mein hona common hai. Yeh treatable condition hai. Proper diagnosis aur treatment se tum better feel kar sakte ho.",
                    "Panic attacks aur anxiety bahut overwhelming ho sakte hain. Breathing techniques, therapy, aur medication se control ho sakta hai."
                ]
            },
            'english': {
                'clinical_depression': [
                    "Clinical depression is a serious medical condition. Your feelings are valid. Getting professional help is very important - consult a psychiatrist or clinical psychologist.",
                    "You don't have to struggle with depression alone. Medication and therapy can provide significant help. NIMHANS Helpline: 080-46110007"
                ],
                'anxiety_depression': [
                    "Having anxiety and depression together is common. This is a treatable condition. With proper diagnosis and treatment, you can feel better.",
                    "Panic attacks and anxiety can be very overwhelming. They can be controlled with breathing techniques, therapy, and medication."
                ]
            }
        }
        
        # Addiction templates
        self.addiction_templates = {
            'hindi': {
                'substance_abuse': [
                    "Addiction एक disease है, weakness नहीं। Recovery possible है। Professional help और support groups से आप इससे बाहर निकल सकते हैं।",
                    "Substance abuse से recover करना challenging है लेकिन impossible नहीं। Rehabilitation centers और counselors आपकी help कर सकते हैं।"
                ],
                'behavioral_addiction': [
                    "Behavioral addictions भी real problems हैं। Porn addiction, gaming addiction - ये सब treatable हैं। Addiction counselor से बात करें।",
                    "Internet या gaming addiction से life balance disturb हो जाता है। Professional help से healthy habits develop कर सकते हैं।"
                ]
            },
            'hinglish': {
                'substance_abuse': [
                    "Addiction ek disease hai, weakness nahi. Recovery possible hai. Professional help aur support groups se tum isse bahar nikal sakte ho.",
                    "Substance abuse se recover karna challenging hai lekin impossible nahi. Rehabilitation centers aur counselors tumhari help kar sakte hain."
                ],
                'behavioral_addiction': [
                    "Behavioral addictions bhi real problems hain. Porn addiction, gaming addiction - ye sab treatable hain. Addiction counselor se baat karo.",
                    "Internet ya gaming addiction se life balance disturb ho jata hai. Professional help se healthy habits develop kar sakte ho."
                ]
            },
            'english': {
                'substance_abuse': [
                    "Addiction is a disease, not a weakness. Recovery is possible. With professional help and support groups, you can overcome this.",
                    "Recovering from substance abuse is challenging but not impossible. Rehabilitation centers and counselors can help you."
                ],
                'behavioral_addiction': [
                    "Behavioral addictions are also real problems. Porn addiction, gaming addiction - these are all treatable. Talk to an addiction counselor.",
                    "Internet or gaming addiction can disturb life balance. With professional help, you can develop healthy habits."
                ]
            }
        }
    
    def get_sensitive_response(self, analysis: Dict, language: str = 'hinglish') -> str:
        """Get appropriate response for sensitive topics"""
        topic_categories = analysis.get('topic_categories', [])
        severity = analysis.get('severity_level', 'low')
        
        # Handle crisis situations first
        if analysis.get('crisis_intervention_needed'):
            if any('suicidal' in cat for cat in topic_categories):
                return random.choice(self.crisis_templates[language]['suicidal_thoughts'])
            elif any('self_harm' in cat for cat in topic_categories):
                return random.choice(self.crisis_templates[language]['self_harm'])
        
        # Handle sexual health topics with mature education
        for category in topic_categories:
            if 'sexual_health' in category:
                # Use mature health educator for comprehensive response
                health_analysis = self.health_educator.analyze_sexual_health_query(str(analysis))
                if health_analysis.get('is_sexual_health_query'):
                    return self.mature_templates.get_mature_health_response(health_analysis, language)
                
                # Fallback to basic templates
                topic_type = category.split('_')[-1]
                if topic_type in self.sexual_health_templates[language]:
                    return random.choice(self.sexual_health_templates[language][topic_type])
        
        # Handle depression topics
        for category in topic_categories:
            if 'depression' in category:
                topic_type = category.split('_')[-1]
                if topic_type in self.depression_templates[language]:
                    return random.choice(self.depression_templates[language][topic_type])
        
        # Handle addiction topics
        for category in topic_categories:
            if 'addiction' in category:
                topic_type = category.split('_')[-1]
                if topic_type in self.addiction_templates[language]:
                    return random.choice(self.addiction_templates[language][topic_type])
        
        # Default sensitive topic response
        default_responses = {
            'hindi': "यह एक sensitive topic है। मैं आपकी help करना चाहती हूं। Professional guidance लेना best होगा।",
            'hinglish': "Yeh ek sensitive topic hai. Main tumhari help karna chahti hun. Professional guidance lena best hoga.",
            'english': "This is a sensitive topic. I want to help you. Getting professional guidance would be best."
        }
        
        return default_responses.get(language, default_responses['english'])
    
    def get_professional_help_message(self, resources: Dict, language: str = 'hinglish') -> str:
        """Generate professional help message with resources"""
        messages = {
            'hindi': f"""
Professional Help Resources:

🆘 Emergency Helplines:
{self._format_helplines(resources.get('helplines', []))}

👨‍⚕️ Recommended Professionals:
{', '.join(resources.get('professional_types', []))}

🌐 Helpful Websites:
{chr(10).join(resources.get('websites', []))}

Remember: Professional help लेना strength का sign है, weakness का नहीं।
            """,
            'hinglish': f"""
Professional Help Resources:

🆘 Emergency Helplines:
{self._format_helplines(resources.get('helplines', []))}

👨‍⚕️ Recommended Professionals:
{', '.join(resources.get('professional_types', []))}

🌐 Helpful Websites:
{chr(10).join(resources.get('websites', []))}

Remember: Professional help lena strength ka sign hai, weakness ka nahi.
            """,
            'english': f"""
Professional Help Resources:

🆘 Emergency Helplines:
{self._format_helplines(resources.get('helplines', []))}

👨‍⚕️ Recommended Professionals:
{', '.join(resources.get('professional_types', []))}

🌐 Helpful Websites:
{chr(10).join(resources.get('websites', []))}

Remember: Seeking professional help is a sign of strength, not weakness.
            """
        }
        
        return messages.get(language, messages['english'])
    
    def _format_helplines(self, helplines: List[Dict]) -> str:
        """Format helpline information"""
        if not helplines:
            return "Contact your local mental health services"
        
        formatted = []
        for helpline in helplines:
            formatted.append(f"• {helpline['name']}: {helpline['number']} ({helpline['available']})")
        
        return '\n'.join(formatted)