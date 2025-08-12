'use client';

import React, { ReactNode } from 'react';

interface ScreenReaderOnlyProps {
  children: ReactNode;
  as?: keyof JSX.IntrinsicElements;
  className?: string;
}

export function ScreenReaderOnly({ 
  children, 
  as: Component = 'span',
  className = '' 
}: ScreenReaderOnlyProps) {
  return (
    <Component 
      className={`sr-only ${className}`}
      aria-hidden="false"
    >
      {children}
    </Component>
  );
}

// Utility component for live regions
interface LiveRegionProps {
  children: ReactNode;
  politeness?: 'polite' | 'assertive' | 'off';
  atomic?: boolean;
  relevant?: 'additions' | 'removals' | 'text' | 'all';
  className?: string;
}

export function LiveRegion({ 
  children, 
  politeness = 'polite',
  atomic = false,
  relevant = 'all',
  className = ''
}: LiveRegionProps) {
  return (
    <div
      aria-live={politeness}
      aria-atomic={atomic}
      aria-relevant={relevant}
      className={`sr-only ${className}`}
    >
      {children}
    </div>
  );
}

// Component for announcing status updates
interface StatusAnnouncementProps {
  message: string;
  priority?: 'polite' | 'assertive';
}

export function StatusAnnouncement({ 
  message, 
  priority = 'polite' 
}: StatusAnnouncementProps) {
  if (!message) return null;

  return (
    <LiveRegion politeness={priority}>
      {message}
    </LiveRegion>
  );
}