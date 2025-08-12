// Chat history and advanced features types
import { ConversationSummary } from './chat';

export interface SearchRequest {
  query: string;
  page: number;
  limit: number;
  date_from?: string;
  date_to?: string;
  archived?: boolean;
}

export interface SearchResult {
  conversation: ConversationSummary;
  highlights: string[];
  relevance_score: number;
}

export interface SearchResponse {
  results: SearchResult[];
  total_count: number;
  page: number;
  limit: number;
  has_more: boolean;
}

export interface ConversationUpdateRequest {
  title?: string;
  is_archived?: boolean;
}

export interface ConversationStats {
  total_conversations: number;
  total_messages: number;
  active_days: number;
  average_messages_per_conversation: number;
  most_active_day?: string;
  conversation_frequency: Record<string, number>;
}

export interface ExportOptions {
  format: 'json' | 'txt' | 'pdf';
  conversation_ids: string[];
  date_from?: string;
  date_to?: string;
}

export interface ExportRequest {
  options: ExportOptions;
}

export interface BulkOperationRequest {
  conversation_ids: string[];
  action: 'archive' | 'unarchive' | 'delete';
}

// ConversationSummary is imported from chat types above