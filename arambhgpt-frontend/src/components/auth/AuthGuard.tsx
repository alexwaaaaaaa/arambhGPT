'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useProfessionalAuth } from '@/hooks/useProfessionalAuth';
import { LoadingSpinner, ErrorMessage } from '@/components/ui';

interface AuthGuardProps {
  children: React.ReactNode;
  requireProfessional?: boolean;
  fallback?: React.ReactNode;
  errorFallback?: React.ReactNode;
  loadingFallback?: React.ReactNode;
}

export function AuthGuard({
  children,
  requireProfessional = false,
  fallback,
  errorFallback,
  loadingFallback,
}: AuthGuardProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { isProfessional, professionalUser, isLoading: isProfessionalLoading } = useProfessionalAuth();

  // Show loading state
  if (isLoading || (requireProfessional && isProfessionalLoading)) {
    return (
      loadingFallback || (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-600">Checking authentication...</p>
          </div>
        </div>
      )
    );
  }

  // Check professional authentication if required
  if (requireProfessional) {
    if (!isProfessional || !professionalUser) {
      return (
        errorFallback || 
        fallback || (
          <div className="min-h-screen flex items-center justify-center">
            <div className="max-w-md w-full">
              <ErrorMessage
                message="You need to be signed in as a professional to access this page."
                variant="card"
              />
              <div className="mt-4 text-center">
                <a
                  href="/professional/signin"
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Professional Sign In
                </a>
              </div>
            </div>
          </div>
        )
      );
    }
  } else {
    // Regular user authentication check
    if (!isAuthenticated || !user) {
      return (
        errorFallback || 
        fallback || (
          <div className="min-h-screen flex items-center justify-center">
            <div className="max-w-md w-full">
              <ErrorMessage
                message="You need to be signed in to access this page."
                variant="card"
              />
              <div className="mt-4 text-center">
                <a
                  href="/signin"
                  className="text-teal-600 hover:text-teal-700 font-medium"
                >
                  Sign in to continue
                </a>
              </div>
            </div>
          </div>
        )
      );
    }
  }

  return <>{children}</>;
}