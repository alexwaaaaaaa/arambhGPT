// Chat related types

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  ai_provider?: string;
  created_at: string;
}

export interface MessageCreate {
  content: string;
  sender: 'user' | 'ai';
  ai_provider?: string;
}

export interface ChatResponse {
  response: string;
  status: string;
  ai_provider: string;
}

export interface ChatMessage {
  message: string;
}

export interface Conversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  messages: Message[];
  is_archived: boolean;
  message_count: number;
}

export interface ConversationSummary {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  message_count: number;
  last_message_preview: string;
  last_message_timestamp: string;
  is_archived: boolean;
}

export interface ConversationCreate {
  title?: string;
}

export interface ConversationListResponse {
  conversations: ConversationSummary[];
  total_count: number;
  page: number;
  limit: number;
  has_more: boolean;
}

export interface ConversationParams {
  page?: number;
  limit?: number;
  archived?: boolean;
  search?: string;
  date_from?: string;
  date_to?: string;
}