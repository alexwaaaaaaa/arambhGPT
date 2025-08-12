'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { LoadingSpinner } from '@/components/ui';

interface GuestGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
  loadingFallback?: React.ReactNode;
}

export function GuestGuard({
  children,
  redirectTo = '/chat',
  loadingFallback,
}: GuestGuardProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, isLoading, redirectTo, router]);

  // Show loading state
  if (isLoading) {
    return (
      loadingFallback || (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      )
    );
  }

  // Don't render if user is authenticated (will redirect)
  if (isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}