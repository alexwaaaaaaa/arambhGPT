// useAuth hook tests

import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { mockApiResponse, mockApiError, createMockUser } from '@/__tests__/utils/test-utils';

// Mock the API client
jest.mock('@/lib/api', () => ({
  apiClient: {
    signUp: jest.fn(),
    signIn: jest.fn(),
    signOut: jest.fn(),
    getCurrentUser: jest.fn(),
    isAuthenticated: jest.fn(),
    getToken: jest.fn(),
  },
}));

import { apiClient } from '@/lib/api';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('useAuth Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (apiClient.isAuthenticated as jest.Mock).mockReturnValue(false);
    (apiClient.getToken as jest.Mock).mockReturnValue(null);
  });

  it('initializes with unauthenticated state', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    expect(result.current.isLoading).toBe(true);
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBe(null);
    expect(result.current.token).toBe(null);
  });

  it('loads authenticated user on mount', async () => {
    const mockUser = createMockUser();
    (apiClient.isAuthenticated as jest.Mock).mockReturnValue(true);
    (apiClient.getCurrentUser as jest.Mock).mockResolvedValue(mockUser);
    (apiClient.getToken as jest.Mock).mockReturnValue('mock-token');

    const { result, waitForNextUpdate } = renderHook(() => useAuth(), { wrapper });
    
    await waitForNextUpdate();
    
    expect(result.current.isLoading).toBe(false);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.token).toBe('mock-token');
  });

  it('handles sign up successfully', async () => {
    const mockUser = createMockUser();
    const signUpData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    };
    
    const mockAuthResponse = {
      access_token: 'new-token',
      token_type: 'Bearer',
      user: {
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
      },
    };

    (apiClient.signUp as jest.Mock).mockResolvedValue(mockAuthResponse);

    const { result } = renderHook(() => useAuth(), { wrapper });
    
    await act(async () => {
      await result.current.signUp(signUpData);
    });
    
    expect(apiClient.signUp).toHaveBeenCalledWith(signUpData);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.token).toBe('new-token');
  });

  it('handles sign up error', async () => {
    const signUpData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    };

    (apiClient.signUp as jest.Mock).mockRejectedValue(new Error('Sign up failed'));

    const { result } = renderHook(() => useAuth(), { wrapper });
    
    await expect(
      act(async () => {
        await result.current.signUp(signUpData);
      })
    ).rejects.toThrow('Sign up failed');
    
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('handles sign in successfully', async () => {
    const mockUser = createMockUser();
    const signInData = {
      email: 'test@example.com',
      password: 'password123',
    };
    
    const mockAuthResponse = {
      access_token: 'signin-token',
      token_type: 'Bearer',
      user: {
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
      },
    };

    (apiClient.signIn as jest.Mock).mockResolvedValue(mockAuthResponse);

    const { result } = renderHook(() => useAuth(), { wrapper });
    
    await act(async () => {
      await result.current.signIn(signInData);
    });
    
    expect(apiClient.signIn).toHaveBeenCalledWith(signInData);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.token).toBe('signin-token');
  });

  it('handles sign out', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    
    act(() => {
      result.current.signOut();
    });
    
    expect(apiClient.signOut).toHaveBeenCalled();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBe(null);
    expect(result.current.token).toBe(null);
  });

  it('refreshes user data', async () => {
    const mockUser = createMockUser({ name: 'Updated User' });
    (apiClient.isAuthenticated as jest.Mock).mockReturnValue(true);
    (apiClient.getCurrentUser as jest.Mock).mockResolvedValue(mockUser);

    const { result } = renderHook(() => useAuth(), { wrapper });
    
    await act(async () => {
      await result.current.refreshUser();
    });
    
    expect(apiClient.getCurrentUser).toHaveBeenCalled();
    expect(result.current.user).toEqual(mockUser);
  });

  it('handles refresh user error by signing out', async () => {
    (apiClient.isAuthenticated as jest.Mock).mockReturnValue(true);
    (apiClient.getCurrentUser as jest.Mock).mockRejectedValue(new Error('Unauthorized'));

    const { result } = renderHook(() => useAuth(), { wrapper });
    
    await expect(
      act(async () => {
        await result.current.refreshUser();
      })
    ).rejects.toThrow('Unauthorized');
    
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('clears invalid token on initialization error', async () => {
    (apiClient.isAuthenticated as jest.Mock).mockReturnValue(true);
    (apiClient.getCurrentUser as jest.Mock).mockRejectedValue(new Error('Invalid token'));

    const { result, waitForNextUpdate } = renderHook(() => useAuth(), { wrapper });
    
    await waitForNextUpdate();
    
    expect(apiClient.signOut).toHaveBeenCalled();
    expect(result.current.isAuthenticated).toBe(false);
  });
});