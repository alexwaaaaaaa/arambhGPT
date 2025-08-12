from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

# User models
class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    city: str
    country: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class User(BaseModel):
    id: str
    name: str
    email: str
    city: str
    country: str
    created_at: datetime

class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict

# Chat models
class ChatMessage(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str
    status: str
    ai_provider: str

# Conversation models
class ConversationCreate(BaseModel):
    title: Optional[str] = None

class ConversationUpdateRequest(BaseModel):
    title: Optional[str] = None
    is_archived: Optional[bool] = None

class MessageCreate(BaseModel):
    content: str
    sender: str
    ai_provider: Optional[str] = None

class MessageDetail(BaseModel):
    id: str
    content: str
    sender: str
    ai_provider: Optional[str] = None
    created_at: datetime

class ConversationDetail(BaseModel):
    id: str
    title: str
    created_at: datetime
    updated_at: datetime
    messages: List[MessageDetail]
    is_archived: bool
    message_count: int

class ConversationSummary(BaseModel):
    id: str
    title: str
    created_at: datetime
    updated_at: datetime
    message_count: int
    last_message_preview: str
    last_message_timestamp: datetime
    is_archived: bool

class ConversationListResponse(BaseModel):
    conversations: List[ConversationSummary]
    total_count: int
    page: int
    limit: int
    has_more: bool

# Search models
class SearchFilters(BaseModel):
    date_from: Optional[datetime] = None
    date_to: Optional[datetime] = None
    ai_provider: Optional[str] = None
    message_count_min: Optional[int] = None
    message_count_max: Optional[int] = None
    archived: Optional[bool] = None

class SearchRequest(BaseModel):
    query: str
    filters: Optional[SearchFilters] = None
    page: int = 1
    limit: int = 20

class SearchResult(BaseModel):
    conversation: ConversationSummary
    highlights: List[str] = []
    relevance_score: float = 0.0

class SearchResponse(BaseModel):
    results: List[SearchResult]
    total_count: int
    page: int
    limit: int
    has_more: bool

# Stats models
class ConversationStats(BaseModel):
    total_conversations: int
    total_messages: int
    active_days: int
    average_messages_per_conversation: float
    most_active_day: Optional[str] = None
    conversation_frequency: dict = {}

# Export models
class ExportRequest(BaseModel):
    format: str = "json"
    conversation_ids: List[str] = []
    include_metadata: bool = True

# Mood Tracking models
class MoodEntryCreate(BaseModel):
    mood: int  # 1-5 scale
    emotions: List[str] = []
    notes: Optional[str] = None
    activities: List[str] = []
    sleep_hours: Optional[float] = None
    stress_level: Optional[int] = None
    energy_level: Optional[int] = None
    date: Optional[str] = None  # YYYY-MM-DD format

class MoodEntryUpdate(BaseModel):
    mood: Optional[int] = None
    emotions: Optional[List[str]] = None
    notes: Optional[str] = None
    activities: Optional[List[str]] = None
    sleep_hours: Optional[float] = None
    stress_level: Optional[int] = None
    energy_level: Optional[int] = None

class MoodEntry(BaseModel):
    id: str
    user_id: str
    date: str
    mood: int
    emotions: List[str]
    notes: Optional[str] = None
    activities: List[str]
    sleep_hours: Optional[float] = None
    stress_level: Optional[int] = None
    energy_level: Optional[int] = None
    created_at: datetime
    updated_at: datetime

class MoodStats(BaseModel):
    average_mood: float
    total_entries: int
    streak_days: int
    most_common_mood: int
    mood_trend: str  # 'improving', 'declining', 'stable'
    weekly_average: float
    monthly_average: float

# Notification models
class NotificationCreate(BaseModel):
    type: str  # 'mood_reminder', 'wellness_tip', 'achievement', 'social', 'system'
    title: str
    message: str
    priority: str = "medium"  # 'low', 'medium', 'high'
    action_url: Optional[str] = None
    icon: Optional[str] = None

class Notification(BaseModel):
    id: str
    user_id: str
    type: str
    title: str
    message: str
    is_read: bool
    priority: str
    action_url: Optional[str] = None
    icon: Optional[str] = None
    created_at: datetime

class NotificationSettings(BaseModel):
    mood_reminders: bool = True
    wellness_tips: bool = True
    achievements: bool = True
    social_updates: bool = False
    email_notifications: bool = False
    push_notifications: bool = False
    reminder_time: str = "20:00"
    frequency: str = "daily"

# Social Features models
class SupportGroupCreate(BaseModel):
    name: str
    description: str
    is_private: bool = False
    tags: List[str] = []

class SupportGroup(BaseModel):
    id: str
    name: str
    description: str
    member_count: int
    is_private: bool
    tags: List[str]
    created_at: datetime
    moderators: List[str]

class GroupMessageCreate(BaseModel):
    content: str
    is_anonymous: bool = True

class GroupMessage(BaseModel):
    id: str
    group_id: str
    author_id: str
    author_name: str
    content: str
    is_anonymous: bool
    reactions: List[dict] = []
    created_at: datetime

# AI Context models
class AIContextUpdate(BaseModel):
    communication_style: Optional[str] = None  # 'formal', 'casual', 'empathetic'
    language: Optional[str] = None  # 'english', 'hindi', 'hinglish'
    topics: Optional[List[str]] = None
    stressors: Optional[List[str]] = None
    coping_mechanisms: Optional[List[str]] = None
    goals: Optional[List[str]] = None

class AIContext(BaseModel):
    user_id: str
    communication_style: str
    language: str
    topics: List[str]
    stressors: List[str]
    coping_mechanisms: List[str]
    goals: List[str]
    updated_at: datetime