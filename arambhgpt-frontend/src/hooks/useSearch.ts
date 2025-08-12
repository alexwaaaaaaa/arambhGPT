'use client';

import { useState, useCallback } from 'react';
import { SearchRequest, SearchResponse, SearchResult } from '@/types';
import { apiClient } from '@/lib/api';

interface UseSearchOptions {
  onError?: (error: string) => void;
}

interface UseSearchReturn {
  results: SearchResult[];
  isLoading: boolean;
  error: string | null;
  totalCount: number;
  hasMore: boolean;
  search: (query: string, filters?: Partial<SearchRequest>) => Promise<void>;
  loadMore: () => Promise<void>;
  clearResults: () => void;
  clearError: () => void;
}

export function useSearch({ onError }: UseSearchOptions = {}): UseSearchReturn {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [currentRequest, setCurrentRequest] = useState<SearchRequest | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
    setTotalCount(0);
    setHasMore(false);
    setCurrentRequest(null);
    setError(null);
  }, []);

  const search = useCallback(async (
    query: string, 
    filters: Partial<SearchRequest> = {}
  ) => {
    if (!query.trim()) {
      clearResults();
      return;
    }

    const searchRequest: SearchRequest = {
      query: query.trim(),
      page: 1,
      limit: 20,
      ...filters,
    };

    try {
      setIsLoading(true);
      setError(null);
      
      const response: SearchResponse = await apiClient.searchConversations(searchRequest);
      
      setResults(response.results);
      setTotalCount(response.total_count);
      setHasMore(response.has_more);
      setCurrentRequest(searchRequest);
      
    } catch (err) {
      console.error('Search failed:', err);
      const errorMessage = 'Search failed. Please try again.';
      setError(errorMessage);
      if (onError) onError(errorMessage);
      
      // Clear results on error
      setResults([]);
      setTotalCount(0);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  }, [onError]);

  const loadMore = useCallback(async () => {
    if (!currentRequest || !hasMore || isLoading) return;

    const nextRequest: SearchRequest = {
      ...currentRequest,
      page: (currentRequest.page || 1) + 1,
    };

    try {
      setIsLoading(true);
      setError(null);
      
      const response: SearchResponse = await apiClient.searchConversations(nextRequest);
      
      setResults(prev => [...prev, ...response.results]);
      setHasMore(response.has_more);
      setCurrentRequest(nextRequest);
      
    } catch (err) {
      console.error('Load more search results failed:', err);
      const errorMessage = 'Failed to load more results. Please try again.';
      setError(errorMessage);
      if (onError) onError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [currentRequest, hasMore, isLoading, onError]);

  return {
    results,
    isLoading,
    error,
    totalCount,
    hasMore,
    search,
    loadMore,
    clearResults,
    clearError,
  };
}