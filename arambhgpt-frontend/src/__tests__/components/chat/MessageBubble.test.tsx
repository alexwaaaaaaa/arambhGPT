// MessageBubble component tests

import React from 'react';
import { render, screen, fireEvent } from '@/__tests__/utils/test-utils';
import { MessageBubble } from '@/components/chat/MessageBubble';
import { createMockMessage } from '@/__tests__/utils/test-utils';

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(),
  },
});

describe('MessageBubble Component', () => {
  const mockUserMessage = createMockMessage({
    role: 'user',
    content: 'Hello, this is a user message',
  });

  const mockAssistantMessage = createMockMessage({
    id: 'assistant-msg',
    role: 'assistant',
    content: 'Hello, this is an assistant response',
  });

  it('renders user message correctly', () => {
    render(<MessageBubble message={mockUserMessage} />);
    
    expect(screen.getByText('Hello, this is a user message')).toBeInTheDocument();
    expect(screen.getByText('You')).toBeInTheDocument();
  });

  it('renders assistant message correctly', () => {
    render(<MessageBubble message={mockAssistantMessage} />);
    
    expect(screen.getByText('Hello, this is an assistant response')).toBeInTheDocument();
    expect(screen.getByText('ArambhGPT')).toBeInTheDocument();
  });

  it('applies correct styling for user messages', () => {
    render(<MessageBubble message={mockUserMessage} />);
    
    const messageContainer = screen.getByTestId('message-bubble');
    expect(messageContainer).toHaveClass('justify-end');
  });

  it('applies correct styling for assistant messages', () => {
    render(<MessageBubble message={mockAssistantMessage} />);
    
    const messageContainer = screen.getByTestId('message-bubble');
    expect(messageContainer).toHaveClass('justify-start');
  });

  it('shows timestamp', () => {
    render(<MessageBubble message={mockUserMessage} showTimestamp />);
    
    expect(screen.getByText(/12:00 AM/)).toBeInTheDocument();
  });

  it('copies message content to clipboard', async () => {
    const writeTextSpy = jest.spyOn(navigator.clipboard, 'writeText');
    render(<MessageBubble message={mockUserMessage} />);
    
    const copyButton = screen.getByLabelText(/copy message/i);
    fireEvent.click(copyButton);
    
    expect(writeTextSpy).toHaveBeenCalledWith('Hello, this is a user message');
  });

  it('handles copy error gracefully', async () => {
    const writeTextSpy = jest.spyOn(navigator.clipboard, 'writeText')
      .mockRejectedValue(new Error('Copy failed'));
    
    render(<MessageBubble message={mockUserMessage} />);
    
    const copyButton = screen.getByLabelText(/copy message/i);
    fireEvent.click(copyButton);
    
    expect(writeTextSpy).toHaveBeenCalled();
    // Should not throw error
  });

  it('renders markdown content correctly', () => {
    const messageWithMarkdown = createMockMessage({
      content: '**Bold text** and *italic text*',
      role: 'assistant',
    });
    
    render(<MessageBubble message={messageWithMarkdown} />);
    
    expect(screen.getByText('Bold text')).toHaveStyle('font-weight: bold');
    expect(screen.getByText('italic text')).toHaveStyle('font-style: italic');
  });

  it('handles long messages correctly', () => {
    const longMessage = createMockMessage({
      content: 'A'.repeat(1000),
      role: 'assistant',
    });
    
    render(<MessageBubble message={longMessage} />);
    
    expect(screen.getByText('A'.repeat(1000))).toBeInTheDocument();
  });

  it('shows loading state for pending messages', () => {
    const pendingMessage = createMockMessage({
      content: 'Pending message',
      role: 'user',
    });
    
    render(<MessageBubble message={pendingMessage} isLoading />);
    
    expect(screen.getByTestId('message-loading')).toBeInTheDocument();
  });

  it('shows error state for failed messages', () => {
    const errorMessage = createMockMessage({
      content: 'Failed message',
      role: 'user',
    });
    
    render(<MessageBubble message={errorMessage} error="Failed to send" />);
    
    expect(screen.getByText('Failed to send')).toBeInTheDocument();
    expect(screen.getByLabelText(/retry/i)).toBeInTheDocument();
  });

  it('calls onRetry when retry button is clicked', () => {
    const onRetry = jest.fn();
    const errorMessage = createMockMessage({
      content: 'Failed message',
      role: 'user',
    });
    
    render(<MessageBubble message={errorMessage} error="Failed to send" onRetry={onRetry} />);
    
    fireEvent.click(screen.getByLabelText(/retry/i));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});