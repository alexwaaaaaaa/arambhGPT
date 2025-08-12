'use client';

import React from 'react';

interface ProgressIndicatorProps {
  progress: number; // 0-100
  size?: 'sm' | 'md' | 'lg';
  variant?: 'linear' | 'circular';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  showPercentage?: boolean;
  label?: string;
  className?: string;
}

export function ProgressIndicator({
  progress,
  size = 'md',
  variant = 'linear',
  color = 'primary',
  showPercentage = false,
  label,
  className = ''
}: ProgressIndicatorProps) {
  const clampedProgress = Math.max(0, Math.min(100, progress));

  const sizeClasses = {
    sm: variant === 'linear' ? 'h-1' : 'w-8 h-8',
    md: variant === 'linear' ? 'h-2' : 'w-12 h-12',
    lg: variant === 'linear' ? 'h-3' : 'w-16 h-16',
  };

  const colorClasses = {
    primary: 'bg-teal-600',
    secondary: 'bg-gray-600',
    success: 'bg-green-600',
    warning: 'bg-yellow-600',
    error: 'bg-red-600',
  };

  if (variant === 'circular') {
    const radius = size === 'sm' ? 14 : size === 'md' ? 20 : 26;
    const strokeWidth = size === 'sm' ? 2 : size === 'md' ? 3 : 4;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (clampedProgress / 100) * circumference;

    return (
      <div className={`relative inline-flex items-center justify-center ${className}`}>
        <svg
          className={`transform -rotate-90 ${sizeClasses[size]}`}
          viewBox="0 0 64 64"
          aria-hidden="true"
        >
          {/* Background circle */}
          <circle
            cx="32"
            cy="32"
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            className="text-gray-200"
          />
          {/* Progress circle */}
          <circle
            cx="32"
            cy="32"
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={`transition-all duration-300 ${colorClasses[color]}`}
          />
        </svg>
        
        {showPercentage && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`font-medium ${
              size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base'
            }`}>
              {Math.round(clampedProgress)}%
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-1">
          {label && (
            <span className="text-sm font-medium text-gray-700">{label}</span>
          )}
          {showPercentage && (
            <span className="text-sm text-gray-600">{Math.round(clampedProgress)}%</span>
          )}
        </div>
      )}
      
      <div className={`w-full bg-gray-200 rounded-full ${sizeClasses[size]}`}>
        <div
          className={`${sizeClasses[size]} rounded-full transition-all duration-300 ${colorClasses[color]}`}
          style={{ width: `${clampedProgress}%` }}
          role="progressbar"
          aria-valuenow={clampedProgress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={label || `Progress: ${Math.round(clampedProgress)}%`}
        />
      </div>
    </div>
  );
}

// Indeterminate progress indicator
interface IndeterminateProgressProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'linear' | 'circular';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  label?: string;
  className?: string;
}

export function IndeterminateProgress({
  size = 'md',
  variant = 'linear',
  color = 'primary',
  label,
  className = ''
}: IndeterminateProgressProps) {
  const sizeClasses = {
    sm: variant === 'linear' ? 'h-1' : 'w-8 h-8',
    md: variant === 'linear' ? 'h-2' : 'w-12 h-12',
    lg: variant === 'linear' ? 'h-3' : 'w-16 h-16',
  };

  const colorClasses = {
    primary: 'bg-teal-600',
    secondary: 'bg-gray-600',
    success: 'bg-green-600',
    warning: 'bg-yellow-600',
    error: 'bg-red-600',
  };

  if (variant === 'circular') {
    return (
      <div className={`relative inline-flex items-center justify-center ${className}`}>
        <div className={`animate-spin rounded-full border-2 border-gray-200 ${sizeClasses[size]}`}>
          <div className={`rounded-full border-2 border-transparent border-t-current ${sizeClasses[size]} ${colorClasses[color]}`} />
        </div>
        {label && (
          <span className="ml-2 text-sm text-gray-600">{label}</span>
        )}
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="mb-1">
          <span className="text-sm font-medium text-gray-700">{label}</span>
        </div>
      )}
      
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <div
          className={`${sizeClasses[size]} rounded-full animate-pulse ${colorClasses[color]} opacity-75`}
          style={{
            animation: 'indeterminate 2s ease-in-out infinite',
            transformOrigin: 'left center',
          }}
        />
      </div>
      
      <style jsx>{`
        @keyframes indeterminate {
          0% {
            transform: translateX(-100%) scaleX(0.5);
          }
          50% {
            transform: translateX(0%) scaleX(1);
          }
          100% {
            transform: translateX(100%) scaleX(0.5);
          }
        }
      `}</style>
    </div>
  );
}

// Step progress indicator
interface StepProgressProps {
  steps: Array<{
    label: string;
    description?: string;
    completed?: boolean;
    current?: boolean;
    error?: boolean;
  }>;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export function StepProgress({
  steps,
  orientation = 'horizontal',
  className = ''
}: StepProgressProps) {
  return (
    <div className={`${orientation === 'horizontal' ? 'flex items-center' : 'space-y-4'} ${className}`}>
      {steps.map((step, index) => (
        <div
          key={index}
          className={`
            flex items-center
            ${orientation === 'horizontal' ? 'flex-row' : 'flex-col sm:flex-row'}
            ${index < steps.length - 1 && orientation === 'horizontal' ? 'flex-1' : ''}
          `}
        >
          {/* Step indicator */}
          <div className="flex items-center">
            <div
              className={`
                flex items-center justify-center w-8 h-8 rounded-full border-2 text-sm font-medium
                ${step.completed
                  ? 'bg-teal-600 border-teal-600 text-white'
                  : step.current
                  ? 'bg-white border-teal-600 text-teal-600'
                  : step.error
                  ? 'bg-red-600 border-red-600 text-white'
                  : 'bg-white border-gray-300 text-gray-500'
                }
              `}
            >
              {step.completed ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : step.error ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                index + 1
              )}
            </div>
          </div>

          {/* Step content */}
          <div className={`${orientation === 'horizontal' ? 'ml-3' : 'ml-3 sm:ml-3'}`}>
            <div
              className={`
                text-sm font-medium
                ${step.completed || step.current
                  ? 'text-gray-900'
                  : step.error
                  ? 'text-red-600'
                  : 'text-gray-500'
                }
              `}
            >
              {step.label}
            </div>
            {step.description && (
              <div className="text-xs text-gray-500 mt-1">
                {step.description}
              </div>
            )}
          </div>

          {/* Connector line */}
          {index < steps.length - 1 && (
            <div
              className={`
                ${orientation === 'horizontal'
                  ? 'flex-1 h-px ml-4'
                  : 'w-px h-8 ml-4 mt-2'
                }
                ${step.completed ? 'bg-teal-600' : 'bg-gray-300'}
              `}
            />
          )}
        </div>
      ))}
    </div>
  );
}