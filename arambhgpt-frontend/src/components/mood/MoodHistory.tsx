'use client';

import React, { useState } from 'react';
import { MoodEntry, MOOD_LABELS, MOOD_EMOJIS } from '@/types';
import { Card, Button } from '@/components/ui';
import { useMoodTracking } from '@/hooks';

interface MoodHistoryProps {
  entries: MoodEntry[];
  className?: string;
}

export function MoodHistory({ entries, className = '' }: MoodHistoryProps) {
  const { deleteMoodEntry } = useMoodTracking();
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);

  const sortedEntries = [...entries].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'short',
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  const toggleExpanded = (entryId: string) => {
    setExpandedEntry(expandedEntry === entryId ? null : entryId);
  };

  if (sortedEntries.length === 0) {
    return (
      <Card className={`p-6 text-center ${className}`}>
        <div className="text-gray-500">
          <div className="text-4xl mb-2">📝</div>
          <p>No mood entries yet.</p>
          <p className="text-sm mt-1">Start logging your daily mood to see your history here!</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Mood History</h3>
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {sortedEntries.map((entry) => (
          <div
            key={entry.id}
            className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{MOOD_EMOJIS[entry.mood]}</div>
                <div>
                  <p className="font-medium text-gray-900">
                    {MOOD_LABELS[entry.mood]}
                  </p>
                  <p className="text-sm text-gray-500">
                    {formatDate(entry.date)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleExpanded(entry.id)}
                  className="text-xs"
                >
                  {expandedEntry === entry.id ? 'Less' : 'More'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteMoodEntry(entry.id)}
                  className="text-xs text-red-600 hover:text-red-700"
                >
                  Delete
                </Button>
              </div>
            </div>

            {/* Expanded Details */}
            {expandedEntry === entry.id && (
              <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                {/* Emotions */}
                {entry.emotions.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Emotions:</p>
                    <div className="flex flex-wrap gap-1">
                      {entry.emotions.map((emotion) => (
                        <span
                          key={emotion}
                          className="px-2 py-1 bg-teal-100 text-teal-800 text-xs rounded-full"
                        >
                          {emotion}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Activities */}
                {entry.activities && entry.activities.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Activities:</p>
                    <div className="flex flex-wrap gap-1">
                      {entry.activities.map((activity) => (
                        <span
                          key={activity}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {activity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-4 text-sm">
                  {entry.stressLevel && (
                    <div>
                      <p className="text-gray-600">Stress</p>
                      <p className="font-medium">{MOOD_LABELS[entry.stressLevel]}</p>
                    </div>
                  )}
                  {entry.energyLevel && (
                    <div>
                      <p className="text-gray-600">Energy</p>
                      <p className="font-medium">{MOOD_LABELS[entry.energyLevel]}</p>
                    </div>
                  )}
                  {entry.sleepHours && (
                    <div>
                      <p className="text-gray-600">Sleep</p>
                      <p className="font-medium">{entry.sleepHours}h</p>
                    </div>
                  )}
                </div>

                {/* Notes */}
                {entry.notes && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Notes:</p>
                    <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                      {entry.notes}
                    </p>
                  </div>
                )}

                {/* Timestamp */}
                <div className="text-xs text-gray-400">
                  Logged on {new Date(entry.createdAt).toLocaleString()}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}