# Chat History Management - Design Document

## Overview

The Chat History Management system provides users with comprehensive tools to view, search, organize, and manage their conversation history with ArambhGPT. The design focuses on performance, usability, and data privacy while building upon the existing database architecture and authentication system.

## Architecture

### System Components

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend UI   │    │   Backend API   │    │   Database      │
│                 │    │                 │    │                 │
│ - History List  │◄──►│ - History API   │◄──►│ - Conversations │
│ - Search UI     │    │ - Search API    │    │ - Messages      │
│ - Export UI     │    │ - Export API    │    │ - Users         │
│ - Analytics UI  │    │ - Analytics API │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Data Flow

1. **List Conversations**: Frontend → Backend API → Database Query → Response
2. **Search**: User Input → Debounced Search → Backend → Full-text Search → Results
3. **View Conversation**: Click → API Call → Message Retrieval → Display
4. **Export**: Selection → Backend Processing → File Generation → Download

## Components and Interfaces

### Frontend Components

#### 1. ChatHistoryPage Component
```typescript
interface ChatHistoryPageProps {
  userId: string;
}

interface ChatHistoryState {
  conversations: Conversation[];
  loading: boolean;
  searchQuery: string;
  filters: HistoryFilters;
  selectedConversations: string[];
}
```

#### 2. ConversationList Component
```typescript
interface ConversationListProps {
  conversations: Conversation[];
  onConversationClick: (id: string) => void;
  onConversationSelect: (id: string) => void;
  selectedIds: string[];
}
```

#### 3. ConversationView Component
```typescript
interface ConversationViewProps {
  conversationId: string;
  messages: Message[];
  onBack: () => void;
  onContinue: () => void;
}
```

#### 4. SearchBar Component
```typescript
interface SearchBarProps {
  query: string;
  onQueryChange: (query: string) => void;
  filters: HistoryFilters;
  onFiltersChange: (filters: HistoryFilters) => void;
}
```

#### 5. ExportDialog Component
```typescript
interface ExportDialogProps {
  isOpen: boolean;
  selectedConversations: string[];
  onExport: (format: ExportFormat, options: ExportOptions) => void;
  onClose: () => void;
}
```

### Backend API Endpoints

#### 1. Conversation History API
```python
# GET /api/history/conversations
@router.get("/conversations")
async def get_conversations(
    user_id: str = Depends(get_current_user),
    page: int = 1,
    limit: int = 20,
    search: Optional[str] = None,
    date_from: Optional[datetime] = None,
    date_to: Optional[datetime] = None,
    db: Session = Depends(get_db)
) -> ConversationListResponse
```

#### 2. Conversation Detail API
```python
# GET /api/history/conversations/{conversation_id}
@router.get("/conversations/{conversation_id}")
async def get_conversation_detail(
    conversation_id: str,
    user_id: str = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> ConversationDetailResponse
```

#### 3. Search API
```python
# POST /api/history/search
@router.post("/search")
async def search_conversations(
    search_request: SearchRequest,
    user_id: str = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> SearchResponse
```

#### 4. Export API
```python
# POST /api/history/export
@router.post("/export")
async def export_conversations(
    export_request: ExportRequest,
    user_id: str = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> FileResponse
```

## Data Models

### Frontend TypeScript Interfaces

```typescript
interface Conversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  message_count: number;
  last_message_preview: string;
  last_message_timestamp: string;
  is_archived: boolean;
}

interface Message {
  id: string;
  conversation_id: string;
  content: string;
  sender: 'user' | 'ai';
  ai_provider?: string;
  created_at: string;
}

interface HistoryFilters {
  dateRange: {
    from?: Date;
    to?: Date;
  };
  aiProvider?: string;
  messageCountRange?: {
    min?: number;
    max?: number;
  };
  archived?: boolean;
}

interface SearchRequest {
  query: string;
  filters: HistoryFilters;
  page: number;
  limit: number;
}

interface ExportRequest {
  conversation_ids: string[];
  format: 'pdf' | 'json' | 'txt';
  include_metadata: boolean;
  date_range?: {
    from: string;
    to: string;
  };
}
```

### Backend Pydantic Models

```python
class ConversationSummary(BaseModel):
    id: str
    title: str
    created_at: datetime
    updated_at: datetime
    message_count: int
    last_message_preview: str
    last_message_timestamp: datetime
    is_archived: bool

class ConversationDetail(BaseModel):
    id: str
    title: str
    created_at: datetime
    updated_at: datetime
    messages: List[MessageDetail]
    is_archived: bool

class MessageDetail(BaseModel):
    id: str
    content: str
    sender: str
    ai_provider: Optional[str]
    created_at: datetime

class SearchFilters(BaseModel):
    date_from: Optional[datetime]
    date_to: Optional[datetime]
    ai_provider: Optional[str]
    message_count_min: Optional[int]
    message_count_max: Optional[int]
    archived: Optional[bool]

class ExportOptions(BaseModel):
    format: str
    include_metadata: bool
    conversation_ids: List[str]
    date_range: Optional[Dict[str, datetime]]
```

## Database Schema Enhancements

### New Indexes for Performance

```sql
-- Optimize conversation queries
CREATE INDEX idx_conversations_user_updated 
ON conversations(user_id, updated_at DESC);

-- Optimize message search
CREATE INDEX idx_messages_conversation_created 
ON messages(conversation_id, created_at);

-- Full-text search index
CREATE INDEX idx_messages_content_search 
ON messages USING gin(to_tsvector('english', content));

-- Conversation title search
CREATE INDEX idx_conversations_title_search 
ON conversations USING gin(to_tsvector('english', title));
```

### New Database Fields

```sql
-- Add archived status to conversations
ALTER TABLE conversations 
ADD COLUMN is_archived BOOLEAN DEFAULT FALSE;

-- Add conversation statistics
ALTER TABLE conversations 
ADD COLUMN message_count INTEGER DEFAULT 0;

-- Add last message timestamp for sorting
ALTER TABLE conversations 
ADD COLUMN last_message_at TIMESTAMP DEFAULT NOW();
```

## Error Handling

### Frontend Error States

```typescript
interface HistoryError {
  type: 'LOAD_ERROR' | 'SEARCH_ERROR' | 'EXPORT_ERROR' | 'DELETE_ERROR';
  message: string;
  retryable: boolean;
}

const ErrorBoundary: React.FC<{error: HistoryError}> = ({error}) => {
  return (
    <div className="error-container">
      <h3>Something went wrong</h3>
      <p>{error.message}</p>
      {error.retryable && (
        <button onClick={handleRetry}>Try Again</button>
      )}
    </div>
  );
};
```

### Backend Error Handling

```python
class HistoryException(HTTPException):
    def __init__(self, status_code: int, detail: str):
        super().__init__(status_code=status_code, detail=detail)

class ConversationNotFoundError(HistoryException):
    def __init__(self):
        super().__init__(404, "Conversation not found")

class SearchError(HistoryException):
    def __init__(self, message: str):
        super().__init__(400, f"Search error: {message}")

class ExportError(HistoryException):
    def __init__(self, message: str):
        super().__init__(500, f"Export error: {message}")
```

## Testing Strategy

### Unit Tests

1. **Frontend Component Tests**
   - ConversationList rendering and interaction
   - SearchBar functionality and debouncing
   - ExportDialog form validation
   - Error boundary behavior

2. **Backend API Tests**
   - Conversation retrieval with pagination
   - Search functionality with various filters
   - Export generation in different formats
   - Authentication and authorization

### Integration Tests

1. **End-to-End Workflows**
   - Complete conversation history browsing
   - Search and filter operations
   - Export and download process
   - Mobile responsive behavior

2. **Performance Tests**
   - Large conversation list loading
   - Search response times
   - Export generation for large datasets
   - Database query optimization validation

### Test Data

```python
# Test fixtures for conversation history
@pytest.fixture
def sample_conversations():
    return [
        {
            "id": "conv_1",
            "title": "Anxiety Management Discussion",
            "message_count": 15,
            "created_at": "2024-01-15T10:00:00Z",
            "last_message_preview": "Thank you for the breathing exercises..."
        },
        # More test conversations...
    ]

@pytest.fixture
def large_conversation_dataset():
    # Generate 1000+ conversations for performance testing
    return generate_test_conversations(1000)
```

## Performance Considerations

### Frontend Optimizations

1. **Virtual Scrolling**: Implement virtual scrolling for large conversation lists
2. **Lazy Loading**: Load conversation details only when needed
3. **Debounced Search**: Prevent excessive API calls during typing
4. **Caching**: Cache conversation lists and search results
5. **Pagination**: Implement cursor-based pagination for smooth scrolling

### Backend Optimizations

1. **Database Indexing**: Optimize queries with proper indexes
2. **Query Optimization**: Use efficient SQL queries with joins
3. **Caching Layer**: Implement Redis caching for frequent queries
4. **Async Processing**: Use async operations for export generation
5. **Connection Pooling**: Optimize database connection management

### Caching Strategy

```python
# Redis caching for conversation lists
@cache(expire=300)  # 5 minutes
async def get_user_conversations(user_id: str, page: int, limit: int):
    # Database query implementation
    pass

# Cache search results
@cache(expire=600)  # 10 minutes
async def search_conversations(user_id: str, query: str, filters: dict):
    # Search implementation
    pass
```

## Security Considerations

### Data Access Control

1. **User Isolation**: Ensure users can only access their own conversations
2. **Authentication**: Verify JWT tokens for all API endpoints
3. **Authorization**: Check user permissions for conversation access
4. **Data Sanitization**: Sanitize search queries to prevent injection

### Privacy Protection

1. **Export Security**: Secure file generation and temporary storage
2. **Search Privacy**: Don't log sensitive search queries
3. **Data Retention**: Implement conversation deletion policies
4. **Audit Logging**: Log access to sensitive conversation data

```python
# Security middleware for conversation access
async def verify_conversation_access(
    conversation_id: str,
    user_id: str,
    db: Session
) -> bool:
    conversation = db.query(Conversation).filter(
        Conversation.id == conversation_id,
        Conversation.user_id == user_id
    ).first()
    return conversation is not None
```

## Deployment Considerations

### Environment Configuration

```python
# Environment variables for history feature
HISTORY_PAGE_SIZE = 20
SEARCH_RESULTS_LIMIT = 100
EXPORT_MAX_CONVERSATIONS = 50
CACHE_TTL_CONVERSATIONS = 300
CACHE_TTL_SEARCH = 600
```

### Monitoring and Analytics

1. **Performance Metrics**: Track API response times
2. **Usage Analytics**: Monitor search patterns and export usage
3. **Error Tracking**: Log and alert on system errors
4. **User Behavior**: Track conversation access patterns

This design provides a comprehensive foundation for implementing the Chat History Management feature while maintaining performance, security, and user experience standards.