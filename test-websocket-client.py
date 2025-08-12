#!/usr/bin/env python3
"""
Simple WebSocket client to test real-time communication
"""

import asyncio
import websockets
import json
import sys

async def test_websocket():
    uri = "ws://localhost:8000/api/communication/ws/test_session_123/user_456"
    
    try:
        print("🔌 Connecting to WebSocket...")
        async with websockets.connect(uri) as websocket:
            print("✅ Connected to WebSocket!")
            
            # Send a test message
            test_message = {
                "sender_type": "patient",
                "message": "Hello from WebSocket client!",
                "message_type": "text"
            }
            
            print(f"📤 Sending: {test_message}")
            await websocket.send(json.dumps(test_message))
            
            # Listen for messages
            print("👂 Listening for messages...")
            try:
                while True:
                    message = await asyncio.wait_for(websocket.recv(), timeout=5.0)
                    print(f"📥 Received: {message}")
            except asyncio.TimeoutError:
                print("⏰ No messages received in 5 seconds")
                
    except Exception as e:
        print(f"❌ WebSocket connection failed: {e}")
        return False
    
    return True

if __name__ == "__main__":
    print("🚀 Testing WebSocket Communication...")
    success = asyncio.run(test_websocket())
    
    if success:
        print("✅ WebSocket test completed successfully!")
    else:
        print("❌ WebSocket test failed!")
        sys.exit(1)