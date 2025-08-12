from fastapi import APIRouter, HTTPException, Depends, status
from typing import List, Optional
from datetime import datetime, timedelta
import sqlite3
import json
import uuid
from .auth import verify_token, get_user_by_email
from .database import get_db_connection
from .models import *

router = APIRouter(prefix="/social", tags=["social"])

def init_social_tables():
    """Initialize advanced social features tables"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Enhanced support_groups table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS support_groups (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            description TEXT NOT NULL,
            category TEXT NOT NULL,
            member_count INTEGER DEFAULT 0,
            is_private BOOLEAN DEFAULT FALSE,
            is_verified BOOLEAN DEFAULT FALSE,
            max_members INTEGER DEFAULT 100,
            tags TEXT,
            rules TEXT,
            cover_image TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            moderators TEXT,
            activity_score INTEGER DEFAULT 0,
            weekly_messages INTEGER DEFAULT 0
        )
    ''')
    
    # Enhanced group_members table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS group_members (
            group_id TEXT,
            user_id TEXT,
            joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            is_moderator BOOLEAN DEFAULT FALSE,
            is_admin BOOLEAN DEFAULT FALSE,
            role TEXT DEFAULT 'member',
            status TEXT DEFAULT 'active',
            contribution_score INTEGER DEFAULT 0,
            last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (group_id, user_id),
            FOREIGN KEY (group_id) REFERENCES support_groups (id),
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    # Enhanced group_messages table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS group_messages (
            id TEXT PRIMARY KEY,
            group_id TEXT NOT NULL,
            author_id TEXT NOT NULL,
            author_name TEXT NOT NULL,
            content TEXT NOT NULL,
            message_type TEXT DEFAULT 'text',
            is_anonymous BOOLEAN DEFAULT TRUE,
            is_pinned BOOLEAN DEFAULT FALSE,
            reactions TEXT,
            reply_to TEXT,
            attachments TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (group_id) REFERENCES support_groups (id),
            FOREIGN KEY (author_id) REFERENCES users (id)
        )
    ''')
    
    # Group events table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS group_events (
            id TEXT PRIMARY KEY,
            group_id TEXT NOT NULL,
            title TEXT NOT NULL,
            description TEXT,
            event_type TEXT NOT NULL,
            start_time TIMESTAMP NOT NULL,
            end_time TIMESTAMP,
            location TEXT,
            max_participants INTEGER,
            created_by TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (group_id) REFERENCES support_groups (id),
            FOREIGN KEY (created_by) REFERENCES users (id)
        )
    ''')
    
    # Group resources table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS group_resources (
            id TEXT PRIMARY KEY,
            group_id TEXT NOT NULL,
            title TEXT NOT NULL,
            description TEXT,
            resource_type TEXT NOT NULL,
            url TEXT,
            file_path TEXT,
            tags TEXT,
            created_by TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (group_id) REFERENCES support_groups (id),
            FOREIGN KEY (created_by) REFERENCES users (id)
        )
    ''')
    
    # User interests table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS user_interests (
            user_id TEXT,
            interest TEXT,
            weight REAL DEFAULT 1.0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (user_id, interest),
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    # Group recommendations table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS group_recommendations (
            user_id TEXT,
            group_id TEXT,
            score REAL NOT NULL,
            reason TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            PRIMARY KEY (user_id, group_id),
            FOREIGN KEY (user_id) REFERENCES users (id),
            FOREIGN KEY (group_id) REFERENCES support_groups (id)
        )
    ''')
    
    conn.commit()
    conn.close()

@router.post("/groups")
async def create_support_group(
    group_data: dict,
    email: str = Depends(verify_token)
):
    """Create a new support group"""
    user = get_user_by_email(email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        group_id = f"group_{int(datetime.now().timestamp())}"
        tags_json = json.dumps(group_data.get('tags', []))
        moderators_json = json.dumps([str(user['id'])])
        
        cursor.execute('''
            INSERT INTO support_groups 
            (id, name, description, is_private, tags, moderators)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (
            group_id, group_data['name'], group_data['description'],
            group_data.get('is_private', False), tags_json, moderators_json
        ))
        
        # Add creator as member and moderator
        cursor.execute('''
            INSERT INTO group_members (group_id, user_id, is_moderator)
            VALUES (?, ?, TRUE)
        ''', (group_id, str(user['id'])))
        
        # Update member count
        cursor.execute(
            "UPDATE support_groups SET member_count = 1 WHERE id = ?",
            (group_id,)
        )
        
        conn.commit()
        
        return {
            "id": group_id,
            "name": group_data['name'],
            "description": group_data['description'],
            "member_count": 1,
            "is_private": group_data.get('is_private', False),
            "tags": group_data.get('tags', []),
            "created_at": datetime.now().isoformat(),
            "moderators": [str(user['id'])]
        }
        
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to create group: {str(e)}")
    finally:
        conn.close()

@router.get("/groups")
async def get_support_groups(
    limit: int = 20,
    email: str = Depends(verify_token)
):
    """Get list of support groups"""
    user = get_user_by_email(email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute('''
            SELECT id, name, description, member_count, is_private, tags, 
                   created_at, moderators
            FROM support_groups 
            WHERE is_private = FALSE OR id IN (
                SELECT group_id FROM group_members WHERE user_id = ?
            )
            ORDER BY created_at DESC LIMIT ?
        ''', (str(user['id']), limit))
        
        rows = cursor.fetchall()
        groups = []
        
        for row in rows:
            groups.append({
                "id": row[0],
                "name": row[1],
                "description": row[2],
                "member_count": row[3],
                "is_private": bool(row[4]),
                "tags": json.loads(row[5]) if row[5] else [],
                "created_at": row[6],
                "moderators": json.loads(row[7]) if row[7] else []
            })
        
        return groups
        
    finally:
        conn.close()

@router.post("/groups/{group_id}/join")
async def join_support_group(
    group_id: str,
    email: str = Depends(verify_token)
):
    """Join a support group"""
    user = get_user_by_email(email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Check if group exists
        cursor.execute(
            "SELECT id, is_private FROM support_groups WHERE id = ?",
            (group_id,)
        )
        group = cursor.fetchone()
        if not group:
            raise HTTPException(status_code=404, detail="Group not found")
        
        # Check if already a member
        cursor.execute(
            "SELECT user_id FROM group_members WHERE group_id = ? AND user_id = ?",
            (group_id, str(user['id']))
        )
        if cursor.fetchone():
            raise HTTPException(status_code=400, detail="Already a member of this group")
        
        # Add user to group
        cursor.execute(
            "INSERT INTO group_members (group_id, user_id) VALUES (?, ?)",
            (group_id, str(user['id']))
        )
        
        # Update member count
        cursor.execute(
            "UPDATE support_groups SET member_count = member_count + 1 WHERE id = ?",
            (group_id,)
        )
        
        conn.commit()
        return {"message": "Successfully joined the group"}
        
    except HTTPException:
        raise
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to join group: {str(e)}")
    finally:
        conn.close()

@router.post("/groups/{group_id}/messages")
async def create_group_message(
    group_id: str,
    message_data: dict,
    email: str = Depends(verify_token)
):
    """Create a message in a support group"""
    user = get_user_by_email(email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Check if user is a member of the group
        cursor.execute(
            "SELECT user_id FROM group_members WHERE group_id = ? AND user_id = ?",
            (group_id, str(user['id']))
        )
        if not cursor.fetchone():
            raise HTTPException(status_code=403, detail="Not a member of this group")
        
        message_id = f"msg_{group_id}_{int(datetime.now().timestamp())}"
        author_name = "Anonymous" if message_data.get('is_anonymous', True) else user['name']
        
        cursor.execute('''
            INSERT INTO group_messages 
            (id, group_id, author_id, author_name, content, is_anonymous, reactions)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', (
            message_id, group_id, str(user['id']), author_name,
            message_data['content'], message_data.get('is_anonymous', True), 
            json.dumps([])
        ))
        
        conn.commit()
        
        return {
            "id": message_id,
            "group_id": group_id,
            "author_id": str(user['id']),
            "author_name": author_name,
            "content": message_data['content'],
            "is_anonymous": message_data.get('is_anonymous', True),
            "reactions": [],
            "created_at": datetime.now().isoformat()
        }
        
    except HTTPException:
        raise
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to create message: {str(e)}")
    finally:
        conn.close()

@router.get("/groups/{group_id}/messages")
async def get_group_messages(
    group_id: str,
    limit: int = 50,
    email: str = Depends(verify_token)
):
    """Get messages from a support group"""
    user = get_user_by_email(email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Check if user is a member of the group
        cursor.execute(
            "SELECT user_id FROM group_members WHERE group_id = ? AND user_id = ?",
            (group_id, str(user['id']))
        )
        if not cursor.fetchone():
            raise HTTPException(status_code=403, detail="Not a member of this group")
        
        cursor.execute('''
            SELECT id, group_id, author_id, author_name, content, is_anonymous, 
                   reactions, created_at
            FROM group_messages 
            WHERE group_id = ?
            ORDER BY created_at DESC LIMIT ?
        ''', (group_id, limit))
        
        rows = cursor.fetchall()
        messages = []
        
        for row in rows:
            messages.append({
                "id": row[0],
                "group_id": row[1],
                "author_id": row[2],
                "author_name": row[3],
                "content": row[4],
                "is_anonymous": bool(row[5]),
                "reactions": json.loads(row[6]) if row[6] else [],
                "created_at": row[7]
            })
        
        return messages
        
    finally:
        conn.close()

# Advanced Community Features

@router.get("/groups/recommended")
async def get_recommended_groups(
    limit: int = 10,
    email: str = Depends(verify_token)
):
    """Get AI-powered group recommendations based on user interests"""
    user = get_user_by_email(email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Get user's interests from their chat history and mood data
        cursor.execute('''
            SELECT content FROM messages m
            JOIN conversations c ON m.conversation_id = c.id
            WHERE c.user_id = ? AND m.sender = 'user'
            ORDER BY m.created_at DESC LIMIT 50
        ''', (user['id'],))
        
        user_messages = [row[0] for row in cursor.fetchall()]
        
        # Simple interest extraction (can be enhanced with NLP)
        interests = extract_interests_from_messages(user_messages)
        
        # Find groups matching interests
        cursor.execute('''
            SELECT g.*, 
                   (SELECT COUNT(*) FROM group_messages WHERE group_id = g.id AND created_at > datetime('now', '-7 days')) as recent_activity
            FROM support_groups g
            WHERE g.is_private = FALSE
            ORDER BY g.activity_score DESC, recent_activity DESC
            LIMIT ?
        ''', (limit,))
        
        rows = cursor.fetchall()
        recommendations = []
        
        for row in rows:
            group_tags = json.loads(row[5]) if row[5] else []
            match_score = calculate_interest_match(interests, group_tags)
            
            recommendations.append({
                "id": row[0],
                "name": row[1],
                "description": row[2],
                "category": row[3],
                "member_count": row[4],
                "tags": group_tags,
                "match_score": match_score,
                "recent_activity": row[-1],
                "created_at": row[8]
            })
        
        # Sort by match score
        recommendations.sort(key=lambda x: x['match_score'], reverse=True)
        
        return recommendations[:limit]
        
    finally:
        conn.close()

@router.get("/groups/trending")
async def get_trending_groups(
    limit: int = 10,
    email: str = Depends(verify_token)
):
    """Get trending groups based on activity"""
    user = get_user_by_email(email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute('''
            SELECT g.*,
                   (SELECT COUNT(*) FROM group_messages WHERE group_id = g.id AND created_at > datetime('now', '-24 hours')) as daily_messages,
                   (SELECT COUNT(*) FROM group_members WHERE group_id = g.id AND joined_at > datetime('now', '-7 days')) as new_members
            FROM support_groups g
            WHERE g.is_private = FALSE
            ORDER BY (daily_messages * 2 + new_members * 3 + g.activity_score) DESC
            LIMIT ?
        ''', (limit,))
        
        rows = cursor.fetchall()
        trending = []
        
        for row in rows:
            trending.append({
                "id": row[0],
                "name": row[1],
                "description": row[2],
                "category": row[3],
                "member_count": row[4],
                "tags": json.loads(row[5]) if row[5] else [],
                "daily_messages": row[-2],
                "new_members": row[-1],
                "created_at": row[8]
            })
        
        return trending
        
    finally:
        conn.close()

@router.post("/groups/{group_id}/events")
async def create_group_event(
    group_id: str,
    event_data: dict,
    email: str = Depends(verify_token)
):
    """Create a group event"""
    user = get_user_by_email(email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Check if user is moderator/admin
        cursor.execute('''
            SELECT is_moderator, is_admin FROM group_members 
            WHERE group_id = ? AND user_id = ?
        ''', (group_id, str(user['id'])))
        
        member = cursor.fetchone()
        if not member or (not member[0] and not member[1]):
            raise HTTPException(status_code=403, detail="Only moderators can create events")
        
        event_id = str(uuid.uuid4())
        
        cursor.execute('''
            INSERT INTO group_events 
            (id, group_id, title, description, event_type, start_time, end_time, location, max_participants, created_by)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            event_id, group_id, event_data['title'], event_data.get('description'),
            event_data['event_type'], event_data['start_time'], event_data.get('end_time'),
            event_data.get('location'), event_data.get('max_participants'), str(user['id'])
        ))
        
        conn.commit()
        
        return {
            "id": event_id,
            "group_id": group_id,
            "title": event_data['title'],
            "description": event_data.get('description'),
            "event_type": event_data['event_type'],
            "start_time": event_data['start_time'],
            "created_by": str(user['id']),
            "created_at": datetime.now().isoformat()
        }
        
    except HTTPException:
        raise
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to create event: {str(e)}")
    finally:
        conn.close()

@router.get("/groups/{group_id}/events")
async def get_group_events(
    group_id: str,
    email: str = Depends(verify_token)
):
    """Get group events"""
    user = get_user_by_email(email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Check if user is member
        cursor.execute(
            "SELECT user_id FROM group_members WHERE group_id = ? AND user_id = ?",
            (group_id, str(user['id']))
        )
        if not cursor.fetchone():
            raise HTTPException(status_code=403, detail="Not a member of this group")
        
        cursor.execute('''
            SELECT * FROM group_events 
            WHERE group_id = ? AND start_time > datetime('now')
            ORDER BY start_time ASC
        ''', (group_id,))
        
        rows = cursor.fetchall()
        events = []
        
        for row in rows:
            events.append({
                "id": row[0],
                "group_id": row[1],
                "title": row[2],
                "description": row[3],
                "event_type": row[4],
                "start_time": row[5],
                "end_time": row[6],
                "location": row[7],
                "max_participants": row[8],
                "created_by": row[9],
                "created_at": row[10]
            })
        
        return events
        
    finally:
        conn.close()

@router.post("/groups/{group_id}/resources")
async def add_group_resource(
    group_id: str,
    resource_data: dict,
    email: str = Depends(verify_token)
):
    """Add a resource to the group"""
    user = get_user_by_email(email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Check if user is member
        cursor.execute(
            "SELECT user_id FROM group_members WHERE group_id = ? AND user_id = ?",
            (group_id, str(user['id']))
        )
        if not cursor.fetchone():
            raise HTTPException(status_code=403, detail="Not a member of this group")
        
        resource_id = str(uuid.uuid4())
        tags_json = json.dumps(resource_data.get('tags', []))
        
        cursor.execute('''
            INSERT INTO group_resources 
            (id, group_id, title, description, resource_type, url, tags, created_by)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            resource_id, group_id, resource_data['title'], resource_data.get('description'),
            resource_data['resource_type'], resource_data.get('url'), tags_json, str(user['id'])
        ))
        
        conn.commit()
        
        return {
            "id": resource_id,
            "group_id": group_id,
            "title": resource_data['title'],
            "description": resource_data.get('description'),
            "resource_type": resource_data['resource_type'],
            "url": resource_data.get('url'),
            "tags": resource_data.get('tags', []),
            "created_by": str(user['id']),
            "created_at": datetime.now().isoformat()
        }
        
    except HTTPException:
        raise
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to add resource: {str(e)}")
    finally:
        conn.close()

@router.get("/groups/{group_id}/resources")
async def get_group_resources(
    group_id: str,
    email: str = Depends(verify_token)
):
    """Get group resources"""
    user = get_user_by_email(email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Check if user is member
        cursor.execute(
            "SELECT user_id FROM group_members WHERE group_id = ? AND user_id = ?",
            (group_id, str(user['id']))
        )
        if not cursor.fetchone():
            raise HTTPException(status_code=403, detail="Not a member of this group")
        
        cursor.execute('''
            SELECT * FROM group_resources 
            WHERE group_id = ?
            ORDER BY created_at DESC
        ''', (group_id,))
        
        rows = cursor.fetchall()
        resources = []
        
        for row in rows:
            resources.append({
                "id": row[0],
                "group_id": row[1],
                "title": row[2],
                "description": row[3],
                "resource_type": row[4],
                "url": row[5],
                "tags": json.loads(row[7]) if row[7] else [],
                "created_by": row[8],
                "created_at": row[9]
            })
        
        return resources
        
    finally:
        conn.close()

@router.get("/groups/categories")
async def get_group_categories():
    """Get available group categories"""
    return [
        {"id": "mental_health", "name": "Mental Health", "icon": "🧠"},
        {"id": "anxiety_support", "name": "Anxiety Support", "icon": "💙"},
        {"id": "depression_support", "name": "Depression Support", "icon": "🌈"},
        {"id": "relationship_advice", "name": "Relationship Advice", "icon": "💕"},
        {"id": "family_issues", "name": "Family Issues", "icon": "👨‍👩‍👧‍👦"},
        {"id": "career_stress", "name": "Career Stress", "icon": "💼"},
        {"id": "student_support", "name": "Student Support", "icon": "📚"},
        {"id": "lgbtq_support", "name": "LGBTQ+ Support", "icon": "🏳️‍🌈"},
        {"id": "addiction_recovery", "name": "Addiction Recovery", "icon": "🌟"},
        {"id": "grief_support", "name": "Grief Support", "icon": "🕊️"},
        {"id": "wellness_tips", "name": "Wellness Tips", "icon": "🌱"},
        {"id": "meditation_mindfulness", "name": "Meditation & Mindfulness", "icon": "🧘‍♀️"}
    ]

def extract_interests_from_messages(messages: List[str]) -> List[str]:
    """Extract interests from user messages using simple keyword matching"""
    interests = []
    
    # Keywords for different interests
    interest_keywords = {
        "anxiety": ["anxiety", "anxious", "tension", "टेंशन", "चिंता", "worried"],
        "depression": ["depression", "depressed", "sad", "उदास", "दुखी", "low"],
        "relationships": ["relationship", "partner", "boyfriend", "girlfriend", "marriage", "शादी"],
        "family": ["family", "parents", "ghar", "घर", "माता-पिता", "family pressure"],
        "career": ["job", "career", "work", "office", "नौकरी", "काम", "career stress"],
        "student": ["study", "exam", "college", "university", "पढ़ाई", "परीक्षा"],
        "health": ["health", "fitness", "exercise", "स्वास्थ्य", "सेहत"]
    }
    
    message_text = " ".join(messages).lower()
    
    for interest, keywords in interest_keywords.items():
        if any(keyword in message_text for keyword in keywords):
            interests.append(interest)
    
    return interests

def calculate_interest_match(user_interests: List[str], group_tags: List[str]) -> float:
    """Calculate match score between user interests and group tags"""
    if not user_interests or not group_tags:
        return 0.0
    
    matches = len(set(user_interests) & set(group_tags))
    return matches / len(set(user_interests) | set(group_tags))

# Initialize tables when module is imported
init_social_tables()