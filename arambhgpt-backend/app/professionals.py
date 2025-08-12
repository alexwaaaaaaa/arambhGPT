from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from datetime import datetime
from .database import get_db_connection
from .auth import verify_token, get_user_by_email
from .models import User

router = APIRouter()

# Professional data structure
class Professional:
    def __init__(self, id: str, name: str, title: str, specialization: List[str], 
                 experience: int, rating: float, reviews: int, languages: List[str],
                 price_chat: int, price_call: int, price_video: int, 
                 availability: str, description: str):
        self.id = id
        self.name = name
        self.title = title
        self.specialization = specialization
        self.experience = experience
        self.rating = rating
        self.reviews = reviews
        self.languages = languages
        self.price_chat = price_chat
        self.price_call = price_call
        self.price_video = price_video
        self.availability = availability
        self.description = description

# Sample professionals data
PROFESSIONALS = [
    Professional(
        id="1",
        name="Dr. Priya Sharma",
        title="Clinical Psychologist",
        specialization=["Anxiety", "Depression", "Relationship Issues"],
        experience=8,
        rating=4.8,
        reviews=1250,
        languages=["Hindi", "English"],
        price_chat=50,
        price_call=100,
        price_video=150,
        availability="online",
        description="Specialized in cognitive behavioral therapy with 8+ years experience"
    ),
    Professional(
        id="2",
        name="Dr. Rajesh Kumar",
        title="Psychiatrist",
        specialization=["ADHD", "Bipolar Disorder", "Trauma"],
        experience=12,
        rating=4.9,
        reviews=890,
        languages=["Hindi", "English", "Punjabi"],
        price_chat=80,
        price_call=150,
        price_video=200,
        availability="online",
        description="Senior psychiatrist specializing in mood disorders and trauma therapy"
    ),
    Professional(
        id="3",
        name="Dr. Anita Gupta",
        title="Marriage Counselor",
        specialization=["Couples Therapy", "Family Issues", "Communication"],
        experience=6,
        rating=4.7,
        reviews=650,
        languages=["Hindi", "English"],
        price_chat=60,
        price_call=120,
        price_video=180,
        availability="busy",
        description="Expert in relationship counseling and family therapy"
    ),
    Professional(
        id="4",
        name="Dr. Amit Singh",
        title="Child Psychologist",
        specialization=["Child Therapy", "ADHD", "Learning Disabilities"],
        experience=10,
        rating=4.9,
        reviews=1100,
        languages=["Hindi", "English"],
        price_chat=70,
        price_call=140,
        price_video=190,
        availability="online",
        description="Specialized in child and adolescent mental health"
    ),
    Professional(
        id="5",
        name="Dr. Sunita Patel",
        title="Trauma Therapist",
        specialization=["PTSD", "Trauma Recovery", "Crisis Intervention"],
        experience=15,
        rating=4.8,
        reviews=800,
        languages=["Hindi", "English", "Gujarati"],
        price_chat=90,
        price_call=180,
        price_video=250,
        availability="online",
        description="Expert in trauma-informed therapy and crisis intervention"
    )
]

@router.get("/professionals")
async def get_professionals(
    category: Optional[str] = None,
    specialization: Optional[str] = None,
    availability: Optional[str] = None,
    min_rating: Optional[float] = None,
    max_price: Optional[int] = None,
    language: Optional[str] = None
):
    """Get list of available professionals with filters"""
    
    filtered_professionals = PROFESSIONALS.copy()
    
    # Apply filters
    if category:
        if category == "psychologist":
            filtered_professionals = [p for p in filtered_professionals if "psychologist" in p.title.lower()]
        elif category == "psychiatrist":
            filtered_professionals = [p for p in filtered_professionals if "psychiatrist" in p.title.lower()]
        elif category == "counselor":
            filtered_professionals = [p for p in filtered_professionals if "counselor" in p.title.lower()]
        elif category == "therapist":
            filtered_professionals = [p for p in filtered_professionals if "therapist" in p.title.lower()]
    
    if specialization:
        filtered_professionals = [p for p in filtered_professionals 
                                if any(specialization.lower() in spec.lower() for spec in p.specialization)]
    
    if availability:
        filtered_professionals = [p for p in filtered_professionals if p.availability == availability]
    
    if min_rating:
        filtered_professionals = [p for p in filtered_professionals if p.rating >= min_rating]
    
    if max_price:
        filtered_professionals = [p for p in filtered_professionals if p.price_chat <= max_price]
    
    if language:
        filtered_professionals = [p for p in filtered_professionals 
                                if any(language.lower() in lang.lower() for lang in p.languages)]
    
    # Convert to dict format
    result = []
    for p in filtered_professionals:
        result.append({
            "id": p.id,
            "name": p.name,
            "title": p.title,
            "specialization": p.specialization,
            "experience": p.experience,
            "rating": p.rating,
            "reviews": p.reviews,
            "languages": p.languages,
            "price": {
                "chat": p.price_chat,
                "call": p.price_call,
                "video": p.price_video
            },
            "availability": p.availability,
            "description": p.description
        })
    
    return {
        "professionals": result,
        "total_count": len(result),
        "filters_applied": {
            "category": category,
            "specialization": specialization,
            "availability": availability,
            "min_rating": min_rating,
            "max_price": max_price,
            "language": language
        }
    }

@router.get("/professionals/{professional_id}")
async def get_professional_detail(professional_id: str):
    """Get detailed information about a specific professional"""
    
    professional = next((p for p in PROFESSIONALS if p.id == professional_id), None)
    
    if not professional:
        raise HTTPException(status_code=404, detail="Professional not found")
    
    return {
        "id": professional.id,
        "name": professional.name,
        "title": professional.title,
        "specialization": professional.specialization,
        "experience": professional.experience,
        "rating": professional.rating,
        "reviews": professional.reviews,
        "languages": professional.languages,
        "price": {
            "chat": professional.price_chat,
            "call": professional.price_call,
            "video": professional.price_video
        },
        "availability": professional.availability,
        "description": professional.description,
        "education": [
            "PhD in Clinical Psychology - AIIMS Delhi",
            "Masters in Counseling Psychology - DU"
        ],
        "certifications": [
            "Licensed Clinical Psychologist",
            "Certified CBT Therapist",
            "Trauma-Informed Care Specialist"
        ],
        "available_slots": [
            "10:00 AM - 11:00 AM",
            "2:00 PM - 3:00 PM",
            "6:00 PM - 7:00 PM"
        ]
    }

@router.post("/professionals/{professional_id}/session/start")
async def start_session(
    professional_id: str,
    session_type: str,  # chat, call, video
    email: str = Depends(verify_token)
):
    """Start a session with a professional"""
    
    user_id = get_user_by_email(email)['id']
    professional = next((p for p in PROFESSIONALS if p.id == professional_id), None)
    
    if not professional:
        raise HTTPException(status_code=404, detail="Professional not found")
    
    if professional.availability != "online":
        raise HTTPException(status_code=400, detail="Professional is not available")
    
    # Create session record
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Create sessions table if not exists
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS professional_sessions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            professional_id TEXT NOT NULL,
            session_type TEXT NOT NULL,
            status TEXT DEFAULT 'active',
            start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            end_time TIMESTAMP,
            duration_minutes INTEGER DEFAULT 0,
            cost REAL DEFAULT 0,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    # Get price based on session type
    price_per_minute = {
        'chat': professional.price_chat,
        'call': professional.price_call,
        'video': professional.price_video
    }.get(session_type, professional.price_chat)
    
    cursor.execute(
        "INSERT INTO professional_sessions (user_id, professional_id, session_type) VALUES (?, ?, ?)",
        (user_id, professional_id, session_type)
    )
    session_id = cursor.lastrowid
    
    conn.commit()
    conn.close()
    
    return {
        "session_id": str(session_id),
        "professional": {
            "id": professional.id,
            "name": professional.name,
            "title": professional.title
        },
        "session_type": session_type,
        "price_per_minute": price_per_minute,
        "status": "active",
        "start_time": datetime.now().isoformat()
    }

@router.post("/professionals/{professional_id}/session/{session_id}/end")
async def end_session(
    professional_id: str,
    session_id: str,
    email: str = Depends(verify_token)
):
    """End a session with a professional"""
    
    user_id = get_user_by_email(email)['id']
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Get session details
    cursor.execute(
        "SELECT * FROM professional_sessions WHERE id = ? AND user_id = ? AND professional_id = ?",
        (int(session_id), user_id, professional_id)
    )
    session = cursor.fetchone()
    
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    
    # Calculate duration and cost
    start_time = datetime.fromisoformat(session['start_time'])
    end_time = datetime.now()
    duration_minutes = max(1, int((end_time - start_time).total_seconds() / 60))
    
    professional = next((p for p in PROFESSIONALS if p.id == professional_id), None)
    price_per_minute = {
        'chat': professional.price_chat,
        'call': professional.price_call,
        'video': professional.price_video
    }.get(session['session_type'], professional.price_chat)
    
    total_cost = duration_minutes * price_per_minute
    
    # Update session
    cursor.execute(
        "UPDATE professional_sessions SET status = 'completed', end_time = ?, duration_minutes = ?, cost = ? WHERE id = ?",
        (end_time.isoformat(), duration_minutes, total_cost, int(session_id))
    )
    
    conn.commit()
    conn.close()
    
    return {
        "session_id": session_id,
        "status": "completed",
        "duration_minutes": duration_minutes,
        "total_cost": total_cost,
        "end_time": end_time.isoformat()
    }

@router.get("/professionals/sessions/history")
async def get_session_history(
    email: str = Depends(verify_token)
):
    """Get user's session history with professionals"""
    
    user_id = get_user_by_email(email)['id']
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute(
        "SELECT * FROM professional_sessions WHERE user_id = ? ORDER BY start_time DESC",
        (user_id,)
    )
    sessions = cursor.fetchall()
    
    conn.close()
    
    result = []
    for session in sessions:
        professional = next((p for p in PROFESSIONALS if p.id == session['professional_id']), None)
        
        result.append({
            "session_id": str(session['id']),
            "professional": {
                "id": session['professional_id'],
                "name": professional.name if professional else "Unknown",
                "title": professional.title if professional else "Professional"
            },
            "session_type": session['session_type'],
            "status": session['status'],
            "start_time": session['start_time'],
            "end_time": session['end_time'],
            "duration_minutes": session['duration_minutes'],
            "cost": session['cost']
        })
    
    return {
        "sessions": result,
        "total_sessions": len(result),
        "total_spent": sum(s['cost'] or 0 for s in sessions)
    }

from pydantic import BaseModel

class ProfessionalProfileUpdate(BaseModel):
    name: str
    email: str
    title: str
    specialization: List[str]
    experience: int
    bio: str
    education: List[str]
    certifications: List[str]
    languages: List[str]
    availability: str
    rates: dict
    location: dict
    phone: Optional[str] = None
    website: Optional[str] = None
    socialLinks: Optional[dict] = None

@router.put("/api/professionals/profile")
async def update_professional_profile(profile_data: ProfessionalProfileUpdate):
    """Update professional profile and rates"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Update professional rates
        cursor.execute("""
            INSERT OR REPLACE INTO professional_rates 
            (id, professional_id, chat_rate, voice_rate, video_rate, updated_at)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (
            f"rate_{profile_data.email}",
            profile_data.email,
            profile_data.rates.get('chat', 5.0),
            profile_data.rates.get('voice', 8.0),
            profile_data.rates.get('video', 12.0),
            datetime.utcnow().isoformat()
        ))
        
        # Update professional profile
        cursor.execute("""
            INSERT OR REPLACE INTO professional_profiles 
            (id, professional_id, bio, specialization, education, certifications, 
             languages, location_city, location_country, phone, website, 
             linkedin, twitter, availability, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            f"profile_{profile_data.email}",
            profile_data.email,
            profile_data.bio,
            ','.join(profile_data.specialization),
            ','.join(profile_data.education),
            ','.join(profile_data.certifications),
            ','.join(profile_data.languages),
            profile_data.location.get('city', ''),
            profile_data.location.get('country', ''),
            profile_data.phone,
            profile_data.website,
            profile_data.socialLinks.get('linkedin', '') if profile_data.socialLinks else '',
            profile_data.socialLinks.get('twitter', '') if profile_data.socialLinks else '',
            profile_data.availability,
            datetime.utcnow().isoformat()
        ))
        
        conn.commit()
        conn.close()
        
        return {
            "success": True,
            "message": "Professional profile updated successfully"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update profile: {str(e)}")

@router.get("/api/professionals/profile/{professional_id}")
async def get_professional_profile(professional_id: str):
    """Get professional profile data"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Get profile data
        cursor.execute("""
            SELECT * FROM professional_profiles 
            WHERE professional_id = ?
        """, (professional_id,))
        
        profile = cursor.fetchone()
        
        # Get rates data
        cursor.execute("""
            SELECT * FROM professional_rates 
            WHERE professional_id = ?
        """, (professional_id,))
        
        rates = cursor.fetchone()
        conn.close()
        
        if profile:
            return {
                "id": profile['professional_id'],
                "bio": profile['bio'],
                "specialization": profile['specialization'].split(',') if profile['specialization'] else [],
                "education": profile['education'].split(',') if profile['education'] else [],
                "certifications": profile['certifications'].split(',') if profile['certifications'] else [],
                "languages": profile['languages'].split(',') if profile['languages'] else [],
                "location": {
                    "city": profile['location_city'],
                    "country": profile['location_country']
                },
                "phone": profile['phone'],
                "website": profile['website'],
                "socialLinks": {
                    "linkedin": profile['linkedin'],
                    "twitter": profile['twitter']
                },
                "availability": profile['availability'],
                "rates": {
                    "chat": rates['chat_rate'] if rates else 5.0,
                    "voice": rates['voice_rate'] if rates else 8.0,
                    "video": rates['video_rate'] if rates else 12.0
                }
            }
        else:
            # Return default profile
            return {
                "id": professional_id,
                "bio": "",
                "specialization": [],
                "education": [],
                "certifications": [],
                "languages": [],
                "location": {"city": "", "country": ""},
                "phone": "",
                "website": "",
                "socialLinks": {"linkedin": "", "twitter": ""},
                "availability": "online",
                "rates": {"chat": 5.0, "voice": 8.0, "video": 12.0}
            }
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching profile: {str(e)}")