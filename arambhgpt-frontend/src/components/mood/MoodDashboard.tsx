'use client';

import React, { useState } from 'react';
import { useMoodTracking } from '@/hooks';
import { MoodEntry } from './MoodEntry';
import { MoodChart } from './MoodChart';
import { MoodStats } from './MoodStats';
import { MoodHistory } from './MoodHistory';
import { AdvancedAnalyticsDashboard } from '@/components/analytics';
import { Button, Card, Modal } from '@/components/ui';
import { MOOD_EMOJIS } from '@/types';

interface MoodDashboardProps {
  className?: string;
}

export function MoodDashboard({ className = '' }: MoodDashboardProps) {
  const {
    todaysMood,
    moodHistory,
    moodStats,
    chartData,
    isLoading,
    error,
    hasLoggedToday
  } = useMoodTracking();

  const [showMoodEntry, setShowMoodEntry] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'chart' | 'analytics' | 'history'>('overview');

  const handleMoodEntryComplete = () => {
    setShowMoodEntry(false);
  };

  if (error) {
    return (
      <Card className={`p-6 text-center ${className}`}>
        <div className="text-red-500">
          <p>Error loading mood data: {error}</p>
          <Button
            onClick={() => window.location.reload()}
            className="mt-2"
            size="sm"
          >
            Retry
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mood Tracking</h1>
          <p className="text-gray-600">Track your daily mood and well-being</p>
        </div>

        <Button
          onClick={() => setShowMoodEntry(true)}
          className="flex items-center space-x-2"
        >
          <span>{hasLoggedToday ? '✏️' : '➕'}</span>
          <span>{hasLoggedToday ? 'Update Today' : 'Log Mood'}</span>
        </Button>
      </div>

      {/* Today's Mood Quick View */}
      {hasLoggedToday && todaysMood && (
        <Card className="p-4 bg-gradient-to-r from-teal-50 to-blue-50 border-teal-200">
          <div className="flex items-center space-x-4">
            <div className="text-4xl">{MOOD_EMOJIS[todaysMood.mood as keyof typeof MOOD_EMOJIS]}</div>
            <div>
              <p className="font-semibold text-gray-900">Today's Mood</p>
              <p className="text-gray-600">
                Feeling {todaysMood.mood >= 4 ? 'good' : todaysMood.mood === 3 ? 'okay' : 'not great'} today
              </p>
              {todaysMood.emotions.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {todaysMood.emotions.slice(0, 3).map((emotion: string) => (
                    <span
                      key={emotion}
                      className="px-2 py-1 bg-white bg-opacity-70 text-teal-800 text-xs rounded-full"
                    >
                      {emotion}
                    </span>
                  ))}
                  {todaysMood.emotions.length > 3 && (
                    <span className="px-2 py-1 bg-white bg-opacity-70 text-teal-800 text-xs rounded-full">
                      +{todaysMood.emotions.length - 3} more
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* No Data State */}
      {!hasLoggedToday && moodHistory.length === 0 && (
        <Card className="p-8 text-center">
          <div className="text-6xl mb-4">🌟</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Start Your Mood Journey
          </h2>
          <p className="text-gray-600 mb-4">
            Track your daily mood to understand patterns and improve your well-being
          </p>
          <Button
            onClick={() => setShowMoodEntry(true)}
            size="lg"
            className="px-8"
          >
            Log Your First Mood
          </Button>
        </Card>
      )}

      {/* Stats Overview */}
      {moodStats && (
        <MoodStats stats={moodStats} />
      )}

      {/* Tabs */}
      {moodHistory.length > 0 && (
        <>
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', label: 'Overview', icon: '📊' },
                { id: 'chart', label: 'Trends', icon: '📈' },
                { id: 'analytics', label: 'Analytics', icon: '🔍' },
                { id: 'history', label: 'History', icon: '📝' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${activeTab === tab.id
                    ? 'border-teal-500 text-teal-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="mt-6">
            {activeTab === 'overview' && moodStats && (
              <div className="space-y-6">
                <MoodChart data={chartData} />
                {moodHistory.length > 0 && (
                  <MoodHistory entries={moodHistory.slice(0, 5)} />
                )}
              </div>
            )}

            {activeTab === 'chart' && (
              <MoodChart
                data={chartData}
                showStress={true}
                showEnergy={true}
              />
            )}

            {activeTab === 'analytics' && (
              <AdvancedAnalyticsDashboard />
            )}

            {activeTab === 'history' && (
              <MoodHistory entries={moodHistory} />
            )}
          </div>
        </>
      )}

      {/* Mood Entry Modal */}
      <Modal
        isOpen={showMoodEntry}
        onClose={() => setShowMoodEntry(false)}
        title={hasLoggedToday ? "Update Today's Mood" : "Log Your Mood"}
        size="lg"
      >
        <MoodEntry onComplete={handleMoodEntryComplete} />
      </Modal>
    </div>
  );
}