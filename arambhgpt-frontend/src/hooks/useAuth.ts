'use client';

import { useState } from 'react';
import { useAuth as useAuthContext } from '@/contexts/AuthContext';
import { SignUpData, SignInData, AppError } from '@/types';

interface UseAuthReturn {
  signUp: (userData: SignUpData) => Promise<void>;
  signIn: (credentials: SignInData) => Promise<void>;
  signOut: () => void;
  refreshUser: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
  clearError: () => void;
  user: any;
  isAuthenticated: boolean;
  token: string | null;
}

export function useAuth(): UseAuthReturn {
  const auth = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const signUp = async (userData: SignUpData): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      await auth.signUp(userData);
    } catch (err) {
      const errorMessage = err instanceof AppError ? err.message : 'Sign up failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (credentials: SignInData): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      await auth.signIn(credentials);
    } catch (err) {
      const errorMessage = err instanceof AppError ? err.message : 'Sign in failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = (): void => {
    setError(null);
    auth.signOut();
  };

  return {
    signUp,
    signIn,
    signOut,
    refreshUser: auth.refreshUser,
    isLoading: isLoading || auth.isLoading,
    error,
    clearError,
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,
    token: auth.token,
  };
}