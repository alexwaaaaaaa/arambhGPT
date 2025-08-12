'use client';

import React, { useState } from 'react';
import { MoodLevel, MOOD_EMOJIS, MOOD_LABELS } from '@/types';
import { useMoodTracking } from '@/hooks';
import { Card, Button } from '@/components/ui';

interface MoodQuickEntryProps {
  className?: string;
  onComplete?: () => void;
}

export function MoodQuickEntry({ className = '', onComplete }: MoodQuickEntryProps) {
  const { saveMoodEntry, isLoading, hasLoggedToday } = useMoodTracking();
  const [selectedMood, setSelectedMood] = useState<MoodLevel | null>(null);

  const handleMoodSelect = async (mood: MoodLevel) => {
    setSelectedMood(mood);
    
    try {
      await saveMoodEntry({
        mood,
        emotions: [],
        activities: []
      });
      
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error('Failed to save mood entry:', error);
      // Reset selected mood on error
      setSelectedMood(null);
    }
  };

  if (hasLoggedToday) {
    return null;
  }

  return (
    <Card className={`p-4 bg-gradient-to-r from-teal-50 to-blue-50 border-teal-200 ${className}`}>
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          How are you feeling today?
        </h3>
        <p className="text-sm text-gray-600">
          Quick mood check-in
        </p>
      </div>

      <div className="flex justify-center space-x-3">
        {([1, 2, 3, 4, 5] as MoodLevel[]).map((mood) => (
          <button
            key={mood}
            onClick={() => handleMoodSelect(mood)}
            disabled={isLoading}
            className={`flex flex-col items-center p-3 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
              selectedMood === mood
                ? 'border-teal-500 bg-white shadow-md'
                : 'border-transparent bg-white bg-opacity-70 hover:bg-white hover:border-gray-200'
            } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <div className="text-2xl mb-1">{MOOD_EMOJIS[mood]}</div>
            <div className="text-xs font-medium text-gray-700">
              {MOOD_LABELS[mood]}
            </div>
          </button>
        ))}
      </div>

      <div className="text-center mt-3">
        <p className="text-xs text-gray-500">
          Tap an emoji for quick entry, or{' '}
          <button className="text-teal-600 hover:text-teal-700 underline">
            add details
          </button>
        </p>
      </div>
    </Card>
  );
}