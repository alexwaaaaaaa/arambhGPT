from fastapi import APIRouter, HTTPException, Depends, status
from typing import List, Optional
from datetime import datetime, date, timedelta
import sqlite3
import json
from .auth import verify_token, get_user_by_email
from .models import (
    MoodEntryCreate, MoodEntryUpdate, MoodEntry, MoodStats,
    User
)
from .database import get_db_connection

router = APIRouter(prefix="/mood", tags=["mood"])

def init_mood_tables():
    """Initialize mood tracking tables"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Create mood_entries table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS mood_entries (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            date TEXT NOT NULL,
            mood INTEGER NOT NULL,
            emotions TEXT,
            notes TEXT,
            activities TEXT,
            sleep_hours REAL,
            stress_level INTEGER,
            energy_level INTEGER,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id),
            UNIQUE(user_id, date)
        )
    ''')
    
    conn.commit()
    conn.close()

@router.post("/entries", response_model=MoodEntry)
async def create_mood_entry(
    mood_data: MoodEntryCreate,
    email: str = Depends(verify_token)
):
    """Create or update a mood entry for a specific date"""
    # Get user from email
    user = get_user_by_email(email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Initialize mood tables
    init_mood_tables()
    
    try:
        entry_date = mood_data.date or date.today().isoformat()
        entry_id = f"mood_{user['id']}_{entry_date}"
        
        # Check if entry exists for this date
        cursor.execute(
            "SELECT id FROM mood_entries WHERE user_id = ? AND date = ?",
            (str(user['id']), entry_date)
        )
        existing = cursor.fetchone()
        
        emotions_json = json.dumps(mood_data.emotions)
        activities_json = json.dumps(mood_data.activities)
        
        if existing:
            # Update existing entry
            cursor.execute('''
                UPDATE mood_entries 
                SET mood = ?, emotions = ?, notes = ?, activities = ?, 
                    sleep_hours = ?, stress_level = ?, energy_level = ?, 
                    updated_at = CURRENT_TIMESTAMP
                WHERE user_id = ? AND date = ?
            ''', (
                mood_data.mood, emotions_json, mood_data.notes, activities_json,
                mood_data.sleep_hours, mood_data.stress_level, mood_data.energy_level,
                str(user['id']), entry_date
            ))
        else:
            # Create new entry
            cursor.execute('''
                INSERT INTO mood_entries 
                (id, user_id, date, mood, emotions, notes, activities, 
                 sleep_hours, stress_level, energy_level)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                entry_id, str(user['id']), entry_date, mood_data.mood,
                emotions_json, mood_data.notes, activities_json,
                mood_data.sleep_hours, mood_data.stress_level, mood_data.energy_level
            ))
        
        conn.commit()
        
        # Fetch the created/updated entry
        cursor.execute('''
            SELECT id, user_id, date, mood, emotions, notes, activities,
                   sleep_hours, stress_level, energy_level, created_at, updated_at
            FROM mood_entries WHERE user_id = ? AND date = ?
        ''', (str(user['id']), entry_date))
        
        row = cursor.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Failed to create mood entry")
        
        return MoodEntry(
            id=row[0],
            user_id=row[1],
            date=row[2],
            mood=row[3],
            emotions=json.loads(row[4]) if row[4] else [],
            notes=row[5],
            activities=json.loads(row[6]) if row[6] else [],
            sleep_hours=row[7],
            stress_level=row[8],
            energy_level=row[9],
            created_at=datetime.fromisoformat(row[10]),
            updated_at=datetime.fromisoformat(row[11])
        )
        
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to save mood entry: {str(e)}")
    finally:
        conn.close()

@router.get("/entries", response_model=List[MoodEntry])
async def get_mood_entries(
    days: int = 30,
    email: str = Depends(verify_token)
):
    """Get mood entries for the current user"""
    # Get user from email
    user = get_user_by_email(email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Initialize mood tables
    init_mood_tables()
    
    try:
        # Calculate date range
        end_date = date.today()
        start_date = end_date - timedelta(days=days)
        
        cursor.execute('''
            SELECT id, user_id, date, mood, emotions, notes, activities,
                   sleep_hours, stress_level, energy_level, created_at, updated_at
            FROM mood_entries 
            WHERE user_id = ? AND date >= ? AND date <= ?
            ORDER BY date DESC
        ''', (str(user['id']), start_date.isoformat(), end_date.isoformat()))
        
        rows = cursor.fetchall()
        entries = []
        
        for row in rows:
            entries.append(MoodEntry(
                id=row[0],
                user_id=row[1],
                date=row[2],
                mood=row[3],
                emotions=json.loads(row[4]) if row[4] else [],
                notes=row[5],
                activities=json.loads(row[6]) if row[6] else [],
                sleep_hours=row[7],
                stress_level=row[8],
                energy_level=row[9],
                created_at=datetime.fromisoformat(row[10]),
                updated_at=datetime.fromisoformat(row[11])
            ))
        
        return entries
        
    finally:
        conn.close()

@router.get("/entries/{entry_date}", response_model=MoodEntry)
async def get_mood_entry_by_date(
    entry_date: str,
    email: str = Depends(verify_token)
):
    """Get mood entry for a specific date"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute('''
            SELECT id, user_id, date, mood, emotions, notes, activities,
                   sleep_hours, stress_level, energy_level, created_at, updated_at
            FROM mood_entries 
            WHERE user_id = ? AND date = ?
        ''', (current_user.id, entry_date))
        
        row = cursor.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Mood entry not found")
        
        return MoodEntry(
            id=row[0],
            user_id=row[1],
            date=row[2],
            mood=row[3],
            emotions=json.loads(row[4]) if row[4] else [],
            notes=row[5],
            activities=json.loads(row[6]) if row[6] else [],
            sleep_hours=row[7],
            stress_level=row[8],
            energy_level=row[9],
            created_at=datetime.fromisoformat(row[10]),
            updated_at=datetime.fromisoformat(row[11])
        )
        
    finally:
        conn.close()

@router.get("/stats", response_model=MoodStats)
async def get_mood_stats(
    days: int = 30,
    email: str = Depends(verify_token)
):
    """Get mood statistics for the current user"""
    # Get user from email
    user = get_user_by_email(email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Calculate date range
        end_date = date.today()
        start_date = end_date - timedelta(days=days)
        
        # Get all mood entries in range
        cursor.execute('''
            SELECT mood, date FROM mood_entries 
            WHERE user_id = ? AND date >= ? AND date <= ?
            ORDER BY date ASC
        ''', (str(user['id']), start_date.isoformat(), end_date.isoformat()))
        
        rows = cursor.fetchall()
        
        if not rows:
            return MoodStats(
                average_mood=0.0,
                total_entries=0,
                streak_days=0,
                most_common_mood=3,
                mood_trend="stable",
                weekly_average=0.0,
                monthly_average=0.0
            )
        
        moods = [row[0] for row in rows]
        dates = [row[1] for row in rows]
        
        # Calculate statistics
        average_mood = sum(moods) / len(moods)
        total_entries = len(moods)
        
        # Most common mood
        mood_counts = {}
        for mood in moods:
            mood_counts[mood] = mood_counts.get(mood, 0) + 1
        most_common_mood = max(mood_counts.keys(), key=lambda k: mood_counts[k])
        
        # Calculate streak (consecutive days with entries)
        streak_days = 0
        current_date = date.today()
        
        for i in range(len(dates)):
            expected_date = (current_date - timedelta(days=i)).isoformat()
            if expected_date in dates:
                streak_days += 1
            else:
                break
        
        # Calculate trend (last 7 days vs previous 7 days)
        recent_moods = moods[-7:] if len(moods) >= 7 else moods
        older_moods = moods[-14:-7] if len(moods) >= 14 else []
        
        recent_avg = sum(recent_moods) / len(recent_moods)
        older_avg = sum(older_moods) / len(older_moods) if older_moods else recent_avg
        
        if recent_avg > older_avg + 0.2:
            mood_trend = "improving"
        elif recent_avg < older_avg - 0.2:
            mood_trend = "declining"
        else:
            mood_trend = "stable"
        
        # Weekly and monthly averages
        weekly_moods = moods[-7:] if len(moods) >= 7 else moods
        weekly_average = sum(weekly_moods) / len(weekly_moods)
        monthly_average = average_mood
        
        return MoodStats(
            average_mood=round(average_mood, 2),
            total_entries=total_entries,
            streak_days=streak_days,
            most_common_mood=most_common_mood,
            mood_trend=mood_trend,
            weekly_average=round(weekly_average, 2),
            monthly_average=round(monthly_average, 2)
        )
        
    finally:
        conn.close()

@router.delete("/entries/{entry_date}")
async def delete_mood_entry(
    entry_date: str,
    email: str = Depends(verify_token)
):
    """Delete a mood entry for a specific date"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute(
            "DELETE FROM mood_entries WHERE user_id = ? AND date = ?",
            (current_user.id, entry_date)
        )
        
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Mood entry not found")
        
        conn.commit()
        return {"message": "Mood entry deleted successfully"}
        
    finally:
        conn.close()

# Initialize tables when module is imported
init_mood_tables()