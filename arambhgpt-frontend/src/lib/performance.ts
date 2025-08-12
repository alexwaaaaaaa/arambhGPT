// Performance optimization utilities

import React from 'react';
import { useCallback, useRef, useEffect, useMemo, useState } from 'react';

// Debounce hook for performance optimization
export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout>();

  return useCallback(
    ((...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    }) as T,
    [callback, delay]
  );
}

// Throttle hook for performance optimization
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const lastCallRef = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout>();

  return useCallback(
    ((...args: Parameters<T>) => {
      const now = Date.now();

      if (now - lastCallRef.current >= delay) {
        lastCallRef.current = now;
        callback(...args);
      } else {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
          lastCallRef.current = Date.now();
          callback(...args);
        }, delay - (now - lastCallRef.current));
      }
    }) as T,
    [callback, delay]
  );
}

// Memoized selector hook
export function useMemoizedSelector<T, R>(
  data: T,
  selector: (data: T) => R,
  deps: React.DependencyList = []
): R {
  return useMemo(() => selector(data), [data, ...deps]);
}

// Virtual scrolling hook for large lists
interface UseVirtualScrollOptions {
  itemHeight: number;
  containerHeight: number;
  itemCount: number;
  overscan?: number;
}

interface VirtualScrollResult {
  startIndex: number;
  endIndex: number;
  visibleItems: number[];
  totalHeight: number;
  offsetY: number;
}

export function useVirtualScroll({
  itemHeight,
  containerHeight,
  itemCount,
  overscan = 5
}: UseVirtualScrollOptions): [VirtualScrollResult, (scrollTop: number) => void] {
  const scrollTopRef = useRef(0);

  const result = useMemo((): VirtualScrollResult => {
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const startIndex = Math.max(0, Math.floor(scrollTopRef.current / itemHeight) - overscan);
    const endIndex = Math.min(itemCount - 1, startIndex + visibleCount + overscan * 2);

    const visibleItems = Array.from(
      { length: endIndex - startIndex + 1 },
      (_, i) => startIndex + i
    );

    return {
      startIndex,
      endIndex,
      visibleItems,
      totalHeight: itemCount * itemHeight,
      offsetY: startIndex * itemHeight,
    };
  }, [itemHeight, containerHeight, itemCount, overscan]);

  const setScrollTop = useCallback((scrollTop: number) => {
    scrollTopRef.current = scrollTop;
  }, []);

  return [result, setScrollTop];
}

// Image lazy loading hook
export function useLazyImage(src: string, options: IntersectionObserverInit = {}) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, ...options }
    );

    observer.observe(img);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isInView && src) {
      const img = new Image();
      img.onload = () => setIsLoaded(true);
      img.src = src;
    }
  }, [isInView, src]);

  return { imgRef, isLoaded, isInView };
}

// Performance monitoring utilities
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number[]> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  startTiming(label: string): () => void {
    const startTime = performance.now();

    return () => {
      const endTime = performance.now();
      const duration = endTime - startTime;

      if (!this.metrics.has(label)) {
        this.metrics.set(label, []);
      }

      this.metrics.get(label)!.push(duration);

      // Keep only last 100 measurements
      const measurements = this.metrics.get(label)!;
      if (measurements.length > 100) {
        measurements.shift();
      }

      // Log slow operations in development
      if (process.env.NODE_ENV === 'development' && duration > 100) {
        console.warn(`Slow operation detected: ${label} took ${duration.toFixed(2)}ms`);
      }
    };
  }

  getMetrics(label: string): { avg: number; min: number; max: number; count: number } | null {
    const measurements = this.metrics.get(label);
    if (!measurements || measurements.length === 0) return null;

    const avg = measurements.reduce((sum, val) => sum + val, 0) / measurements.length;
    const min = Math.min(...measurements);
    const max = Math.max(...measurements);

    return { avg, min, max, count: measurements.length };
  }

  getAllMetrics(): Record<string, ReturnType<PerformanceMonitor['getMetrics']>> {
    const result: Record<string, ReturnType<PerformanceMonitor['getMetrics']>> = {};

    Array.from(this.metrics.keys()).forEach(label => {
      result[label] = this.getMetrics(label);
    });

    return result;
  }

  clearMetrics(label?: string): void {
    if (label) {
      this.metrics.delete(label);
    } else {
      this.metrics.clear();
    }
  }
}

// React component performance wrapper
export function withPerformanceMonitoring<P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
) {
  const WrappedComponent = React.memo((props: P) => {
    const monitor = PerformanceMonitor.getInstance();

    useEffect(() => {
      const endTiming = monitor.startTiming(`${componentName}_render`);
      return endTiming;
    });

    return React.createElement(Component, props);
  });

  return WrappedComponent;
}

// Bundle size optimization utilities
export const lazyImport = <T extends React.ComponentType<any>>(
  importFn: () => Promise<{ default: T }>
) => {
  return React.lazy(importFn);
};

// Memory usage monitoring
export function useMemoryMonitor(interval: number = 5000) {
  const [memoryInfo, setMemoryInfo] = useState<{
    usedJSHeapSize: number;
    totalJSHeapSize: number;
    jsHeapSizeLimit: number;
  } | null>(null);

  useEffect(() => {
    if (!('memory' in performance)) return;

    const updateMemoryInfo = () => {
      const memory = (performance as any).memory;
      setMemoryInfo({
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit,
      });
    };

    updateMemoryInfo();
    const intervalId = setInterval(updateMemoryInfo, interval);

    return () => clearInterval(intervalId);
  }, [interval]);

  return memoryInfo;
}

// Cache utilities
export class LRUCache<K, V> {
  private cache = new Map<K, V>();
  private maxSize: number;

  constructor(maxSize: number = 100) {
    this.maxSize = maxSize;
  }

  get(key: K): V | undefined {
    const value = this.cache.get(key);
    if (value !== undefined) {
      // Move to end (most recently used)
      this.cache.delete(key);
      this.cache.set(key, value);
    }
    return value;
  }

  set(key: K, value: V): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxSize) {
      // Remove least recently used (first item)
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(key, value);
  }

  has(key: K): boolean {
    return this.cache.has(key);
  }

  delete(key: K): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  get size(): number {
    return this.cache.size;
  }
}