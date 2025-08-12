'use client';

import React from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import { Card, Button, Input } from '@/components/ui';

interface NotificationSettingsProps {
  className?: string;
}

export function NotificationSettings({ className = '' }: NotificationSettingsProps) {
  const { settings, updateSettings, requestPermission } = useNotifications();

  const handleToggle = (key: keyof typeof settings) => {
    updateSettings({ [key]: !settings[key] });
  };

  const handleTimeChange = (time: string) => {
    updateSettings({ reminderTime: time });
  };

  const handleFrequencyChange = (frequency: 'daily' | 'weekly' | 'custom') => {
    updateSettings({ frequency });
  };

  const handleRequestPermission = async () => {
    const granted = await requestPermission();
    if (granted) {
      updateSettings({ pushNotifications: true });
    }
  };

  return (
    <Card className={`p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Notification Settings
      </h3>

      <div className="space-y-6">
        {/* Push Notifications */}
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900">Push Notifications</h4>
            <p className="text-sm text-gray-500">Receive notifications in your browser</p>
          </div>
          <Button
            variant={settings.pushNotifications ? "primary" : "outline"}
            size="sm"
            onClick={settings.pushNotifications ? () => handleToggle('pushNotifications') : handleRequestPermission}
          >
            {settings.pushNotifications ? 'Enabled' : 'Enable'}
          </Button>
        </div>

        {/* Mood Reminders */}
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900">Mood Reminders</h4>
            <p className="text-sm text-gray-500">Daily reminders to log your mood</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.moodReminders}
              onChange={() => handleToggle('moodReminders')}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
          </label>
        </div>

        {/* Reminder Time */}
        {settings.moodReminders && (
          <div className="ml-4 space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Reminder Time
            </label>
            <Input
              type="time"
              value={settings.reminderTime}
              onChange={(value) => handleTimeChange(value)}
              className="w-32"
            />
          </div>
        )}

        {/* Wellness Tips */}
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900">Wellness Tips</h4>
            <p className="text-sm text-gray-500">Helpful tips for mental wellness</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.wellnessTips}
              onChange={() => handleToggle('wellnessTips')}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
          </label>
        </div>

        {/* Achievements */}
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900">Achievements</h4>
            <p className="text-sm text-gray-500">Celebrate your wellness milestones</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.achievements}
              onChange={() => handleToggle('achievements')}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
          </label>
        </div>

        {/* Social Updates */}
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900">Social Updates</h4>
            <p className="text-sm text-gray-500">Updates from your support network</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.socialUpdates}
              onChange={() => handleToggle('socialUpdates')}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
          </label>
        </div>

        {/* Email Notifications */}
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900">Email Notifications</h4>
            <p className="text-sm text-gray-500">Weekly mood reports via email</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.emailNotifications}
              onChange={() => handleToggle('emailNotifications')}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
          </label>
        </div>

        {/* Frequency */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2">Notification Frequency</h4>
          <div className="space-y-2">
            {(['daily', 'weekly', 'custom'] as const).map((freq) => (
              <label key={freq} className="flex items-center">
                <input
                  type="radio"
                  name="frequency"
                  value={freq}
                  checked={settings.frequency === freq}
                  onChange={() => handleFrequencyChange(freq)}
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700 capitalize">{freq}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}