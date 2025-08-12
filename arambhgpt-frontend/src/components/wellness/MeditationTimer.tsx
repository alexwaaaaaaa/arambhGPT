'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, Button } from '@/components/ui';

interface MeditationTimerProps {
  className?: string;
}

export function MeditationTimer({ className = '' }: MeditationTimerProps) {
  const [duration, setDuration] = useState(5); // minutes
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedSound, setSelectedSound] = useState('bell');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const sounds = {
    bell: '🔔',
    ocean: '🌊', 
    forest: '🌲',
    rain: '🌧️',
    silence: '🔇'
  };

  const presetDurations = [3, 5, 10, 15, 20, 30];

  useEffect(() => {
    if (isActive && !isPaused && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(time => {
          if (time <= 1) {
            setIsActive(false);
            playCompletionSound();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, isPaused, timeLeft]);

  const startTimer = () => {
    setTimeLeft(duration * 60);
    setIsActive(true);
    setIsPaused(false);
  };

  const pauseTimer = () => {
    setIsPaused(!isPaused);
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsPaused(false);
    setTimeLeft(0);
  };

  const playCompletionSound = () => {
    // In a real app, this would play actual sounds
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Meditation Complete! 🧘‍♀️', {
        body: 'Great job on completing your meditation session!',
        icon: '/icons/icon-192x192.png'
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = timeLeft > 0 ? ((duration * 60 - timeLeft) / (duration * 60)) * 100 : 0;

  return (
    <Card className={`p-6 text-center ${className}`}>
      <h3 className="text-xl font-semibold text-gray-900 mb-6">
        Meditation Timer 🧘‍♀️
      </h3>

      {/* Timer Display */}
      <div className="relative w-48 h-48 mx-auto mb-6">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="#e5e7eb"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="#0d9488"
            strokeWidth="8"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 45}`}
            strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
            className="transition-all duration-1000 ease-linear"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">
              {isActive ? formatTime(timeLeft) : `${duration}:00`}
            </div>
            <div className="text-sm text-gray-500">
              {isActive ? (isPaused ? 'Paused' : 'Meditating') : 'Ready'}
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="space-y-4">
        {!isActive ? (
          <>
            {/* Duration Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Duration (minutes)
              </label>
              <div className="flex flex-wrap justify-center gap-2">
                {presetDurations.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setDuration(preset)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      duration === preset
                        ? 'bg-teal-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {preset}m
                  </button>
                ))}
              </div>
            </div>

            {/* Sound Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Background Sound
              </label>
              <div className="flex justify-center gap-2">
                {Object.entries(sounds).map(([sound, emoji]) => (
                  <button
                    key={sound}
                    onClick={() => setSelectedSound(sound)}
                    className={`p-2 rounded-lg text-xl transition-colors ${
                      selectedSound === sound
                        ? 'bg-teal-100 border-2 border-teal-500'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                    title={sound}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <Button onClick={startTimer} size="lg" className="w-full">
              Start Meditation
            </Button>
          </>
        ) : (
          <div className="flex justify-center space-x-3">
            <Button
              onClick={pauseTimer}
              variant="outline"
              size="lg"
            >
              {isPaused ? 'Resume' : 'Pause'}
            </Button>
            <Button
              onClick={resetTimer}
              variant="outline"
              size="lg"
            >
              Stop
            </Button>
          </div>
        )}
      </div>

      {/* Meditation Tips */}
      {!isActive && (
        <div className="mt-6 p-4 bg-teal-50 rounded-lg">
          <h4 className="text-sm font-medium text-teal-900 mb-2">
            Meditation Tips 💡
          </h4>
          <ul className="text-xs text-teal-700 space-y-1 text-left">
            <li>• Find a comfortable, quiet position</li>
            <li>• Focus on your breath naturally</li>
            <li>• It's okay if your mind wanders</li>
            <li>• Gently return attention to your breath</li>
            <li>• Start with shorter sessions</li>
          </ul>
        </div>
      )}
    </Card>
  );
}