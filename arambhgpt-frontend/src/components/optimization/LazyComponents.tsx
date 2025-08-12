// Lazy-loaded components for code splitting

import React, { Suspense } from 'react';
import { LoadingSpinner, ErrorBoundary } from '@/components/ui';

// Lazy load heavy components
export const LazyStatsPanel = React.lazy(() => 
  import('@/components/chat/StatsPanel').then(module => ({ default: module.StatsPanel }))
);

export const LazyExportModal = React.lazy(() => 
  import('@/components/chat/ExportModal').then(module => ({ default: module.ExportModal }))
);

export const LazySearchModal = React.lazy(() => 
  import('@/components/chat/SearchModal').then(module => ({ default: module.SearchModal }))
);

export const LazyProfileInterface = React.lazy(() => 
  import('@/components/profile/ProfileInterface').then(module => ({ default: module.ProfileInterface }))
);

export const LazyMobileChatInterface = React.lazy(() => 
  import('@/components/mobile/MobileChatInterface').then(module => ({ default: module.MobileChatInterface }))
);

// Wrapper component for lazy loading with error boundary and loading state
interface LazyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  errorFallback?: React.ComponentType<{ error: Error; retry: () => void }>;
}

const DefaultErrorFallback = ({ error, retry }: { error: Error; retry: () => void }) => (
  <div className="text-center p-8 text-red-600">
    <p>Failed to load component</p>
    <button onClick={retry} className="mt-2 px-4 py-2 bg-red-600 text-white rounded">
      Retry
    </button>
  </div>
);

export function LazyWrapper({ 
  children, 
  fallback = <LoadingSpinner size="lg" />,
  errorFallback = DefaultErrorFallback
}: LazyWrapperProps) {
  return (
    <ErrorBoundary fallback={errorFallback}>
      <Suspense fallback={fallback}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}

// Pre-configured lazy components with appropriate loading states
export function LazyStatsPanelWithFallback(props: any) {
  return (
    <LazyWrapper 
      fallback={
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 rounded-lg h-32"></div>
              </div>
            ))}
          </div>
          <div className="animate-pulse">
            <div className="bg-gray-200 rounded-lg h-64"></div>
          </div>
        </div>
      }
    >
      <LazyStatsPanel {...props} />
    </LazyWrapper>
  );
}

export function LazyExportModalWithFallback(props: any) {
  return (
    <LazyWrapper>
      <LazyExportModal {...props} />
    </LazyWrapper>
  );
}

export function LazySearchModalWithFallback(props: any) {
  return (
    <LazyWrapper>
      <LazySearchModal {...props} />
    </LazyWrapper>
  );
}

export function LazyProfileInterfaceWithFallback(props: any) {
  return (
    <LazyWrapper 
      fallback={
        <div className="space-y-6 animate-pulse">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-32"></div>
            ))}
          </div>
        </div>
      }
    >
      <LazyProfileInterface {...props} />
    </LazyWrapper>
  );
}

export function LazyMobileChatInterfaceWithFallback(props: any) {
  return (
    <LazyWrapper 
      fallback={
        <div className="h-full flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      }
    >
      <LazyMobileChatInterface {...props} />
    </LazyWrapper>
  );
}