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

def get_user_id_from_email(email: str) -> int:
    user = get_user_by_email(email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user['id']

@router.post("/api/history/conversations")
async def create_conversation(
    conversation: ConversationCreate,
    email: str = Depends(verify_token)
):
    user_id = await get_user_id_from_email(email)
    
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
        "id": str(conversation_id),
        "title": title,
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat(),
        "messages": [],
        "is_archived": False,
        "message_count": 0
    }

@router.get("/api/history/conversations")
async def get_conversations(
    page: int = 1,
    limit: int = 20,
    archived: Optional[bool] = None,
    search: Optional[str] = None,
    email: str = Depends(verify_token)
):
    try:
        user_id = await get_user_id_from_email(email)
        
        conn = await get_db_connection()
        
        # Simplified query to avoid complex joins
        query = """
            SELECT c.id, c.title, c.created_at, c.updated_at, c.is_archived
            FROM conversations c
            WHERE c.user_id = $1
        """
        params = [user_id]
        param_count = 1
        
        if archived is not None:
            param_count += 1
            query += f" AND c.is_archived = ${param_count}"
            params.append(archived)
        
        if search:
            param_count += 1
            query += f" AND c.title ILIKE ${param_count}"
            params.append(f"%{search}%")
        
        query += " ORDER BY c.updated_at DESC"
        
        # Add pagination
        offset = (page - 1) * limit
        param_count += 1
        query += f" LIMIT ${param_count}"
        params.append(limit)
        param_count += 1
        query += f" OFFSET ${param_count}"
        params.append(offset)
        
        conversations = await conn.fetch(query, *params)
        
        # Get message counts separately
        conversation_list = []
        for conv in conversations:
            # Get message count for this conversation
            message_count = await conn.fetchval(
                "SELECT COUNT(*) FROM messages WHERE conversation_id = $1",
                conv['id']
            )
            
            # Get last message
            last_message = await conn.fetchrow(
                "SELECT content, created_at FROM messages WHERE conversation_id = $1 ORDER BY created_at DESC LIMIT 1",
                conv['id']
            )
            
            # Handle None timestamps
            created_at = conv['created_at'] or datetime.now()
            updated_at = conv['updated_at'] or datetime.now()
            last_timestamp = last_message['created_at'] if last_message else created_at
            
            conversation_list.append(ConversationSummary(
                id=str(conv['id']),
                title=conv['title'] or "New Conversation",
                created_at=created_at,
                updated_at=updated_at,
                message_count=message_count or 0,
                last_message_preview=last_message['content'] if last_message else "",
                last_message_timestamp=last_timestamp,
                is_archived=bool(conv['is_archived'])
            ))
        
        # Get total count
        count_query = "SELECT COUNT(*) FROM conversations WHERE user_id = $1"
        count_params = [user_id]
        count_param_count = 1
        
        if archived is not None:
            count_param_count += 1
            count_query += f" AND is_archived = ${count_param_count}"
            count_params.append(archived)
        if search:
            count_param_count += 1
            count_query += f" AND title ILIKE ${count_param_count}"
            count_params.append(f"%{search}%")
        
        total_count = await conn.fetchval(count_query, *count_params)
        
        await conn.close()
        
        return ConversationListResponse(
            conversations=conversation_list,
            total_count=total_count,
            page=page,
            limit=limit,
            has_more=(page * limit) < total_count
        )
        
    except Exception as e:
        print(f"Error in get_conversations: {e}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.get("/api/history/conversations/{conversation_id}")
async def get_conversation_detail(
    conversation_id: str,
    email: str = Depends(verify_token)
):
    try:
        user_id = await get_user_id_from_email(email)
        
        conn = await get_db_connection()
        
        # Get conversation
        conversation = await conn.fetchrow(
            "SELECT * FROM conversations WHERE id = $1 AND user_id = $2",
            int(conversation_id), user_id
        )
        
        if not conversation:
            await conn.close()
            raise HTTPException(status_code=404, detail="Conversation not found")
        
        # Get messages
        messages = await conn.fetch(
            "SELECT * FROM messages WHERE conversation_id = $1 ORDER BY created_at ASC",
            int(conversation_id)
        )
        
        await conn.close()
        
        message_list = []
        for msg in messages:
            message_list.append(MessageDetail(
                id=str(msg['id']),
                content=msg['content'],
                sender=msg['sender'],
                ai_provider=msg['ai_provider'] or "honey",
                created_at=msg['created_at']
            ))
        
        return ConversationDetail(
            id=str(conversation['id']),
            title=conversation['title'],
            created_at=conversation['created_at'],
            updated_at=conversation['updated_at'],
            messages=message_list,
            is_archived=bool(conversation['is_archived']),
            message_count=len(message_list)
        )
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error in get_conversation_detail: {e}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.post("/api/history/conversations/{conversation_id}/messages")
async def add_message_to_conversation(
    conversation_id: int,
    message: MessageCreate,
    email: str = Depends(verify_token)
):
    user_id = await get_user_id_from_email(email)
    
    conn = await get_db_connection()
    
    # Verify conversation belongs to user
    conversation = await conn.fetchrow(
        "SELECT id FROM conversations WHERE id = $1 AND user_id = $2",
        conversation_id, user_id
    )
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    # Add message
    message_id = await conn.fetchval(
        "INSERT INTO messages (conversation_id, content, sender, ai_provider) VALUES ($1, $2, $3, $4) RETURNING id",
        conversation_id, message.content, message.sender, message.ai_provider
    )
    
    # Update conversation timestamp
    await conn.execute(
        "UPDATE conversations SET updated_at = CURRENT_TIMESTAMP WHERE id = $1",
        conversation_id
    )
    
    await conn.close()
    
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
    user_id = await get_user_id_from_email(email)
    
    conn = await get_db_connection()
    
    # Build update query
    update_fields = []
    params = []
    param_count = 0
    
    if updates.title is not None:
        param_count += 1
        update_fields.append(f"title = ${param_count}")
        params.append(updates.title)
    
    if updates.is_archived is not None:
        param_count += 1
        update_fields.append(f"is_archived = ${param_count}")
        params.append(updates.is_archived)
    
    if not update_fields:
        return {"message": "No updates provided"}
    
    update_fields.append("updated_at = CURRENT_TIMESTAMP")
    param_count += 1
    params.append(int(conversation_id))
    param_count += 1
    params.append(user_id)
    
    query = f"UPDATE conversations SET {', '.join(update_fields)} WHERE id = ${param_count-1} AND user_id = ${param_count}"
    result = await conn.execute(query, *params)
    
    if result == "UPDATE 0":
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    await conn.close()
    
    return {"message": "Conversation updated successfully"}

@router.delete("/api/history/conversations/{conversation_id}")
async def delete_conversation(
    conversation_id: str,
    email: str = Depends(verify_token)
):
    user_id = await get_user_id_from_email(email)
    
    conn = await get_db_connection()
    
    # Delete messages first
    await conn.execute("DELETE FROM messages WHERE conversation_id = $1", int(conversation_id))
    
    # Delete conversation
    result = await conn.execute(
        "DELETE FROM conversations WHERE id = $1 AND user_id = $2",
        int(conversation_id), user_id
    )
    
    if result == "DELETE 0":
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    await conn.close()
    
    return {"message": "Conversation deleted successfully"}

@router.post("/api/history/search")
async def search_conversations(
    search_request: SearchRequest,
    email: str = Depends(verify_token)
):
    user_id = await get_user_id_from_email(email)
    
    conn = await get_db_connection()
    
    # Simple search implementation
    query = """
        SELECT c.*, COUNT(m.id) as message_count,
               MAX(m.created_at) as last_message_time,
               (SELECT content FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message
        FROM conversations c
        LEFT JOIN messages m ON c.id = m.conversation_id
        WHERE c.user_id = $1 AND (c.title ILIKE $2 OR EXISTS (
            SELECT 1 FROM messages WHERE conversation_id = c.id AND content ILIKE $3
        ))
        GROUP BY c.id
        ORDER BY c.updated_at DESC
        LIMIT $4 OFFSET $5
    """
    
    search_term = f"%{search_request.query}%"
    offset = (search_request.page - 1) * search_request.limit
    
    results = await conn.fetch(query, user_id, search_term, search_term, search_request.limit, offset)
    
    await conn.close()
    
    search_results = []
    for result in results:
        conversation = ConversationSummary(
            id=str(result['id']),
            title=result['title'],
            created_at=result['created_at'],
            updated_at=result['updated_at'],
            message_count=result['message_count'] or 0,
            last_message_preview=result['last_message'] or "",
            last_message_timestamp=result['last_message_time'] if result['last_message_time'] else result['created_at'],
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
    user_id = await get_user_id_from_email(email)
    
    conn = await get_db_connection()
    
    # Get basic stats
    total_conversations = await conn.fetchval("SELECT COUNT(*) FROM conversations WHERE user_id = $1", user_id)
    
    total_messages = await conn.fetchval("""
        SELECT COUNT(*) FROM messages m 
        JOIN conversations c ON m.conversation_id = c.id 
        WHERE c.user_id = $1
    """, user_id)
    
    await conn.close()
    
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