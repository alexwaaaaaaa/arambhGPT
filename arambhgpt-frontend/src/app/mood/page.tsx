'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { PageLayout } from '@/components/layout/PageLayout';
import { MoodDashboard } from '@/components/mood';
import { Button } from '@/components/ui';
import Link from 'next/link';

export default function MoodPage() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (!isAuthenticated) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-orange-50">
          <div className="text-center max-w-md mx-auto p-8">
            <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">💜</span>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-orange-600 bg-clip-text text-transparent mb-4">
              Track Your Mood
            </h1>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Monitor your emotional well-being with beautiful visualizations and personalized insights. Sign in to start tracking your mood journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signin">
                <Button className="w-full sm:w-auto bg-gradient-to-r from-teal-500 to-orange-500 hover:from-teal-600 hover:to-orange-600 text-white">
                  🔐 Sign In to Track Mood
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant="outline" className="w-full sm:w-auto border-teal-500 text-teal-600 hover:bg-teal-500 hover:text-white">
                  📝 Create Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <MoodDashboard />
      </div>
    </PageLayout>
  );
}