'use client';

import React from 'react';
import { MoodChart as MoodChartType, MOOD_COLORS, MOOD_LABELS } from '@/types';
import { Card } from '@/components/ui';

interface MoodChartProps {
  data: MoodChartType[];
  className?: string;
  showStress?: boolean;
  showEnergy?: boolean;
}

export function MoodChart({ data, className = '', showStress = true, showEnergy = true }: MoodChartProps) {
  if (data.length === 0) {
    return (
      <Card className={`p-6 text-center ${className}`}>
        <p className="text-gray-500">No mood data available yet. Start logging your mood to see trends!</p>
      </Card>
    );
  }

  const maxValue = 5;
  const chartHeight = 200;
  const chartWidth = Math.max(600, data.length * 40);
  const padding = 40;

  // Calculate positions
  const xStep = (chartWidth - padding * 2) / Math.max(data.length - 1, 1);
  const yStep = (chartHeight - padding * 2) / maxValue;

  // Generate path for mood line
  const moodPath = data
    .map((point, index) => {
      const x = padding + index * xStep;
      const y = chartHeight - padding - (point.mood - 1) * yStep;
      return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  // Generate path for stress line
  const stressPath = showStress && data.some(d => d.stress)
    ? data
        .filter(d => d.stress)
        .map((point, index) => {
          const originalIndex = data.findIndex(d => d.date === point.date);
          const x = padding + originalIndex * xStep;
          const y = chartHeight - padding - ((point.stress || 1) - 1) * yStep;
          return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
        })
        .join(' ')
    : '';

  // Generate path for energy line
  const energyPath = showEnergy && data.some(d => d.energy)
    ? data
        .filter(d => d.energy)
        .map((point, index) => {
          const originalIndex = data.findIndex(d => d.date === point.date);
          const x = padding + originalIndex * xStep;
          const y = chartHeight - padding - ((point.energy || 1) - 1) * yStep;
          return `${index === 0 ? 'M' : 'L'} ${x} ${y}`;
        })
        .join(' ')
    : '';

  return (
    <Card className={`p-6 ${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Mood Trends</h3>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-teal-500 rounded-full mr-2"></div>
            <span>Mood</span>
          </div>
          {showStress && (
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              <span>Stress</span>
            </div>
          )}
          {showEnergy && (
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
              <span>Energy</span>
            </div>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <svg width={chartWidth} height={chartHeight} className="w-full">
          {/* Grid lines */}
          {[1, 2, 3, 4, 5].map((level) => (
            <g key={level}>
              <line
                x1={padding}
                y1={chartHeight - padding - (level - 1) * yStep}
                x2={chartWidth - padding}
                y2={chartHeight - padding - (level - 1) * yStep}
                stroke="#f3f4f6"
                strokeWidth="1"
              />
              <text
                x={padding - 10}
                y={chartHeight - padding - (level - 1) * yStep + 4}
                textAnchor="end"
                className="text-xs fill-gray-500"
              >
                {level}
              </text>
            </g>
          ))}

          {/* Mood line */}
          <path
            d={moodPath}
            fill="none"
            stroke="#0d9488"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Stress line */}
          {stressPath && (
            <path
              d={stressPath}
              fill="none"
              stroke="#ef4444"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="5,5"
            />
          )}

          {/* Energy line */}
          {energyPath && (
            <path
              d={energyPath}
              fill="none"
              stroke="#eab308"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="3,3"
            />
          )}

          {/* Data points */}
          {data.map((point, index) => {
            const x = padding + index * xStep;
            const y = chartHeight - padding - (point.mood - 1) * yStep;
            
            return (
              <g key={index}>
                <circle
                  cx={x}
                  cy={y}
                  r="4"
                  fill="#0d9488"
                  stroke="white"
                  strokeWidth="2"
                />
                
                {/* Date labels (show every few points to avoid crowding) */}
                {index % Math.max(1, Math.floor(data.length / 7)) === 0 && (
                  <text
                    x={x}
                    y={chartHeight - 10}
                    textAnchor="middle"
                    className="text-xs fill-gray-500"
                  >
                    {new Date(point.date).toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className="mt-4 text-xs text-gray-500">
        <div className="flex justify-between">
          <span>Very Low</span>
          <span>Low</span>
          <span>Neutral</span>
          <span>Good</span>
          <span>Excellent</span>
        </div>
      </div>
    </Card>
  );
}