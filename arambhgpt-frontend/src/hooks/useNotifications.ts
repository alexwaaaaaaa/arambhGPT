'use client';

import { useState, useEffect, useCallback } from 'react';
import { type Notification, NotificationSettings, NotificationType } from '@/types/notifications';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';

interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  settings: NotificationSettings;
  isLoading: boolean;
  error: string | null;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  updateSettings: (settings: Partial<NotificationSettings>) => void;
  requestPermission: () => Promise<boolean>;
  scheduleReminder: (type: NotificationType, time: string) => void;
}

const defaultSettings: NotificationSettings = {
  moodReminders: true,
  wellnessTips: true,
  achievements: true,
  socialUpdates: false,
  emailNotifications: false,
  pushNotifications: false,
  reminderTime: '20:00',
  frequency: 'daily'
};

export function useNotifications(): UseNotificationsReturn {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Load notifications from API
  const loadNotifications = useCallback(async () => {
    if (!user || !apiClient.isAuthenticated()) return;

    try {
      setIsLoading(true);
      setError(null);
      
      const data = await apiClient.getNotifications(50, false);
      setNotifications(data.map((notif: any) => ({
        id: notif.id,
        type: notif.type,
        title: notif.title,
        message: notif.message,
        isRead: notif.is_read,
        priority: notif.priority,
        actionUrl: notif.action_url,
        icon: notif.icon,
        createdAt: notif.created_at
      })));
    } catch (err) {
      console.error('Failed to load notifications:', err);
      setError('Failed to load notifications');
      
      // Fallback to localStorage
      try {
        const savedNotifications = localStorage.getItem(`notifications-${user.id}`);
        if (savedNotifications) {
          setNotifications(JSON.parse(savedNotifications));
        }
      } catch (localError) {
        console.error('Failed to load from localStorage:', localError);
      }
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Save notifications to localStorage
  const saveNotifications = useCallback((newNotifications: Notification[]) => {
    if (!user) return;
    localStorage.setItem(`notifications-${user.id}`, JSON.stringify(newNotifications));
  }, [user]);

  // Save settings to localStorage
  const saveSettings = useCallback((newSettings: NotificationSettings) => {
    if (!user) return;
    localStorage.setItem(`notification-settings-${user.id}`, JSON.stringify(newSettings));
  }, [user]);

  // Add new notification
  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'createdAt' | 'isRead'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `notification-${Date.now()}`,
      createdAt: new Date().toISOString(),
      isRead: false
    };

    setNotifications(prev => {
      const updated = [newNotification, ...prev];
      saveNotifications(updated);
      return updated;
    });

    // Show browser notification if permission granted
    if (settings.pushNotifications && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: notification.icon || '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png',
        tag: newNotification.id
      });
    }
  }, [settings.pushNotifications, saveNotifications]);

  // Mark notification as read
  const markAsRead = useCallback(async (id: string) => {
    try {
      await apiClient.markNotificationRead(id);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
      // Update locally anyway for better UX
      setNotifications(prev => {
        const updated = prev.map(n => n.id === id ? { ...n, isRead: true } : n);
        saveNotifications(updated);
        return updated;
      });
    }
  }, [saveNotifications]);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      await apiClient.markAllNotificationsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
      // Update locally anyway for better UX
      setNotifications(prev => {
        const updated = prev.map(n => ({ ...n, isRead: true }));
        saveNotifications(updated);
        return updated;
      });
    }
  }, [saveNotifications]);

  // Delete notification
  const deleteNotification = useCallback((id: string) => {
    setNotifications(prev => {
      const updated = prev.filter(n => n.id !== id);
      saveNotifications(updated);
      return updated;
    });
  }, [saveNotifications]);

  // Update settings
  const updateSettings = useCallback(async (newSettings: Partial<NotificationSettings>) => {
    try {
      const updatedSettings = { ...settings, ...newSettings };
      
      const apiSettings = {
        mood_reminders: updatedSettings.moodReminders,
        wellness_tips: updatedSettings.wellnessTips,
        achievements: updatedSettings.achievements,
        social_updates: updatedSettings.socialUpdates,
        email_notifications: updatedSettings.emailNotifications,
        push_notifications: updatedSettings.pushNotifications,
        reminder_time: updatedSettings.reminderTime,
        frequency: updatedSettings.frequency,
      };

      await apiClient.updateNotificationSettings(apiSettings);
      setSettings(updatedSettings);
    } catch (err) {
      console.error('Failed to update notification settings:', err);
      setError('Failed to update settings');
      // Update locally anyway for better UX
      setSettings(prev => {
        const updated = { ...prev, ...newSettings };
        saveSettings(updated);
        return updated;
      });
    }
  }, [settings, saveSettings]);

  // Request notification permission
  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission === 'denied') {
      return false;
    }

    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }, []);

  // Schedule reminder
  const scheduleReminder = useCallback((type: NotificationType, time: string) => {
    // This would typically integrate with a service worker for persistent scheduling
    // For now, we'll use setTimeout for demo purposes
    const [hours, minutes] = time.split(':').map(Number);
    const now = new Date();
    const scheduledTime = new Date();
    scheduledTime.setHours(hours, minutes, 0, 0);

    // If time has passed today, schedule for tomorrow
    if (scheduledTime <= now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    const timeUntilReminder = scheduledTime.getTime() - now.getTime();

    setTimeout(() => {
      let title = '';
      let message = '';
      let icon = '';

      switch (type) {
        case 'mood_reminder':
          title = 'Daily Mood Check-in';
          message = 'How are you feeling today? Take a moment to log your mood.';
          icon = '😊';
          break;
        case 'wellness_tip':
          title = 'Wellness Tip';
          message = 'Remember to take deep breaths and stay hydrated!';
          icon = '💡';
          break;
        default:
          title = 'ArambhGPT Reminder';
          message = 'Don\'t forget to check in with yourself today.';
          icon = '🌟';
      }

      addNotification({
        type,
        title,
        message,
        priority: 'medium',
        icon
      });
    }, timeUntilReminder);
  }, [addNotification]);

  // Load notification settings from API
  const loadSettings = useCallback(async () => {
    if (!user || !apiClient.isAuthenticated()) return;

    try {
      const data = await apiClient.getNotificationSettings();
      setSettings({
        moodReminders: data.mood_reminders,
        wellnessTips: data.wellness_tips,
        achievements: data.achievements,
        socialUpdates: data.social_updates,
        emailNotifications: data.email_notifications,
        pushNotifications: data.push_notifications,
        reminderTime: data.reminder_time,
        frequency: data.frequency,
      });
    } catch (err) {
      console.error('Failed to load notification settings:', err);
      
      // Fallback to localStorage
      try {
        const savedSettings = localStorage.getItem(`notification-settings-${user.id}`);
        if (savedSettings) {
          setSettings({ ...defaultSettings, ...JSON.parse(savedSettings) });
        }
      } catch (localError) {
        console.error('Failed to load settings from localStorage:', localError);
      }
    }
  }, [user]);

  // Load data on mount
  useEffect(() => {
    if (user && apiClient.isAuthenticated()) {
      loadNotifications();
      loadSettings();
    }
  }, [user, loadNotifications, loadSettings]);

  // Set up daily reminders
  useEffect(() => {
    if (settings.moodReminders && user) {
      scheduleReminder('mood_reminder', settings.reminderTime);
    }
  }, [settings.moodReminders, settings.reminderTime, user, scheduleReminder]);

  // Generate wellness tips
  useEffect(() => {
    if (settings.wellnessTips && user) {
      const tips = [
        'Take 5 deep breaths to reduce stress',
        'Drink a glass of water to stay hydrated',
        'Step outside for some fresh air',
        'Practice gratitude by listing 3 things you\'re thankful for',
        'Take a 5-minute break from screens'
      ];

      const randomTip = tips[Math.floor(Math.random() * tips.length)];
      
      // Add a wellness tip every few hours (demo)
      const tipInterval = setInterval(() => {
        addNotification({
          type: 'wellness_tip',
          title: 'Wellness Tip 💡',
          message: randomTip,
          priority: 'low',
          icon: '💡'
        });
      }, 4 * 60 * 60 * 1000); // Every 4 hours

      return () => clearInterval(tipInterval);
    }
  }, [settings.wellnessTips, user, addNotification]);

  return {
    notifications,
    unreadCount,
    settings,
    isLoading,
    error,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    updateSettings,
    requestPermission,
    scheduleReminder
  };
}