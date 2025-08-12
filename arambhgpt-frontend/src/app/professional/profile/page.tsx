'use client';

import React from 'react';
import { ProfessionalProfileEditor } from '@/components/professional/ProfessionalProfileEditor';
import { PageLayout } from '@/components/layout/PageLayout';
import { useProfessional } from '@/hooks/useProfessional';
import { LoadingSpinner, Card, Button } from '@/components/ui';

export default function ProfessionalProfilePage() {
  const { professional, loading, isAuthenticated } = useProfessional();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated || !professional) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <Card className="p-8 text-center max-w-md">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center mb-6">
            <span className="text-3xl">🔒</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Professional Access Required</h2>
          <p className="text-gray-600 mb-6">Please sign in as a healthcare professional to access your profile.</p>
          <Button 
            onClick={() => window.location.href = '/professional/signin'}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            Professional Sign In
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <PageLayout>
      <ProfessionalProfileEditor />
    </PageLayout>
  );
}