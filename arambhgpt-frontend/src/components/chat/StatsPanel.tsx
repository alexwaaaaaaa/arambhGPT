'use client';

import React from 'react';
import { ConversationStats } from '@/types';
import { Card, LoadingSpinner, ErrorMessage } from '@/components/ui';
import { useStats } from '@/hooks/useStats';

interface StatsPanelProps {
  className?: string;
}

export function StatsPanel({ className = '' }: StatsPanelProps) {
  const { stats, isLoading, error, refresh, clearError } = useStats();

  if (isLoading && !stats) {
    return (
      <div className={`space-y-4 ${className}`}>
        <div className="text-center py-8">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading statistics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={className}>
        <ErrorMessage
          message={error}
          variant="card"
          onRetry={() => {
            clearError();
            refresh();
          }}
        />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className={className}>
        <Card className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Statistics Available</h3>
          <p className="text-gray-600">Start chatting to see your conversation statistics.</p>
        </Card>
      </div>
    );
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  const getActivityLevel = (activeDays: number) => {
    if (activeDays >= 30) return { label: 'Very Active', color: 'text-green-600', bg: 'bg-green-100' };
    if (activeDays >= 14) return { label: 'Active', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (activeDays >= 7) return { label: 'Moderate', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { label: 'Getting Started', color: 'text-gray-600', bg: 'bg-gray-100' };
  };

  const activityLevel = getActivityLevel(stats.active_days);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="text-center" padding={false}>
          <div className="p-6">
            <div className="w-12 h-12 mx-auto mb-3 bg-teal-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {formatNumber(stats.total_conversations)}
            </div>
            <div className="text-sm text-gray-600">Total Conversations</div>
          </div>
        </Card>

        <Card className="text-center" padding={false}>
          <div className="p-6">
            <div className="w-12 h-12 mx-auto mb-3 bg-orange-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {formatNumber(stats.total_messages)}
            </div>
            <div className="text-sm text-gray-600">Total Messages</div>
          </div>
        </Card>

        <Card className="text-center" padding={false}>
          <div className="p-6">
            <div className="w-12 h-12 mx-auto mb-3 bg-purple-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V6a2 2 0 012-2h4a2 2 0 012 2v1m-6 0h6m-6 0l-1 1v4a2 2 0 002 2h2a2 2 0 002-2V8l-1-1" />
              </svg>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {stats.active_days}
            </div>
            <div className="text-sm text-gray-600">Active Days</div>
          </div>
        </Card>

        <Card className="text-center" padding={false}>
          <div className="p-6">
            <div className="w-12 h-12 mx-auto mb-3 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {stats.average_messages_per_conversation.toFixed(1)}
            </div>
            <div className="text-sm text-gray-600">Avg Messages/Chat</div>
          </div>
        </Card>
      </div>

      {/* Activity Level */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">Activity Level</h3>
            <p className="text-sm text-gray-600">
              Based on your {stats.active_days} active days
            </p>
          </div>
          <div className={`px-3 py-1 rounded-full ${activityLevel.bg}`}>
            <span className={`text-sm font-medium ${activityLevel.color}`}>
              {activityLevel.label}
            </span>
          </div>
        </div>
      </Card>

      {/* Insights */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Insights</h3>
        <div className="space-y-3">
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0" />
            <p className="text-sm text-gray-700">
              You've had <strong>{formatNumber(stats.total_conversations)}</strong> conversations 
              with an average of <strong>{stats.average_messages_per_conversation.toFixed(1)}</strong> messages each.
            </p>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
            <p className="text-sm text-gray-700">
              You've been active for <strong>{stats.active_days}</strong> days, 
              showing consistent engagement with your mental wellness journey.
            </p>
          </div>
          
          {stats.total_messages > 100 && (
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
              <p className="text-sm text-gray-700">
                Great progress! You've exchanged over <strong>{formatNumber(stats.total_messages)}</strong> messages, 
                demonstrating your commitment to mental health support.
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}