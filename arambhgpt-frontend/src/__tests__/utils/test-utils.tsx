// Testing utilities and custom render functions

import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { AuthProvider } from '@/contexts/AuthContext';
import { ErrorBoundary } from '@/components/ui';

// Mock auth context for testing
const MockAuthProvider = ({ children }: { children: React.ReactNode }) => {
  const mockAuthValue = {
    user: {
      id: 'test-user-id',
      name: 'Test User',
      email: 'test@example.com',
      created_at: '2024-01-01T00:00:00Z',
    },
    token: 'mock-token',
    isLoading: false,
    isAuthenticated: true,
    signUp: jest.fn(),
    signIn: jest.fn(),
    signOut: jest.fn(),
    refreshUser: jest.fn(),
  };

  return (
    <div data-testid="mock-auth-provider">
      {children}
    </div>
  );
};

// Custom render function with providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <ErrorBoundary>
      <MockAuthProvider>
        {children}
      </MockAuthProvider>
    </ErrorBoundary>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };

// Test data factories
export const createMockUser = (overrides = {}) => ({
  id: 'test-user-id',
  name: 'Test User',
  email: 'test@example.com',
  created_at: '2024-01-01T00:00:00Z',
  ...overrides,
});

export const createMockMessage = (overrides = {}) => ({
  id: 'test-message-id',
  content: 'Test message content',
  role: 'user' as const,
  created_at: '2024-01-01T00:00:00Z',
  ...overrides,
});

export const createMockConversation = (overrides = {}) => ({
  id: 'test-conversation-id',
  title: 'Test Conversation',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  message_count: 5,
  last_message_preview: 'Last message preview',
  is_archived: false,
  ...overrides,
});

export const createMockStats = (overrides = {}) => ({
  total_conversations: 10,
  total_messages: 50,
  active_days: 7,
  average_messages_per_conversation: 5.0,
  most_active_day: '2024-01-01',
  conversation_frequency: {
    '2024-01-01': 3,
    '2024-01-02': 2,
    '2024-01-03': 5,
  },
  ...overrides,
});

// Mock API responses
export const mockApiResponse = <T>(data: T, delay = 0) => {
  return new Promise<T>((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
};

export const mockApiError = (message = 'API Error', delay = 0) => {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error(message)), delay);
  });
};

// Custom matchers
expect.extend({
  toBeInTheDocument(received) {
    const pass = received !== null && document.body.contains(received);
    return {
      message: () =>
        pass
          ? `Expected element not to be in the document`
          : `Expected element to be in the document`,
      pass,
    };
  },
});

// Utility functions for testing
export const waitForLoadingToFinish = () => {
  return new Promise((resolve) => {
    setTimeout(resolve, 0);
  });
};

export const mockIntersectionObserver = () => {
  const mockIntersectionObserver = jest.fn();
  mockIntersectionObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null,
  });
  window.IntersectionObserver = mockIntersectionObserver;
  return mockIntersectionObserver;
};

export const mockResizeObserver = () => {
  const mockResizeObserver = jest.fn();
  mockResizeObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null,
  });
  window.ResizeObserver = mockResizeObserver;
  return mockResizeObserver;
};

// Mock fetch with custom responses
export const mockFetch = (responses: Array<{ url: string; response: any; status?: number }>) => {
  const mockFetch = jest.fn();
  
  responses.forEach(({ url, response, status = 200 }) => {
    mockFetch.mockImplementationOnce((requestUrl: string) => {
      if (requestUrl.includes(url)) {
        return Promise.resolve({
          ok: status >= 200 && status < 300,
          status,
          json: () => Promise.resolve(response),
          text: () => Promise.resolve(JSON.stringify(response)),
        });
      }
      return Promise.reject(new Error(`Unexpected request to ${requestUrl}`));
    });
  });
  
  global.fetch = mockFetch;
  return mockFetch;
};