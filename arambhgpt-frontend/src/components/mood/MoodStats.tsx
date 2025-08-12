'use client';

import React from 'react';
import { MoodStats as MoodStatsType, MOOD_LABELS, MOOD_EMOJIS } from '@/types';
import { Card } from '@/components/ui';

interface MoodStatsProps {
  stats: MoodStatsType;
  className?: string;
}

export function MoodStats({ stats, className = '' }: MoodStatsProps) {
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return '📈';
      case 'declining':
        return '📉';
      default:
        return '➡️';
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving':
        return 'text-green-600';
      case 'declining':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTrendText = (trend: string) => {
    switch (trend) {
      case 'improving':
        return 'Improving';
      case 'declining':
        return 'Needs attention';
      default:
        return 'Stable';
    }
  };

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      {/* Average Mood */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Average Mood</p>
            <p className="text-2xl font-bold text-gray-900">
              {stats.averageMood.toFixed(1)}
            </p>
            <p className="text-xs text-gray-500">
              {MOOD_LABELS[Math.round(stats.averageMood) as keyof typeof MOOD_LABELS]}
            </p>
          </div>
          <div className="text-3xl">
            {MOOD_EMOJIS[Math.round(stats.averageMood) as keyof typeof MOOD_EMOJIS]}
          </div>
        </div>
      </Card>

      {/* Streak */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Current Streak</p>
            <p className="text-2xl font-bold text-gray-900">
              {stats.streakDays}
            </p>
            <p className="text-xs text-gray-500">
              {stats.streakDays === 1 ? 'day' : 'days'}
            </p>
          </div>
          <div className="text-3xl">🔥</div>
        </div>
      </Card>

      {/* Trend */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Trend</p>
            <p className={`text-lg font-semibold ${getTrendColor(stats.moodTrend)}`}>
              {getTrendText(stats.moodTrend)}
            </p>
            <p className="text-xs text-gray-500">Last 7 days</p>
          </div>
          <div className="text-2xl">
            {getTrendIcon(stats.moodTrend)}
          </div>
        </div>
      </Card>

      {/* Total Entries */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Entries</p>
            <p className="text-2xl font-bold text-gray-900">
              {stats.totalEntries}
            </p>
            <p className="text-xs text-gray-500">
              {stats.totalEntries === 1 ? 'entry' : 'entries'}
            </p>
          </div>
          <div className="text-3xl">📊</div>
        </div>
      </Card>

      {/* Weekly Average */}
      <Card className="p-4 md:col-span-2">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">This Week</p>
            <p className="text-xl font-bold text-gray-900">
              {stats.weeklyAverage.toFixed(1)} avg
            </p>
            <p className="text-xs text-gray-500">
              {MOOD_LABELS[Math.round(stats.weeklyAverage) as keyof typeof MOOD_LABELS]}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-gray-600">Most Common</p>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">{MOOD_EMOJIS[stats.mostCommonMood]}</span>
              <span className="text-sm text-gray-700">
                {MOOD_LABELS[stats.mostCommonMood]}
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Insights */}
      <Card className="p-4 md:col-span-2">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-2">Insights</p>
          <div className="space-y-1 text-sm text-gray-700">
            {stats.streakDays >= 7 && (
              <p className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Great job maintaining a {stats.streakDays}-day logging streak!
              </p>
            )}
            {stats.moodTrend === 'improving' && (
              <p className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Your mood has been improving lately. Keep it up!
              </p>
            )}
            {stats.moodTrend === 'declining' && (
              <p className="flex items-center">
                <span className="text-yellow-500 mr-2">⚠</span>
                Consider talking to someone or trying self-care activities.
              </p>
            )}
            {stats.averageMood >= 4 && (
              <p className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                You're maintaining a positive mood overall!
              </p>
            )}
            {stats.totalEntries >= 30 && (
              <p className="flex items-center">
                <span className="text-blue-500 mr-2">📈</span>
                You've built a great habit of mood tracking!
              </p>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}