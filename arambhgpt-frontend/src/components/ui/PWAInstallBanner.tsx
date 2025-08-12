'use client';

import React from 'react';
import { usePWA } from '@/hooks';
import { Button } from './Button';

interface PWAInstallBannerProps {
  className?: string;
}

export function PWAInstallBanner({ className = '' }: PWAInstallBannerProps) {
  const { isInstallable, isInstalled, installApp, showInstallPrompt, dismissInstallPrompt } = usePWA();

  if (isInstalled || !isInstallable || !showInstallPrompt) {
    return null;
  }

  return (
    <div className={`fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 ${className}`}>
      <div className="flex items-start space-x-3">
        {/* App Icon */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded-lg flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900">
            Install ArambhGPT
          </h3>
          <p className="text-xs text-gray-600 mt-1">
            Get quick access to your AI mental health companion. Install now for a better experience!
          </p>
          
          {/* Benefits */}
          <div className="mt-2 space-y-1">
            <div className="flex items-center text-xs text-gray-500">
              <svg className="w-3 h-3 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Faster loading
            </div>
            <div className="flex items-center text-xs text-gray-500">
              <svg className="w-3 h-3 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Works offline
            </div>
            <div className="flex items-center text-xs text-gray-500">
              <svg className="w-3 h-3 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Native app feel
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2 mt-3">
            <Button
              onClick={installApp}
              size="sm"
              className="flex-1 text-xs"
            >
              Install App
            </Button>
            <Button
              onClick={dismissInstallPrompt}
              variant="ghost"
              size="sm"
              className="text-xs px-2"
            >
              Not now
            </Button>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={dismissInstallPrompt}
          className="flex-shrink-0 p-1 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Dismiss install prompt"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}