'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { isSafeRedirectUrl } from '@/lib/redirects';

interface UseAuthRedirectOptions {
  requireAuth?: boolean;
  redirectTo?: string;
  onAuthSuccess?: (returnUrl?: string) => void;
  onAuthFailure?: () => void;
}

export function useAuthRedirect({
  requireAuth = true,
  redirectTo,
  onAuthSuccess,
  onAuthFailure,
}: UseAuthRedirectOptions = {}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    const returnUrl = searchParams.get('returnUrl');
    const safeReturnUrl = returnUrl && isSafeRedirectUrl(returnUrl) ? returnUrl : null;

    if (requireAuth && !isAuthenticated) {
      // User needs to be authenticated but isn't
      if (onAuthFailure) {
        onAuthFailure();
      } else if (redirectTo) {
        router.push(redirectTo);
      } else {
        const signInUrl = safeReturnUrl 
          ? `/signin?returnUrl=${encodeURIComponent(safeReturnUrl)}`
          : '/signin';
        router.push(signInUrl);
      }
    } else if (!requireAuth && isAuthenticated) {
      // User is authenticated but shouldn't be (e.g., on auth pages)
      if (onAuthSuccess) {
        onAuthSuccess(safeReturnUrl || undefined);
      } else {
        const targetUrl = safeReturnUrl || redirectTo || '/chat';
        router.push(targetUrl);
      }
    } else if (requireAuth && isAuthenticated && safeReturnUrl) {
      // User is authenticated and there's a return URL
      if (onAuthSuccess) {
        onAuthSuccess(safeReturnUrl);
      } else {
        router.push(safeReturnUrl);
      }
    }
  }, [
    isAuthenticated,
    isLoading,
    requireAuth,
    redirectTo,
    onAuthSuccess,
    onAuthFailure,
    router,
    searchParams,
  ]);

  return {
    isAuthenticated,
    isLoading,
    returnUrl: searchParams.get('returnUrl'),
  };
}