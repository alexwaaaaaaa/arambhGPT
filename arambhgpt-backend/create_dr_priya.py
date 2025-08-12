#!/usr/bin/env python3

import sqlite3
import bcrypt
from datetime import datetime
import json

def create_dr_priya():
    """Create Dr. Priya professional account"""
    
    # Database connection
    conn = sqlite3.connect('arambhgpt.db')
    cursor = conn.cursor()
    
    try:
        # Dr. Priya professional data
        dr_priya = {
            'name': 'Dr. Priya Sharma',
            'email': 'dr.priya@demo.com',
            'password': 'priya123',
            'title': 'Clinical Psychologist & Therapist',
            'specialization': json.dumps(['Anxiety', 'Depression', 'Women Health', 'Family Counseling']),
            'experience': 12,
            'education': 'PhD in Clinical Psychology - Delhi University, M.Phil in Psychology - JNU',
            'license_number': 'RCI/A/PRIYA/2018',
            'chat_rate': 60,
            'call_rate': 120,
            'video_rate': 180,
            'rating': 4.9,
            'reviews': 234,
            'languages': 'Hindi,English,Punjabi',
            'availability': 'online',
            'description': 'Experienced clinical psychologist with 12+ years of practice. Specializes in anxiety, depression, women\'s mental health, and family counseling. Fluent in Hindi, English, and Punjabi.',
            'is_verified': True
        }
        
        # Hash password
        hashed_password = bcrypt.hashpw(
            dr_priya['password'].encode('utf-8'), 
            bcrypt.gensalt()
        ).decode('utf-8')
        
        # Insert Dr. Priya
        cursor.execute('''
            INSERT OR REPLACE INTO professionals 
            (name, email, hashed_password, title, specialization, experience, 
             education, license_number, chat_rate, call_rate, video_rate, 
             rating, reviews, languages, availability, description, is_verified)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            dr_priya['name'],
            dr_priya['email'],
            hashed_password,
            dr_priya['title'],
            dr_priya['specialization'],
            dr_priya['experience'],
            dr_priya['education'],
            dr_priya['license_number'],
            dr_priya['chat_rate'],
            dr_priya['call_rate'],
            dr_priya['video_rate'],
            dr_priya['rating'],
            dr_priya['reviews'],
            dr_priya['languages'],
            dr_priya['availability'],
            dr_priya['description'],
            dr_priya['is_verified']
        ))
        
        conn.commit()
        print("✅ Dr. Priya professional account created successfully!")
        print(f"📧 Email: {dr_priya['email']}")
        print(f"🔑 Password: {dr_priya['password']}")
        print(f"👩‍⚕️ Name: {dr_priya['name']}")
        print(f"🏥 Access: http://localhost:3000/professional/signin")
        
    except Exception as e:
        print(f"❌ Error creating Dr. Priya account: {e}")
        conn.rollback()
    
    finally:
        conn.close()

if __name__ == "__main__":
    create_dr_priya()