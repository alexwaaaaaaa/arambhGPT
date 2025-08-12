'use client';

import React, { useState } from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import { Button, Card, Modal } from '@/components/ui';
import { Notification } from '@/types/notifications';

interface NotificationCenterProps {
  className?: string;
}

export function NotificationCenter({ className = '' }: NotificationCenterProps) {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification
  } = useNotifications();

  const [isOpen, setIsOpen] = useState(false);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'mood_reminder': return '😊';
      case 'wellness_tip': return '💡';
      case 'achievement': return '🏆';
      case 'social': return '👥';
      default: return '🔔';
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return date.toLocaleDateString();
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.isRead) {
      markAsRead(notification.id);
    }

    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
  };

  return (
    <>
      {/* Notification Bell */}
      <div className={`relative ${className}`}>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(true)}
          className="relative p-2"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>

          {/* Unread count badge */}
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </div>

      {/* Notification Modal */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Notifications"
        size="md"
      >
        <div className="max-h-96 overflow-y-auto">
          {/* Header Actions */}
          {notifications.length > 0 && (
            <div className="flex justify-between items-center mb-4 pb-2 border-b">
              <span className="text-sm text-gray-600">
                {unreadCount} unread
              </span>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-xs"
                >
                  Mark all as read
                </Button>
              )}
            </div>
          )}

          {/* Notifications List */}
          {notifications.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-4xl mb-2">🔔</div>
              <p className="text-gray-500">No notifications yet</p>
              <p className="text-sm text-gray-400 mt-1">
                We'll notify you about important updates
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${notification.isRead
                    ? 'bg-gray-50 border-gray-200'
                    : 'bg-blue-50 border-blue-200'
                    } hover:bg-gray-100`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start space-x-3">
                    {/* Icon */}
                    <div className="text-2xl flex-shrink-0">
                      {notification.icon || getNotificationIcon(notification.type)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <h4 className={`text-sm font-medium ${notification.isRead ? 'text-gray-700' : 'text-gray-900'
                          }`}>
                          {notification.title}
                        </h4>

                        {/* Delete button */}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e?: React.MouseEvent) => {
                            e?.stopPropagation();
                            deleteNotification(notification.id);
                          }}
                          className="p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </Button>
                      </div>

                      <p className={`text-sm mt-1 ${notification.isRead ? 'text-gray-500' : 'text-gray-700'
                        }`}>
                        {notification.message}
                      </p>

                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-400">
                          {formatTime(notification.createdAt)}
                        </span>

                        {/* Priority indicator */}
                        {notification.priority === 'high' && (
                          <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                            High Priority
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}