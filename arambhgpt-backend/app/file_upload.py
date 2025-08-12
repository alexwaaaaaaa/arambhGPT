from fastapi import APIRouter, HTTPException, Depends, UploadFile, File
from fastapi.responses import FileResponse
from typing import List, Optional
import os
import uuid
import shutil
from pathlib import Path
from .auth import verify_token, get_user_by_email
from .database import get_db_connection

router = APIRouter()

# Create uploads directory if it doesn't exist
UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

# Allowed file types
ALLOWED_EXTENSIONS = {
    'image': {'.jpg', '.jpeg', '.png', '.gif', '.webp'},
    'document': {'.pdf', '.doc', '.docx', '.txt', '.rtf'},
    'audio': {'.mp3', '.wav', '.ogg', '.m4a'},
    'video': {'.mp4', '.webm', '.mov', '.avi'}
}

MAX_FILE_SIZE = 10 * 1024 * 1024  # 10MB

def get_file_type(filename: str) -> str:
    """Determine file type based on extension"""
    ext = Path(filename).suffix.lower()
    
    for file_type, extensions in ALLOWED_EXTENSIONS.items():
        if ext in extensions:
            return file_type
    
    return 'unknown'

def is_allowed_file(filename: str) -> bool:
    """Check if file type is allowed"""
    return get_file_type(filename) != 'unknown'

@router.post("/upload/chat-file")
async def upload_chat_file(
    file: UploadFile = File(...),
    session_id: Optional[str] = None,
    email: str = Depends(verify_token)
):
    """Upload file for chat session"""
    
    # Validate file
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")
    
    if not is_allowed_file(file.filename):
        raise HTTPException(status_code=400, detail="File type not allowed")
    
    # Check file size
    file_content = await file.read()
    if len(file_content) > MAX_FILE_SIZE:
        raise HTTPException(status_code=400, detail="File too large (max 10MB)")
    
    # Reset file pointer
    await file.seek(0)
    
    try:
        user = get_user_by_email(email)
        user_id = user['id']
        
        # Generate unique filename
        file_extension = Path(file.filename).suffix
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        file_path = UPLOAD_DIR / unique_filename
        
        # Save file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Save file info to database
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Create files table if not exists
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS chat_files (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                session_id TEXT,
                original_filename TEXT NOT NULL,
                stored_filename TEXT NOT NULL,
                file_type TEXT NOT NULL,
                file_size INTEGER NOT NULL,
                upload_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        ''')
        
        cursor.execute(
            """INSERT INTO chat_files 
               (user_id, session_id, original_filename, stored_filename, file_type, file_size) 
               VALUES (?, ?, ?, ?, ?, ?)""",
            (user_id, session_id, file.filename, unique_filename, 
             get_file_type(file.filename), len(file_content))
        )
        
        file_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return {
            "file_id": str(file_id),
            "filename": file.filename,
            "file_type": get_file_type(file.filename),
            "file_size": len(file_content),
            "download_url": f"/files/download/{file_id}",
            "preview_url": f"/files/preview/{file_id}" if get_file_type(file.filename) == 'image' else None
        }
        
    except Exception as e:
        # Clean up file if database operation fails
        if file_path.exists():
            file_path.unlink()
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

@router.get("/files/download/{file_id}")
async def download_file(
    file_id: str,
    email: str = Depends(verify_token)
):
    """Download file by ID"""
    
    user = get_user_by_email(email)
    user_id = user['id']
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Get file info
    cursor.execute(
        "SELECT * FROM chat_files WHERE id = ? AND user_id = ?",
        (int(file_id), user_id)
    )
    file_info = cursor.fetchone()
    conn.close()
    
    if not file_info:
        raise HTTPException(status_code=404, detail="File not found")
    
    file_path = UPLOAD_DIR / file_info['stored_filename']
    
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found on disk")
    
    return FileResponse(
        path=file_path,
        filename=file_info['original_filename'],
        media_type='application/octet-stream'
    )

@router.get("/files/preview/{file_id}")
async def preview_file(
    file_id: str,
    email: str = Depends(verify_token)
):
    """Preview file (for images)"""
    
    user = get_user_by_email(email)
    user_id = user['id']
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Get file info
    cursor.execute(
        "SELECT * FROM chat_files WHERE id = ? AND user_id = ? AND file_type = 'image'",
        (int(file_id), user_id)
    )
    file_info = cursor.fetchone()
    conn.close()
    
    if not file_info:
        raise HTTPException(status_code=404, detail="Image not found")
    
    file_path = UPLOAD_DIR / file_info['stored_filename']
    
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found on disk")
    
    # Determine media type based on extension
    ext = Path(file_info['original_filename']).suffix.lower()
    media_type_map = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.gif': 'image/gif',
        '.webp': 'image/webp'
    }
    
    media_type = media_type_map.get(ext, 'image/jpeg')
    
    return FileResponse(
        path=file_path,
        media_type=media_type
    )

@router.get("/files/user-files")
async def get_user_files(
    session_id: Optional[str] = None,
    file_type: Optional[str] = None,
    limit: int = 50,
    email: str = Depends(verify_token)
):
    """Get user's uploaded files"""
    
    user = get_user_by_email(email)
    user_id = user['id']
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Build query
    query = "SELECT * FROM chat_files WHERE user_id = ?"
    params = [user_id]
    
    if session_id:
        query += " AND session_id = ?"
        params.append(session_id)
    
    if file_type:
        query += " AND file_type = ?"
        params.append(file_type)
    
    query += " ORDER BY upload_time DESC LIMIT ?"
    params.append(limit)
    
    cursor.execute(query, params)
    files = cursor.fetchall()
    conn.close()
    
    result = []
    for file_info in files:
        result.append({
            "file_id": str(file_info['id']),
            "filename": file_info['original_filename'],
            "file_type": file_info['file_type'],
            "file_size": file_info['file_size'],
            "upload_time": file_info['upload_time'],
            "session_id": file_info['session_id'],
            "download_url": f"/files/download/{file_info['id']}",
            "preview_url": f"/files/preview/{file_info['id']}" if file_info['file_type'] == 'image' else None
        })
    
    return {
        "files": result,
        "total_count": len(result)
    }

@router.delete("/files/{file_id}")
async def delete_file(
    file_id: str,
    email: str = Depends(verify_token)
):
    """Delete file"""
    
    user = get_user_by_email(email)
    user_id = user['id']
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Get file info
    cursor.execute(
        "SELECT * FROM chat_files WHERE id = ? AND user_id = ?",
        (int(file_id), user_id)
    )
    file_info = cursor.fetchone()
    
    if not file_info:
        conn.close()
        raise HTTPException(status_code=404, detail="File not found")
    
    # Delete from database
    cursor.execute("DELETE FROM chat_files WHERE id = ?", (int(file_id),))
    conn.commit()
    conn.close()
    
    # Delete file from disk
    file_path = UPLOAD_DIR / file_info['stored_filename']
    if file_path.exists():
        file_path.unlink()
    
    return {"message": "File deleted successfully"}

@router.post("/upload/voice-message")
async def upload_voice_message(
    file: UploadFile = File(...),
    session_id: Optional[str] = None,
    duration: Optional[int] = None,
    email: str = Depends(verify_token)
):
    """Upload voice message"""
    
    if not file.filename or not file.filename.endswith(('.mp3', '.wav', '.ogg', '.m4a')):
        raise HTTPException(status_code=400, detail="Invalid audio file")
    
    # Check file size (max 5MB for voice messages)
    file_content = await file.read()
    if len(file_content) > 5 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Voice message too large (max 5MB)")
    
    await file.seek(0)
    
    try:
        user = get_user_by_email(email)
        user_id = user['id']
        
        # Generate unique filename
        file_extension = Path(file.filename).suffix
        unique_filename = f"voice_{uuid.uuid4()}{file_extension}"
        file_path = UPLOAD_DIR / unique_filename
        
        # Save file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Save to database
        conn = get_db_connection()
        cursor = conn.cursor()
        
        cursor.execute(
            """INSERT INTO chat_files 
               (user_id, session_id, original_filename, stored_filename, file_type, file_size) 
               VALUES (?, ?, ?, ?, 'audio', ?)""",
            (user_id, session_id, f"Voice message ({duration}s)" if duration else "Voice message", 
             unique_filename, len(file_content))
        )
        
        file_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return {
            "file_id": str(file_id),
            "filename": f"Voice message ({duration}s)" if duration else "Voice message",
            "file_type": "audio",
            "file_size": len(file_content),
            "duration": duration,
            "download_url": f"/files/download/{file_id}"
        }
        
    except Exception as e:
        if file_path.exists():
            file_path.unlink()
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

@router.get("/files/stats")
async def get_file_stats(email: str = Depends(verify_token)):
    """Get user's file upload statistics"""
    
    user = get_user_by_email(email)
    user_id = user['id']
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Get stats
    cursor.execute(
        "SELECT file_type, COUNT(*) as count, SUM(file_size) as total_size FROM chat_files WHERE user_id = ? GROUP BY file_type",
        (user_id,)
    )
    stats_by_type = cursor.fetchall()
    
    cursor.execute(
        "SELECT COUNT(*) as total_files, SUM(file_size) as total_size FROM chat_files WHERE user_id = ?",
        (user_id,)
    )
    total_stats = cursor.fetchone()
    
    conn.close()
    
    return {
        "total_files": total_stats['total_files'] or 0,
        "total_size": total_stats['total_size'] or 0,
        "by_type": [
            {
                "file_type": stat['file_type'],
                "count": stat['count'],
                "total_size": stat['total_size']
            }
            for stat in stats_by_type
        ]
    }