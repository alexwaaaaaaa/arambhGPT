'use client';

import { useState, useEffect, useCallback } from 'react';
import { ConversationStats } from '@/types';
import { apiClient } from '@/lib/api';

interface UseStatsOptions {
  autoLoad?: boolean;
  onError?: (error: string) => void;
}

interface UseStatsReturn {
  stats: ConversationStats | null;
  isLoading: boolean;
  error: string | null;
  loadStats: () => Promise<void>;
  refresh: () => Promise<void>;
  clearError: () => void;
}

export function useStats({ 
  autoLoad = true, 
  onError 
}: UseStatsOptions = {}): UseStatsReturn {
  const [stats, setStats] = useState<ConversationStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const loadStats = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const statsData = await apiClient.getConversationStats();
      setStats(statsData);
      
    } catch (err) {
      console.error('Failed to load stats:', err);
      const errorMessage = 'Failed to load statistics. Please try again.';
      setError(errorMessage);
      if (onError) onError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [onError]);

  const refresh = useCallback(async () => {
    await loadStats();
  }, [loadStats]);

  // Auto-load stats on mount
  useEffect(() => {
    if (autoLoad) {
      loadStats();
    }
  }, [autoLoad, loadStats]);

  return {
    stats,
    isLoading,
    error,
    loadStats,
    refresh,
    clearError,
  };
}