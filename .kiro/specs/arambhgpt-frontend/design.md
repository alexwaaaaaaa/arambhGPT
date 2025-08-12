# ArambhGPT Frontend Design Document

## Overview

The ArambhGPT frontend is a modern, full-featured Next.js 15 application that provides a comprehensive mental health chat experience. The design emphasizes clean UI, intuitive navigation, and seamless integration with the existing FastAPI backend. The application follows a light theme with black input fields as specified, ensuring accessibility and user comfort.

## Architecture

### Technology Stack
- **Framework:** Next.js 15.4.6 with App Router
- **Language:** TypeScript for type safety
- **Styling:** Tailwind CSS for utility-first styling
- **State Management:** React Context API + Custom hooks
- **HTTP Client:** Fetch API with custom wrapper
- **Authentication:** JWT tokens with secure storage
- **Build Tool:** Turbopack (Next.js 15 default)

### Project Structure
```
arambhgpt-frontend/
├── src/
│   ├── app/                    # App Router pages
│   │   ├── (auth)/            # Auth group routes
│   │   │   ├── signin/
│   │   │   └── signup/
│   │   ├── chat/              # Chat page
│   │   ├── about/             # About page
│   │   ├── profile/           # User profile
│   │   ├── globals.css        # Global styles
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/            # Reusable components
│   │   ├── ui/               # Basic UI components
│   │   ├── auth/             # Authentication components
│   │   ├── chat/             # Chat-related components
│   │   └── layout/           # Layout components
│   ├── lib/                  # Utilities and configurations
│   │   ├── api.ts           # API client
│   │   ├── auth.ts          # Auth utilities
│   │   └── utils.ts         # General utilities
│   ├── hooks/               # Custom React hooks
│   ├── types/               # TypeScript type definitions
│   └── contexts/            # React contexts
├── public/                  # Static assets
└── config files
```

## Components and Interfaces

### Core Components

#### 1. Layout Components

**Navbar Component**
```typescript
interface NavbarProps {
  user?: User | null;
  onLogout: () => void;
}
```
- Responsive navigation with mobile hamburger menu
- Dynamic authentication state display
- ArambhGPT logo with consistent branding
- Active route highlighting

**Layout Component**
```typescript
interface LayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}
```
- Consistent page structure
- Conditional sidebar rendering
- Responsive design breakpoints

#### 2. Authentication Components

**SignInForm Component**
```typescript
interface SignInFormProps {
  onSuccess: (user: User, token: string) => void;
  onError: (error: string) => void;
}
```
- Email and password validation
- Loading states and error handling
- Redirect logic after successful authentication

**SignUpForm Component**
```typescript
interface SignUpFormProps {
  onSuccess: (user: User, token: string) => void;
  onError: (error: string) => void;
}
```
- Name, email, password validation
- Password strength indicators
- Terms and conditions acceptance

#### 3. Chat Components

**ChatInterface Component**
```typescript
interface ChatInterfaceProps {
  conversationId?: string;
  onNewConversation: (conversation: Conversation) => void;
}
```
- Message display area with auto-scroll
- Black input field with send button
- Typing indicators and loading states
- Message timestamps and AI provider badges

**MessageBubble Component**
```typescript
interface MessageBubbleProps {
  message: Message;
  isUser: boolean;
  aiProvider?: string;
  timestamp: Date;
}
```
- Distinct styling for user vs AI messages
- Copy message functionality
- Timestamp display on hover

**ChatSidebar Component**
```typescript
interface ChatSidebarProps {
  conversations: ConversationSummary[];
  activeConversationId?: string;
  onConversationSelect: (id: string) => void;
  onNewChat: () => void;
}
```
- Collapsible conversation history
- Search functionality
- Conversation management (rename, delete, archive)
- New chat button

#### 4. Advanced Feature Components

**SearchModal Component**
```typescript
interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResultSelect: (conversationId: string) => void;
}
```
- Full-text search across conversations
- Search result highlighting
- Filter options (date range, archived status)

**ExportModal Component**
```typescript
interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversationIds: string[];
}
```
- Format selection (PDF, JSON, TXT)
- Date range selection
- Progress indicators for export generation

**StatsPanel Component**
```typescript
interface StatsPanelProps {
  stats: ConversationStats;
  className?: string;
}
```
- Visual charts for conversation frequency
- Usage metrics display
- Activity heatmap

## Data Models

### Frontend Type Definitions

```typescript
// User types
interface User {
  id: string;
  name: string;
  email: string;
  created_at: string;
}

// Authentication types
interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// Chat types
interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  ai_provider?: string;
  created_at: string;
}

interface Conversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  messages: Message[];
  is_archived: boolean;
  message_count: number;
}

interface ConversationSummary {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  message_count: number;
  last_message_preview: string;
  last_message_timestamp: string;
  is_archived: boolean;
}

// API Response types
interface ChatResponse {
  response: string;
  status: string;
  ai_provider: string;
}

interface ConversationStats {
  total_conversations: number;
  total_messages: number;
  active_days: number;
  average_messages_per_conversation: number;
  most_active_day?: string;
  conversation_frequency: Record<string, number>;
}
```

### API Integration Layer

```typescript
class ApiClient {
  private baseURL: string;
  private token: string | null;

  // Authentication methods
  async signUp(userData: SignUpData): Promise<AuthResponse>;
  async signIn(credentials: SignInData): Promise<AuthResponse>;
  async getCurrentUser(): Promise<User>;

  // Chat methods
  async sendMessage(message: string): Promise<ChatResponse>;
  async createConversation(title?: string): Promise<Conversation>;
  async getConversations(params?: ConversationParams): Promise<ConversationListResponse>;
  async getConversation(id: string): Promise<Conversation>;
  async addMessageToConversation(conversationId: string, message: MessageCreate): Promise<Message>;

  // Advanced features
  async searchConversations(query: SearchRequest): Promise<SearchResponse>;
  async exportConversations(request: ExportRequest): Promise<Blob>;
  async getConversationStats(): Promise<ConversationStats>;
  async updateConversation(id: string, updates: ConversationUpdate): Promise<void>;
  async deleteConversation(id: string): Promise<void>;
}
```

## Error Handling

### Error Boundary Implementation
- Global error boundary for unhandled React errors
- API error handling with user-friendly messages
- Network error detection and retry mechanisms
- Authentication error handling with automatic logout

### Loading States
- Skeleton loaders for chat messages
- Spinner indicators for API calls
- Progressive loading for conversation history
- Optimistic updates for better UX

## Testing Strategy

### Unit Testing
- Component testing with React Testing Library
- Hook testing for custom hooks
- API client testing with mock responses
- Utility function testing

### Integration Testing
- Authentication flow testing
- Chat functionality end-to-end testing
- API integration testing
- Responsive design testing

### E2E Testing
- User journey testing with Playwright
- Cross-browser compatibility testing
- Mobile responsiveness testing
- Accessibility testing with axe-core

## Performance Optimization

### Code Splitting
- Route-based code splitting with Next.js App Router
- Component lazy loading for heavy features
- Dynamic imports for modals and advanced features

### Caching Strategy
- API response caching with React Query or SWR
- Static asset optimization
- Service worker for offline functionality
- Browser storage optimization

### Bundle Optimization
- Tree shaking for unused code elimination
- Image optimization with Next.js Image component
- Font optimization and preloading
- CSS purging with Tailwind CSS

## Security Considerations

### Authentication Security
- JWT token secure storage (httpOnly cookies preferred)
- Token refresh mechanism
- CSRF protection
- XSS prevention with proper sanitization

### Data Protection
- Input validation and sanitization
- Secure API communication (HTTPS)
- Sensitive data encryption
- Privacy-compliant data handling

## Accessibility Features

### WCAG 2.1 Compliance
- Keyboard navigation support
- Screen reader compatibility
- Color contrast compliance (minimum 4.5:1 ratio)
- Focus management and indicators

### Inclusive Design
- Responsive text sizing
- High contrast mode support
- Reduced motion preferences
- Multi-language support (English, Hindi, Hinglish)

## Deployment Configuration

### Build Configuration
- Production build optimization
- Environment variable management
- Static asset optimization
- Progressive Web App (PWA) setup

### Hosting Setup
- Vercel deployment configuration
- Custom domain setup
- SSL certificate configuration
- CDN optimization for global performance