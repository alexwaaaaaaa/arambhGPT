'use client';

import { useState, useEffect, useCallback } from 'react';
import { ConversationSummary, ConversationListResponse, ConversationParams } from '@/types';
import { apiClient } from '@/lib/api';

interface UseConversationsOptions {
  autoLoad?: boolean;
  initialParams?: ConversationParams;
}

interface UseConversationsReturn {
  conversations: ConversationSummary[];
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  totalCount: number;
  loadConversations: (params?: ConversationParams) => Promise<void>;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
  deleteConversation: (id: string) => Promise<void>;
  updateConversation: (id: string, updates: { title?: string; is_archived?: boolean }) => Promise<void>;
  clearError: () => void;
}

export function useConversations({
  autoLoad = true,
  initialParams = { page: 1, limit: 20 },
}: UseConversationsOptions = {}): UseConversationsReturn {
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [currentParams, setCurrentParams] = useState<ConversationParams>(initialParams);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const loadConversations = useCallback(async (params: ConversationParams = currentParams) => {
    try {
      setIsLoading(true);
      setError(null);

      // Temporarily disabled - history router not available in backend
      // const response: ConversationListResponse = await apiClient.getConversations(params);

      // Mock response for now
      const response: ConversationListResponse = {
        conversations: [],
        total_count: 0,
        has_more: false,
        page: params.page || 1,
        limit: params.limit || 20
      };

      if (params.page === 1) {
        // Replace conversations for first page
        setConversations(response.conversations);
      } else {
        // Append conversations for subsequent pages
        setConversations(prev => [...prev, ...response.conversations]);
      }

      setHasMore(response.has_more);
      setTotalCount(response.total_count);
      setCurrentParams(params);

    } catch (err) {
      console.error('Failed to load conversations:', err);
      setError('Failed to load conversations. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [currentParams]);

  const loadMore = useCallback(async () => {
    if (hasMore && !isLoading) {
      const nextParams = {
        ...currentParams,
        page: (currentParams.page || 1) + 1,
      };
      await loadConversations(nextParams);
    }
  }, [hasMore, isLoading, currentParams, loadConversations]);

  const refresh = useCallback(async () => {
    const refreshParams = { ...currentParams, page: 1 };
    await loadConversations(refreshParams);
  }, [currentParams, loadConversations]);

  const deleteConversation = useCallback(async (id: string) => {
    try {
      await apiClient.deleteConversation(id);

      // Remove from local state
      setConversations(prev => prev.filter(conv => conv.id !== id));
      setTotalCount(prev => prev - 1);

    } catch (err) {
      console.error('Failed to delete conversation:', err);
      setError('Failed to delete conversation. Please try again.');
      throw err;
    }
  }, []);

  const updateConversation = useCallback(async (
    id: string,
    updates: { title?: string; is_archived?: boolean }
  ) => {
    try {
      await apiClient.updateConversation(id, updates);

      // Update local state
      setConversations(prev =>
        prev.map(conv =>
          conv.id === id
            ? { ...conv, ...updates, updated_at: new Date().toISOString() }
            : conv
        )
      );

    } catch (err) {
      console.error('Failed to update conversation:', err);
      setError('Failed to update conversation. Please try again.');
      throw err;
    }
  }, []);

  // Auto-load conversations on mount
  useEffect(() => {
    if (autoLoad) {
      loadConversations();
    }
  }, [autoLoad]); // Only run on mount

  return {
    conversations,
    isLoading,
    error,
    hasMore,
    totalCount,
    loadConversations,
    loadMore,
    refresh,
    deleteConversation,
    updateConversation,
    clearError,
  };
}