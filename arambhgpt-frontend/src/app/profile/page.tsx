'use client';

import React from 'react';
import { ProtectedRoute } from '@/components/auth';
import { PageLayout } from '@/components/layout';
import { ProfileInterface } from '@/components/profile';
import { ExpertProfileInterface } from '@/components/profile/ExpertProfileInterface';
import { useAuth } from '@/hooks';
import { useProfessional } from '@/hooks/useProfessional';
import { LoadingSpinner } from '@/components/ui';

export default function ProfilePage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { professional, isAuthenticated: isProfessionalAuthenticated, loading: professionalLoading } = useProfessional();

  // Determine user type
  const isPersonalUser = isAuthenticated && user && !isProfessionalAuthenticated;
  const isExpertUser = isProfessionalAuthenticated && professional;
  const isLoading = authLoading || professionalLoading;

  if (isLoading) {
    return (
      <PageLayout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </PageLayout>
    );
  }

  return (
    <ProtectedRoute>
      <PageLayout>
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {isExpertUser ? (
              <>
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-gray-900">Expert Profile</h1>
                  <p className="mt-2 text-gray-600">
                    Manage your expert profile, credentials, and practice settings.
                  </p>
                </div>
                <ExpertProfileInterface />
              </>
            ) : (
              <>
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-gray-900">Personal Profile</h1>
                  <p className="mt-2 text-gray-600">
                    Manage your account information and view your usage statistics.
                  </p>
                </div>
                <ProfileInterface />
              </>
            )}
          </div>
        </div>
      </PageLayout>
    </ProtectedRoute>
  );
}