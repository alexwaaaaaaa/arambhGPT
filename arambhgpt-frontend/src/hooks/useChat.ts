'use client';

import { useState, useCallback } from 'react';
import { Message, ChatResponse, Conversation } from '@/types';
import { apiClient } from '@/lib/api';

interface UseChatOptions {
  conversationId?: string;
  onNewConversation?: (conversation: Conversation) => void;
  onError?: (error: string) => void;
}

interface UseChatReturn {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<void>;
  loadConversation: (id: string) => Promise<void>;
  clearMessages: () => void;
  clearError: () => void;
  retryLastMessage: () => Promise<void>;
}

export function useChat({
  conversationId,
  onNewConversation,
  onError,
}: UseChatOptions = {}): UseChatReturn {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUserMessage, setLastUserMessage] = useState<string>('');

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  const loadConversation = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const conversation = await apiClient.getConversation(id);
      setMessages(conversation.messages);
    } catch (err) {
      const errorMessage = 'Failed to load conversation. Please try again.';
      setError(errorMessage);
      if (onError) onError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [onError]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: content.trim(),
      sender: 'user',
      created_at: new Date().toISOString(),
    };

    // Add user message immediately
    setMessages(prev => [...prev, userMessage]);
    setLastUserMessage(content.trim());
    setIsLoading(true);
    setError(null);

    try {
      // Send message to AI
      const response: ChatResponse = await apiClient.sendMessage(content.trim());

      // Create AI response message
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        content: response.response,
        sender: 'ai',
        ai_provider: response.ai_provider,
        created_at: new Date().toISOString(),
      };

      // Add AI response
      setMessages(prev => [...prev, aiMessage]);

      // Handle conversation creation/saving
      if (!conversationId && onNewConversation) {
        try {
          // Create new conversation
          const conversation = await apiClient.createConversation();
          
          // Save both messages
          await Promise.all([
            apiClient.addMessageToConversation(conversation.id, {
              content: userMessage.content,
              sender: 'user',
            }),
            apiClient.addMessageToConversation(conversation.id, {
              content: aiMessage.content,
              sender: 'ai',
              ai_provider: response.ai_provider,
            }),
          ]);

          onNewConversation(conversation);
        } catch (saveError) {
          console.error('Failed to save new conversation:', saveError);
          // Continue with chat even if saving fails
        }
      } else if (conversationId) {
        try {
          // Save messages to existing conversation
          await Promise.all([
            apiClient.addMessageToConversation(conversationId, {
              content: userMessage.content,
              sender: 'user',
            }),
            apiClient.addMessageToConversation(conversationId, {
              content: aiMessage.content,
              sender: 'ai',
              ai_provider: response.ai_provider,
            }),
          ]);
        } catch (saveError) {
          console.error('Failed to save messages to conversation:', saveError);
          // Continue with chat even if saving fails
        }
      }

    } catch (err) {
      console.error('Failed to send message:', err);
      const errorMessage = 'Failed to send message. Please try again.';
      setError(errorMessage);
      if (onError) onError(errorMessage);
      
      // Remove the user message if sending failed
      setMessages(prev => prev.filter(msg => msg.id !== userMessage.id));
    } finally {
      setIsLoading(false);
    }
  }, [conversationId, isLoading, onNewConversation, onError]);

  const retryLastMessage = useCallback(async () => {
    if (lastUserMessage && !isLoading) {
      await sendMessage(lastUserMessage);
    }
  }, [lastUserMessage, isLoading, sendMessage]);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    loadConversation,
    clearMessages,
    clearError,
    retryLastMessage,
  };
}