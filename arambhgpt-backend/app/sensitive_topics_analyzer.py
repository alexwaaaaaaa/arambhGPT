from typing import Dict, List, Tuple
import re

class SensitiveTopicsAnalyzer:
    """Advanced analyzer for sexual health, depression, and intimate problems"""
    
    def __init__(self):
        # Sexual health related patterns
        self.sexual_health_patterns = {
            'performance_anxiety': [
                'performance anxiety', 'bed mein problem', 'intimate problem', 
                'sexual performance', 'premature ejaculation', 'erectile dysfunction',
                'sex mein problem', 'bedroom issues', 'intimacy issues',
                'पर्फॉर्मेंस एंग्जायटी', 'यौन समस्या', 'बिस्तर में समस्या'
            ],
            'sexual_education': [
                'sex education', 'sexual health', 'contraception', 'safe sex',
                'sexual wellness', 'reproductive health', 'birth control',
                'यौन शिक्षा', 'यौन स्वास्थ्य', 'गर्भनिरोधक'
            ],
            'relationship_intimacy': [
                'intimacy problems', 'sexual compatibility', 'relationship intimacy',
                'physical intimacy', 'emotional intimacy', 'couple problems',
                'रिश्ते में अंतरंगता', 'शारीरिक निकटता', 'भावनात्मक निकटता'
            ],
            'sexual_identity': [
                'sexual orientation', 'gender identity', 'lgbtq', 'coming out',
                'sexual identity crisis', 'homosexuality', 'bisexuality',
                'यौन पहचान', 'लैंगिक पहचान'
            ],
            'sexual_trauma': [
                'sexual abuse', 'sexual assault', 'trauma', 'harassment',
                'unwanted advances', 'sexual violence', 'molestation',
                'यौन शोषण', 'यौन हिंसा', 'छेड़छाड़'
            ]
        }
        
        # Depression and mental health patterns
        self.depression_patterns = {
            'clinical_depression': [
                'clinical depression', 'major depression', 'severe depression',
                'chronic depression', 'bipolar disorder', 'manic depression',
                'क्लिनिकल डिप्रेशन', 'गंभीर अवसाद', 'द्विध्रुवी विकार'
            ],
            'suicidal_thoughts': [
                'suicide', 'kill myself', 'end my life', 'no point living',
                'want to die', 'suicidal thoughts', 'self harm', 'cutting',
                'आत्महत्या', 'मरना चाहता हूं', 'जीने का मन नहीं'
            ],
            'self_harm': [
                'self harm', 'cutting', 'hurting myself', 'self injury',
                'self mutilation', 'scratching', 'burning myself',
                'खुद को नुकसान', 'अपने आप को काटना'
            ],
            'eating_disorders': [
                'eating disorder', 'anorexia', 'bulimia', 'binge eating',
                'food issues', 'body dysmorphia', 'weight obsession',
                'खाने का विकार', 'भोजन संबंधी समस्या'
            ],
            'anxiety_depression': [
                'anxiety depression', 'panic attacks', 'social anxiety',
                'generalized anxiety', 'phobia', 'ocd', 'ptsd',
                'चिंता अवसाद', 'पैनिक अटैक', 'सामाजिक चिंता'
            ]
        }
        
        # Addiction patterns
        self.addiction_patterns = {
            'substance_abuse': [
                'drug addiction', 'alcohol addiction', 'substance abuse',
                'drinking problem', 'drug problem', 'addiction recovery',
                'नशे की लत', 'शराब की लत', 'ड्रग्स की समस्या'
            ],
            'behavioral_addiction': [
                'porn addiction', 'sex addiction', 'gambling addiction',
                'internet addiction', 'gaming addiction', 'social media addiction',
                'पोर्न की लत', 'जुआ की लत', 'इंटरनेट की लत'
            ]
        }
        
        # Relationship and family issues
        self.relationship_patterns = {
            'domestic_violence': [
                'domestic violence', 'abusive relationship', 'physical abuse',
                'emotional abuse', 'toxic relationship', 'violent partner',
                'घरेलू हिंसा', 'अपमानजनक रिश्ता', 'हिंसक साथी'
            ],
            'marital_problems': [
                'marital problems', 'marriage issues', 'divorce thoughts',
                'unhappy marriage', 'loveless marriage', 'cheating spouse',
                'वैवाहिक समस्याएं', 'शादी में समस्या', 'तलाक के विचार'
            ]
        }
        
        # Severity indicators
        self.severity_indicators = {
            'crisis': [
                'emergency', 'urgent', 'immediate help', 'crisis', 'right now',
                'can\'t take it', 'breaking point', 'desperate', 'hopeless'
            ],
            'high': [
                'severe', 'extreme', 'unbearable', 'overwhelming', 'intense',
                'very bad', 'terrible', 'awful', 'worst'
            ],
            'medium': [
                'moderate', 'concerning', 'troubling', 'difficult', 'hard',
                'challenging', 'problematic'
            ]
        }
    
    def analyze_sensitive_content(self, message: str) -> Dict:
        """Analyze message for sensitive topics and determine appropriate response strategy"""
        message_lower = message.lower()
        
        analysis = {
            'contains_sensitive_content': False,
            'topic_categories': [],
            'severity_level': 'low',
            'requires_professional_help': False,
            'crisis_intervention_needed': False,
            'content_warnings': [],
            'response_guidelines': []
        }
        
        # Check for sexual health topics
        for category, patterns in self.sexual_health_patterns.items():
            if any(pattern in message_lower for pattern in patterns):
                analysis['contains_sensitive_content'] = True
                analysis['topic_categories'].append(f'sexual_health_{category}')
                
                if category == 'sexual_trauma':
                    analysis['requires_professional_help'] = True
                    analysis['content_warnings'].append('trauma_content')
        
        # Check for depression patterns
        for category, patterns in self.depression_patterns.items():
            if any(pattern in message_lower for pattern in patterns):
                analysis['contains_sensitive_content'] = True
                analysis['topic_categories'].append(f'depression_{category}')
                
                if category in ['suicidal_thoughts', 'self_harm']:
                    analysis['crisis_intervention_needed'] = True
                    analysis['requires_professional_help'] = True
                    analysis['severity_level'] = 'crisis'
        
        # Check for addiction patterns
        for category, patterns in self.addiction_patterns.items():
            if any(pattern in message_lower for pattern in patterns):
                analysis['contains_sensitive_content'] = True
                analysis['topic_categories'].append(f'addiction_{category}')
                analysis['requires_professional_help'] = True
        
        # Check for relationship issues
        for category, patterns in self.relationship_patterns.items():
            if any(pattern in message_lower for pattern in patterns):
                analysis['contains_sensitive_content'] = True
                analysis['topic_categories'].append(f'relationship_{category}')
                
                if category == 'domestic_violence':
                    analysis['requires_professional_help'] = True
                    analysis['severity_level'] = 'high'
        
        # Determine severity if not already set
        if analysis['severity_level'] == 'low':
            for level, indicators in self.severity_indicators.items():
                if any(indicator in message_lower for indicator in indicators):
                    analysis['severity_level'] = level
                    break
        
        # Generate response guidelines
        analysis['response_guidelines'] = self._generate_response_guidelines(analysis)
        
        return analysis
    
    def _generate_response_guidelines(self, analysis: Dict) -> List[str]:
        """Generate guidelines for responding to sensitive content"""
        guidelines = []
        
        if analysis['crisis_intervention_needed']:
            guidelines.extend([
                'immediate_crisis_response',
                'provide_helpline_numbers',
                'encourage_professional_help',
                'non_judgmental_support'
            ])
        
        if 'sexual_health' in str(analysis['topic_categories']):
            guidelines.extend([
                'professional_medical_advice',
                'normalize_sexual_health_discussions',
                'provide_educational_resources',
                'maintain_privacy_respect'
            ])
        
        if 'depression' in str(analysis['topic_categories']):
            guidelines.extend([
                'validate_emotions',
                'encourage_professional_therapy',
                'provide_coping_strategies',
                'monitor_for_crisis_signs'
            ])
        
        if 'addiction' in str(analysis['topic_categories']):
            guidelines.extend([
                'non_judgmental_approach',
                'encourage_recovery_resources',
                'provide_support_group_info',
                'acknowledge_recovery_difficulty'
            ])
        
        if analysis['requires_professional_help']:
            guidelines.append('emphasize_professional_help')
        
        return list(set(guidelines))  # Remove duplicates
    
    def get_professional_resources(self, topic_categories: List[str], language: str = 'hinglish') -> Dict:
        """Get appropriate professional resources based on topic"""
        resources = {
            'helplines': [],
            'websites': [],
            'professional_types': [],
            'emergency_contacts': []
        }
        
        # Crisis helplines
        if any('suicidal' in cat or 'self_harm' in cat for cat in topic_categories):
            resources['helplines'].extend([
                {
                    'name': 'National Suicide Prevention Helpline',
                    'number': '9152987821',
                    'available': '24/7'
                },
                {
                    'name': 'Vandrevala Foundation',
                    'number': '9999666555',
                    'available': '24/7'
                }
            ])
        
        # Sexual health resources
        if any('sexual_health' in cat for cat in topic_categories):
            resources['professional_types'].extend([
                'Sexologist', 'Gynecologist', 'Urologist', 'Sex Therapist'
            ])
            resources['websites'].extend([
                'https://www.who.int/health-topics/sexual-health',
                'https://www.plannedparenthood.org'
            ])
        
        # Mental health resources
        if any('depression' in cat or 'anxiety' in cat for cat in topic_categories):
            resources['professional_types'].extend([
                'Psychiatrist', 'Clinical Psychologist', 'Counselor', 'Therapist'
            ])
            resources['helplines'].extend([
                {
                    'name': 'NIMHANS Helpline',
                    'number': '080-46110007',
                    'available': 'Mon-Sat 9AM-5PM'
                }
            ])
        
        # Addiction resources
        if any('addiction' in cat for cat in topic_categories):
            resources['professional_types'].extend([
                'Addiction Counselor', 'Rehabilitation Specialist', 'Support Groups'
            ])
        
        return resources