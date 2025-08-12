// Redirect utilities for authentication and navigation

/**
 * Redirect to sign in page
 */
export function redirectToSignIn(returnUrl?: string): void {
  if (typeof window !== 'undefined') {
    const url = returnUrl ? `/signin?returnUrl=${encodeURIComponent(returnUrl)}` : '/signin';
    window.location.href = url;
  }
}

/**
 * Redirect to sign up page
 */
export function redirectToSignUp(returnUrl?: string): void {
  if (typeof window !== 'undefined') {
    const url = returnUrl ? `/signup?returnUrl=${encodeURIComponent(returnUrl)}` : '/signup';
    window.location.href = url;
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

/**
 * Redirect to profile page
 */
export function redirectToProfile(): void {
  if (typeof window !== 'undefined') {
    window.location.href = '/profile';
  }
}

/**
 * Get return URL from query parameters
 */
export function getReturnUrl(): string | null {
  if (typeof window !== 'undefined') {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('returnUrl');
  }
  return null;
}

/**
 * Redirect to return URL or default URL
 */
export function redirectToReturnUrl(defaultUrl: string = '/chat'): void {
  const returnUrl = getReturnUrl();
  const targetUrl = returnUrl || defaultUrl;
  
  if (typeof window !== 'undefined') {
    window.location.href = targetUrl;
  }
}

/**
 * Check if URL is safe for redirect (prevent open redirect attacks)
 */
export function isSafeRedirectUrl(url: string): boolean {
  try {
    // Allow relative URLs
    if (url.startsWith('/')) {
      return true;
    }
    
    // Allow same-origin URLs
    const urlObj = new URL(url);
    const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
    
    return urlObj.origin === currentOrigin;
  } catch {
    return false;
  }
}

/**
 * Safe redirect that prevents open redirect attacks
 */
export function safeRedirect(url: string, fallbackUrl: string = '/'): void {
  const targetUrl = isSafeRedirectUrl(url) ? url : fallbackUrl;
  
  if (typeof window !== 'undefined') {
    window.location.href = targetUrl;
  }
}