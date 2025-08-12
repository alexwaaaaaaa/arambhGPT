'use client';

import React, { useState } from 'react';
import { useAdvancedAnalytics } from '@/hooks';
import { Card, Button, Tabs } from '@/components/ui';
import { MoodChart } from '@/components/mood';

interface AdvancedAnalyticsDashboardProps {
  className?: string;
}

export function AdvancedAnalyticsDashboard({ className = '' }: AdvancedAnalyticsDashboardProps) {
  const { analytics, isLoading, error, exportData } = useAdvancedAnalytics();
  const [activeTab, setActiveTab] = useState<'correlations' | 'patterns' | 'predictions' | 'trends'>('correlations');

  if (isLoading) {
    return (
      <Card className={`p-6 text-center ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={`p-6 text-center ${className}`}>
        <div className="text-red-500">
          <p>Error loading analytics: {error}</p>
        </div>
      </Card>
    );
  }

  if (!analytics) {
    return (
      <Card className={`p-6 text-center ${className}`}>
        <div className="text-gray-500">
          <p>No analytics data available</p>
          <p className="text-sm mt-1">Start logging your mood to see insights</p>
        </div>
      </Card>
    );
  }

  const getCorrelationColor = (correlation: number) => {
    if (correlation > 0.3) return 'text-green-600';
    if (correlation < -0.3) return 'text-red-600';
    return 'text-gray-600';
  };

  const getSignificanceColor = (significance: string) => {
    switch (significance) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Advanced Analytics</h2>
          <p className="text-gray-600">Deep insights into your mood patterns</p>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportData('csv')}
          >
            Export CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportData('json')}
          >
            Export JSON
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'correlations', label: 'Correlations', icon: '📊' },
            { id: 'patterns', label: 'Patterns', icon: '🔍' },
            { id: 'predictions', label: 'Predictions', icon: '🔮' },
            { id: 'trends', label: 'Trends', icon: '📈' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
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
        {activeTab === 'correlations' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Mood Correlations</h3>
            {analytics.correlations.length === 0 ? (
              <Card className="p-6 text-center">
                <p className="text-gray-500">Not enough data for correlation analysis</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {analytics.correlations.map((correlation, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{correlation.factor}</h4>
                      <span className={`text-sm px-2 py-1 rounded ${getSignificanceColor(correlation.significance)}`}>
                        {correlation.significance}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm text-gray-600">Correlation:</span>
                      <span className={`font-medium ${getCorrelationColor(correlation.correlation)}`}>
                        {correlation.correlation.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{correlation.description}</p>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'patterns' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Identified Patterns</h3>
            {analytics.patterns.length === 0 ? (
              <Card className="p-6 text-center">
                <p className="text-gray-500">No significant patterns detected yet</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {analytics.patterns.map((pattern, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{pattern.pattern}</h4>
                      <span className="text-sm text-gray-500">
                        {pattern.frequency} occurrences
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{pattern.description}</p>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Recommendation:</strong> {pattern.recommendation}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'predictions' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Mood Predictions</h3>
            {analytics.predictions.length === 0 ? (
              <Card className="p-6 text-center">
                <p className="text-gray-500">Need more data for predictions</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {analytics.predictions.map((prediction, index) => (
                  <Card key={index} className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900 mb-1">
                        {prediction.predictedMood.toFixed(1)}
                      </div>
                      <div className="text-sm text-gray-600 mb-2">
                        {new Date(prediction.date).toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div 
                          className="bg-teal-600 h-2 rounded-full" 
                          style={{ width: `${prediction.confidence * 100}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {Math.round(prediction.confidence * 100)}% confidence
                      </div>
                      <div className="mt-2">
                        {prediction.factors.map((factor, i) => (
                          <span key={i} className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded mr-1">
                            {factor}
                          </span>
                        ))}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'trends' && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Mood Trends</h3>
            
            {/* Weekly Trends */}
            <Card className="p-6">
              <h4 className="font-medium text-gray-900 mb-4">Weekly Patterns</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
                {analytics.weeklyTrends.map((trend, index) => (
                  <div key={index} className="text-center p-2 bg-gray-50 rounded">
                    <div className="text-xs text-gray-600 mb-1">{trend.day.slice(0, 3)}</div>
                    <div className="text-lg font-semibold text-gray-900">
                      {trend.averageMood.toFixed(1)}
                    </div>
                    <div className="text-xs text-gray-500">{trend.count} entries</div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Activity Impact */}
            <Card className="p-6">
              <h4 className="font-medium text-gray-900 mb-4">Activity Impact</h4>
              <div className="space-y-2">
                {analytics.activityImpact.slice(0, 5).map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm font-medium text-gray-900">{activity.activity}</span>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">
                        {activity.averageMoodAfter.toFixed(1)} avg
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        activity.impact === 'positive' ? 'bg-green-100 text-green-800' :
                        activity.impact === 'negative' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {activity.impact}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Emotion Frequency */}
            <Card className="p-6">
              <h4 className="font-medium text-gray-900 mb-4">Most Common Emotions</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {analytics.emotionFrequency.slice(0, 8).map((emotion, index) => (
                  <div key={index} className="text-center p-2 bg-gray-50 rounded">
                    <div className="text-sm font-medium text-gray-900 mb-1">
                      {emotion.emotion}
                    </div>
                    <div className="text-xs text-gray-600">
                      {emotion.percentage.toFixed(1)}%
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}