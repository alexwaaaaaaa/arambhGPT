import {
  ApiError,
  ApiResponse,
  RequestOptions,
  HttpStatus,
  ErrorType,
  AuthResponse,
  SignUpData,
  SignInData,
  User,
  ChatMessage,
  ChatResponse,
  Conversation,
  ConversationCreate,
  ConversationListResponse,
  ConversationParams,
  Message,
  MessageCreate,
  SearchRequest,
  SearchResponse,
  ConversationStats,
  ExportRequest,
  ConversationUpdateRequest,
  AppError,
  AuthenticationError,
  NetworkError,
  TimeoutError,
} from '@/types';

class ApiClient {
  private baseURL: string;
  private token: string | null = null;
  private defaultTimeout = 5000; // 5 seconds
  private maxRetries = 1;

  // Getter for baseURL
  getBaseURL() {
    return this.baseURL;
  }

  constructor(baseURL: string = 'http://localhost:8000') {
    this.baseURL = baseURL;
    this.loadToken();
  }

  // Token management
  private loadToken(): void {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  private saveToken(token: string): void {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  }

  private clearToken(): void {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }

  // HTTP request wrapper
  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const {
      method = 'GET',
      body,
      headers = {},
      timeout = this.defaultTimeout,
      retries = this.maxRetries,
    } = options;

    const url = `${this.baseURL}${endpoint}`;

    // Prepare headers
    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers,
    };

    // Add authorization header if token exists
    if (this.token) {
      requestHeaders.Authorization = `Bearer ${this.token}`;
    }

    // Prepare request config
    const requestConfig: RequestInit = {
      method,
      headers: requestHeaders,
    };

    if (body && method !== 'GET') {
      requestConfig.body = JSON.stringify(body);
    }

    // Retry logic
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(url, {
          ...requestConfig,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        // Handle different response statuses
        if (response.ok) {
          const data = await response.json();
          return { data, success: true };
        }

        // Handle error responses
        const errorData = await response.json().catch(() => ({}));
        const error: ApiError = {
          message: errorData.detail || errorData.message || 'Request failed',
          status: response.status,
          code: this.getErrorCode(response.status),
          details: errorData,
        };

        // Handle authentication errors
        if (response.status === HttpStatus.UNAUTHORIZED) {
          this.clearToken();
          throw new AuthenticationError(error.message);
        }

        return { error, success: false };

      } catch (err) {
        // Handle network and timeout errors
        if (err instanceof AuthenticationError) {
          throw err;
        }

        if (err instanceof Error) {
          if (err.name === 'AbortError') {
            if (attempt === retries) {
              throw new TimeoutError('Request timeout');
            }
            continue; // Retry on timeout
          }

          if (attempt === retries) {
            throw new NetworkError(err.message);
          }
        }

        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
      }
    }

    throw new NetworkError('Max retries exceeded');
  }

  private getErrorCode(status: number): string {
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return ErrorType.VALIDATION_ERROR;
      case HttpStatus.UNAUTHORIZED:
        return ErrorType.AUTHENTICATION_ERROR;
      case HttpStatus.FORBIDDEN:
        return ErrorType.AUTHORIZATION_ERROR;
      case HttpStatus.NOT_FOUND:
        return 'NOT_FOUND';
      case HttpStatus.INTERNAL_SERVER_ERROR:
        return ErrorType.SERVER_ERROR;
      case HttpStatus.SERVICE_UNAVAILABLE:
        return 'SERVICE_UNAVAILABLE';
      default:
        return ErrorType.UNKNOWN_ERROR;
    }
  }

  // Authentication methods
  async signUp(userData: SignUpData): Promise<AuthResponse> {
    try {
      const url = `${this.baseURL}/auth/register`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new AppError(
          errorData.detail || 'Sign up failed',
          ErrorType.AUTHENTICATION_ERROR,
          response.status
        );
      }

      const data = await response.json();
      this.saveToken(data.access_token);
      return data;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error('Sign up error:', error);
      throw new AppError(
        'Sign up failed',
        ErrorType.NETWORK_ERROR,
        500
      );
    }
  }

  async signIn(credentials: SignInData): Promise<AuthResponse> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const url = `${this.baseURL}/auth/login`;

      // Check if backend is reachable first
      try {
        const healthCheck = await fetch(`${this.baseURL}/`, {
          method: 'GET',
          signal: AbortSignal.timeout(3000)
        });
      } catch (healthError) {
        throw new AppError(
          'Backend server is not running. Please start the backend server.',
          ErrorType.NETWORK_ERROR,
          503
        );
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        if (response.status === 401 || response.status === 403) {
          throw new AppError(
            'Incorrect email or password. Please check your credentials.',
            ErrorType.AUTHENTICATION_ERROR,
            response.status
          );
        }

        throw new AppError(
          errorData.detail || `Server error (${response.status}). Please try again.`,
          ErrorType.AUTHENTICATION_ERROR,
          response.status
        );
      }

      const data = await response.json();
      this.saveToken(data.access_token);
      return data;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new AppError(
          'Request timeout. Please check your internet connection and try again.',
          ErrorType.NETWORK_ERROR,
          408
        );
      }
      if (error instanceof AppError) {
        throw error;
      }

      // Network connectivity issues
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new AppError(
          'Cannot connect to server. Please check if the backend is running on http://localhost:8000',
          ErrorType.NETWORK_ERROR,
          503
        );
      }

      console.error('Sign in error:', error);
      throw new AppError(
        'Sign in failed. Please try again or contact support.',
        ErrorType.NETWORK_ERROR,
        500
      );
    }
  }

  async getCurrentUser(): Promise<User> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

      const url = `${this.baseURL}/auth/me`;
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 401) {
          this.clearToken();
        }
        const errorData = await response.json().catch(() => ({}));
        throw new AppError(
          errorData.detail || 'Failed to get user info',
          ErrorType.AUTHENTICATION_ERROR,
          response.status
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new AppError(
          'Request timeout',
          ErrorType.NETWORK_ERROR,
          408
        );
      }
      if (error instanceof AppError) {
        throw error;
      }
      console.error('Get user error:', error);
      throw new AppError(
        'Failed to get user info',
        ErrorType.NETWORK_ERROR,
        500
      );
    }
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  signOut(): void {
    this.clearToken();
  }

  // Chat methods
  async sendMessage(message: string): Promise<ChatResponse> {
    const chatMessage: ChatMessage = { message };

    try {
      // Direct API call without wrapper
      const url = `${this.baseURL}/chat`;
      const response = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(chatMessage),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data as ChatResponse;
    } catch (error) {
      console.error('Chat API error:', error);
      throw new AppError(
        'Failed to send message',
        ErrorType.NETWORK_ERROR,
        500
      );
    }
  }

  // Conversation management
  async createConversation(title?: string): Promise<Conversation> {
    const conversationData: ConversationCreate = { title };
    const response = await this.request<Conversation>('/api/history/conversations', {
      method: 'POST',
      body: conversationData,
    });

    if (response.success && response.data) {
      return response.data;
    }

    throw new AppError(
      response.error?.message || 'Failed to create conversation',
      response.error?.code || ErrorType.UNKNOWN_ERROR,
      response.error?.status || 500
    );
  }

  async getConversations(params?: ConversationParams): Promise<ConversationListResponse> {
    const queryParams = new URLSearchParams();

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, String(value));
        }
      });
    }

    const endpoint = `/api/history/conversations${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await this.request<ConversationListResponse>(endpoint);

    if (response.success && response.data) {
      return response.data;
    }

    throw new AppError(
      response.error?.message || 'Failed to get conversations',
      response.error?.code || ErrorType.UNKNOWN_ERROR,
      response.error?.status || 500
    );
  }

  async getConversation(id: string): Promise<Conversation> {
    const response = await this.request<Conversation>(`/api/history/conversations/${id}`);

    if (response.success && response.data) {
      return response.data;
    }

    throw new AppError(
      response.error?.message || 'Failed to get conversation',
      response.error?.code || ErrorType.UNKNOWN_ERROR,
      response.error?.status || 500
    );
  }

  async addMessageToConversation(conversationId: string, message: MessageCreate): Promise<Message> {
    const response = await this.request<Message>(`/api/history/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: message,
    });

    if (response.success && response.data) {
      return response.data;
    }

    throw new AppError(
      response.error?.message || 'Failed to add message',
      response.error?.code || ErrorType.UNKNOWN_ERROR,
      response.error?.status || 500
    );
  }

  // Advanced features
  async searchConversations(searchRequest: SearchRequest): Promise<SearchResponse> {
    const response = await this.request<SearchResponse>('/api/history/search', {
      method: 'POST',
      body: searchRequest,
    });

    if (response.success && response.data) {
      return response.data;
    }

    throw new AppError(
      response.error?.message || 'Search failed',
      response.error?.code || ErrorType.UNKNOWN_ERROR,
      response.error?.status || 500
    );
  }

  async exportConversations(exportRequest: ExportRequest): Promise<Blob> {
    const response = await fetch(`${this.baseURL}/api/history/export`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
      },
      body: JSON.stringify(exportRequest),
    });

    if (response.ok) {
      return await response.blob();
    }

    const errorData = await response.json().catch(() => ({}));
    throw new AppError(
      errorData.detail || 'Export failed',
      this.getErrorCode(response.status),
      response.status
    );
  }

  async getConversationStats(): Promise<ConversationStats> {
    const response = await this.request<ConversationStats>('/api/history/stats');

    if (response.success && response.data) {
      return response.data;
    }

    throw new AppError(
      response.error?.message || 'Failed to get stats',
      response.error?.code || ErrorType.UNKNOWN_ERROR,
      response.error?.status || 500
    );
  }

  async updateConversation(id: string, updates: ConversationUpdateRequest): Promise<void> {
    const response = await this.request(`/api/history/conversations/${id}`, {
      method: 'PUT',
      body: updates,
    });

    if (!response.success) {
      throw new AppError(
        response.error?.message || 'Failed to update conversation',
        response.error?.code || ErrorType.UNKNOWN_ERROR,
        response.error?.status || 500
      );
    }
  }

  async deleteConversation(id: string): Promise<void> {
    const response = await this.request(`/api/history/conversations/${id}`, {
      method: 'DELETE',
    });

    if (!response.success) {
      throw new AppError(
        response.error?.message || 'Failed to delete conversation',
        response.error?.code || ErrorType.UNKNOWN_ERROR,
        response.error?.status || 500
      );
    }
  }

  // Mood Tracking API
  async createMoodEntry(moodData: any): Promise<any> {
    try {
      const url = `${this.baseURL}/mood/entries`;
      const response = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(moodData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Mood API error:', error);
      throw new AppError(
        'Failed to create mood entry',
        ErrorType.NETWORK_ERROR,
        500
      );
    }
  }

  async getMoodEntries(startDate?: string, endDate?: string): Promise<any> {
    try {
      const queryParams = new URLSearchParams();
      if (startDate) queryParams.append('start_date', startDate);
      if (endDate) queryParams.append('end_date', endDate);

      const url = `${this.baseURL}/mood/entries${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Mood API error:', error);
      throw new AppError(
        'Failed to get mood entries',
        ErrorType.NETWORK_ERROR,
        500
      );
    }
  }

  async getMoodStats(): Promise<any> {
    try {
      const url = `${this.baseURL}/mood/stats`;
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Mood stats API error:', error);
      throw new AppError(
        'Failed to get mood stats',
        ErrorType.NETWORK_ERROR,
        500
      );
    }
  }

  // Notifications API
  async getNotifications(limit = 50, unreadOnly = false): Promise<any> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('limit', limit.toString());
      if (unreadOnly) queryParams.append('unread_only', 'true');

      const url = `${this.baseURL}/notifications?${queryParams.toString()}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Notifications API error:', error);
      throw new AppError(
        'Failed to get notifications',
        ErrorType.NETWORK_ERROR,
        500
      );
    }
  }

  async markNotificationRead(notificationId: string): Promise<void> {
    try {
      const url = `${this.baseURL}/notifications/${notificationId}/read`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Mark notification read API error:', error);
      throw new AppError(
        'Failed to mark notification as read',
        ErrorType.NETWORK_ERROR,
        500
      );
    }
  }

  async markAllNotificationsRead(): Promise<void> {
    try {
      const url = `${this.baseURL}/notifications/mark-all-read`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Mark all notifications read API error:', error);
      throw new AppError(
        'Failed to mark all notifications as read',
        ErrorType.NETWORK_ERROR,
        500
      );
    }
  }

  async getNotificationSettings(): Promise<any> {
    try {
      const url = `${this.baseURL}/notifications/settings`;
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Notification settings API error:', error);
      throw new AppError(
        'Failed to get notification settings',
        ErrorType.NETWORK_ERROR,
        500
      );
    }
  }

  async updateNotificationSettings(settings: any): Promise<any> {
    try {
      const url = `${this.baseURL}/notifications/settings`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Update notification settings API error:', error);
      throw new AppError(
        'Failed to update notification settings',
        ErrorType.NETWORK_ERROR,
        500
      );
    }
  }

  async getUnreadNotificationCount(): Promise<{ unread_count: number }> {
    try {
      const url = `${this.baseURL}/notifications/unread-count`;
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Unread count API error:', error);
      throw new AppError(
        'Failed to get unread count',
        ErrorType.NETWORK_ERROR,
        500
      );
    }
  }

  // Social Features API
  async getSupportGroups(limit = 20): Promise<any> {
    const response = await this.request(`/social/groups?limit=${limit}`);

    if (response.success && response.data) {
      return response.data;
    }

    throw new AppError(
      response.error?.message || 'Failed to get support groups',
      response.error?.code || ErrorType.UNKNOWN_ERROR,
      response.error?.status || 500
    );
  }

  async createSupportGroup(groupData: any): Promise<any> {
    const response = await this.request('/social/groups', {
      method: 'POST',
      body: groupData,
    });

    if (response.success && response.data) {
      return response.data;
    }

    throw new AppError(
      response.error?.message || 'Failed to create support group',
      response.error?.code || ErrorType.UNKNOWN_ERROR,
      response.error?.status || 500
    );
  }

  async joinSupportGroup(groupId: string): Promise<void> {
    const response = await this.request(`/social/groups/${groupId}/join`, {
      method: 'POST',
    });

    if (!response.success) {
      throw new AppError(
        response.error?.message || 'Failed to join support group',
        response.error?.code || ErrorType.UNKNOWN_ERROR,
        response.error?.status || 500
      );
    }
  }

  async getGroupMessages(groupId: string, limit = 50): Promise<any> {
    const response = await this.request(`/social/groups/${groupId}/messages?limit=${limit}`);

    if (response.success && response.data) {
      return response.data;
    }

    throw new AppError(
      response.error?.message || 'Failed to get group messages',
      response.error?.code || ErrorType.UNKNOWN_ERROR,
      response.error?.status || 500
    );
  }

  async sendGroupMessage(groupId: string, messageData: any): Promise<any> {
    const response = await this.request(`/social/groups/${groupId}/messages`, {
      method: 'POST',
      body: messageData,
    });

    if (response.success && response.data) {
      return response.data;
    }

    throw new AppError(
      response.error?.message || 'Failed to send group message',
      response.error?.code || ErrorType.UNKNOWN_ERROR,
      response.error?.status || 500
    );
  }

  // AI Context API
  async getAIContext(): Promise<any> {
    try {
      const url = `${this.baseURL}/ai-context`;
      const response = await fetch(url, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('AI Context API error:', error);
      throw new AppError(
        'Failed to get AI context',
        ErrorType.NETWORK_ERROR,
        500
      );
    }
  }

  async updateAIContext(contextData: any): Promise<any> {
    try {
      const url = `${this.baseURL}/ai-context`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(contextData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Update AI Context API error:', error);
      throw new AppError(
        'Failed to update AI context',
        ErrorType.NETWORK_ERROR,
        500
      );
    }
  }

  async analyzeMessage(message: string): Promise<any> {
    try {
      const url = `${this.baseURL}/ai-context/analyze-message`;
      const response = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Analyze message API error:', error);
      throw new AppError(
        'Failed to analyze message',
        ErrorType.NETWORK_ERROR,
        500
      );
    }
  }

  // Professional Authentication Helper Methods
  isProfessionalAuthenticated(): boolean {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('professional_token');
    }
    return false;
  }

  professionalSignOut(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('professional_token');
      localStorage.removeItem('professional_data');
    }
  }

  // Professional API Methods
  async professionalSignUp(professionalData: any): Promise<any> {
    try {
      const url = `${this.baseURL}/auth/professional/register`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(professionalData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new AppError(
          errorData.detail || 'Professional registration failed',
          ErrorType.AUTHENTICATION_ERROR,
          response.status
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error('Professional sign up error:', error);
      throw new AppError(
        'Professional registration failed',
        ErrorType.NETWORK_ERROR,
        500
      );
    }
  }

  async professionalSignIn(credentials: { email: string; password: string }): Promise<any> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const url = `${this.baseURL}/auth/professional/login`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new AppError(
          errorData.detail || 'Invalid email or password',
          ErrorType.AUTHENTICATION_ERROR,
          response.status
        );
      }

      const data = await response.json();

      // Store professional token separately
      if (typeof window !== 'undefined') {
        localStorage.setItem('professional_token', data.access_token);
        localStorage.setItem('professional_data', JSON.stringify(data.professional));
      }

      return data;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new AppError(
          'Sign in timeout - please try again',
          ErrorType.NETWORK_ERROR,
          408
        );
      }
      if (error instanceof AppError) {
        throw error;
      }
      console.error('Professional sign in error:', error);
      throw new AppError(
        'Professional sign in failed',
        ErrorType.NETWORK_ERROR,
        500
      );
    }
  }

  async getCurrentProfessional(): Promise<any> {
    try {
      const professionalToken = typeof window !== 'undefined'
        ? localStorage.getItem('professional_token')
        : null;

      if (!professionalToken) {
        throw new AppError(
          'No professional token found',
          ErrorType.AUTHENTICATION_ERROR,
          401
        );
      }

      const url = `${this.baseURL}/auth/professional/me`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${professionalToken}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Clear professional token on auth error
          if (typeof window !== 'undefined') {
            localStorage.removeItem('professional_token');
            localStorage.removeItem('professional_data');
          }
        }
        const errorData = await response.json().catch(() => ({}));
        throw new AppError(
          errorData.detail || 'Failed to get professional info',
          ErrorType.AUTHENTICATION_ERROR,
          response.status
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error('Get professional error:', error);
      throw new AppError(
        'Failed to get professional info',
        ErrorType.NETWORK_ERROR,
        500
      );
    }
  }

  async updateProfessionalAvailability(availability: 'online' | 'offline' | 'busy'): Promise<any> {
    try {
      const professionalToken = typeof window !== 'undefined'
        ? localStorage.getItem('professional_token')
        : null;

      if (!professionalToken) {
        throw new AppError(
          'No professional token found',
          ErrorType.AUTHENTICATION_ERROR,
          401
        );
      }

      const url = `${this.baseURL}/auth/professional/availability`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${professionalToken}`,
        },
        body: JSON.stringify({ availability }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new AppError(
          errorData.detail || 'Failed to update availability',
          ErrorType.SERVER_ERROR,
          response.status
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error('Update availability error:', error);
      throw new AppError(
        'Failed to update availability',
        ErrorType.NETWORK_ERROR,
        500
      );
    }
  }

  async getProfessionalStats(): Promise<any> {
    try {
      const professionalToken = typeof window !== 'undefined'
        ? localStorage.getItem('professional_token')
        : null;

      if (!professionalToken) {
        throw new AppError(
          'No professional token found',
          ErrorType.AUTHENTICATION_ERROR,
          401
        );
      }

      const url = `${this.baseURL}/professional/stats`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${professionalToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new AppError(
          errorData.detail || 'Failed to get professional stats',
          ErrorType.SERVER_ERROR,
          response.status
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error('Get professional stats error:', error);
      throw new AppError(
        'Failed to get professional stats',
        ErrorType.NETWORK_ERROR,
        500
      );
    }
  }

  async updateProfessionalProfile(profileData: any): Promise<any> {
    try {
      const professionalToken = typeof window !== 'undefined'
        ? localStorage.getItem('professional_token')
        : null;

      if (!professionalToken) {
        throw new AppError(
          'No professional token found',
          ErrorType.AUTHENTICATION_ERROR,
          401
        );
      }

      const url = `${this.baseURL}/professional/profile`;
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${professionalToken}`,
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new AppError(
          errorData.detail || 'Failed to update professional profile',
          ErrorType.SERVER_ERROR,
          response.status
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error('Update professional profile error:', error);
      throw new AppError(
        'Failed to update professional profile',
        ErrorType.NETWORK_ERROR,
        500
      );
    }
  }



  async getProfessionalPatients(): Promise<any> {
    try {
      const professionalToken = typeof window !== 'undefined'
        ? localStorage.getItem('professional_token')
        : null;

      if (!professionalToken) {
        throw new AppError(
          'No professional token found',
          ErrorType.AUTHENTICATION_ERROR,
          401
        );
      }

      const url = `${this.baseURL}/professional/patients`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${professionalToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new AppError(
          errorData.detail || 'Failed to get patients',
          ErrorType.SERVER_ERROR,
          response.status
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error('Get patients error:', error);
      throw new AppError(
        'Failed to get patients',
        ErrorType.NETWORK_ERROR,
        500
      );
    }
  }

  async getProfessionalSessions(date?: string): Promise<any> {
    try {
      const professionalToken = typeof window !== 'undefined'
        ? localStorage.getItem('professional_token')
        : null;

      if (!professionalToken) {
        throw new AppError(
          'No professional token found',
          ErrorType.AUTHENTICATION_ERROR,
          401
        );
      }

      const queryParams = date ? `?date=${date}` : '';
      const url = `${this.baseURL}/professional/sessions${queryParams}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${professionalToken}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new AppError(
          errorData.detail || 'Failed to get sessions',
          ErrorType.SERVER_ERROR,
          response.status
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      console.error('Get sessions error:', error);
      throw new AppError(
        'Failed to get sessions',
        ErrorType.NETWORK_ERROR,
        500
      );
    }
  }



  getProfessionalToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('professional_token');
    }
    return null;
  }

  // Utility methods
  isAuthenticated(): boolean {
    return !!this.token;
  }

  getToken(): string | null {
    return this.token;
  }
}

// Create and export singleton instance
export const apiClient = new ApiClient();
export default apiClient;