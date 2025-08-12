'use client';

import React, { useState, useEffect } from 'react';
import { Card, Button } from '@/components/ui';
import { StatusAnnouncement } from '@/components/accessibility';

interface NetworkErrorHandlerProps {
  children: React.ReactNode;
}

interface NetworkStatus {
  isOnline: boolean;
  isSlowConnection: boolean;
  connectionType?: string;
}

export function NetworkErrorHandler({ children }: NetworkErrorHandlerProps) {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    isSlowConnection: false,
  });
  const [showOfflineMessage, setShowOfflineMessage] = useState(false);
  const [retryAttempts, setRetryAttempts] = useState(0);

  useEffect(() => {
    const handleOnline = () => {
      setNetworkStatus(prev => ({ ...prev, isOnline: true }));
      setShowOfflineMessage(false);
      setRetryAttempts(0);
    };

    const handleOffline = () => {
      setNetworkStatus(prev => ({ ...prev, isOnline: false }));
      setShowOfflineMessage(true);
    };

    // Check connection speed
    const checkConnectionSpeed = () => {
      if ('connection' in navigator) {
        const connection = (navigator as any).connection;
        const isSlowConnection = connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g';
        setNetworkStatus(prev => ({
          ...prev,
          isSlowConnection,
          connectionType: connection.effectiveType,
        }));
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Check connection speed on mount and periodically
    checkConnectionSpeed();
    const connectionInterval = setInterval(checkConnectionSpeed, 30000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(connectionInterval);
    };
  }, []);

  const handleRetryConnection = async () => {
    setRetryAttempts(prev => prev + 1);
    
    try {
      // Try to fetch a small resource to test connectivity
      const response = await fetch('/favicon.ico', { 
        method: 'HEAD',
        cache: 'no-cache',
        signal: AbortSignal.timeout(5000)
      });
      
      if (response.ok) {
        setNetworkStatus(prev => ({ ...prev, isOnline: true }));
        setShowOfflineMessage(false);
        setRetryAttempts(0);
      }
    } catch (error) {
      console.error('Connection test failed:', error);
      // Keep showing offline message
    }
  };

  if (!networkStatus.isOnline && showOfflineMessage) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <div className="text-center">
            {/* Offline Icon */}
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-orange-100 mb-6">
              <svg
                className="h-8 w-8 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z"
                />
              </svg>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-4">You're Offline</h1>
            <p className="text-gray-600 mb-6">
              It looks like you've lost your internet connection. Please check your network settings and try again.
            </p>

            {/* Connection Tips */}
            <div className="text-left mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900 mb-2">Troubleshooting Tips:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Check your Wi-Fi or mobile data connection</li>
                <li>• Try moving to a location with better signal</li>
                <li>• Restart your router or modem</li>
                <li>• Contact your internet service provider</li>
              </ul>
            </div>

            {/* Retry Button */}
            <Button 
              onClick={handleRetryConnection}
              className="w-full"
              disabled={retryAttempts >= 5}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              {retryAttempts >= 5 ? 'Too Many Attempts' : `Try Again ${retryAttempts > 0 ? `(${retryAttempts}/5)` : ''}`}
            </Button>

            {retryAttempts >= 5 && (
              <p className="text-sm text-gray-500 mt-3">
                Please check your connection and refresh the page manually.
              </p>
            )}

            <StatusAnnouncement 
              message="You are currently offline. Please check your internet connection."
              priority="assertive"
            />
          </div>
        </Card>
      </div>
    );
  }

  // Show slow connection warning
  if (networkStatus.isSlowConnection && networkStatus.isOnline) {
    return (
      <div className="relative">
        <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-3">
          <div className="flex items-center justify-between max-w-7xl mx-auto">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <span className="text-sm text-yellow-800">
                Slow connection detected ({networkStatus.connectionType}). Some features may load slowly.
              </span>
            </div>
          </div>
        </div>
        {children}
      </div>
    );
  }

  return <>{children}</>;
}