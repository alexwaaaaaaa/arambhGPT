'use client';

import React from 'react';
import { WithChildren, WithClassName } from '@/types';

interface PageLayoutProps extends WithChildren, WithClassName {
  title?: string;
  description?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: boolean;
  showSidebar?: boolean;
  sidebar?: React.ReactNode;
}

export function PageLayout({
  children,
  className = '',
  title,
  description,
  maxWidth = 'xl',
  padding = true,
  showSidebar = false,
  sidebar,
}: PageLayoutProps) {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-7xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full',
  };

  const paddingClasses = padding ? 'px-4 sm:px-6 lg:px-8 py-6' : '';

  return (
    <div className={`${maxWidthClasses[maxWidth]} mx-auto ${paddingClasses} ${className}`}>
      {/* Page Header */}
      {(title || description) && (
        <div className="mb-8">
          {title && (
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {title}
            </h1>
          )}
          {description && (
            <p className="text-lg text-gray-600">
              {description}
            </p>
          )}
        </div>
      )}

      {/* Main Content */}
      {showSidebar ? (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          {sidebar && (
            <aside className="lg:w-64 flex-shrink-0">
              {sidebar}
            </aside>
          )}
          
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {children}
          </div>
        </div>
      ) : (
        children
      )}
    </div>
  );
}