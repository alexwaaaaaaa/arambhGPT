'use client';

import { useState, useEffect } from 'react';

interface BreakpointConfig {
  sm: number;
  md: number;
  lg: number;
  xl: number;
  '2xl': number;
}

const defaultBreakpoints: BreakpointConfig = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

interface UseResponsiveReturn {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLarge: boolean;
  screenWidth: number;
  screenHeight: number;
  orientation: 'portrait' | 'landscape';
  breakpoint: keyof BreakpointConfig | 'xs';
}

export function useResponsive(breakpoints: BreakpointConfig = defaultBreakpoints): UseResponsiveReturn {
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  });

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Set initial size
    handleResize();

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  const getCurrentBreakpoint = (): keyof BreakpointConfig | 'xs' => {
    const { width } = screenSize;
    
    if (width >= breakpoints['2xl']) return '2xl';
    if (width >= breakpoints.xl) return 'xl';
    if (width >= breakpoints.lg) return 'lg';
    if (width >= breakpoints.md) return 'md';
    if (width >= breakpoints.sm) return 'sm';
    return 'xs';
  };

  const isMobile = screenSize.width < breakpoints.md;
  const isTablet = screenSize.width >= breakpoints.md && screenSize.width < breakpoints.lg;
  const isDesktop = screenSize.width >= breakpoints.lg;
  const isLarge = screenSize.width >= breakpoints.xl;
  const orientation = screenSize.width > screenSize.height ? 'landscape' : 'portrait';

  return {
    isMobile,
    isTablet,
    isDesktop,
    isLarge,
    screenWidth: screenSize.width,
    screenHeight: screenSize.height,
    orientation,
    breakpoint: getCurrentBreakpoint(),
  };
}

// Hook for specific breakpoint checks
export function useBreakpoint(breakpoint: keyof BreakpointConfig): boolean {
  const { screenWidth } = useResponsive();
  
  return screenWidth >= defaultBreakpoints[breakpoint];
}

// Hook for mobile detection
export function useIsMobile(): boolean {
  const { isMobile } = useResponsive();
  return isMobile;
}

// Hook for touch device detection
export function useIsTouchDevice(): boolean {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const checkTouchDevice = () => {
      return (
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        // @ts-ignore
        navigator.msMaxTouchPoints > 0
      );
    };

    setIsTouchDevice(checkTouchDevice());
  }, []);

  return isTouchDevice;
}