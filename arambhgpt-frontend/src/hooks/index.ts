// Custom hooks exports

export { useAuth } from './useAuth';
export { useLocalStorage } from './useLocalStorage';
export { useApi } from './useApi';
export { useAuthRedirect } from './useAuthRedirect';
export { useChat } from './useChat';
export { useConversations } from './useConversations';
export { useSearch } from './useSearch';
export { useStats } from './useStats';
export { useVoiceChat } from './useVoiceChat';
export { useMoodTracking } from './useMoodTracking';
export { usePWA } from './usePWA';
export { useNotifications } from './useNotifications';
export { useAdvancedAnalytics } from './useAdvancedAnalytics';
export { useAIContext } from './useAIContext';
export { useResponsive, useBreakpoint, useIsMobile, useIsTouchDevice } from './useResponsive';
export { useProfessionalAuth } from './useProfessionalAuth';

// Re-export auth hooks from context
export {
  useAuth as useAuthContext,
  useRequireAuth,
  useIsAuthenticated
} from '@/contexts/AuthContext';