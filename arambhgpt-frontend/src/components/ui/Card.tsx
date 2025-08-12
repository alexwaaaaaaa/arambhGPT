'use client';

import React from 'react';
import { WithChildren, WithClassName } from '@/types';

interface CardProps extends WithChildren, WithClassName {
  title?: string;
  description?: string;
  footer?: React.ReactNode;
  padding?: boolean;
  hover?: boolean;
}

export function Card({
  children,
  className = '',
  title,
  description,
  footer,
  padding = true,
  hover = false,
}: CardProps) {
  const paddingClasses = padding ? 'p-6' : '';
  const hoverClasses = hover ? 'hover:shadow-lg transition-shadow duration-200' : '';

  return (
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm ${hoverClasses} ${className}`}>
      {/* Header */}
      {(title || description) && (
        <div className={`${padding ? 'px-6 pt-6' : 'p-6'} ${!title && description ? 'pb-0' : ''}`}>
          {title && (
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {title}
            </h3>
          )}
          {description && (
            <p className="text-sm text-gray-600">
              {description}
            </p>
          )}
        </div>
      )}

      {/* Content */}
      <div className={paddingClasses}>
        {children}
      </div>

      {/* Footer */}
      {footer && (
        <div className={`border-t border-gray-200 ${padding ? 'px-6 py-4' : 'p-6'}`}>
          {footer}
        </div>
      )}
    </div>
  );
}