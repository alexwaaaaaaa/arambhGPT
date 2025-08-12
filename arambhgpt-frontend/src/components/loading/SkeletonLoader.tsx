'use client';

import React from 'react';

interface SkeletonLoaderProps {
  className?: string;
  width?: string | number;
  height?: string | number;
  variant?: 'text' | 'rectangular' | 'circular' | 'rounded';
  animation?: 'pulse' | 'wave' | 'none';
}

export function SkeletonLoader({
  className = '',
  width = '100%',
  height = '1rem',
  variant = 'text',
  animation = 'pulse'
}: SkeletonLoaderProps) {
  const baseClasses = 'bg-gray-200';
  
  const variantClasses = {
    text: 'rounded',
    rectangular: '',
    circular: 'rounded-full',
    rounded: 'rounded-lg',
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-wave',
    none: '',
  };

  const style = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  return (
    <div
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${animationClasses[animation]}
        ${className}
      `}
      style={style}
      aria-hidden="true"
    />
  );
}

// Skeleton components for specific use cases
export function MessageSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-start space-x-3">
        <SkeletonLoader variant="circular" width={40} height={40} />
        <div className="flex-1 space-y-2">
          <SkeletonLoader height="1rem" width="60%" />
          <SkeletonLoader height="1rem" width="80%" />
          <SkeletonLoader height="1rem" width="40%" />
        </div>
      </div>
    </div>
  );
}

export function ConversationSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`p-4 space-y-3 ${className}`}>
      <div className="flex items-center justify-between">
        <SkeletonLoader height="1.25rem" width="70%" />
        <SkeletonLoader height="0.875rem" width="3rem" />
      </div>
      <SkeletonLoader height="0.875rem" width="90%" />
      <SkeletonLoader height="0.875rem" width="60%" />
    </div>
  );
}

export function ProfileSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center space-x-4">
        <SkeletonLoader variant="circular" width={80} height={80} />
        <div className="flex-1 space-y-2">
          <SkeletonLoader height="1.5rem" width="40%" />
          <SkeletonLoader height="1rem" width="60%" />
          <SkeletonLoader height="0.875rem" width="30%" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-6 bg-white rounded-lg border">
            <div className="text-center space-y-2">
              <SkeletonLoader variant="circular" width={48} height={48} className="mx-auto" />
              <SkeletonLoader height="2rem" width="3rem" className="mx-auto" />
              <SkeletonLoader height="0.875rem" width="80%" className="mx-auto" />
            </div>
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="space-y-4">
        <SkeletonLoader height="1.5rem" width="30%" />
        <SkeletonLoader height="1rem" width="100%" />
        <SkeletonLoader height="1rem" width="90%" />
        <SkeletonLoader height="1rem" width="70%" />
      </div>
    </div>
  );
}

export function StatsSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-6 bg-white rounded-lg border">
            <div className="text-center space-y-3">
              <SkeletonLoader variant="circular" width={48} height={48} className="mx-auto" />
              <SkeletonLoader height="2rem" width="4rem" className="mx-auto" />
              <SkeletonLoader height="0.875rem" width="80%" className="mx-auto" />
            </div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white rounded-lg border p-6">
        <SkeletonLoader height="1.5rem" width="40%" className="mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <SkeletonLoader height="0.875rem" width="3rem" />
              <div className="flex-1">
                <SkeletonLoader height="0.5rem" width={`${Math.random() * 60 + 20}%`} />
              </div>
              <SkeletonLoader height="0.875rem" width="1.5rem" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function TableSkeleton({ 
  rows = 5, 
  columns = 4, 
  className = '' 
}: { 
  rows?: number; 
  columns?: number; 
  className?: string; 
}) {
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Table Header */}
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, i) => (
          <SkeletonLoader key={i} height="1rem" width="80%" />
        ))}
      </div>

      {/* Table Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <SkeletonLoader 
              key={colIndex} 
              height="1rem" 
              width={`${Math.random() * 40 + 40}%`} 
            />
          ))}
        </div>
      ))}
    </div>
  );
}