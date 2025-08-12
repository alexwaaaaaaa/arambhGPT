from fastapi import APIRouter, HTTPException, Depends, status
from typing import List, Optional
from datetime import datetime, timedelta
import sqlite3
import json
from .auth import verify_token, get_user_by_email
from .database import get_db_connection

router = APIRouter(prefix="/notifications", tags=["notifications"])

def init_notification_tables():
    """Initialize notification tables"""
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Create notifications table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS notifications (
            id TEXT PRIMARY KEY,
            user_id TEXT NOT NULL,
            type TEXT NOT NULL,
            title TEXT NOT NULL,
            message TEXT NOT NULL,
            is_read BOOLEAN DEFAULT FALSE,
            priority TEXT DEFAULT 'medium',
            action_url TEXT,
            icon TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    # Create notification_settings table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS notification_settings (
            user_id TEXT PRIMARY KEY,
            mood_reminders BOOLEAN DEFAULT TRUE,
            wellness_tips BOOLEAN DEFAULT TRUE,
            achievements BOOLEAN DEFAULT TRUE,
            social_updates BOOLEAN DEFAULT FALSE,
            email_notifications BOOLEAN DEFAULT FALSE,
            push_notifications BOOLEAN DEFAULT FALSE,
            reminder_time TEXT DEFAULT '20:00',
            frequency TEXT DEFAULT 'daily',
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    
    conn.commit()
    conn.close()

@router.post("/")
async def create_notification(
    notification_data: dict,
    email: str = Depends(verify_token)
):
    """Create a new notification"""
    user = get_user_by_email(email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        notification_id = f"notif_{user['id']}_{int(datetime.now().timestamp())}"
        
        cursor.execute('''
            INSERT INTO notifications 
            (id, user_id, type, title, message, priority, action_url, icon)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            notification_id, str(user['id']), notification_data.get('type', 'general'),
            notification_data['title'], notification_data['message'],
            notification_data.get('priority', 'medium'), 
            notification_data.get('action_url'),
            notification_data.get('icon')
        ))
        
        conn.commit()
        
        # Fetch the created notification
        cursor.execute('''
            SELECT id, user_id, type, title, message, is_read, priority, 
                   action_url, icon, created_at
            FROM notifications WHERE id = ?
        ''', (notification_id,))
        
        row = cursor.fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Failed to create notification")
        
        return {
            "id": row[0],
            "user_id": row[1],
            "type": row[2],
            "title": row[3],
            "message": row[4],
            "is_read": bool(row[5]),
            "priority": row[6],
            "action_url": row[7],
            "icon": row[8],
            "created_at": row[9]
        }
        
    except Exception as e:
        conn.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to create notification: {str(e)}")
    finally:
        conn.close()

@router.get("/")
async def get_notifications(
    limit: int = 50,
    unread_only: bool = False,
    email: str = Depends(verify_token)
):
    """Get notifications for the current user"""
    user = get_user_by_email(email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        query = '''
            SELECT id, user_id, type, title, message, is_read, priority, 
                   action_url, icon, created_at
            FROM notifications 
            WHERE user_id = ?
        '''
        params = [str(user['id'])]
        
        if unread_only:
            query += " AND is_read = FALSE"
        
        query += " ORDER BY created_at DESC LIMIT ?"
        params.append(limit)
        
        cursor.execute(query, params)
        rows = cursor.fetchall()
        
        notifications = []
        for row in rows:
            notifications.append({
                "id": row[0],
                "user_id": row[1],
                "type": row[2],
                "title": row[3],
                "message": row[4],
                "is_read": bool(row[5]),
                "priority": row[6],
                "action_url": row[7],
                "icon": row[8],
                "created_at": row[9]
            })
        
        return notifications
        
    finally:
        conn.close()

@router.put("/{notification_id}/read")
async def mark_notification_read(
    notification_id: str,
    email: str = Depends(verify_token)
):
    """Mark a notification as read"""
    user = get_user_by_email(email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute(
            "UPDATE notifications SET is_read = TRUE WHERE id = ? AND user_id = ?",
            (notification_id, str(user['id']))
        )
        
        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Notification not found")
        
        conn.commit()
        return {"message": "Notification marked as read"}
        
    finally:
        conn.close()

@router.put("/mark-all-read")
async def mark_all_notifications_read(
    email: str = Depends(verify_token)
):
    """Mark all notifications as read"""
    user = get_user_by_email(email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute(
            "UPDATE notifications SET is_read = TRUE WHERE user_id = ?",
            (str(user['id']),)
        )
        
        conn.commit()
        return {"message": f"Marked {cursor.rowcount} notifications as read"}
        
    finally:
        conn.close()

@router.get("/settings")
async def get_notification_settings(
    email: str = Depends(verify_token)
):
    """Get notification settings for the current user"""
    user = get_user_by_email(email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute(
            "SELECT * FROM notification_settings WHERE user_id = ?",
            (str(user['id']),)
        )
        
        row = cursor.fetchone()
        if not row:
            # Create default settings
            cursor.execute('''
                INSERT INTO notification_settings (user_id) VALUES (?)
            ''', (str(user['id']),))
            conn.commit()
            
            return {
                "mood_reminders": True,
                "wellness_tips": True,
                "achievements": True,
                "social_updates": False,
                "email_notifications": False,
                "push_notifications": False,
                "reminder_time": "20:00",
                "frequency": "daily"
            }
        
        return {
            "mood_reminders": bool(row[1]),
            "wellness_tips": bool(row[2]),
            "achievements": bool(row[3]),
            "social_updates": bool(row[4]),
            "email_notifications": bool(row[5]),
            "push_notifications": bool(row[6]),
            "reminder_time": row[7],
            "frequency": row[8]
        }
        
    finally:
        conn.close()

@router.put("/settings")
async def update_notification_settings(
    settings: dict,
    email: str = Depends(verify_token)
):
    """Update notification settings for the current user"""
    user = get_user_by_email(email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        # Check if settings exist
        cursor.execute(
            "SELECT user_id FROM notification_settings WHERE user_id = ?",
            (str(user['id']),)
        )
        
        if cursor.fetchone():
            # Update existing settings
            cursor.execute('''
                UPDATE notification_settings 
                SET mood_reminders = ?, wellness_tips = ?, achievements = ?,
                    social_updates = ?, email_notifications = ?, push_notifications = ?,
                    reminder_time = ?, frequency = ?, updated_at = CURRENT_TIMESTAMP
                WHERE user_id = ?
            ''', (
                settings.get('mood_reminders', True),
                settings.get('wellness_tips', True),
                settings.get('achievements', True),
                settings.get('social_updates', False),
                settings.get('email_notifications', False),
                settings.get('push_notifications', False),
                settings.get('reminder_time', '20:00'),
                settings.get('frequency', 'daily'),
                str(user['id'])
            ))
        else:
            # Create new settings
            cursor.execute('''
                INSERT INTO notification_settings 
                (user_id, mood_reminders, wellness_tips, achievements, social_updates,
                 email_notifications, push_notifications, reminder_time, frequency)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                str(user['id']),
                settings.get('mood_reminders', True),
                settings.get('wellness_tips', True),
                settings.get('achievements', True),
                settings.get('social_updates', False),
                settings.get('email_notifications', False),
                settings.get('push_notifications', False),
                settings.get('reminder_time', '20:00'),
                settings.get('frequency', 'daily')
            ))
        
        conn.commit()
        return settings
        
    finally:
        conn.close()

@router.get("/unread-count")
async def get_unread_count(
    email: str = Depends(verify_token)
):
    """Get count of unread notifications"""
    user = get_user_by_email(email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    try:
        cursor.execute(
            "SELECT COUNT(*) FROM notifications WHERE user_id = ? AND is_read = FALSE",
            (str(user['id']),)
        )
        
        count = cursor.fetchone()[0]
        return {"unread_count": count}
        
    finally:
        conn.close()

# Initialize tables when module is imported
init_notification_tables()