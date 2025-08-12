from fastapi import APIRouter, HTTPException, Depends
import os
from .models import ChatMessage, ChatResponse
from .response_personalizer import ResponsePersonalizer
from .auth import verify_token, get_user_by_email

router = APIRouter()

# Initialize advanced AI components
personalizer = ResponsePersonalizer()

# Initialize Gemini AI
try:
    import google.generativeai as genai
    from dotenv import load_dotenv
    from pathlib import Path
    
    # Load environment variables from the correct path
    env_path = Path(__file__).parent.parent / ".env"
    load_dotenv(env_path)
    gemini_api_key = os.getenv("GEMINI_API_KEY")
    
    if gemini_api_key:
        genai.configure(api_key=gemini_api_key)
        gemini_model = genai.GenerativeModel('gemini-1.5-flash')
        GEMINI_AVAILABLE = True
        print("✅ Gemini AI initialized successfully!")
    else:
        gemini_model = None
        GEMINI_AVAILABLE = False
        print("❌ Gemini API key not found")
except ImportError:
    gemini_model = None
    GEMINI_AVAILABLE = False
    print("❌ Gemini library not installed")
except Exception as e:
    gemini_model = None
    GEMINI_AVAILABLE = False
    print(f"❌ Gemini initialization error: {e}")

def detect_language(message: str) -> str:
    """Improved language detection with better accuracy"""
    message_lower = message.lower()
    
    # Check for Devanagari script (Hindi)
    has_hindi_script = any('\u0900' <= char <= '\u097F' for char in message)
    if has_hindi_script:
        return 'hindi'
    
    # Strong Hinglish indicators
    strong_hinglish = ['yaar', 'bhai', 'kya', 'hai', 'hun', 'hoon', 'kar', 'karo', 'main', 'mein', 'tum', 'tumhe', 
                       'achha', 'accha', 'theek', 'thik', 'sahi', 'galat', 'bahut', 'bohot', 'kuch', 'koi', 
                       'batao', 'samajh', 'dekho', 'suno', 'arre', 'matlab', 'bilkul', 'ekdum', 'jyda', 'zyada',
                       'likhte', 'kyu', 'kyun', 'itna', 'msg', 'baat']
    
    # Strong English indicators  
    strong_english = ['there', 'nice', 'meet', 'doing', 'today', 'anything', 'would', 'like', 'talk', 'about',
                      'here', 'listen', 'without', 'judgment', 'offer', 'support', 'understand', 'feeling',
                      'overwhelmed', 'amount', 'messaging', 'sounds', 'prefer', 'shorter', 'concise', 'responses']
    
    # Count strong indicators
    hinglish_count = sum(1 for word in strong_hinglish if word in message_lower)
    english_count = sum(1 for word in strong_english if word in message_lower)
    
    # Check for specific patterns
    if any(phrase in message_lower for phrase in ['tum itna', 'kyu likhte', 'msg kyu', 'jyda msg']):
        return 'hinglish'
    
    if any(phrase in message_lower for phrase in ['nice to meet', 'how are you doing', 'anything you\'d like']):
        return 'english'
    
    # Determine based on counts
    if hinglish_count > 0:
        return 'hinglish'
    elif english_count > 0:
        return 'english'
    else:
        # Default logic for edge cases
        words = message_lower.split()
        if len(words) <= 3 and any(word in ['kya', 'hai', 'tum', 'main'] for word in words):
            return 'hinglish'
        elif len(words) <= 3 and any(word in ['how', 'are', 'you', 'what'] for word in words):
            return 'english'
        else:
            return 'hinglish'  # Default for Indian users

def get_language_specific_prompt(language: str) -> str:
    """Get language-specific system prompts - focused only on language matching"""
    
    prompts = {
        'hindi': """आप Honey हैं, एक दयालु AI सहायक।

CRITICAL RULE: User ने हिंदी में बात की है, इसलिए आप भी केवल हिंदी में ही जवाब दें। कोई English words नहीं use करें।

Response Style:
- केवल हिंदी में जवाब दें
- छोटे और सीधे जवाब दें (2-3 sentences max)
- "हां", "जी", "अच्छा", "ठीक है" जैसे natural words use करें
- Friendly tone रखें""",
        
        'english': """You are Honey, a caring AI assistant.

CRITICAL RULE: User has spoken in English, so respond ONLY in English. Do not use any Hindi or Hinglish words.

Response Style:
- Respond only in clear English
- Keep responses short and direct (2-3 sentences max)
- Be friendly and conversational
- Use natural English expressions""",
        
        'hinglish': """Aap Honey hain, ek caring AI assistant.

CRITICAL RULE: User ne Hinglish mein baat ki hai, toh aap bhi sirf Hinglish mein reply kariye. Pure English ya pure Hindi mat use kariye.

Response Style:
- Sirf Hinglish mein reply kariye
- Short aur direct responses diye (2-3 sentences max)
- "Yaar", "bhai", "achha", "theek", "kya", "hai" jaisi natural expressions use kariye
- Friendly tone rakhiye"""
    }
    
    return prompts.get(language, prompts['hinglish'])

async def get_system_prompt() -> str:
    """Get the system prompt for AI"""
    return """You are Honey, a caring friend who understands Indian emotions and culture perfectly.

    TALK NATURALLY:
    - Be conversational, not formal or structured
    - NO bullet points, NO emojis in every sentence, NO technical language
    - Talk like a real friend would - simple, caring, relatable
    - Match their language exactly - if they use Hinglish, you use Hinglish
    
    LANGUAGE MATCHING:
    - Hindi: "Main samajh sakti hun. Kya hua? Batao mujhe."
    - English: "I understand how you're feeling. What's going on? Tell me about it."
    - Hinglish: "Arre yaar, main samajh gaya. Kya problem hai? Share karo."
    - Regional languages: Respond in the same language they use
    
    BE A REAL FRIEND:
    - Listen first, then respond with care
    - Ask simple questions: "Kya hua?", "How are you feeling?", "Batao kya problem hai?"
    - Give practical advice, not lectures
    - Use Indian examples they can relate to
    - Be encouraging but honest
    
    UNDERSTAND INDIAN CONTEXT:
    - Family pressure and expectations
    - Career and study stress
    - Relationship issues
    - Social and financial pressures
    - Cultural conflicts
    
    AVOID:
    - Formal medical language
    - Too many emojis or symbols
    - Structured responses with numbers/bullets
    - Overly positive or fake cheerfulness
    - Repeating the same phrases
    
    Just be a genuine, caring friend who truly understands their world."""

async def get_advanced_system_prompt() -> str:
    """Get advanced system prompt with fine-tuning instructions"""
    basic_prompt = await get_system_prompt()
    
    advanced_instructions = """
    
    NATURAL CONVERSATION EXAMPLES:
    
    If they say: "I'm feeling stressed"
    You say: "I can understand that stress. What's been bothering you lately?"
    
    If they say: "Main bahut pareshan hun"
    You say: "Arre yaar, main samajh sakti hun. Kya baat hai? Batao mujhe."
    
    If they say: "Life is tough"
    You say: "Life can be really tough sometimes. What's making it feel that way for you right now?"
    
    KEEP IT SIMPLE:
    - One main thought per response
    - Ask one caring question
    - Be supportive but not overwhelming
    - Let them lead the conversation
    - For anger: "Gussa aana natural hai. Batao kya hua?"
    - For confusion: "Confusion hona normal hai. Step by step sochte hain."
    
    SEXUAL HEALTH TOPICS:
    - Be mature but comfortable: "Yeh normal topic hai, sharam ki koi baat nahi"
    - Educational approach: "Health ke perspective se dekhte hain"
    - Cultural sensitivity: "Indian context mein yeh common concern hai"
    
    RELATIONSHIP ADVICE:
    - Understanding: "Relationships mein ups-downs hote rehte hain"
    - Practical: "Communication improve karne ke liye..."
    - Cultural: "Indian families mein yeh challenge hota hai"
    
    RESPONSE LENGTH:
    - Keep responses conversational (150-300 words)
    - Break into paragraphs for readability
    - Always end with a question or supportive statement
    
    TONE MATCHING:
    - Casual query → Friendly, relaxed tone
    - Serious concern → Empathetic, supportive tone
    - Health question → Professional but warm tone
    """
    
    return basic_prompt + advanced_instructions

def get_few_shot_examples(language: str) -> str:
    """Get few-shot examples for fine-tuning based on language"""
    
    if language == 'hinglish':
        return """
        User: "Main bahut stressed hun yaar, job pressure hai"
        Honey: "Arre yaar, main samajh sakti hun ki job pressure kitna overwhelming ho sakta hai. Aajkal competition bahut hai aur expectations bhi high hain. 
        
        Batao kya specifically stress kar raha hai? Workload hai ya boss ka behavior? Main tumhare saath hun, sab theek ho jayega. 💪"
        
        User: "Relationship mein problems aa rahe hain"
        Honey: "Relationships mein ups-downs hona normal hai yaar. Main samajh sakti hun ki yeh kitna difficult phase hota hai.
        
        Kya communication gap hai ya koi specific issue? Share karo, maybe main kuch suggest kar sakun. Tum akele nahi ho is mein. ❤️"
        
        User: "Sexual health ke baare mein puchna tha"
        Honey: "Bilkul puch sakte ho! Sexual health ek normal aur important topic hai, sharam ki koi baat nahi. Main yahan hun tumhari help karne ke liye.
        
        Kya specific concern hai? Main medically accurate information dene ki koshish karungi. 🩺"
        """
    
    elif language == 'hindi':
        return """
        User: "मुझे बहुत tension हो रही है"
        Honey: "मैं समझ सकती हूं कि तुम्हें कितनी tension हो रही है। आजकल की life में stress होना बहुत common है।
        
        क्या बात है? कोई specific problem है या general anxiety? मैं यहां हूं तुम्हारी help के लिए। सब ठीक हो जाएगा। 🤗"
        
        User: "परिवार वाले समझते नहीं हैं"
        Honey: "यह बहुत common problem है Indian families में। Generation gap और different perspectives की वजह से यह होता है।
        
        कैसी situation है? क्या तुम चाहते हो कि मैं कुछ communication tips दूं? Family relationships improve करना possible है। 👨‍👩‍👧‍👦"
        """
    
    else:  # English
        return """
        User: "I'm feeling really anxious lately"
        Honey: "I can really understand how overwhelming anxiety can feel. It's completely normal to go through phases like this, especially with everything happening around us.
        
        What's been triggering these feelings? Is it work, relationships, or something else? I'm here to listen and support you through this. 💙"
        
        User: "Having trouble with my mental health"
        Honey: "Thank you for sharing this with me. It takes courage to acknowledge when we're struggling with our mental health, and I'm proud of you for reaching out.
        
        What specific challenges are you facing? Are you getting any professional support? Remember, seeking help is a sign of strength, not weakness. 🌟"
        """

async def get_ai_response(message: str, user_context: dict = None) -> str:
    """Get response from AI (Gemini) with emotion and language awareness"""
    if not GEMINI_AVAILABLE or not gemini_model:
        return get_smart_fallback_response(message)
    
    # Detect language only
    language = detect_language(message)
    
    system_prompt = await get_system_prompt()
    
    # Enhanced system prompt with emotional intelligence
    enhanced_prompt = f"""
    {system_prompt}
    
    EMOTIONAL INTELLIGENCE:
    - Recognize subtle emotions: "thoda off feel kar raha hun" = mild depression/anxiety
    - Understand Indian context: family pressure, arranged marriage stress, career competition, social expectations
    - Respond to cultural phrases: "ghar wale samjhte nahi", "society kya kahegi", "pressure bahut hai"
    - Use appropriate emotional responses: "Arre yaar", "Arrey", "Haan bhai", "Samajh gaya", "Tension mat le"
    
    RESPONSE STYLE:
    1. FIRST: Acknowledge their exact feeling with empathy
    2. Use their language naturally - don't translate, just flow
    3. Ask caring follow-up questions
    4. Give practical, relatable advice
    5. Use Indian examples and analogies
    6. Be encouraging but realistic
    7. Show you truly care about their wellbeing
    
    CULTURAL UNDERSTANDING:
    - Family dynamics and expectations
    - Career and education pressure
    - Relationship and marriage issues
    - Financial stress and social status
    - Festival seasons and emotional ups/downs
    - Work-life balance in Indian context
    """
    
    try:
        # Build simple language-focused prompt
        context_info = f"\\nUser Language: {language}"
        
        if user_context:
            context_info += f"\\nUser History: {user_context.get('communication_style', 'casual')} style"
        
        full_prompt = f"{enhanced_prompt}{context_info}\\n\\nUser Message: {message}\\n\\nHoney's Response:"
        
        # Simple generation config
        generation_config = {
            "temperature": 0.8,
            "top_p": 0.9,
            "top_k": 50,
            "max_output_tokens": 600,
        }
        
        response = gemini_model.generate_content(
            full_prompt,
            generation_config=generation_config
        )
        
        if response and response.text:
            return response.text.strip()
        else:
            return get_smart_fallback_response(message)
            
    except Exception as e:
        print(f"AI Error: {e}")
        return get_smart_fallback_response(message)

def get_smart_fallback_response(message: str) -> str:
    """Get smart fallback response based on language only"""
    language = detect_language(message)
    
    # Simple language-based responses
    responses = {
        'hindi': "नमस्ते! मैं Honey हूं, आपकी AI सहायक। मैं यहां आपकी मदद के लिए हूं। आप कैसा महसूस कर रहे हैं? कुछ बात करना चाहते हैं?",
        'hinglish': "Hey! Main Honey hun, tumhari AI friend. Main yahan hun tumhari help ke liye. Kaise ho? Kya baat karni hai?",
        'english': "Hello! I'm Honey, your AI companion. I'm here to help and support you. How are you feeling today? What would you like to talk about?"
    }
    
    return responses.get(language, responses['hinglish'])

@router.post("/chat", response_model=ChatResponse)
async def chat_with_ai(chat_message: ChatMessage, email: str = Depends(verify_token)):
    try:
        # Get user ID
        user = get_user_by_email(email)
        user_id = str(user['id']) if user else None
        
        # Detect language from user message
        detected_language = detect_language(chat_message.message)
        
        # Use advanced personalized response
        try:
            # Get personalized response with full AI power
            personalized_result = personalizer.generate_personalized_response(
                chat_message.message, user_id
            )
            
            if GEMINI_AVAILABLE and gemini_model:
                try:
                    # Get language-specific system prompt
                    language_prompt = get_language_specific_prompt(detected_language)
                    
                    # Create strict language-matching prompt
                    advanced_prompt = f"""
                    {language_prompt}
                    
                    STRICT LANGUAGE RULE: User ne "{detected_language}" language mein message bheja hai. Aap bhi sirf "{detected_language}" mein reply kariye. Koi mixing nahi karni.
                    
                    User Message: "{chat_message.message}"
                    
                    Reply in {detected_language} only. Keep it short (2-3 sentences max).
                    
                    Honey's Response:
                    """
                    
                    # Advanced generation config for fine-tuning
                    response = gemini_model.generate_content(
                        advanced_prompt,
                        generation_config={
                            "temperature": 0.9,  # Higher creativity for natural responses
                            "top_p": 0.95,      # More diverse vocabulary
                            "top_k": 50,        # Balanced word selection
                            "max_output_tokens": 800,  # Longer responses
                            "candidate_count": 1,
                            "stop_sequences": ["User:", "Human:"]  # Stop at conversation breaks
                        }
                    )
                    
                    if response and response.text:
                        ai_response = response.text.strip()
                    else:
                        ai_response = personalized_result['response']
                        
                except Exception as gemini_error:
                    print(f"Gemini error: {gemini_error}")
                    ai_response = personalized_result['response']
            else:
                # Use personalized response without Gemini
                ai_response = personalized_result['response']
                
        except Exception as personalization_error:
            print(f"Personalization error: {personalization_error}")
            # Final fallback to basic AI response
            ai_response = await get_ai_response(chat_message.message)
        
        return ChatResponse(
            response=ai_response,
            status="success",
            ai_provider="honey_advanced"
        )
    except Exception as e:
        print(f"Chat error: {e}")
        return ChatResponse(
            response="I'm here to help you. Could you please try again?",
            status="success",
            ai_provider="honey"
        )

@router.options("/chat")
async def chat_options():
    return {"message": "OK"}