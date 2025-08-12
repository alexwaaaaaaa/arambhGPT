'use client';

import React, { useEffect, useRef, ReactNode } from 'react';

interface KeyboardNavigationProps {
  children: ReactNode;
  onEscape?: () => void;
  onEnter?: () => void;
  onArrowUp?: () => void;
  onArrowDown?: () => void;
  onArrowLeft?: () => void;
  onArrowRight?: () => void;
  className?: string;
}

export function KeyboardNavigation({
  children,
  onEscape,
  onEnter,
  onArrowUp,
  onArrowDown,
  onArrowLeft,
  onArrowRight,
  className = ''
}: KeyboardNavigationProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Escape':
          if (onEscape) {
            event.preventDefault();
            onEscape();
          }
          break;
        case 'Enter':
          if (onEnter) {
            event.preventDefault();
            onEnter();
          }
          break;
        case 'ArrowUp':
          if (onArrowUp) {
            event.preventDefault();
            onArrowUp();
          }
          break;
        case 'ArrowDown':
          if (onArrowDown) {
            event.preventDefault();
            onArrowDown();
          }
          break;
        case 'ArrowLeft':
          if (onArrowLeft) {
            event.preventDefault();
            onArrowLeft();
          }
          break;
        case 'ArrowRight':
          if (onArrowRight) {
            event.preventDefault();
            onArrowRight();
          }
          break;
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('keydown', handleKeyDown);
      return () => container.removeEventListener('keydown', handleKeyDown);
    }
  }, [onEscape, onEnter, onArrowUp, onArrowDown, onArrowLeft, onArrowRight]);

  return (
    <div ref={containerRef} className={className} tabIndex={-1}>
      {children}
    </div>
  );
}

// Hook for keyboard shortcuts
interface UseKeyboardShortcutsOptions {
  [key: string]: () => void;
}

export function useKeyboardShortcuts(shortcuts: UseKeyboardShortcutsOptions) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Create a key combination string
      const keys = [];
      if (event.ctrlKey) keys.push('ctrl');
      if (event.altKey) keys.push('alt');
      if (event.shiftKey) keys.push('shift');
      if (event.metaKey) keys.push('meta');
      keys.push(event.key.toLowerCase());
      
      const combination = keys.join('+');
      
      if (shortcuts[combination]) {
        event.preventDefault();
        shortcuts[combination]();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
}

// Component for roving tabindex navigation (for lists, menus, etc.)
interface RovingTabIndexProps {
  children: ReactNode;
  orientation?: 'horizontal' | 'vertical' | 'both';
  loop?: boolean;
  className?: string;
}

export function RovingTabIndex({
  children,
  orientation = 'vertical',
  loop = true,
  className = ''
}: RovingTabIndexProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const focusableElements = Array.from(
      container.querySelectorAll('[role="option"], [role="menuitem"], [role="tab"], button, [tabindex="0"]')
    ) as HTMLElement[];

    if (focusableElements.length === 0) return;

    // Set initial tabindex values
    focusableElements.forEach((element, index) => {
      element.tabIndex = index === 0 ? 0 : -1;
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      const currentIndex = focusableElements.findIndex(el => el === document.activeElement);
      if (currentIndex === -1) return;

      let nextIndex = currentIndex;

      switch (event.key) {
        case 'ArrowDown':
          if (orientation === 'vertical' || orientation === 'both') {
            event.preventDefault();
            nextIndex = currentIndex + 1;
            if (nextIndex >= focusableElements.length) {
              nextIndex = loop ? 0 : focusableElements.length - 1;
            }
          }
          break;
        case 'ArrowUp':
          if (orientation === 'vertical' || orientation === 'both') {
            event.preventDefault();
            nextIndex = currentIndex - 1;
            if (nextIndex < 0) {
              nextIndex = loop ? focusableElements.length - 1 : 0;
            }
          }
          break;
        case 'ArrowRight':
          if (orientation === 'horizontal' || orientation === 'both') {
            event.preventDefault();
            nextIndex = currentIndex + 1;
            if (nextIndex >= focusableElements.length) {
              nextIndex = loop ? 0 : focusableElements.length - 1;
            }
          }
          break;
        case 'ArrowLeft':
          if (orientation === 'horizontal' || orientation === 'both') {
            event.preventDefault();
            nextIndex = currentIndex - 1;
            if (nextIndex < 0) {
              nextIndex = loop ? focusableElements.length - 1 : 0;
            }
          }
          break;
        case 'Home':
          event.preventDefault();
          nextIndex = 0;
          break;
        case 'End':
          event.preventDefault();
          nextIndex = focusableElements.length - 1;
          break;
      }

      if (nextIndex !== currentIndex) {
        // Update tabindex values
        focusableElements[currentIndex].tabIndex = -1;
        focusableElements[nextIndex].tabIndex = 0;
        focusableElements[nextIndex].focus();
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [orientation, loop]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}