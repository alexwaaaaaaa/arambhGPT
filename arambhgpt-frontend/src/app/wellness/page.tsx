'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { PageLayout } from '@/components/layout/PageLayout';
import { MeditationTimer, BreathingExercise } from '@/components/wellness';
import { Card, Button } from '@/components/ui';
import Link from 'next/link';

export default function WellnessPage() {
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
              <span className="text-3xl">🧘‍♀️</span>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-orange-600 bg-clip-text text-transparent mb-4">
              Wellness Center
            </h1>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Access guided meditation, breathing exercises, and wellness tools. Sign in to start your wellness journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/signin">
                <Button className="w-full sm:w-auto bg-gradient-to-r from-teal-500 to-orange-500 hover:from-teal-600 hover:to-orange-600 text-white">
                  🔐 Sign In for Wellness
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
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Wellness Center 🧘‍♀️
          </h1>
          <p className="text-gray-600">
            Take a moment for yourself with guided wellness activities
          </p>
        </div>

        {/* Wellness Tools Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <MeditationTimer />
          <BreathingExercise />
        </div>

        {/* Quick Tips */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Daily Wellness Tips 💡
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-2">🌅 Morning</h3>
              <p className="text-sm text-blue-700">
                Start with 5 minutes of deep breathing to set a positive tone for your day
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-medium text-green-900 mb-2">🌞 Afternoon</h3>
              <p className="text-sm text-green-700">
                Take a mindful walk or do a quick meditation to recharge your energy
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-medium text-purple-900 mb-2">🌙 Evening</h3>
              <p className="text-sm text-purple-700">
                Wind down with gentle breathing exercises before sleep
              </p>
            </div>
          </div>
        </Card>
      </div>
    </PageLayout>
  );
}