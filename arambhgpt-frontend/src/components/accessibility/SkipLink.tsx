'use client';

import React from 'react';

interface SkipLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function SkipLink({ href, children, className = '' }: SkipLinkProps) {
  return (
    <a
      href={href}
      className={`
        sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 
        bg-teal-600 text-white px-4 py-2 rounded-md font-medium 
        focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2
        z-50 transition-all duration-200
        ${className}
      `}
      tabIndex={0}
    >
      {children}
    </a>
  );
}

export function SkipLinks() {
  return (
    <div className="sr-only focus-within:not-sr-only">
      <SkipLink href="#main-content">Skip to main content</SkipLink>
      <SkipLink href="#navigation">Skip to navigation</SkipLink>
      <SkipLink href="#chat-input">Skip to chat input</SkipLink>
    </div>
  );
}