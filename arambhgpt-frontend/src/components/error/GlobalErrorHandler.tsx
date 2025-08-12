'use client';

import React, { Component, ReactNode } from 'react';
import { ErrorBoundaryState, ErrorBoundaryProps } from '@/types';
import { Button, Card } from '@/components/ui';
import { ScreenReaderOnly } from '@/components/accessibility';

interface GlobalErrorHandlerState extends ErrorBoundaryState {
  eventId?: string;
  retryCount: number;
}

export class GlobalErrorHandler extends Component<ErrorBoundaryProps, GlobalErrorHandlerState> {
  private retryTimeoutId: NodeJS.Timeout | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<GlobalErrorHandlerState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Global Error Handler caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
      eventId: this.generateEventId(),
    });

    // Report error to monitoring service (if available)
    this.reportError(error, errorInfo);
  }

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  private generateEventId(): string {
    return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private reportError(error: Error, errorInfo: React.ErrorInfo) {
    // In a real application, you would send this to your error reporting service
    // Example: Sentry, LogRocket, Bugsnag, etc.
    const errorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      eventId: this.state.eventId,
    };

    console.error('Error Report:', errorReport);
    
    // Example: Send to monitoring service
    // errorReportingService.captureException(error, { extra: errorReport });
  }

  private handleRetry = () => {
    const { retryCount } = this.state;
    const maxRetries = 3;

    if (retryCount < maxRetries) {
      this.setState({
        hasError: false,
        error: undefined,
        errorInfo: undefined,
        retryCount: retryCount + 1,
      });

      // Add a small delay before retry to prevent immediate re-error
      this.retryTimeoutId = setTimeout(() => {
        // Force a re-render
        this.forceUpdate();
      }, 1000);
    }
  };

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private getErrorType(error: Error): string {
    if (error.name === 'ChunkLoadError') return 'chunk_load';
    if (error.message.includes('Loading chunk')) return 'chunk_load';
    if (error.message.includes('Network Error')) return 'network';
    if (error.message.includes('Failed to fetch')) return 'network';
    if (error.name === 'TypeError') return 'type_error';
    return 'unknown';
  }

  private getErrorMessage(error: Error): { title: string; description: string; suggestion: string } {
    const errorType = this.getErrorType(error);

    switch (errorType) {
      case 'chunk_load':
        return {
          title: 'Loading Error',
          description: 'There was a problem loading part of the application.',
          suggestion: 'This usually happens after an app update. Please refresh the page to get the latest version.',
        };
      case 'network':
        return {
          title: 'Connection Error',
          description: 'Unable to connect to our servers.',
          suggestion: 'Please check your internet connection and try again.',
        };
      case 'type_error':
        return {
          title: 'Application Error',
          description: 'Something unexpected happened in the application.',
          suggestion: 'Please try refreshing the page or contact support if the problem persists.',
        };
      default:
        return {
          title: 'Unexpected Error',
          description: 'An unexpected error occurred.',
          suggestion: 'Please try refreshing the page or contact support if the problem persists.',
        };
    }
  }

  render() {
    if (this.state.hasError && this.state.error) {
      const { title, description, suggestion } = this.getErrorMessage(this.state.error);
      const { retryCount } = this.state;
      const maxRetries = 3;
      const canRetry = retryCount < maxRetries;

      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <Card className="max-w-lg w-full">
            <div className="text-center">
              {/* Error Icon */}
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
                <svg
                  className="h-8 w-8 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>

              {/* Error Content */}
              <h1 className="text-2xl font-bold text-gray-900 mb-4">{title}</h1>
              <p className="text-gray-600 mb-2">{description}</p>
              <p className="text-sm text-gray-500 mb-8">{suggestion}</p>

              {/* Error Details (for development) */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="text-left mb-6 p-4 bg-gray-100 rounded-lg">
                  <summary className="cursor-pointer font-medium text-gray-700 mb-2">
                    Error Details (Development)
                  </summary>
                  <div className="text-sm text-gray-600 space-y-2">
                    <div>
                      <strong>Error:</strong> {this.state.error.message}
                    </div>
                    {this.state.eventId && (
                      <div>
                        <strong>Event ID:</strong> {this.state.eventId}
                      </div>
                    )}
                    {this.state.error.stack && (
                      <div>
                        <strong>Stack:</strong>
                        <pre className="mt-1 text-xs overflow-auto">
                          {this.state.error.stack}
                        </pre>
                      </div>
                    )}
                  </div>
                </details>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                {canRetry && (
                  <Button onClick={this.handleRetry} className="flex-1 sm:flex-none">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Try Again {retryCount > 0 && `(${retryCount}/${maxRetries})`}
                  </Button>
                )}

                <Button onClick={this.handleReload} variant="outline" className="flex-1 sm:flex-none">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Refresh Page
                </Button>

                <Button onClick={this.handleGoHome} variant="outline" className="flex-1 sm:flex-none">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Go Home
                </Button>
              </div>

              {/* Retry Count Warning */}
              {!canRetry && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    Maximum retry attempts reached. Please refresh the page or contact support.
                  </p>
                </div>
              )}

              {/* Screen Reader Announcement */}
              <ScreenReaderOnly>
                An error occurred: {title}. {description} {suggestion}
              </ScreenReaderOnly>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}