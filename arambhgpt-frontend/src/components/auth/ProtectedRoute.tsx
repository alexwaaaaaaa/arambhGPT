'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/ui';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  requireAuth?: boolean;
  fallback?: React.ReactNode;
}

export function ProtectedRoute({
  children,
  redirectTo = '/signin',
  requireAuth = true,
  fallback,
}: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (requireAuth && !isAuthenticated) {
        // Redirect to sign in if authentication is required but user is not authenticated
        router.push(redirectTo);
      } else if (!requireAuth && isAuthenticated) {
        // Redirect authenticated users away from auth pages
        router.push('/chat');
      }
    }
  }, [isAuthenticated, isLoading, requireAuth, redirectTo, router]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      )
    );
  }

  // Don't render children if authentication requirements are not met
  if (requireAuth && !isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  if (!requireAuth && isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
}