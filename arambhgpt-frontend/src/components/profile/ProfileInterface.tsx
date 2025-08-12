'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks';
import { Card, Tabs, Button, LoadingSpinner, ErrorMessage } from '@/components/ui';
import { StatsPanel } from '@/components/chat';
import { ProfileInfo } from './ProfileInfo';
import { AccountSettings } from './AccountSettings';
import { WalletDashboard } from '@/components/wallet/WalletDashboard';

interface ProfileInterfaceProps {
  className?: string;
}

export function ProfileInterface({ className = '' }: ProfileInterfaceProps) {
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    {
      id: 'overview',
      label: 'Overview',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      id: 'wallet',
      label: 'Wallet',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      id: 'statistics',
      label: 'Statistics',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div className={`flex justify-center items-center py-12 ${className}`}>
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className={className}>
        <ErrorMessage
          message="Unable to load profile information"
          variant="card"
        />
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Personal Profile Header */}
      <Card>
        <div className="flex items-center space-x-6">
          {/* Avatar */}
          <div className="w-24 h-24 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center">
            <span className="text-3xl font-bold text-white">
              {user.name.charAt(0).toUpperCase()}
            </span>
          </div>

          {/* User Info */}
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-lg text-gray-600">{user.email}</p>
            <p className="text-sm text-gray-500 mt-2">
              🗓️ Member since {new Date(user.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
            <div className="flex items-center space-x-4 mt-2">
              <span className="text-sm text-gray-500">
                💬 Active User
              </span>
              <span className="text-sm text-gray-500">
                🌟 Personal Account
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col space-y-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveTab('settings')}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Profile
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => window.location.href = '/chat'}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Start Chat
            </Button>
          </div>
        </div>
      </Card>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center py-2 px-1 border-b-2 font-medium text-sm transition-colors
                ${activeTab === tab.id
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {tab.icon}
              <span className="ml-2">{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <ProfileInfo user={user} />

              {/* Quick Access Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="cursor-pointer" onClick={() => window.location.href = '/chat'}>
                  <Card className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">AI Chat</h3>
                        <p className="text-sm text-gray-600">Start a conversation</p>
                      </div>
                    </div>
                  </Card>
                </div>

                <div className="cursor-pointer" onClick={() => window.location.href = '/mood'}>
                  <Card className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Mood Tracker</h3>
                        <p className="text-sm text-gray-600">Track your wellness</p>
                      </div>
                    </div>
                  </Card>
                </div>

                <div className="cursor-pointer" onClick={() => window.location.href = '/professionals'}>
                  <Card className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Find Experts</h3>
                        <p className="text-sm text-gray-600">Connect with experts</p>
                      </div>
                    </div>
                  </Card>
                </div>

                <div className="cursor-pointer" onClick={() => setActiveTab('wallet')}>
                  <Card className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Wallet</h3>
                        <p className="text-sm text-gray-600">Manage your credits</p>
                      </div>
                    </div>
                  </Card>
                </div>

                <div className="cursor-pointer" onClick={() => window.location.href = '/community'}>
                  <Card className="p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Community</h3>
                        <p className="text-sm text-gray-600">Join support groups</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Status</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Account Type</span>
                    <span className="px-2 py-1 bg-teal-100 text-teal-800 rounded-full text-sm">Personal</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Status</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">Active</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Verified</span>
                    <span className="text-green-600">✓</span>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Chat Sessions</p>
                    <p className="text-2xl font-bold text-teal-600">24</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Mood Entries</p>
                    <p className="text-2xl font-bold text-purple-600">18</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Community Posts</p>
                    <p className="text-2xl font-bold text-green-600">7</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'wallet' && (
          <div className="space-y-6">
            <WalletDashboard />
          </div>
        )}

        {activeTab === 'statistics' && (
          <div className="space-y-6">
            <StatsPanel />
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <AccountSettings user={user} />
          </div>
        )}
      </div>
    </div>
  );
}