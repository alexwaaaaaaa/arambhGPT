from typing import Dict, List, Tuple
import re

class HealthGuidanceSystem:
    """Comprehensive health-focused guidance for sexual and mental wellness"""
    
    def __init__(self):
        # Medical concern categories
        self.medical_concerns = {
            'sexual_dysfunction': [
                'erectile dysfunction', 'premature ejaculation', 'low libido', 'painful sex',
                'vaginismus', 'orgasm problems', 'sexual dysfunction', 'performance issues',
                'स्तंभन दोष', 'शीघ्रपतन', 'कामेच्छा की कमी', 'यौन समस्या'
            ],
            'reproductive_health': [
                'irregular periods', 'fertility issues', 'pregnancy concerns', 'contraception',
                'menstrual problems', 'reproductive health', 'family planning',
                'अनियमित मासिक धर्म', 'प्रजनन स्वास्थ्य', 'गर्भधारण'
            ],
            'hormonal_issues': [
                'hormone imbalance', 'testosterone low', 'estrogen problems', 'thyroid issues',
                'PCOS', 'hormonal changes', 'menopause', 'andropause',
                'हार्मोन असंतुलन', 'थायराइड', 'रजोनिवृत्ति'
            ],
            'mental_health_physical': [
                'stress affecting sex', 'anxiety performance', 'depression libido',
                'medication side effects', 'antidepressants sexual', 'mental health impact',
                'तनाव का प्रभाव', 'चिंता का असर', 'दवाओं के दुष्प्रभाव'
            ],
            'infections_stds': [
                'STD symptoms', 'UTI', 'yeast infection', 'sexual infection',
                'discharge problems', 'burning sensation', 'itching',
                'यौन संक्रमण', 'मूत्र संक्रमण', 'खुजली'
            ]
        }
        
        # When to see specific doctors
        self.doctor_specializations = {
            'sexologist': [
                'sexual dysfunction', 'performance anxiety', 'libido issues', 'sexual therapy',
                'relationship counseling', 'sexual education', 'intimacy problems'
            ],
            'gynecologist': [
                'female reproductive health', 'menstrual issues', 'pregnancy', 'contraception',
                'PCOS', 'menopause', 'vaginal problems', 'fertility'
            ],
            'urologist': [
                'male reproductive health', 'erectile dysfunction', 'prostate issues',
                'male fertility', 'urinary problems', 'testosterone'
            ],
            'psychiatrist': [
                'depression affecting sex', 'anxiety disorders', 'medication effects',
                'mental health therapy', 'sexual trauma', 'relationship therapy'
            ],
            'endocrinologist': [
                'hormone imbalance', 'thyroid problems', 'diabetes sexual effects',
                'PCOS', 'testosterone therapy', 'hormonal disorders'
            ]
        }
        
        # Wellness tips categories
        self.wellness_categories = {
            'lifestyle_factors': [
                'exercise for sexual health', 'diet for libido', 'sleep and sex',
                'stress management', 'weight management', 'smoking cessation'
            ],
            'preventive_care': [
                'regular checkups', 'STD testing', 'cancer screening',
                'vaccination', 'safe sex practices', 'hygiene'
            ],
            'natural_remedies': [
                'herbal supplements', 'yoga for sexual health', 'meditation',
                'breathing exercises', 'natural aphrodisiacs', 'ayurvedic remedies'
            ]
        }
        
        # Red flag symptoms requiring immediate attention
        self.red_flags = [
            'severe pain during sex', 'bleeding after sex', 'sudden erectile dysfunction',
            'complete loss of libido', 'severe depression', 'suicidal thoughts',
            'persistent infections', 'unusual discharge', 'severe pelvic pain'
        ]
    
    def analyze_health_query(self, message: str) -> Dict:
        """Analyze health-related queries for appropriate guidance"""
        message_lower = message.lower()
        
        analysis = {
            'is_health_query': False,
            'medical_categories': [],
            'recommended_specialists': [],
            'urgency_level': 'normal',
            'wellness_focus': [],
            'requires_immediate_attention': False,
            'self_care_applicable': True
        }
        
        # Check for medical concerns
        for category, patterns in self.medical_concerns.items():
            if any(pattern in message_lower for pattern in patterns):
                analysis['is_health_query'] = True
                analysis['medical_categories'].append(category)
        
        # Determine recommended specialists
        for specialist, conditions in self.doctor_specializations.items():
            if any(condition in message_lower for condition in conditions):
                if specialist not in analysis['recommended_specialists']:
                    analysis['recommended_specialists'].append(specialist)
        
        # Check for red flags
        for red_flag in self.red_flags:
            if red_flag in message_lower:
                analysis['requires_immediate_attention'] = True
                analysis['urgency_level'] = 'high'
                analysis['self_care_applicable'] = False
                break
        
        # Determine wellness focus
        analysis['wellness_focus'] = self._determine_wellness_focus(analysis['medical_categories'])
        
        return analysis
    
    def _determine_wellness_focus(self, categories: List[str]) -> List[str]:
        """Determine wellness focus areas"""
        focus_areas = []
        
        if any(cat in ['sexual_dysfunction', 'reproductive_health'] for cat in categories):
            focus_areas.extend(['sexual_wellness', 'reproductive_care'])
        
        if any(cat in ['hormonal_issues'] for cat in categories):
            focus_areas.append('hormonal_balance')
        
        if any(cat in ['mental_health_physical'] for cat in categories):
            focus_areas.append('mind_body_connection')
        
        if any(cat in ['infections_stds'] for cat in categories):
            focus_areas.extend(['infection_prevention', 'safe_practices'])
        
        return focus_areas if focus_areas else ['general_wellness']
    
    def get_health_guidance(self, analysis: Dict, language: str = 'hinglish') -> Dict:
        """Get comprehensive health guidance"""
        categories = analysis.get('medical_categories', [])
        specialists = analysis.get('recommended_specialists', [])
        urgency = analysis.get('urgency_level', 'normal')
        
        guidance = {
            'medical_advice': '',
            'when_to_see_doctor': [],
            'specialist_recommendations': [],
            'wellness_tips': [],
            'self_care_measures': [],
            'prevention_tips': []
        }
        
        # Generate medical advice
        for category in categories:
            category_advice = self._get_category_health_advice(category, language)
            guidance['medical_advice'] += category_advice['advice'] + '\n\n'
            guidance['wellness_tips'].extend(category_advice.get('tips', []))
        
        # Add specialist recommendations
        guidance['specialist_recommendations'] = self._get_specialist_info(specialists, language)
        
        # Add when to see doctor guidelines
        guidance['when_to_see_doctor'] = self._get_doctor_consultation_guidelines(categories, urgency, language)
        
        # Add self-care measures if applicable
        if analysis.get('self_care_applicable', True):
            guidance['self_care_measures'] = self._get_self_care_measures(categories, language)
        
        # Add prevention tips
        guidance['prevention_tips'] = self._get_prevention_tips(categories, language)
        
        return guidance
    
    def _get_category_health_advice(self, category: str, language: str) -> Dict:
        """Get health advice for specific category"""
        advice_library = {
            'sexual_dysfunction': {
                'hindi': {
                    'advice': "Sexual dysfunction common problem है और treatable है। यह physical, psychological, या lifestyle factors से हो सकता है। Stress, poor diet, lack of exercise, और certain medications भी cause हो सकते हैं।",
                    'tips': [
                        "Regular exercise से blood circulation improve होता है",
                        "Healthy diet - zinc, vitamin D rich foods लें",
                        "Stress management techniques practice करें",
                        "Adequate sleep (7-8 hours) जरूरी है"
                    ]
                },
                'hinglish': {
                    'advice': "Sexual dysfunction common problem hai aur treatable hai. Yeh physical, psychological, ya lifestyle factors se ho sakta hai. Stress, poor diet, lack of exercise, aur certain medications bhi cause ho sakte hain.",
                    'tips': [
                        "Regular exercise se blood circulation improve hota hai",
                        "Healthy diet - zinc, vitamin D rich foods lo",
                        "Stress management techniques practice karo",
                        "Adequate sleep (7-8 hours) zaroori hai"
                    ]
                },
                'english': {
                    'advice': "Sexual dysfunction is a common problem and is treatable. It can be caused by physical, psychological, or lifestyle factors. Stress, poor diet, lack of exercise, and certain medications can also be causes.",
                    'tips': [
                        "Regular exercise improves blood circulation",
                        "Maintain a healthy diet rich in zinc and vitamin D",
                        "Practice stress management techniques",
                        "Get adequate sleep (7-8 hours)"
                    ]
                }
            },
            'hormonal_issues': {
                'hindi': {
                    'advice': "Hormonal imbalance sexual health को significantly affect करता है। Age, stress, diet, और medical conditions hormones को impact करते हैं। Proper diagnosis और treatment से improvement possible है।",
                    'tips': [
                        "Regular hormone level testing कराएं",
                        "Balanced diet with healthy fats लें",
                        "Regular sleep schedule maintain करें",
                        "Stress को manage करें"
                    ]
                },
                'hinglish': {
                    'advice': "Hormonal imbalance sexual health ko significantly affect karta hai. Age, stress, diet, aur medical conditions hormones ko impact karte hain. Proper diagnosis aur treatment se improvement possible hai.",
                    'tips': [
                        "Regular hormone level testing karao",
                        "Balanced diet with healthy fats lo",
                        "Regular sleep schedule maintain karo",
                        "Stress ko manage karo"
                    ]
                },
                'english': {
                    'advice': "Hormonal imbalance significantly affects sexual health. Age, stress, diet, and medical conditions impact hormones. Improvement is possible with proper diagnosis and treatment.",
                    'tips': [
                        "Get regular hormone level testing",
                        "Maintain a balanced diet with healthy fats",
                        "Keep a regular sleep schedule",
                        "Manage stress effectively"
                    ]
                }
            },
            'mental_health_physical': {
                'hindi': {
                    'advice': "Mental health और sexual health deeply connected हैं। Depression, anxiety, और stress sexual function को affect करते हैं। Antidepressants भी sexual side effects cause कर सकती हैं।",
                    'tips': [
                        "Mental health professional से consult करें",
                        "Medication side effects के बारे में doctor से बात करें",
                        "Therapy और counseling helpful हो सकते हैं",
                        "Partner के साथ open communication रखें"
                    ]
                },
                'hinglish': {
                    'advice': "Mental health aur sexual health deeply connected hain. Depression, anxiety, aur stress sexual function ko affect karte hain. Antidepressants bhi sexual side effects cause kar sakti hain.",
                    'tips': [
                        "Mental health professional se consult karo",
                        "Medication side effects ke baare mein doctor se baat karo",
                        "Therapy aur counseling helpful ho sakte hain",
                        "Partner ke saath open communication rakho"
                    ]
                },
                'english': {
                    'advice': "Mental health and sexual health are deeply connected. Depression, anxiety, and stress affect sexual function. Antidepressants can also cause sexual side effects.",
                    'tips': [
                        "Consult a mental health professional",
                        "Discuss medication side effects with your doctor",
                        "Therapy and counseling can be helpful",
                        "Maintain open communication with your partner"
                    ]
                }
            }
        }
        
        return advice_library.get(category, {}).get(language, {
            'advice': "This is an important health concern that may require professional medical attention.",
            'tips': ["Consult with appropriate healthcare professionals for proper diagnosis and treatment"]
        })
    
    def _get_specialist_info(self, specialists: List[str], language: str) -> List[Dict]:
        """Get information about recommended specialists"""
        specialist_info = {
            'hindi': {
                'sexologist': {
                    'name': 'Sexologist',
                    'when_to_visit': 'Sexual problems, performance issues, relationship counseling के लिए',
                    'what_to_expect': 'Confidential consultation, medical history, treatment options discuss करेंगे'
                },
                'gynecologist': {
                    'name': 'Gynecologist',
                    'when_to_visit': 'Female reproductive health, menstrual issues, pregnancy के लिए',
                    'what_to_expect': 'Physical examination, tests, hormonal evaluation हो सकता है'
                },
                'urologist': {
                    'name': 'Urologist',
                    'when_to_visit': 'Male reproductive health, erectile dysfunction, prostate issues के लिए',
                    'what_to_expect': 'Physical examination, blood tests, specialized tests हो सकते हैं'
                }
            },
            'hinglish': {
                'sexologist': {
                    'name': 'Sexologist',
                    'when_to_visit': 'Sexual problems, performance issues, relationship counseling ke liye',
                    'what_to_expect': 'Confidential consultation, medical history, treatment options discuss karenge'
                },
                'gynecologist': {
                    'name': 'Gynecologist',
                    'when_to_visit': 'Female reproductive health, menstrual issues, pregnancy ke liye',
                    'what_to_expect': 'Physical examination, tests, hormonal evaluation ho sakta hai'
                },
                'urologist': {
                    'name': 'Urologist',
                    'when_to_visit': 'Male reproductive health, erectile dysfunction, prostate issues ke liye',
                    'what_to_expect': 'Physical examination, blood tests, specialized tests ho sakte hain'
                }
            },
            'english': {
                'sexologist': {
                    'name': 'Sexologist',
                    'when_to_visit': 'For sexual problems, performance issues, relationship counseling',
                    'what_to_expect': 'Confidential consultation, medical history review, discussion of treatment options'
                },
                'gynecologist': {
                    'name': 'Gynecologist',
                    'when_to_visit': 'For female reproductive health, menstrual issues, pregnancy',
                    'what_to_expect': 'Physical examination, tests, possible hormonal evaluation'
                },
                'urologist': {
                    'name': 'Urologist',
                    'when_to_visit': 'For male reproductive health, erectile dysfunction, prostate issues',
                    'what_to_expect': 'Physical examination, blood tests, possible specialized tests'
                }
            }
        }
        
        return [specialist_info[language].get(spec, {}) for spec in specialists if spec in specialist_info[language]]
    
    def _get_doctor_consultation_guidelines(self, categories: List[str], urgency: str, language: str) -> List[str]:
        """Get guidelines for when to see a doctor"""
        guidelines = {
            'hindi': {
                'immediate': [
                    "तुरंत doctor से मिलें यदि severe pain या bleeding है",
                    "Sudden complete loss of sexual function में immediate consultation जरूरी है",
                    "Severe depression या suicidal thoughts में emergency help लें"
                ],
                'urgent': [
                    "2-3 weeks से persistent symptoms हों तो doctor से मिलें",
                    "Medication side effects affect कर रहे हों तो consult करें",
                    "Relationship significantly impact हो रहा हो तो help लें"
                ],
                'routine': [
                    "Annual sexual health checkup कराएं",
                    "Regular STD screening जरूरी है",
                    "Preventive care के लिए regular visits करें"
                ]
            },
            'hinglish': {
                'immediate': [
                    "Turant doctor se milo agar severe pain ya bleeding hai",
                    "Sudden complete loss of sexual function mein immediate consultation zaroori hai",
                    "Severe depression ya suicidal thoughts mein emergency help lo"
                ],
                'urgent': [
                    "2-3 weeks se persistent symptoms hon to doctor se milo",
                    "Medication side effects affect kar rahe hon to consult karo",
                    "Relationship significantly impact ho raha ho to help lo"
                ],
                'routine': [
                    "Annual sexual health checkup karao",
                    "Regular STD screening zaroori hai",
                    "Preventive care ke liye regular visits karo"
                ]
            },
            'english': {
                'immediate': [
                    "See a doctor immediately if there's severe pain or bleeding",
                    "Sudden complete loss of sexual function requires immediate consultation",
                    "Seek emergency help for severe depression or suicidal thoughts"
                ],
                'urgent': [
                    "Consult a doctor if symptoms persist for 2-3 weeks",
                    "If medication side effects are affecting you, seek consultation",
                    "Get help if your relationship is significantly impacted"
                ],
                'routine': [
                    "Get annual sexual health checkups",
                    "Regular STD screening is important",
                    "Make regular visits for preventive care"
                ]
            }
        }
        
        if urgency == 'high':
            return guidelines[language]['immediate']
        elif urgency == 'medium':
            return guidelines[language]['urgent']
        else:
            return guidelines[language]['routine']
    
    def _get_self_care_measures(self, categories: List[str], language: str) -> List[str]:
        """Get self-care measures"""
        measures = {
            'hindi': [
                "Daily 30 minutes exercise करें - walking, yoga, swimming",
                "Balanced diet लें - fruits, vegetables, lean proteins",
                "Adequate sleep (7-8 hours) maintain करें",
                "Stress management - meditation, deep breathing",
                "Alcohol limit करें, smoking avoid करें",
                "Regular health checkups कराएं"
            ],
            'hinglish': [
                "Daily 30 minutes exercise karo - walking, yoga, swimming",
                "Balanced diet lo - fruits, vegetables, lean proteins",
                "Adequate sleep (7-8 hours) maintain karo",
                "Stress management - meditation, deep breathing",
                "Alcohol limit karo, smoking avoid karo",
                "Regular health checkups karao"
            ],
            'english': [
                "Exercise daily for 30 minutes - walking, yoga, swimming",
                "Maintain a balanced diet - fruits, vegetables, lean proteins",
                "Get adequate sleep (7-8 hours)",
                "Practice stress management - meditation, deep breathing",
                "Limit alcohol, avoid smoking",
                "Get regular health checkups"
            ]
        }
        
        return measures.get(language, measures['english'])
    
    def _get_prevention_tips(self, categories: List[str], language: str) -> List[str]:
        """Get prevention tips"""
        tips = {
            'hindi': [
                "Safe sex practices follow करें - condoms use करें",
                "Regular STD testing कराएं",
                "Personal hygiene maintain करें",
                "Multiple partners के साथ extra precautions लें",
                "Vaccination up-to-date रखें (HPV, Hepatitis B)",
                "Annual health screenings कराएं"
            ],
            'hinglish': [
                "Safe sex practices follow karo - condoms use karo",
                "Regular STD testing karao",
                "Personal hygiene maintain karo",
                "Multiple partners ke saath extra precautions lo",
                "Vaccination up-to-date rakho (HPV, Hepatitis B)",
                "Annual health screenings karao"
            ],
            'english': [
                "Follow safe sex practices - use condoms",
                "Get regular STD testing",
                "Maintain personal hygiene",
                "Take extra precautions with multiple partners",
                "Keep vaccinations up-to-date (HPV, Hepatitis B)",
                "Get annual health screenings"
            ]
        }
        
        return tips.get(language, tips['english'])