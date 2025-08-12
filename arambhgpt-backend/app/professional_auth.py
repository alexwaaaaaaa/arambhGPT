from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import Optional, List
import bcrypt
import jwt
from datetime import datetime, timedelta
import json
from .database import get_db_connection

router = APIRouter()
security = HTTPBearer()

# JWT Configuration
SECRET_KEY = "your-secret-key-for-professionals"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 1440  # 24 hours

class ProfessionalSignUp(BaseModel):
    name: str
    email: str
    password: str
    title: str
    specialization: List[str]
    experience: int
    education: str
    license: str
    chatRate: int = 50
    callRate: int = 100
    videoRate: int = 150

class ProfessionalSignIn(BaseModel):
    email: str
    password: str

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_professional_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return email
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

def get_professional_by_email(email: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("SELECT * FROM professionals WHERE email = ?", (email,))
    professional = cursor.fetchone()
    conn.close()
    
    if professional:
        return dict(professional)
    return None

@router.post("/auth/professional/register")
async def professional_register(professional_data: ProfessionalSignUp):
    """Register new professional"""
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Create professionals table if not exists
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS professionals (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                hashed_password TEXT NOT NULL,
                title TEXT NOT NULL,
                specialization TEXT NOT NULL,
                experience INTEGER NOT NULL,
                education TEXT NOT NULL,
                license_number TEXT NOT NULL,
                chat_rate INTEGER DEFAULT 50,
                call_rate INTEGER DEFAULT 100,
                video_rate INTEGER DEFAULT 150,
                rating REAL DEFAULT 0.0,
                reviews INTEGER DEFAULT 0,
                languages TEXT DEFAULT 'Hindi,English',
                availability TEXT DEFAULT 'offline',
                description TEXT,
                is_verified BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Check if professional already exists
        cursor.execute("SELECT id FROM professionals WHERE email = ?", (professional_data.email,))
        if cursor.fetchone():
            raise HTTPException(status_code=400, detail="Professional already registered")
        
        # Hash password
        hashed_password = bcrypt.hashpw(
            professional_data.password.encode('utf-8'), 
            bcrypt.gensalt()
        ).decode('utf-8')
        
        # Insert professional
        cursor.execute('''
            INSERT INTO professionals 
            (name, email, hashed_password, title, specialization, experience, 
             education, license_number, chat_rate, call_rate, video_rate)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            professional_data.name,
            professional_data.email,
            hashed_password,
            professional_data.title,
            json.dumps(professional_data.specialization),
            professional_data.experience,
            professional_data.education,
            professional_data.license,
            professional_data.chatRate,
            professional_data.callRate,
            professional_data.videoRate
        ))
        
        conn.commit()
        
        return {
            "message": "Professional application submitted successfully",
            "status": "pending_verification",
            "email": professional_data.email
        }
        
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

@router.post("/auth/professional/login")
async def professional_login(credentials: ProfessionalSignIn):
    """Professional login"""
    
    professional = get_professional_by_email(credentials.email)
    
    if not professional:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Verify password
    if not bcrypt.checkpw(credentials.password.encode('utf-8'), professional['hashed_password'].encode('utf-8')):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Check if verified
    if not professional.get('is_verified', False):
        raise HTTPException(status_code=403, detail="Account pending verification")
    
    # Create access token
    access_token = create_access_token(data={"sub": professional['email']})
    
    # Remove sensitive data
    professional_data = {
        "id": professional['id'],
        "name": professional['name'],
        "email": professional['email'],
        "title": professional['title'],
        "specialization": json.loads(professional['specialization']) if professional['specialization'] else [],
        "experience": professional['experience'],
        "rating": professional['rating'],
        "reviews": professional['reviews'],
        "availability": professional['availability'],
        "chat_rate": professional['chat_rate'],
        "call_rate": professional['call_rate'],
        "video_rate": professional['video_rate']
    }
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "professional": professional_data
    }

@router.get("/auth/professional/me")
async def get_current_professional(email: str = Depends(verify_professional_token)):
    """Get current professional info"""
    
    professional = get_professional_by_email(email)
    
    if not professional:
        raise HTTPException(status_code=404, detail="Professional not found")
    
    # Remove sensitive data
    professional_data = {
        "id": professional['id'],
        "name": professional['name'],
        "email": professional['email'],
        "title": professional['title'],
        "specialization": json.loads(professional['specialization']) if professional['specialization'] else [],
        "experience": professional['experience'],
        "education": professional['education'],
        "license_number": professional['license_number'],
        "chat_rate": professional['chat_rate'],
        "call_rate": professional['call_rate'],
        "video_rate": professional['video_rate'],
        "rating": professional['rating'],
        "reviews": professional['reviews'],
        "languages": professional['languages'],
        "availability": professional['availability'],
        "description": professional['description'],
        "is_verified": professional['is_verified']
    }
    
    return professional_data

@router.put("/auth/professional/availability")
async def update_availability(
    availability_data: dict,
    email: str = Depends(verify_professional_token)
):
    """Update professional availability status"""
    
    availability = availability_data.get('availability')
    if availability not in ['online', 'offline', 'busy']:
        raise HTTPException(status_code=400, detail="Invalid availability status")
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute(
            "UPDATE professionals SET availability = ? WHERE email = ?",
            (availability, email)
        )
        conn.commit()
        
        return {"message": "Availability updated successfully", "availability": availability}
        
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

@router.get("/professional/stats")
async def get_professional_stats(email: str = Depends(verify_professional_token)):
    """Get professional statistics"""
    
    # Mock data for demo
    return {
        "today_sessions": 8,
        "active_patients": 24,
        "today_earnings": 12500,
        "rating": 4.8,
        "total_reviews": 156,
        "weekly_sessions": 42,
        "weekly_earnings": 84500,
        "monthly_earnings": 325000
    }

@router.get("/professional/patients")
async def get_professional_patients(email: str = Depends(verify_professional_token)):
    """Get professional's patients"""
    
    # Mock data for demo
    return {
        "patients": [
            {
                "id": "1",
                "name": "Rahul Sharma",
                "age": 28,
                "lastSession": "2024-01-08",
                "status": "waiting",
                "condition": "Anxiety Disorder",
                "priority": "high"
            },
            {
                "id": "2", 
                "name": "Priya Patel",
                "age": 32,
                "lastSession": "2024-01-07",
                "status": "active",
                "condition": "Depression",
                "priority": "medium"
            },
            {
                "id": "3",
                "name": "Amit Kumar", 
                "age": 25,
                "lastSession": "2024-01-06",
                "status": "completed",
                "condition": "Relationship Issues",
                "priority": "low"
            }
        ]
    }

@router.get("/professional/sessions")
async def get_professional_sessions(
    date: str = None,
    email: str = Depends(verify_professional_token)
):
    """Get professional's sessions"""
    
    # Mock data for demo
    return {
        "sessions": [
            {
                "id": "1",
                "patientName": "Rahul Sharma",
                "type": "video",
                "time": "10:00 AM",
                "duration": 45,
                "amount": 1500,
                "status": "scheduled"
            },
            {
                "id": "2",
                "patientName": "Priya Patel", 
                "type": "chat",
                "time": "11:30 AM",
                "duration": 30,
                "amount": 900,
                "status": "active"
            },
            {
                "id": "3",
                "patientName": "Amit Kumar",
                "type": "voice", 
                "time": "9:00 AM",
                "duration": 60,
                "amount": 2000,
                "status": "completed"
            }
        ]
    }

@router.put("/professional/profile")
async def update_professional_profile(
    profile_data: dict,
    email: str = Depends(verify_professional_token)
):
    """Update professional profile"""
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Update professional profile
        update_fields = []
        update_values = []
        
        if 'chat_rate' in profile_data:
            update_fields.append('chat_rate = ?')
            update_values.append(profile_data['chat_rate'])
            
        if 'call_rate' in profile_data:
            update_fields.append('call_rate = ?')
            update_values.append(profile_data['call_rate'])
            
        if 'video_rate' in profile_data:
            update_fields.append('video_rate = ?')
            update_values.append(profile_data['video_rate'])
            
        if 'description' in profile_data:
            update_fields.append('description = ?')
            update_values.append(profile_data['description'])
        
        if update_fields:
            update_values.append(email)
            cursor.execute(
                f"UPDATE professionals SET {', '.join(update_fields)} WHERE email = ?",
                update_values
            )
            conn.commit()
        
        # Return updated professional data
        professional = get_professional_by_email(email)
        if professional:
            professional_data = {
                "id": professional['id'],
                "name": professional['name'],
                "email": professional['email'],
                "title": professional['title'],
                "specialization": json.loads(professional['specialization']) if professional['specialization'] else [],
                "experience": professional['experience'],
                "education": professional['education'],
                "license_number": professional['license_number'],
                "chat_rate": professional['chat_rate'],
                "call_rate": professional['call_rate'],
                "video_rate": professional['video_rate'],
                "rating": professional['rating'],
                "reviews": professional['reviews'],
                "languages": professional['languages'],
                "availability": professional['availability'],
                "description": professional['description'],
                "is_verified": professional['is_verified']
            }
            return professional_data
        
        raise HTTPException(status_code=404, detail="Professional not found")
        
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()