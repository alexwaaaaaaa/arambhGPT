// Authentication utility functions

import { apiClient } from './api';
import { User } from '@/types';

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return apiClient.isAuthenticated();
}

/**
 * Get current auth token
 */
export function getAuthToken(): string | null {
  return apiClient.getToken();
}

/**
 * Sign out user and clear all auth data
 */
export function signOut(): void {
  apiClient.signOut();
  
  // Clear any additional auth-related data from localStorage
  if (typeof window !== 'undefined') {
    localStorage.removeItem('user_preferences');
    localStorage.removeItem('chat_history_cache');
  }
}

/**
 * Check if token is expired (basic check)
 */
export function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch (error) {
    return true; // If we can't parse the token, consider it expired
  }
}

/**
 * Get user info from token (without API call)
 */
export function getUserFromToken(token: string): Partial<User> | null {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      email: payload.sub,
      // Add other fields if available in token
    };
  } catch (error) {
    return null;
  }
}

/**
 * Redirect to sign in page
 */
export function redirectToSignIn(): void {
  if (typeof window !== 'undefined') {
    window.location.href = '/signin';
  }
}

/**
 * Redirect to home page
 */
export function redirectToHome(): void {
  if (typeof window !== 'undefined') {
    window.location.href = '/';
  }
}

/**
 * Redirect to chat page
 */
export function redirectToChat(): void {
  if (typeof window !== 'undefined') {
    window.location.href = '/chat';
  }
}