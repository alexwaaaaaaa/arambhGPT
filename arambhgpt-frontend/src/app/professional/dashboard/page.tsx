'use client';

import React, { useState } from 'react';
import { Card, Button, LoadingSpinner } from '@/components/ui';
import { useProfessional } from '@/hooks/useProfessional';

// Mock data for appointments
const mockAppointments = [
  {
    id: '1',
    clientName: 'Rahul Sharma',
    type: 'video',
    date: '2025-01-11',
    time: '10:00 AM',
    duration: 60,
    status: 'confirmed',
    notes: 'Follow-up session for anxiety management'
  },
  {
    id: '2',
    clientName: 'Priya Patel',
    type: 'chat',
    date: '2025-01-11',
    time: '2:00 PM',
    duration: 45,
    status: 'pending',
    notes: 'First session - relationship counseling'
  },
  {
    id: '3',
    clientName: 'Amit Kumar',
    type: 'voice',
    date: '2025-01-12',
    time: '11:00 AM',
    duration: 50,
    status: 'confirmed',
    notes: 'Depression therapy session'
  }
];

const mockRequests = [
  {
    id: '1',
    clientName: 'Sneha Reddy',
    requestType: 'booking',
    preferredType: 'video',
    preferredDate: '2025-01-12',
    preferredTime: '3:00 PM',
    message: 'Hi, I would like to book a session for stress management.',
    timestamp: '2025-01-11T08:30:00Z',
    status: 'pending'
  },
  {
    id: '2',
    clientName: 'Vikash Singh',
    requestType: 'consultation',
    preferredType: 'chat',
    message: 'I need help with anxiety issues. Can we start with a chat session?',
    timestamp: '2025-01-11T07:15:00Z',
    status: 'pending'
  }
];

export default function ProfessionalDashboard() {
  const { professional, loading, stats, updateAvailability, isAuthenticated } = useProfessional();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-indigo-600 font-medium">Loading your professional dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !professional) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <Card className="p-8 text-center max-w-md shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center mb-6">
            <span className="text-3xl">🔒</span>
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Access Restricted
          </h2>
          <p className="text-gray-600 mb-6">Please sign in as a healthcare professional to access your dashboard.</p>
          <Button 
            onClick={() => window.location.href = '/professional/signin'}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold"
          >
            🩺 Professional Sign In
          </Button>
        </Card>
      </div>
    );
  }

  const handleAppointmentAction = (appointmentId: string, action: 'confirm' | 'cancel' | 'reschedule') => {
    console.log(`${action} appointment ${appointmentId}`);
  };

  const handleRequestAction = (requestId: string, action: 'accept' | 'decline') => {
    console.log(`${action} request ${requestId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'pending': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'cancelled': return 'bg-rose-100 text-rose-800 border-rose-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return '🎥';
      case 'voice': return '🎤';
      case 'chat': return '💬';
      default: return '📞';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Professional Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full mb-4 shadow-lg">
            <span className="text-2xl">👩‍⚕️</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
            Welcome Back, Dr. {professional?.name?.split(' ')[1] || 'Expert'}
          </h1>
          <p className="text-lg text-indigo-600 font-medium">
            Your Professional Healthcare Dashboard
          </p>
          <p className="text-gray-600 mt-1">
            Empowering wellness through expert care
          </p>
        </div>

        {/* Professional Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Today's Healing Sessions</p>
                <p className="text-3xl font-bold">{stats?.today_sessions || 8}</p>
                <p className="text-blue-200 text-xs mt-1">Lives touched today</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">🩺</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-emerald-500 to-teal-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm font-medium">Active Care Recipients</p>
                <p className="text-3xl font-bold">{stats?.active_patients || 24}</p>
                <p className="text-emerald-200 text-xs mt-1">Under your guidance</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">💚</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-purple-500 to-pink-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Professional Earnings</p>
                <p className="text-3xl font-bold">₹{stats?.today_earnings || 12500}</p>
                <p className="text-purple-200 text-xs mt-1">Today's contribution</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">💎</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-amber-500 to-orange-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-100 text-sm font-medium">Excellence Rating</p>
                <p className="text-3xl font-bold">{stats?.rating || 4.8} ⭐</p>
                <p className="text-amber-200 text-xs mt-1">Patient satisfaction</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">🏆</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Professional Status Card */}
        <Card className="p-6 mb-8 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className={`w-4 h-4 rounded-full shadow-lg ${
                professional?.availability === 'online' ? 'bg-emerald-500 animate-pulse' :
                professional?.availability === 'busy' ? 'bg-amber-500' : 'bg-gray-400'
              }`}></div>
              <div>
                <h3 className="text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Professional Availability Status
                </h3>
                <p className="text-gray-600">
                  Currently <span className="font-semibold text-indigo-600 capitalize">
                    {professional?.availability === 'online' ? 'Available for Consultations' :
                     professional?.availability === 'busy' ? 'In Session' : 'Offline'}
                  </span>
                </p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button 
                size="sm" 
                variant={professional?.availability === 'online' ? 'primary' : 'outline'}
                onClick={() => updateAvailability && updateAvailability('online')}
                className={professional?.availability === 'online' ? 
                  'bg-emerald-600 hover:bg-emerald-700 text-white' : 
                  'border-emerald-300 text-emerald-600 hover:bg-emerald-50'
                }
              >
                🟢 Available
              </Button>
              <Button 
                size="sm" 
                variant={professional?.availability === 'busy' ? 'primary' : 'outline'}
                onClick={() => updateAvailability && updateAvailability('busy')}
                className={professional?.availability === 'busy' ? 
                  'bg-amber-600 hover:bg-amber-700 text-white' : 
                  'border-amber-300 text-amber-600 hover:bg-amber-50'
                }
              >
                🟡 In Session
              </Button>
              <Button 
                size="sm" 
                variant={professional?.availability === 'offline' ? 'primary' : 'outline'}
                onClick={() => updateAvailability && updateAvailability('offline')}
                className={professional?.availability === 'offline' ? 
                  'bg-gray-600 hover:bg-gray-700 text-white' : 
                  'border-gray-300 text-gray-600 hover:bg-gray-50'
                }
              >
                🔴 Offline
              </Button>
            </div>
          </div>
        </Card>

        {/* Professional Activities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Scheduled Consultations */}
          <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Today's Healing Sessions
                </h2>
                <p className="text-gray-600 text-sm">Scheduled patient consultations</p>
              </div>
              <Button size="sm" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                ➕ Add Session
              </Button>
            </div>
            
            <div className="space-y-4">
              {mockAppointments.slice(0, 3).map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg">
                      <span className="text-lg">{getTypeIcon(appointment.type)}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{appointment.clientName}</p>
                      <p className="text-sm text-indigo-600 font-medium">{appointment.time} • {appointment.duration} min session</p>
                      <p className="text-xs text-gray-500">{appointment.notes}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(appointment.status)}`}>
                    {appointment.status === 'confirmed' ? '✅ Confirmed' : 
                     appointment.status === 'pending' ? '⏳ Pending' : appointment.status}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="mt-6">
              <Button 
                variant="outline" 
                className="w-full border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                onClick={() => window.location.href = '/professional/consultations'}
              >
                View All Consultations
              </Button>
            </div>
          </Card>

          {/* Patient Care Requests */}
          <Card className="p-6 bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  New Care Requests
                </h2>
                <p className="text-gray-600 text-sm">Patients seeking your expertise</p>
              </div>
              <span className="text-sm text-purple-600 bg-purple-100 px-3 py-1 rounded-full font-medium">
                {mockRequests.filter(r => r.status === 'pending').length} awaiting response
              </span>
            </div>
            
            <div className="space-y-4">
              {mockRequests.map((request) => (
                <div key={request.id} className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white shadow-lg">
                        <span className="text-sm">👤</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{request.clientName}</p>
                        <span className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded-full font-medium">
                          {request.requestType === 'booking' ? '📅 Session Booking' : '💬 Consultation'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mb-4 italic">"{request.message}"</p>
                  <div className="flex space-x-3">
                    <Button 
                      size="sm"
                      onClick={() => handleRequestAction(request.id, 'accept')}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white flex-1"
                    >
                      ✅ Accept Care Request
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleRequestAction(request.id, 'decline')}
                      className="border-rose-300 text-rose-600 hover:bg-rose-50 flex-1"
                    >
                      ❌ Decline
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-6">
              <Button variant="outline" className="w-full border-purple-200 text-purple-600 hover:bg-purple-50">
                View All Care Requests
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}