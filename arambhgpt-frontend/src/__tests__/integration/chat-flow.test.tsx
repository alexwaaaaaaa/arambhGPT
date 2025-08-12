// Integration tests for chat flow

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@/__tests__/utils/test-utils';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { mockFetch, createMockMessage, createMockConversation } from '@/__tests__/utils/test-utils';

describe('Chat Flow Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('sends a message and receives a response', async () => {
    const mockConversation = createMockConversation();
    const mockUserMessage = createMockMessage({
      content: 'Hello, how are you?',
      role: 'user',
    });
    const mockAssistantMessage = createMockMessage({
      id: 'assistant-response',
      content: 'I am doing well, thank you for asking!',
      role: 'assistant',
    });

    mockFetch([
      {
        url: '/api/chat',
        response: {
          message: mockAssistantMessage,
          conversation: mockConversation,
        },
      },
    ]);

    render(<ChatInterface />);
    
    // Type a message
    const input = screen.getByPlaceholderText(/type your message/i);
    fireEvent.change(input, { target: { value: 'Hello, how are you?' } });
    
    // Send the message
    const sendButton = screen.getByLabelText(/send message/i);
    fireEvent.click(sendButton);
    
    // Check that user message appears immediately (optimistic update)
    expect(screen.getByText('Hello, how are you?')).toBeInTheDocument();
    
    // Wait for assistant response
    await waitFor(() => {
      expect(screen.getByText('I am doing well, thank you for asking!')).toBeInTheDocument();
    });
    
    // Check that input is cleared
    expect(input).toHaveValue('');
  });

  it('handles message sending error', async () => {
    mockFetch([
      {
        url: '/api/chat',
        response: { error: 'Failed to send message' },
        status: 500,
      },
    ]);

    render(<ChatInterface />);
    
    const input = screen.getByPlaceholderText(/type your message/i);
    fireEvent.change(input, { target: { value: 'Test message' } });
    
    const sendButton = screen.getByLabelText(/send message/i);
    fireEvent.click(sendButton);
    
    // Wait for error to appear
    await waitFor(() => {
      expect(screen.getByText(/failed to send/i)).toBeInTheDocument();
    });
    
    // Check that retry button is available
    expect(screen.getByLabelText(/retry/i)).toBeInTheDocument();
  });

  it('retries failed message', async () => {
    const mockMessage = createMockMessage({
      content: 'Retry test message',
      role: 'assistant',
    });

    // First call fails, second succeeds
    mockFetch([
      {
        url: '/api/chat',
        response: { error: 'Network error' },
        status: 500,
      },
      {
        url: '/api/chat',
        response: {
          message: mockMessage,
          conversation: createMockConversation(),
        },
      },
    ]);

    render(<ChatInterface />);
    
    const input = screen.getByPlaceholderText(/type your message/i);
    fireEvent.change(input, { target: { value: 'Retry test message' } });
    
    const sendButton = screen.getByLabelText(/send message/i);
    fireEvent.click(sendButton);
    
    // Wait for error
    await waitFor(() => {
      expect(screen.getByText(/failed to send/i)).toBeInTheDocument();
    });
    
    // Click retry
    const retryButton = screen.getByLabelText(/retry/i);
    fireEvent.click(retryButton);
    
    // Wait for success
    await waitFor(() => {
      expect(screen.getByText('Retry test message')).toBeInTheDocument();
    });
  });

  it('handles keyboard shortcuts', () => {
    render(<ChatInterface />);
    
    const input = screen.getByPlaceholderText(/type your message/i);
    fireEvent.change(input, { target: { value: 'Keyboard test' } });
    
    // Test Enter key to send
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    
    expect(screen.getByText('Keyboard test')).toBeInTheDocument();
    expect(input).toHaveValue('');
  });

  it('handles Shift+Enter for new line', () => {
    render(<ChatInterface />);
    
    const input = screen.getByPlaceholderText(/type your message/i);
    fireEvent.change(input, { target: { value: 'Line 1' } });
    
    // Test Shift+Enter for new line
    fireEvent.keyDown(input, { 
      key: 'Enter', 
      code: 'Enter', 
      shiftKey: true 
    });
    
    // Message should not be sent
    expect(screen.queryByText('Line 1')).not.toBeInTheDocument();
    
    // Input should still have value
    expect(input).toHaveValue('Line 1');
  });

  it('auto-scrolls to bottom when new messages arrive', async () => {
    const scrollIntoViewMock = jest.fn();
    Element.prototype.scrollIntoView = scrollIntoViewMock;

    const mockMessage = createMockMessage({
      content: 'Auto scroll test',
      role: 'assistant',
    });

    mockFetch([
      {
        url: '/api/chat',
        response: {
          message: mockMessage,
          conversation: createMockConversation(),
        },
      },
    ]);

    render(<ChatInterface />);
    
    const input = screen.getByPlaceholderText(/type your message/i);
    fireEvent.change(input, { target: { value: 'Test message' } });
    
    const sendButton = screen.getByLabelText(/send message/i);
    fireEvent.click(sendButton);
    
    await waitFor(() => {
      expect(screen.getByText('Auto scroll test')).toBeInTheDocument();
    });
    
    // Should have called scrollIntoView
    expect(scrollIntoViewMock).toHaveBeenCalled();
  });

  it('shows typing indicator while waiting for response', async () => {
    mockFetch([
      {
        url: '/api/chat',
        response: {
          message: createMockMessage({ role: 'assistant' }),
          conversation: createMockConversation(),
        },
      },
    ]);

    render(<ChatInterface />);
    
    const input = screen.getByPlaceholderText(/type your message/i);
    fireEvent.change(input, { target: { value: 'Test message' } });
    
    const sendButton = screen.getByLabelText(/send message/i);
    fireEvent.click(sendButton);
    
    // Should show typing indicator
    expect(screen.getByTestId('typing-indicator')).toBeInTheDocument();
    
    // Wait for response
    await waitFor(() => {
      expect(screen.queryByTestId('typing-indicator')).not.toBeInTheDocument();
    });
  });
});