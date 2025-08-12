'use client';

import React from 'react';
import { User } from '@/types';
import { Card } from '@/components/ui';
import { useStats } from '@/hooks';

interface ProfileInfoProps {
  user: User;
  className?: string;
}

export function ProfileInfo({ user, className = '' }: ProfileInfoProps) {
  const { stats, isLoading } = useStats();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAccountAge = () => {
    const createdDate = new Date(user.created_at);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - createdDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) {
      return `${diffDays} days`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months > 1 ? 's' : ''}`;
    } else {
      const years = Math.floor(diffDays / 365);
      const remainingMonths = Math.floor((diffDays % 365) / 30);
      return `${years} year${years > 1 ? 's' : ''}${remainingMonths > 0 ? ` ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}` : ''}`;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Account Information */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <p className="text-gray-900">{user.name}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <p className="text-gray-900">{user.email}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Account Created
            </label>
            <p className="text-gray-900">{formatDate(user.created_at)}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Account Age
            </label>
            <p className="text-gray-900">{getAccountAge()}</p>
          </div>
          
          {user.updated_at && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Updated
              </label>
              <p className="text-gray-900">{formatDate(user.updated_at)}</p>
            </div>
          )}
        </div>
      </Card>

      {/* Quick Stats Overview */}
      {stats && !isLoading && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Overview</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-teal-50 rounded-lg">
              <div className="text-2xl font-bold text-teal-600">
                {stats.total_conversations}
              </div>
              <div className="text-sm text-teal-700">Conversations</div>
            </div>
            
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {stats.total_messages}
              </div>
              <div className="text-sm text-orange-700">Messages</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {stats.active_days}
              </div>
              <div className="text-sm text-purple-700">Active Days</div>
            </div>
            
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {stats.average_messages_per_conversation.toFixed(1)}
              </div>
              <div className="text-sm text-blue-700">Avg per Chat</div>
            </div>
          </div>
        </Card>
      )}

      {/* Account Status */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Status</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div>
                <p className="font-medium text-green-800">Account Active</p>
                <p className="text-sm text-green-600">Your account is in good standing</p>
              </div>
            </div>
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <div>
                <p className="font-medium text-blue-800">Email Verified</p>
                <p className="text-sm text-blue-600">Your email address is confirmed</p>
              </div>
            </div>
            <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </Card>

      {/* Mental Health Journey */}
      {stats && !isLoading && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Mental Health Journey</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-teal-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="text-gray-700">
                  You've been actively engaging with ArambhGPT for <strong>{getAccountAge()}</strong>, 
                  showing commitment to your mental wellness.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="text-gray-700">
                  Through <strong>{stats.total_conversations}</strong> conversations, you've created a 
                  safe space for reflection and growth.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <p className="text-gray-700">
                  Your consistent engagement over <strong>{stats.active_days}</strong> active days 
                  demonstrates your dedication to mental health support.
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}