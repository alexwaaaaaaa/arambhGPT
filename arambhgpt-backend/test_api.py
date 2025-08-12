#!/usr/bin/env python3
"""
Simple test script to debug API issues
"""

import asyncio
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import get_db_connection
from app.auth import get_user_by_email

async def test_db_connection():
    """Test database connection and basic queries"""
    try:
        print("Testing database connection...")
        conn = await get_db_connection()
        
        # Test users table
        users = await conn.fetch("SELECT * FROM users LIMIT 5")
        print(f"✅ Found {len(users)} users")
        
        # Test conversations table
        conversations = await conn.fetch("SELECT * FROM conversations LIMIT 5")
        print(f"✅ Found {len(conversations)} conversations")
        
        # Test messages table
        messages = await conn.fetch("SELECT * FROM messages LIMIT 5")
        print(f"✅ Found {len(messages)} messages")
        
        await conn.close()
        print("✅ Database connection test successful!")
        
    except Exception as e:
        print(f"❌ Database error: {e}")

async def test_user_functions():
    """Test user-related functions"""
    try:
        print("Testing user functions...")
        user = await get_user_by_email("demo@arambhgpt.com")
        if user:
            print(f"✅ Found demo user: {user['name']} ({user['email']})")
        else:
            print("❌ Demo user not found")
            
    except Exception as e:
        print(f"❌ User function error: {e}")

async def main():
    await test_db_connection()
    await test_user_functions()

if __name__ == "__main__":
    asyncio.run(main())