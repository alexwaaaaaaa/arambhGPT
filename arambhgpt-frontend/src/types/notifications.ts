export type NotificationType = 'mood_reminder' | 'wellness_tip' | 'achievement' | 'system' | 'social';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
  icon?: string;
  priority: 'low' | 'medium' | 'high';
}

export interface NotificationSettings {
  moodReminders: boolean;
  wellnessTips: boolean;
  achievements: boolean;
  socialUpdates: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  reminderTime: string; // HH:MM format
  frequency: 'daily' | 'weekly' | 'custom';
}

export interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}