'use client';

import React, { useState, useEffect } from 'react';
import { Card, Button } from '@/components/ui';

interface BreathingExerciseProps {
  className?: string;
}

export function BreathingExercise({ className = '' }: BreathingExerciseProps) {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'pause'>('inhale');
  const [count, setCount] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [technique, setTechnique] = useState<'4-7-8' | '4-4-4' | '6-2-6'>('4-7-8');

  const techniques = {
    '4-7-8': { inhale: 4, hold: 7, exhale: 8, pause: 1 },
    '4-4-4': { inhale: 4, hold: 4, exhale: 4, pause: 1 },
    '6-2-6': { inhale: 6, hold: 2, exhale: 6, pause: 2 }
  };

  const currentTechnique = techniques[technique];

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive) {
      interval = setInterval(() => {
        setCount(prevCount => {
          const newCount = prevCount + 1;
          const maxCount = currentTechnique[phase];

          if (newCount >= maxCount) {
            // Move to next phase
            switch (phase) {
              case 'inhale':
                setPhase('hold');
                break;
              case 'hold':
                setPhase('exhale');
                break;
              case 'exhale':
                setPhase('pause');
                break;
              case 'pause':
                setPhase('inhale');
                setCycle(prev => prev + 1);
                break;
            }
            return 0;
          }
          return newCount;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, phase, currentTechnique]);

  const startExercise = () => {
    setIsActive(true);
    setPhase('inhale');
    setCount(0);
    setCycle(0);
  };

  const stopExercise = () => {
    setIsActive(false);
    setPhase('inhale');
    setCount(0);
    setCycle(0);
  };

  const getPhaseInstruction = () => {
    switch (phase) {
      case 'inhale':
        return 'Breathe In';
      case 'hold':
        return 'Hold';
      case 'exhale':
        return 'Breathe Out';
      case 'pause':
        return 'Pause';
    }
  };

  const getPhaseColor = () => {
    switch (phase) {
      case 'inhale':
        return 'text-blue-600';
      case 'hold':
        return 'text-yellow-600';
      case 'exhale':
        return 'text-green-600';
      case 'pause':
        return 'text-gray-600';
    }
  };

  const getCircleScale = () => {
    const progress = count / currentTechnique[phase];
    switch (phase) {
      case 'inhale':
        return 0.5 + (progress * 0.5); // Scale from 0.5 to 1
      case 'hold':
        return 1; // Stay at full size
      case 'exhale':
        return 1 - (progress * 0.5); // Scale from 1 to 0.5
      case 'pause':
        return 0.5; // Stay at small size
    }
  };

  return (
    <Card className={`p-6 text-center ${className}`}>
      <h3 className="text-xl font-semibold text-gray-900 mb-6">
        Breathing Exercise 🫁
      </h3>

      {/* Breathing Circle */}
      <div className="relative w-64 h-64 mx-auto mb-6">
        <div
          className={`w-full h-full rounded-full border-4 transition-all duration-1000 ease-in-out ${
            phase === 'inhale' ? 'border-blue-400 bg-blue-50' :
            phase === 'hold' ? 'border-yellow-400 bg-yellow-50' :
            phase === 'exhale' ? 'border-green-400 bg-green-50' :
            'border-gray-400 bg-gray-50'
          }`}
          style={{
            transform: `scale(${getCircleScale()})`,
          }}
        >
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className={`text-2xl font-bold ${getPhaseColor()}`}>
                {getPhaseInstruction()}
              </div>
              <div className="text-lg text-gray-600 mt-2">
                {currentTechnique[phase] - count}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      {isActive && (
        <div className="mb-6">
          <div className="text-lg font-semibold text-gray-900">
            Cycle {cycle + 1}
          </div>
          <div className="text-sm text-gray-600">
            {technique} Technique
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="space-y-4">
        {!isActive ? (
          <>
            {/* Technique Selection */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Breathing Technique
              </label>
              <div className="flex justify-center space-x-2">
                {Object.keys(techniques).map((tech) => (
                  <button
                    key={tech}
                    onClick={() => setTechnique(tech as any)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      technique === tech
                        ? 'bg-teal-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {tech}
                  </button>
                ))}
              </div>
            </div>

            {/* Technique Description */}
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              <strong>{technique}:</strong> Inhale for {currentTechnique.inhale}s, 
              hold for {currentTechnique.hold}s, exhale for {currentTechnique.exhale}s
            </div>

            <Button onClick={startExercise} size="lg" className="w-full">
              Start Breathing Exercise
            </Button>
          </>
        ) : (
          <Button onClick={stopExercise} variant="outline" size="lg" className="w-full">
            Stop Exercise
          </Button>
        )}
      </div>

      {/* Benefits */}
      {!isActive && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="text-sm font-medium text-blue-900 mb-2">
            Benefits of Breathing Exercises 💨
          </h4>
          <ul className="text-xs text-blue-700 space-y-1 text-left">
            <li>• Reduces stress and anxiety</li>
            <li>• Improves focus and concentration</li>
            <li>• Lowers blood pressure</li>
            <li>• Promotes better sleep</li>
            <li>• Increases mindfulness</li>
          </ul>
        </div>
      )}
    </Card>
  );
}