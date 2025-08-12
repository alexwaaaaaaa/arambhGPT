from fastapi import APIRouter, HTTPException, Depends
from typing import Optional, List
from datetime import datetime
from .database import get_db_connection
from .auth import verify_token, get_user_by_email
from .models import (
    ConversationCreate, ConversationDetail, ConversationSummary, 
    ConversationListResponse, ConversationUpdateRequest,
    MessageCreate, MessageDetail, SearchRequest, SearchResponse,
    SearchResult, ConversationStats, ExportRequest
)

router = APIRouter()

async def get_user_id_from_email(email: str) -> int:
    user = await get_user_by_email(email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user['id']

@router.post("/api/history/conversations")
async def create_conversation(
    conversation: ConversationCreate,
    email: str = Depends(verify_token)
):
    user_id = get_user_id_from_email(email)
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    title = conversation.title or "New Conversation"
    cursor.execute(
        "INSERT INTO conversations (user_id, title) VALUES (?, ?)",
        (user_id, title)
    )
    conversation_id = cursor.lastrowid
    conn.commit()
    conn.close()
    
    return {
        "id": conversation_id,
        "title": title,
        "created_at": datetime.now(),
        "updated_at": datetime.now(),
        "messages": []
    }

@router.get("/api/history/conversations")
async def get_conversations(
    page: int = 1,
    limit: int = 20,
    archived: Optional[bool] = None,
    search: Optional[str] = None,
    email: str = Depends(verify_token)
):
    user_id = get_user_id_from_email(email)
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Build query
    query = """
        SELECT c.*, 
               COUNT(m.id) as message_count,
               MAX(m.created_at) as last_message_time,
               (SELECT content FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message
        FROM conversations c
        LEFT JOIN messages m ON c.id = m.conversation_id
        WHERE c.user_id = ?
    """
    params = [user_id]
    
    if archived is not None:
        query += " AND c.is_archived = ?"
        params.append(archived)
    
    if search:
        query += " AND c.title LIKE ?"
        params.append(f"%{search}%")
    
    query += " GROUP BY c.id ORDER BY c.updated_at DESC"
    
    # Add pagination
    offset = (page - 1) * limit
    query += f" LIMIT {limit} OFFSET {offset}"
    
    cursor.execute(query, params)
    conversations = cursor.fetchall()
    
    # Get total count
    count_query = "SELECT COUNT(*) FROM conversations WHERE user_id = ?"
    count_params = [user_id]
    if archived is not None:
        count_query += " AND is_archived = ?"
        count_params.append(archived)
    if search:
        count_query += " AND title LIKE ?"
        count_params.append(f"%{search}%")
    
    cursor.execute(count_query, count_params)
    total_count = cursor.fetchone()[0]
    
    conn.close()
    
    # Format response
    conversation_list = []
    for conv in conversations:
        conversation_list.append(ConversationSummary(
            id=str(conv['id']),
            title=conv['title'],
            created_at=datetime.fromisoformat(conv['created_at']),
            updated_at=datetime.fromisoformat(conv['updated_at']),
            message_count=conv['message_count'] or 0,
            last_message_preview=conv['last_message'] or "",
            last_message_timestamp=datetime.fromisoformat(conv['last_message_time']) if conv['last_message_time'] else datetime.fromisoformat(conv['created_at']),
            is_archived=bool(conv['is_archived'])
        ))
    
    return ConversationListResponse(
        conversations=conversation_list,
        total_count=total_count,
        page=page,
        limit=limit,
        has_more=(page * limit) < total_count
    )

@router.get("/api/history/conversations/{conversation_id}")
async def get_conversation_detail(
    conversation_id: str,
    email: str = Depends(verify_token)
):
    user_id = get_user_id_from_email(email)
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Get conversation
    cursor.execute(
        "SELECT * FROM conversations WHERE id = ? AND user_id = ?",
        (conversation_id, user_id)
    )
    conversation = cursor.fetchone()
    
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    # Get messages
    cursor.execute(
        "SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC",
        (conversation_id,)
    )
    messages = cursor.fetchall()
    
    conn.close()
    
    message_list = []
    for msg in messages:
        message_list.append(MessageDetail(
            id=str(msg['id']),
            content=msg['content'],
            sender=msg['sender'],
            ai_provider=msg['ai_provider'],
            created_at=datetime.fromisoformat(msg['created_at'])
        ))
    
    return ConversationDetail(
        id=str(conversation['id']),
        title=conversation['title'],
        created_at=datetime.fromisoformat(conversation['created_at']),
        updated_at=datetime.fromisoformat(conversation['updated_at']),
        messages=message_list,
        is_archived=bool(conversation['is_archived']),
        message_count=len(message_list)
    )

@router.post("/api/history/conversations/{conversation_id}/messages")
async def add_message_to_conversation(
    conversation_id: int,
    message: MessageCreate,
    email: str = Depends(verify_token)
):
    user_id = get_user_id_from_email(email)
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Verify conversation belongs to user
    cursor.execute(
        "SELECT id FROM conversations WHERE id = ? AND user_id = ?",
        (conversation_id, user_id)
    )
    if not cursor.fetchone():
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    # Add message
    cursor.execute(
        "INSERT INTO messages (conversation_id, content, sender, ai_provider) VALUES (?, ?, ?, ?)",
        (conversation_id, message.content, message.sender, message.ai_provider)
    )
    message_id = cursor.lastrowid
    
    # Update conversation timestamp
    cursor.execute(
        "UPDATE conversations SET updated_at = CURRENT_TIMESTAMP WHERE id = ?",
        (conversation_id,)
    )
    
    conn.commit()
    conn.close()
    
    return {
        "id": message_id,
        "content": message.content,
        "sender": message.sender,
        "ai_provider": message.ai_provider,
        "created_at": datetime.now()
    }

@router.put("/api/history/conversations/{conversation_id}")
async def update_conversation(
    conversation_id: str,
    updates: ConversationUpdateRequest,
    email: str = Depends(verify_token)
):
    user_id = get_user_id_from_email(email)
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Build update query
    update_fields = []
    params = []
    
    if updates.title is not None:
        update_fields.append("title = ?")
        params.append(updates.title)
    
    if updates.is_archived is not None:
        update_fields.append("is_archived = ?")
        params.append(updates.is_archived)
    
    if not update_fields:
        return {"message": "No updates provided"}
    
    update_fields.append("updated_at = CURRENT_TIMESTAMP")
    params.extend([conversation_id, user_id])
    
    query = f"UPDATE conversations SET {', '.join(update_fields)} WHERE id = ? AND user_id = ?"
    cursor.execute(query, params)
    
    if cursor.rowcount == 0:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    conn.commit()
    conn.close()
    
    return {"message": "Conversation updated successfully"}

@router.delete("/api/history/conversations/{conversation_id}")
async def delete_conversation(
    conversation_id: str,
    email: str = Depends(verify_token)
):
    user_id = get_user_id_from_email(email)
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Delete messages first
    cursor.execute("DELETE FROM messages WHERE conversation_id = ?", (conversation_id,))
    
    # Delete conversation
    cursor.execute(
        "DELETE FROM conversations WHERE id = ? AND user_id = ?",
        (conversation_id, user_id)
    )
    
    if cursor.rowcount == 0:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    conn.commit()
    conn.close()
    
    return {"message": "Conversation deleted successfully"}

@router.post("/api/history/search")
async def search_conversations(
    search_request: SearchRequest,
    email: str = Depends(verify_token)
):
    user_id = get_user_id_from_email(email)
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Simple search implementation
    query = """
        SELECT c.*, COUNT(m.id) as message_count,
               MAX(m.created_at) as last_message_time,
               (SELECT content FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message
        FROM conversations c
        LEFT JOIN messages m ON c.id = m.conversation_id
        WHERE c.user_id = ? AND (c.title LIKE ? OR EXISTS (
            SELECT 1 FROM messages WHERE conversation_id = c.id AND content LIKE ?
        ))
        GROUP BY c.id
        ORDER BY c.updated_at DESC
        LIMIT ? OFFSET ?
    """
    
    search_term = f"%{search_request.query}%"
    offset = (search_request.page - 1) * search_request.limit
    
    cursor.execute(query, (user_id, search_term, search_term, search_request.limit, offset))
    results = cursor.fetchall()
    
    conn.close()
    
    search_results = []
    for result in results:
        conversation = ConversationSummary(
            id=str(result['id']),
            title=result['title'],
            created_at=datetime.fromisoformat(result['created_at']),
            updated_at=datetime.fromisoformat(result['updated_at']),
            message_count=result['message_count'] or 0,
            last_message_preview=result['last_message'] or "",
            last_message_timestamp=datetime.fromisoformat(result['last_message_time']) if result['last_message_time'] else datetime.fromisoformat(result['created_at']),
            is_archived=bool(result['is_archived'])
        )
        
        search_results.append(SearchResult(
            conversation=conversation,
            highlights=[search_request.query],
            relevance_score=1.0
        ))
    
    return SearchResponse(
        results=search_results,
        total_count=len(search_results),
        page=search_request.page,
        limit=search_request.limit,
        has_more=len(search_results) == search_request.limit
    )

@router.get("/api/history/stats")
async def get_conversation_stats(email: str = Depends(verify_token)):
    user_id = get_user_id_from_email(email)
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Get basic stats
    cursor.execute("SELECT COUNT(*) FROM conversations WHERE user_id = ?", (user_id,))
    total_conversations = cursor.fetchone()[0]
    
    cursor.execute("""
        SELECT COUNT(*) FROM messages m 
        JOIN conversations c ON m.conversation_id = c.id 
        WHERE c.user_id = ?
    """, (user_id,))
    total_messages = cursor.fetchone()[0]
    
    conn.close()
    
    avg_messages = total_messages / total_conversations if total_conversations > 0 else 0
    
    return ConversationStats(
        total_conversations=total_conversations,
        total_messages=total_messages,
        active_days=1,  # Simplified
        average_messages_per_conversation=avg_messages,
        most_active_day="Today",
        conversation_frequency={"today": total_conversations}
    )

@router.post("/api/history/export")
async def export_conversations(
    export_request: ExportRequest,
    email: str = Depends(verify_token)
):
    # Simple export implementation
    return {"message": "Export feature coming soon!", "format": export_request.format}