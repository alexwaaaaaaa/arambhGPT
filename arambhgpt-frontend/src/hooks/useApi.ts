'use client';

import { useState, useCallback } from 'react';
import { AppError } from '@/types';

interface UseApiState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

interface UseApiReturn<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  execute: (...args: any[]) => Promise<T>;
  reset: () => void;
  clearError: () => void;
}

export function useApi<T>(
  apiFunction: (...args: any[]) => Promise<T>
): UseApiReturn<T> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    isLoading: false,
    error: null,
  });

  const execute = useCallback(
    async (...args: any[]): Promise<T> => {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        const result = await apiFunction(...args);
        setState(prev => ({ ...prev, data: result, isLoading: false }));
        return result;
      } catch (error) {
        const errorMessage = error instanceof AppError 
          ? error.message 
          : error instanceof Error 
          ? error.message 
          : 'An unexpected error occurred';
        
        setState(prev => ({ 
          ...prev, 
          error: errorMessage, 
          isLoading: false 
        }));
        throw error;
      }
    },
    [apiFunction]
  );

  const reset = useCallback(() => {
    setState({
      data: null,
      isLoading: false,
      error: null,
    });
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    data: state.data,
    isLoading: state.isLoading,
    error: state.error,
    execute,
    reset,
    clearError,
  };
}