#!/usr/bin/env python3

import sqlite3
import bcrypt
from datetime import datetime
import json

def create_demo_professional():
    """Create demo professional account"""
    
    # Database connection
    conn = sqlite3.connect('arambhgpt.db')
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
                rating REAL DEFAULT 4.8,
                reviews INTEGER DEFAULT 0,
                languages TEXT DEFAULT 'Hindi,English',
                availability TEXT DEFAULT 'online',
                description TEXT,
                is_verified BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Demo professional data
        demo_professional = {
            'name': 'Dr. Demo Professional',
            'email': 'dr.demo@arambhgpt.com',
            'password': 'professional123',
            'title': 'Clinical Psychologist',
            'specialization': json.dumps(['Anxiety', 'Depression', 'Relationship Issues']),
            'experience': 8,
            'education': 'PhD in Clinical Psychology - AIIMS Delhi',
            'license_number': 'RCI/A/DEMO/2020',
            'chat_rate': 50,
            'call_rate': 100,
            'video_rate': 150,
            'rating': 4.8,
            'reviews': 156,
            'languages': 'Hindi,English',
            'availability': 'online',
            'description': 'Experienced clinical psychologist specializing in anxiety, depression, and relationship counseling. Committed to providing compassionate, evidence-based care.',
            'is_verified': True
        }
        
        # Hash password
        hashed_password = bcrypt.hashpw(
            demo_professional['password'].encode('utf-8'), 
            bcrypt.gensalt()
        ).decode('utf-8')
        
        # Insert demo professional
        cursor.execute('''
            INSERT OR REPLACE INTO professionals 
            (name, email, hashed_password, title, specialization, experience, 
             education, license_number, chat_rate, call_rate, video_rate, 
             rating, reviews, languages, availability, description, is_verified)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            demo_professional['name'],
            demo_professional['email'],
            hashed_password,
            demo_professional['title'],
            demo_professional['specialization'],
            demo_professional['experience'],
            demo_professional['education'],
            demo_professional['license_number'],
            demo_professional['chat_rate'],
            demo_professional['call_rate'],
            demo_professional['video_rate'],
            demo_professional['rating'],
            demo_professional['reviews'],
            demo_professional['languages'],
            demo_professional['availability'],
            demo_professional['description'],
            demo_professional['is_verified']
        ))
        
        conn.commit()
        print("✅ Demo professional account created successfully!")
        print(f"📧 Email: {demo_professional['email']}")
        print(f"🔑 Password: {demo_professional['password']}")
        print(f"🏥 Access: http://localhost:3000/professional/signin")
        
    except Exception as e:
        print(f"❌ Error creating demo professional: {e}")
        conn.rollback()
    
    finally:
        conn.close()

if __name__ == "__main__":
    create_demo_professional()