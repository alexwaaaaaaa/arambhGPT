from fastapi import APIRouter, HTTPException, Depends
from typing import Optional, List
from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy import func, desc, or_
from .database import get_db, User as UserModel, Conversation as ConversationModel, Message as MessageModel
from .auth import verify_token, get_user_by_email
from .models import (
    ConversationCreate, ConversationDetail, ConversationSummary, 
    ConversationListResponse, ConversationUpdateRequest,
    MessageCreate, MessageDetail, SearchRequest, SearchResponse,
    SearchResult, ConversationStats, ExportRequest
)

router = APIRouter()

def get_user_id_from_email(db: Session, email: str) -> int:
    user = get_user_by_email(db, email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user.id

@router.post("/api/history/conversations")
async def create_conversation(
    conversation: ConversationCreate,
    email: str = Depends(verify_token),
    db: Session = Depends(get_db)
):
    user_id = get_user_id_from_email(db, email)
    
    title = conversation.title or "New Conversation"
    db_conversation = ConversationModel(
        user_id=user_id,
        title=title
    )
    db.add(db_conversation)
    db.commit()
    db.refresh(db_conversation)
    
    return {
        "id": db_conversation.id,
        "title": db_conversation.title,
        "created_at": db_conversation.created_at,
        "updated_at": db_conversation.updated_at,
        "messages": []
    }

@router.get("/api/history/conversations")
async def get_conversations(
    page: int = 1,
    limit: int = 20,
    archived: Optional[bool] = None,
    search: Optional[str] = None,
    email: str = Depends(verify_token),
    db: Session = Depends(get_db)
):
    user_id = get_user_id_from_email(db, email)
    
    # Build query
    query = db.query(ConversationModel).filter(ConversationModel.user_id == user_id)
    
    if archived is not None:
        query = query.filter(ConversationModel.is_archived == archived)
    
    if search:
        query = query.filter(ConversationModel.title.ilike(f"%{search}%"))
    
    # Get total count
    total_count = query.count()
    
    # Apply pagination and ordering
    conversations = query.order_by(desc(ConversationModel.updated_at)).offset((page - 1) * limit).limit(limit).all()
    
    # Format response
    conversation_list = []
    for conv in conversations:
        # Get message count and last message
        message_count = db.query(MessageModel).filter(MessageModel.conversation_id == conv.id).count()
        last_message = db.query(MessageModel).filter(MessageModel.conversation_id == conv.id).order_by(desc(MessageModel.created_at)).first()
        
        conversation_list.append(ConversationSummary(
            id=str(conv.id),
            title=conv.title,
            created_at=conv.created_at,
            updated_at=conv.updated_at,
            message_count=message_count,
            last_message_preview=last_message.content if last_message else "",
            last_message_timestamp=last_message.created_at if last_message else conv.created_at,
            is_archived=conv.is_archived
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
    email: str = Depends(verify_token),
    db: Session = Depends(get_db)
):
    user_id = get_user_id_from_email(db, email)
    
    # Get conversation
    conversation = db.query(ConversationModel).filter(
        ConversationModel.id == conversation_id,
        ConversationModel.user_id == user_id
    ).first()
    
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    # Get messages
    messages = db.query(MessageModel).filter(
        MessageModel.conversation_id == conversation_id
    ).order_by(MessageModel.created_at).all()
    
    message_list = []
    for msg in messages:
        message_list.append(MessageDetail(
            id=str(msg.id),
            content=msg.content,
            sender=msg.sender,
            ai_provider=msg.ai_provider,
            created_at=msg.created_at
        ))
    
    return ConversationDetail(
        id=str(conversation.id),
        title=conversation.title,
        created_at=conversation.created_at,
        updated_at=conversation.updated_at,
        messages=message_list,
        is_archived=conversation.is_archived,
        message_count=len(message_list)
    )

@router.post("/api/history/conversations/{conversation_id}/messages")
async def add_message_to_conversation(
    conversation_id: int,
    message: MessageCreate,
    email: str = Depends(verify_token),
    db: Session = Depends(get_db)
):
    user_id = get_user_id_from_email(db, email)
    
    # Verify conversation belongs to user
    conversation = db.query(ConversationModel).filter(
        ConversationModel.id == conversation_id,
        ConversationModel.user_id == user_id
    ).first()
    
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    # Add message
    db_message = MessageModel(
        conversation_id=conversation_id,
        content=message.content,
        sender=message.sender,
        ai_provider=message.ai_provider
    )
    db.add(db_message)
    
    # Update conversation timestamp
    conversation.updated_at = datetime.utcnow()
    
    db.commit()
    db.refresh(db_message)
    
    return {
        "id": db_message.id,
        "content": db_message.content,
        "sender": db_message.sender,
        "ai_provider": db_message.ai_provider,
        "created_at": db_message.created_at
    }

@router.put("/api/history/conversations/{conversation_id}")
async def update_conversation(
    conversation_id: str,
    updates: ConversationUpdateRequest,
    email: str = Depends(verify_token),
    db: Session = Depends(get_db)
):
    user_id = get_user_id_from_email(db, email)
    
    conversation = db.query(ConversationModel).filter(
        ConversationModel.id == conversation_id,
        ConversationModel.user_id == user_id
    ).first()
    
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    if updates.title is not None:
        conversation.title = updates.title
    
    if updates.is_archived is not None:
        conversation.is_archived = updates.is_archived
    
    conversation.updated_at = datetime.utcnow()
    db.commit()
    
    return {"message": "Conversation updated successfully"}

@router.delete("/api/history/conversations/{conversation_id}")
async def delete_conversation(
    conversation_id: str,
    email: str = Depends(verify_token),
    db: Session = Depends(get_db)
):
    user_id = get_user_id_from_email(db, email)
    
    conversation = db.query(ConversationModel).filter(
        ConversationModel.id == conversation_id,
        ConversationModel.user_id == user_id
    ).first()
    
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    # Delete messages first
    db.query(MessageModel).filter(MessageModel.conversation_id == conversation_id).delete()
    
    # Delete conversation
    db.delete(conversation)
    db.commit()
    
    return {"message": "Conversation deleted successfully"}

@router.post("/api/history/search")
async def search_conversations(
    search_request: SearchRequest,
    email: str = Depends(verify_token),
    db: Session = Depends(get_db)
):
    user_id = get_user_id_from_email(db, email)
    
    # Simple search implementation
    query = db.query(ConversationModel).filter(ConversationModel.user_id == user_id)
    
    # Search in title or messages
    search_term = f"%{search_request.query}%"
    query = query.filter(
        or_(
            ConversationModel.title.ilike(search_term),
            ConversationModel.id.in_(
                db.query(MessageModel.conversation_id).filter(
                    MessageModel.content.ilike(search_term)
                )
            )
        )
    )
    
    # Apply pagination
    offset = (search_request.page - 1) * search_request.limit
    conversations = query.order_by(desc(ConversationModel.updated_at)).offset(offset).limit(search_request.limit).all()
    
    search_results = []
    for conv in conversations:
        # Get message count and last message
        message_count = db.query(MessageModel).filter(MessageModel.conversation_id == conv.id).count()
        last_message = db.query(MessageModel).filter(MessageModel.conversation_id == conv.id).order_by(desc(MessageModel.created_at)).first()
        
        conversation = ConversationSummary(
            id=str(conv.id),
            title=conv.title,
            created_at=conv.created_at,
            updated_at=conv.updated_at,
            message_count=message_count,
            last_message_preview=last_message.content if last_message else "",
            last_message_timestamp=last_message.created_at if last_message else conv.created_at,
            is_archived=conv.is_archived
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
async def get_conversation_stats(
    email: str = Depends(verify_token),
    db: Session = Depends(get_db)
):
    user_id = get_user_id_from_email(db, email)
    
    # Get basic stats
    total_conversations = db.query(ConversationModel).filter(ConversationModel.user_id == user_id).count()
    total_messages = db.query(MessageModel).join(ConversationModel).filter(ConversationModel.user_id == user_id).count()
    
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
    email: str = Depends(verify_token),
    db: Session = Depends(get_db)
):
    # Simple export implementation
    return {"message": "Export feature coming soon!", "format": export_request.format}