from typing import Dict, List
from .sexual_health_educator import SexualHealthEducator
from .relationship_wellness import RelationshipWellnessSupport
from .health_guidance import HealthGuidanceSystem
from .cultural_context import CulturalContextAnalyzer
from .mature_health_templates import MatureHealthTemplates

class ComprehensiveWellnessSystem:
    """Integrated system combining all 4 wellness modules"""
    
    def __init__(self):
        self.sexual_health = SexualHealthEducator()
        self.relationship_wellness = RelationshipWellnessSupport()
        self.health_guidance = HealthGuidanceSystem()
        self.cultural_context = CulturalContextAnalyzer()
        self.mature_templates = MatureHealthTemplates()
    
    def analyze_comprehensive_query(self, message: str, user_context: Dict = None) -> Dict:
        """Comprehensive analysis using all 4 modules"""
        
        # Run all analyses
        sexual_health_analysis = self.sexual_health.analyze_sexual_health_query(message)
        relationship_analysis = self.relationship_wellness.analyze_relationship_query(message)
        health_analysis = self.health_guidance.analyze_health_query(message)
        cultural_analysis = self.cultural_context.analyze_cultural_context(message, user_context)
        
        # Combine all analyses
        comprehensive_analysis = {
            'sexual_health': sexual_health_analysis,
            'relationship_wellness': relationship_analysis,
            'health_guidance': health_analysis,
            'cultural_context': cultural_analysis,
            'primary_focus': self._determine_primary_focus([
                sexual_health_analysis, relationship_analysis, 
                health_analysis, cultural_analysis
            ]),
            'integrated_approach': self._get_integrated_approach([
                sexual_health_analysis, relationship_analysis, 
                health_analysis, cultural_analysis
            ])
        }
        
        return comprehensive_analysis
    
    def _determine_primary_focus(self, analyses: List[Dict]) -> str:
        """Determine the primary focus area"""
        focus_scores = {
            'sexual_health': 0,
            'relationship_wellness': 0,
            'health_guidance': 0,
            'cultural_context': 0
        }
        
        # Score based on analysis results
        if analyses[0].get('is_sexual_health_query'):
            focus_scores['sexual_health'] += 3
        
        if analyses[1].get('is_relationship_query'):
            focus_scores['relationship_wellness'] += 3
        
        if analyses[2].get('is_health_query'):
            focus_scores['health_guidance'] += 3
        
        if analyses[3].get('cultural_sensitivity_needed'):
            focus_scores['cultural_context'] += 2
        
        # Return highest scoring focus
        return max(focus_scores.items(), key=lambda x: x[1])[0]
    
    def _get_integrated_approach(self, analyses: List[Dict]) -> List[str]:
        """Get integrated approach combining all modules"""
        approaches = []
        
        # Sexual health approaches
        if analyses[0].get('is_sexual_health_query'):
            approaches.extend(['educational_approach', 'health_focused'])
        
        # Relationship approaches
        if analyses[1].get('is_relationship_query'):
            approaches.extend(['communication_focused', 'relationship_building'])
        
        # Health guidance approaches
        if analyses[2].get('is_health_query'):
            approaches.extend(['medical_guidance', 'preventive_care'])
        
        # Cultural approaches
        if analyses[3].get('cultural_sensitivity_needed'):
            approaches.extend(['culturally_sensitive', 'family_aware'])
        
        return list(set(approaches))  # Remove duplicates
    
    def generate_comprehensive_response(self, analysis: Dict, language: str = 'hinglish') -> str:
        """Generate comprehensive response using all modules"""
        primary_focus = analysis.get('primary_focus', 'sexual_health')
        
        response_parts = []
        
        # Generate primary response based on focus
        if primary_focus == 'sexual_health':
            if analysis['sexual_health'].get('is_sexual_health_query'):
                primary_response = self.mature_templates.get_mature_health_response(
                    analysis['sexual_health'], language
                )
                response_parts.append(primary_response)
        
        elif primary_focus == 'relationship_wellness':
            if analysis['relationship_wellness'].get('is_relationship_query'):
                relationship_guidance = self.relationship_wellness.get_relationship_guidance(
                    analysis['relationship_wellness'], language
                )
                response_parts.append(relationship_guidance['main_advice'])
        
        elif primary_focus == 'health_guidance':
            if analysis['health_guidance'].get('is_health_query'):
                health_guidance = self.health_guidance.get_health_guidance(
                    analysis['health_guidance'], language
                )
                response_parts.append(health_guidance['medical_advice'])
        
        # Add cultural context if needed
        if analysis['cultural_context'].get('cultural_sensitivity_needed'):
            cultural_guidance = self.cultural_context.get_cultural_guidance(
                analysis['cultural_context'], language
            )
            if cultural_guidance['cultural_understanding']:
                response_parts.append(f"\n🌟 Cultural Context: {cultural_guidance['cultural_understanding']}")
        
        # Add health guidance if relevant
        if analysis['health_guidance'].get('requires_immediate_attention'):
            health_guidance = self.health_guidance.get_health_guidance(
                analysis['health_guidance'], language
            )
            if health_guidance['when_to_see_doctor']:
                response_parts.append(f"\n⚠️ Medical Attention: {health_guidance['when_to_see_doctor'][0]}")
        
        # Combine all parts
        if response_parts:
            final_response = '\n\n'.join(response_parts)
        else:
            # Default comprehensive response
            default_responses = {
                'hindi': "यह एक important wellness topic है। मैं आपकी comprehensive help कर सकती हूं - sexual health, relationship wellness, medical guidance, और cultural context सभी को ध्यान में रखते हुए।",
                'hinglish': "Yeh ek important wellness topic hai. Main tumhari comprehensive help kar sakti hun - sexual health, relationship wellness, medical guidance, aur cultural context sabko dhyan mein rakhte hue.",
                'english': "This is an important wellness topic. I can provide comprehensive help considering sexual health, relationship wellness, medical guidance, and cultural context."
            }
            final_response = default_responses.get(language, default_responses['english'])
        
        return final_response
    
    def get_follow_up_suggestions(self, analysis: Dict, language: str = 'hinglish') -> List[str]:
        """Get follow-up suggestions based on comprehensive analysis"""
        suggestions = []
        
        # Sexual health follow-ups
        if analysis['sexual_health'].get('is_sexual_health_query'):
            sexual_follow_ups = self.mature_templates.get_follow_up_questions(
                analysis['sexual_health'], language
            )
            suggestions.extend(sexual_follow_ups)
        
        # Relationship follow-ups
        if analysis['relationship_wellness'].get('is_relationship_query'):
            relationship_topics = analysis['relationship_wellness'].get('relationship_topics', [])
            if 'communication_skills' in relationship_topics:
                comm_suggestions = {
                    'hindi': "क्या आप specific communication techniques के बारे में जानना चाहते हैं?",
                    'hinglish': "Kya tum specific communication techniques ke baare mein jaanna chahte ho?",
                    'english': "Would you like to know about specific communication techniques?"
                }
                suggestions.append(comm_suggestions.get(language, comm_suggestions['english']))
        
        # Health guidance follow-ups
        if analysis['health_guidance'].get('is_health_query'):
            health_suggestions = {
                'hindi': "क्या आप preventive care के बारे में और जानना चाहते हैं?",
                'hinglish': "Kya tum preventive care ke baare mein aur jaanna chahte ho?",
                'english': "Would you like to know more about preventive care?"
            }
            suggestions.append(health_suggestions.get(language, health_suggestions['english']))
        
        # Cultural context follow-ups
        if analysis['cultural_context'].get('cultural_sensitivity_needed'):
            cultural_suggestions = {
                'hindi': "क्या आप family के साथ इस topic को discuss करने के तरीकों के बारे में जानना चाहते हैं?",
                'hinglish': "Kya tum family ke saath is topic ko discuss karne ke tariikon ke baare mein jaanna chahte ho?",
                'english': "Would you like to know about ways to discuss this topic with family?"
            }
            suggestions.append(cultural_suggestions.get(language, cultural_suggestions['english']))
        
        return suggestions[:3]  # Return max 3 suggestions