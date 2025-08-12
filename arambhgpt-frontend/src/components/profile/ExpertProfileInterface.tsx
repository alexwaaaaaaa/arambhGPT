'use client';

import React, { useState } from 'react';
import { useProfessional } from '@/hooks/useProfessional';
import { Card, Tabs, Button, LoadingSpinner, ErrorMessage, Input } from '@/components/ui';

interface ExpertProfileInterfaceProps {
  className?: string;
}

export function ExpertProfileInterface({ className = '' }: ExpertProfileInterfaceProps) {
  const { professional, loading, stats, updateAvailability } = useProfessional();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);

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
      id: 'credentials',
      label: 'Credentials',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      ),
    },
    {
      id: 'practice',
      label: 'Practice',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
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

  if (loading) {
    return (
      <div className={`flex justify-center items-center py-12 ${className}`}>
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!professional) {
    return (
      <div className={className}>
        <ErrorMessage
          message="Unable to load expert profile information"
          variant="card"
        />
      </div>
    );
  }

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'online': return 'bg-green-100 text-green-800';
      case 'busy': return 'bg-yellow-100 text-yellow-800';
      case 'offline': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAvailabilityIcon = (availability: string) => {
    switch (availability) {
      case 'online': return '🟢';
      case 'busy': return '🟡';
      case 'offline': return '🔴';
      default: return '⚪';
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Expert Profile Header */}
      <Card>
        <div className="flex items-center space-x-6">
          {/* Avatar */}
          <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
            <span className="text-3xl font-bold text-white">
              Dr
            </span>
          </div>

          {/* Expert Info */}
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h2 className="text-2xl font-bold text-gray-900">
                Dr. {professional.name}
              </h2>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getAvailabilityColor(professional.availability || 'offline')}`}>
                {getAvailabilityIcon(professional.availability || 'offline')} {professional.availability || 'Offline'}
              </span>
            </div>
            <p className="text-lg text-gray-700 font-medium">{professional.title}</p>
            <p className="text-gray-600">{professional.email}</p>
            <div className="flex items-center space-x-4 mt-2">
              <span className="text-sm text-gray-500">
                ⭐ {stats?.rating || '4.9'} Rating
              </span>
              <span className="text-sm text-gray-500">
                📅 {stats?.today_sessions || '156'} Sessions
              </span>
              <span className="text-sm text-gray-500">
                💰 ₹{stats?.today_earnings || '45,600'} Earned
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col space-y-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Profile
            </Button>
            <div className="flex space-x-1">
              <Button
                size="sm"
                variant={professional.availability === 'online' ? 'primary' : 'outline'}
                onClick={() => updateAvailability && updateAvailability('online')}
              >
                Online
              </Button>
              <Button
                size="sm"
                variant={professional.availability === 'busy' ? 'primary' : 'outline'}
                onClick={() => updateAvailability && updateAvailability('busy')}
              >
                Busy
              </Button>
              <Button
                size="sm"
                variant={professional.availability === 'offline' ? 'primary' : 'outline'}
                onClick={() => updateAvailability && updateAvailability('offline')}
              >
                Offline
              </Button>
            </div>
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
                  ? 'border-blue-500 text-blue-600'
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
            {/* Stats Cards */}
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">This Week</h3>
                  <p className="text-3xl font-bold text-blue-600">{stats?.weekly_sessions || '12'}</p>
                  <p className="text-sm text-gray-500">Sessions completed</p>
                </Card>
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">This Month</h3>
                  <p className="text-3xl font-bold text-green-600">₹{stats?.monthly_earnings || '18,400'}</p>
                  <p className="text-sm text-gray-500">Total earnings</p>
                </Card>
              </div>

              {/* Specializations */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Specializations</h3>
                <div className="flex flex-wrap gap-2">
                  {(professional.specialization || ['Anxiety', 'Depression', 'Trauma Therapy']).map((spec: string, index: number) => (
                    <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {spec}
                    </span>
                  ))}
                </div>
              </Card>

              {/* Languages */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Languages</h3>
                <div className="flex flex-wrap gap-2">
                  {((professional as any).languages || ['Hindi', 'English', 'Punjabi']).map((lang: string, index: number) => (
                    <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      {lang}
                    </span>
                  ))}
                </div>
              </Card>
            </div>

            {/* Quick Info */}
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Info</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Experience</p>
                    <p className="font-medium">{professional.experience || '8'} years</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium">{(professional as any).location || 'Delhi, India'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">License</p>
                    <p className="font-medium">{(professional as any).licenseNumber || 'PSY123456'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{(professional as any).phone || '+91 9876543210'}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Session Rates</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">💬 Chat Session</span>
                    <span className="font-medium">₹{professional.chat_rate || '500'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">📞 Voice Call</span>
                    <span className="font-medium">₹{professional.call_rate || '800'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">🎥 Video Call</span>
                    <span className="font-medium">₹{professional.video_rate || '1200'}</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}

        {activeTab === 'credentials' && (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Credentials</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Professional Title</label>
                  <Input value={professional.title || ''} disabled={!isEditing} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">License Number</label>
                  <Input value={(professional as any).licenseNumber || ''} disabled={!isEditing} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience</label>
                  <Input value={professional.experience || ''} disabled={!isEditing} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <Input value={(professional as any).location || ''} disabled={!isEditing} />
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'practice' && (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Practice Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Chat Rate (₹/session)</label>
                  <Input value={professional.chat_rate || '500'} disabled={!isEditing} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Voice Rate (₹/session)</label>
                  <Input value={professional.call_rate || '800'} disabled={!isEditing} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Video Rate (₹/session)</label>
                  <Input value={professional.video_rate || '1200'} disabled={!isEditing} />
                </div>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <Input value={professional.email || ''} disabled={!isEditing} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <Input value={(professional as any).phone || ''} disabled={!isEditing} />
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}