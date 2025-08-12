#!/usr/bin/env python3
"""
Script to create demo user for ArambhGPT
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import get_db_connection
from app.auth import get_password_hash

def create_demo_user():
    """Create demo user if it doesn't exist"""
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Create users table with city and country if it doesn't exist
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT UNIQUE NOT NULL,
                hashed_password TEXT NOT NULL,
                city TEXT NOT NULL,
                country TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        ''')
        
        # Delete existing test user if exists
        cursor.execute("DELETE FROM users WHERE email IN (?, ?)", ("demo@arambhgpt.com", "test@example.com"))
        
        # Create demo user
        hashed_password = get_password_hash("demo123")
        cursor.execute(
            "INSERT INTO users (name, email, hashed_password) VALUES (?, ?, ?)",
            ("Demo User", "demo@arambhgpt.com", hashed_password)
        )
        
        # Create test user for scripts
        test_password = get_password_hash("password123")
        cursor.execute(
            "INSERT INTO users (name, email, hashed_password) VALUES (?, ?, ?)",
            ("Test User", "test@example.com", test_password)
        )
        
        conn.commit()
        conn.close()
        
        print("✅ Demo user created successfully!")
        print("📧 Email: demo@arambhgpt.com")
        print("🔑 Password: demo123")
        print("🏙️ City: Mumbai")
        print("🇮🇳 Country: India")
        
    except Exception as e:
        print(f"❌ Error creating demo user: {e}")

if __name__ == "__main__":
    create_demo_user()