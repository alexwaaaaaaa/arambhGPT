'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import {
  AuthState,
  AuthContextType,
  User,
  SignUpData,
  SignInData,
  AuthenticationError,
  AppError
} from '@/types';
import { apiClient } from '@/lib/api';

// Auth actions
type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_TOKEN'; payload: string | null }
  | { type: 'SIGN_OUT' }
  | { type: 'SET_ERROR'; payload: string | null };

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false, // Start with false to avoid loading spinner
  isAuthenticated: false,
};

// Auth reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    case 'SET_USER':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false,
      };

    case 'SET_TOKEN':
      return {
        ...state,
        token: action.payload,
      };

    case 'SIGN_OUT':
      return {
        ...initialState,
        isLoading: false,
      };

    case 'SET_ERROR':
      return {
        ...state,
        isLoading: false,
      };

    default:
      return state;
  }
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth provider props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth provider component
export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state on mount
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      // Check if user is already authenticated
      if (apiClient.isAuthenticated()) {
        // Try to get cached user data first
        const cachedUser = localStorage.getItem('user_data');
        if (cachedUser) {
          try {
            const user = JSON.parse(cachedUser);
            dispatch({ type: 'SET_USER', payload: user });
            dispatch({ type: 'SET_TOKEN', payload: apiClient.getToken() });
            return; // Skip API call if we have cached data
          } catch (e) {
            // Invalid cached data, continue with API call
          }
        }

        // Only show loading if we need to make API call
        dispatch({ type: 'SET_LOADING', payload: true });

        // Add timeout to prevent infinite loading
        const authTimeout = setTimeout(() => {
          console.warn('Auth initialization timeout, clearing state');
          localStorage.removeItem('user_data');
          apiClient.signOut();
          dispatch({ type: 'SIGN_OUT' });
        }, 5000); // Reduced to 5 seconds

        // Only make API call if no cached data
        try {
          const user = await apiClient.getCurrentUser();
          clearTimeout(authTimeout);
          localStorage.setItem('user_data', JSON.stringify(user));
          dispatch({ type: 'SET_USER', payload: user });
          dispatch({ type: 'SET_TOKEN', payload: apiClient.getToken() });
        } catch (error) {
          // API failed, clear everything
          clearTimeout(authTimeout);
          localStorage.removeItem('user_data');
          apiClient.signOut();
          dispatch({ type: 'SIGN_OUT' });
        }
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } catch (error) {
      console.error('Auth initialization failed:', error);
      // Clear invalid token and cached data
      localStorage.removeItem('user_data');
      apiClient.signOut();
      dispatch({ type: 'SIGN_OUT' });
    }
  };

  const signUp = async (userData: SignUpData): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      const response = await apiClient.signUp(userData);

      localStorage.setItem('user_data', JSON.stringify(response.user));
      dispatch({ type: 'SET_TOKEN', payload: response.access_token });
      dispatch({ type: 'SET_USER', payload: response.user });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: null });
      throw error;
    }
  };

  const signIn = async (credentials: SignInData): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      const response = await apiClient.signIn(credentials);

      localStorage.setItem('user_data', JSON.stringify(response.user));
      dispatch({ type: 'SET_TOKEN', payload: response.access_token });
      dispatch({ type: 'SET_USER', payload: response.user });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: null });
      throw error;
    }
  };

  const signOut = (): void => {
    localStorage.removeItem('user_data');
    apiClient.signOut();
    dispatch({ type: 'SIGN_OUT' });
  };

  const refreshUser = async (): Promise<void> => {
    try {
      if (!apiClient.isAuthenticated()) {
        throw new AuthenticationError('Not authenticated');
      }

      const user = await apiClient.getCurrentUser();
      dispatch({ type: 'SET_USER', payload: user });
    } catch (error) {
      console.error('Failed to refresh user:', error);
      // If refresh fails, sign out user
      signOut();
      throw error;
    }
  };

  const contextValue: AuthContextType = {
    ...state,
    signUp,
    signIn,
    signOut,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook to use auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}

// Hook for protected routes
export function useRequireAuth(): AuthContextType {
  const auth = useAuth();

  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated) {
      // Redirect to sign in page
      window.location.href = '/signin';
    }
  }, [auth.isLoading, auth.isAuthenticated]);

  return auth;
}

// Hook to check if user is authenticated (without redirect)
export function useIsAuthenticated(): boolean {
  const { isAuthenticated, isLoading } = useAuth();
  return isAuthenticated && !isLoading;
}