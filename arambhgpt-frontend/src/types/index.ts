// Main types export file

// Authentication types
export type {
  User,
  SignUpData,
  SignInData,
  AuthResponse,
  AuthState,
  AuthContextType,
} from './auth';

// Chat types
export type {
  Message,
  MessageCreate,
  ChatResponse,
  ChatMessage,
  Conversation,
  ConversationSummary,
  ConversationCreate,
  ConversationListResponse,
  ConversationParams,
} from './chat';

// History and advanced features
export type {
  SearchRequest,
  SearchResult,
  SearchResponse,
  ConversationUpdateRequest,
  ConversationStats,
  ExportOptions,
  ExportRequest,
  BulkOperationRequest,
} from './history';

// API types
export type {
  ApiError,
  ApiResponse,
  PaginatedResponse,
  ApiClientConfig,
  RequestOptions,
} from './api';

export { HttpStatus, ErrorType } from './api';

// Error types
export {
  AppError,
  AuthenticationError,
  AuthorizationError,
  ValidationError,
  NetworkError,
  TimeoutError,
} from './errors';

export type {
  ErrorBoundaryState,
  ErrorBoundaryProps,
  RetryableError,
} from './errors';

// UI types
export type {
  LoadingState,
  ErrorState,
  ModalProps,
  ButtonProps,
  InputProps,
  FormState,
  ToastMessage,
  DropdownOption,
  TabItem,
} from './ui';

// Common utility types
export interface BaseEntity {
  id: string;
  created_at: string;
  updated_at?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface SortParams {
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface FilterParams {
  search?: string;
  date_from?: string;
  date_to?: string;
  status?: string;
}

// React component props helpers
export interface WithClassName {
  className?: string;
}

export interface WithChildren {
  children: React.ReactNode;
}

export interface WithOptionalChildren {
  children?: React.ReactNode;
}

// Event handler types
export type ClickHandler = (event: React.MouseEvent) => void;
export type ChangeHandler = (value: string) => void;
export type SubmitHandler = (event: React.FormEvent) => void;
export type KeyDownHandler = (event: React.KeyboardEvent) => void;
// Voice Chat Types
declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }

  interface Navigator {
    standalone?: boolean; // Safari-specific property for PWA detection
  }

  interface SpeechRecognition extends EventTarget {
    continuous: boolean;
    grammars: SpeechGrammarList;
    interimResults: boolean;
    lang: string;
    maxAlternatives: number;
    serviceURI: string;

    // Event handlers
    onaudioend: ((this: SpeechRecognition, ev: Event) => any) | null;
    onaudiostart: ((this: SpeechRecognition, ev: Event) => any) | null;
    onend: ((this: SpeechRecognition, ev: Event) => any) | null;
    onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
    onnomatch: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
    onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
    onsoundend: ((this: SpeechRecognition, ev: Event) => any) | null;
    onsoundstart: ((this: SpeechRecognition, ev: Event) => any) | null;
    onspeechend: ((this: SpeechRecognition, ev: Event) => any) | null;
    onspeechstart: ((this: SpeechRecognition, ev: Event) => any) | null;
    onstart: ((this: SpeechRecognition, ev: Event) => any) | null;

    // Methods
    abort(): void;
    start(): void;
    stop(): void;
  }

  interface SpeechRecognitionEvent extends Event {
    readonly resultIndex: number;
    readonly results: SpeechRecognitionResultList;
  }

  interface SpeechRecognitionErrorEvent extends Event {
    readonly error: string;
    readonly message: string;
  }

  interface SpeechRecognitionResultList {
    readonly length: number;
    item(index: number): SpeechRecognitionResult;
    [index: number]: SpeechRecognitionResult;
  }

  interface SpeechRecognitionResult {
    readonly isFinal: boolean;
    readonly length: number;
    item(index: number): SpeechRecognitionAlternative;
    [index: number]: SpeechRecognitionAlternative;
  }

  interface SpeechRecognitionAlternative {
    readonly confidence: number;
    readonly transcript: string;
  }

  interface SpeechGrammarList {
    readonly length: number;
    addFromString(string: string, weight?: number): void;
    addFromURI(src: string, weight?: number): void;
    item(index: number): SpeechGrammar;
    [index: number]: SpeechGrammar;
  }

  interface SpeechGrammar {
    src: string;
    weight: number;
  }
}

export interface VoiceSettings {
  enabled: boolean;
  autoSpeak: boolean;
  language: string;
  rate: number;
  pitch: number;
  volume: number;
}

// Mood tracking types
export type {
  MoodLevel,
  MoodEntry,
  MoodStats,
  MoodChart,
} from './mood';

export {
  MOOD_LABELS,
  MOOD_COLORS,
  MOOD_EMOJIS,
  COMMON_EMOTIONS,
  COMMON_ACTIVITIES,
} from './mood';

// Notifications types
export type {
  Notification,
  NotificationSettings,
  NotificationType,
} from './notifications';

// Analytics types
export type {
  AdvancedMoodStats,
  MoodCorrelation,
  MoodPattern,
  MoodPrediction,
} from './analytics';

// Social types
export type {
  SupportGroup,
  GroupMessage,
  MoodShare,
  TherapistProfile,
  SupportConnection,
} from './social';