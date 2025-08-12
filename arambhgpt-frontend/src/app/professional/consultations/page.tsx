'use client';

import React, { useState, useEffect } from 'react';
// Remove AuthGuard import since we'll handle professional auth directly
import { Button, Card, LoadingSpinner } from '@/components/ui';
import { ConsultationInterface } from '@/components/professional/ConsultationInterface';
import { VideoCallInterface } from '@/components/video/VideoCallInterface';
import { useProfessional } from '@/hooks/useProfessional';

interface ConsultationSession {
  id: string;
  type: 'chat' | 'voice' | 'video';
  professionalId: string;
  professionalName: string;
  patientId: string;
  patientName: string;
  patientEmail?: string;
  startTime: string;
  duration: number;
  status: 'scheduled' | 'waiting' | 'active' | 'completed' | 'cancelled';
  rate: number;
  notes?: string;
  issue?: string;
}

export default function ProfessionalConsultationsPage() {
  const { professional, loading, isAuthenticated } = useProfessional();
  const [sessions, setSessions] = useState<ConsultationSession[]>([]);
  const [activeSession, setActiveSession] = useState<ConsultationSession | null>(null);
  const [filter, setFilter] = useState<'all' | 'scheduled' | 'active' | 'completed'>('all');

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    // Mock data - replace with actual API call
    const mockSessions: ConsultationSession[] = [
      {
        id: '1',
        type: 'video',
        professionalId: professional?.id || 'prof1',
        professionalName: professional?.name || 'Dr. Priya Sharma',
        patientId: 'patient1',
        patientName: 'Rahul Kumar',
        patientEmail: 'rahul@example.com',
        startTime: new Date().toISOString(),
        duration: 60,
        status: 'waiting',
        rate: 1200,
        issue: 'Anxiety and stress management'
      },
      {
        id: '2',
        type: 'chat',
        professionalId: professional?.id || 'prof1',
        professionalName: professional?.name || 'Dr. Priya Sharma',
        patientId: 'patient2',
        patientName: 'Priya Singh',
        patientEmail: 'priya@example.com',
        startTime: new Date(Date.now() + 3600000).toISOString(),
        duration: 30,
        status: 'scheduled',
        rate: 500,
        issue: 'Depression and mood swings'
      },
      {
        id: '3',
        type: 'voice',
        professionalId: professional?.id || 'prof1',
        professionalName: professional?.name || 'Dr. Priya Sharma',
        patientId: 'patient3',
        patientName: 'Amit Patel',
        patientEmail: 'amit@example.com',
        startTime: new Date(Date.now() - 3600000).toISOString(),
        duration: 45,
        status: 'completed',
        rate: 800,
        issue: 'Work-related stress'
      }
    ];

    setSessions(mockSessions);
  };

  const handleStartSession = (session: ConsultationSession) => {
    setActiveSession({ ...session, status: 'active' });
  };

  const handleEndSession = () => {
    if (activeSession) {
      setSessions(prev =>
        prev.map(s =>
          s.id === activeSession.id
            ? { ...s, status: 'completed' }
            : s
        )
      );
    }
    setActiveSession(null);
  };

  const handleSessionUpdate = (updatedSession: ConsultationSession) => {
    setSessions(prev =>
      prev.map(s =>
        s.id === updatedSession.id ? updatedSession : s
      )
    );
  };

  const filteredSessions = sessions.filter(session =>
    filter === 'all' || session.status === filter
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'waiting': return 'bg-yellow-100 text-yellow-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'chat': return '💬';
      case 'voice': return '🎤';
      case 'video': return '📹';
      default: return '💬';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated || !professional) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
        <Card className="p-8 text-center max-w-md">
          <div className="w-20 h-20 mx-auto bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center mb-6">
            <span className="text-3xl">🔒</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Professional Access Required</h2>
          <p className="text-gray-600 mb-6">Please sign in as a healthcare professional to access consultations.</p>
          <Button
            onClick={() => window.location.href = '/professional/signin'}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            Professional Sign In
          </Button>
        </Card>
      </div>
    );
  }

  // Active consultation view
  if (activeSession) {
    if (activeSession.type === 'video') {
      return (
        <VideoCallInterface
          sessionId={activeSession.id}
          isHost={true}
          onEndCall={handleEndSession}
        />
      );
    }

    return (
      <ConsultationInterface
        session={activeSession}
        onEndSession={handleEndSession}
        onSessionUpdate={handleSessionUpdate}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Consultations</h1>
          <p className="text-gray-600">Manage your patient consultations and sessions</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Today's Sessions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {sessions.filter(s =>
                    new Date(s.startTime).toDateString() === new Date().toDateString()
                  ).length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">⏳</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Waiting</p>
                <p className="text-2xl font-bold text-gray-900">
                  {sessions.filter(s => s.status === 'waiting').length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">✅</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {sessions.filter(s => s.status === 'completed').length}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Today's Earnings</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{sessions
                    .filter(s =>
                      new Date(s.startTime).toDateString() === new Date().toDateString() &&
                      s.status === 'completed'
                    )
                    .reduce((sum, s) => sum + s.rate, 0)
                  }
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { key: 'all', label: 'All Sessions' },
                { key: 'scheduled', label: 'Scheduled' },
                { key: 'active', label: 'Active' },
                { key: 'completed', label: 'Completed' }
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key as any)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${filter === key
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                >
                  {label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Sessions List */}
        <div className="space-y-4">
          {filteredSessions.length === 0 ? (
            <Card className="p-8 text-center">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No sessions found</h3>
              <p className="text-gray-600">
                {filter === 'all'
                  ? 'You have no consultations scheduled yet.'
                  : `No ${filter} sessions at the moment.`
                }
              </p>
            </Card>
          ) : (
            filteredSessions.map((session) => (
              <Card key={session.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-lg font-bold">
                        {session.patientName.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {session.patientName}
                        </h3>
                        <span className="text-2xl">{getTypeIcon(session.type)}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                          {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
                        </span>
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        {session.patientEmail && <span>📧 {session.patientEmail}</span>}
                        <span>⏰ {new Date(session.startTime).toLocaleString()}</span>
                        <span>⏱️ {session.duration} mins</span>
                        <span>💰 ₹{session.rate}</span>
                      </div>

                      {session.issue && (
                        <p className="text-sm text-gray-700 mt-2">
                          <span className="font-medium">Issue:</span> {session.issue}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {session.status === 'waiting' && (
                      <Button
                        onClick={() => handleStartSession(session)}
                        className="bg-green-500 hover:bg-green-600 text-white"
                      >
                        Start Session
                      </Button>
                    )}

                    {session.status === 'scheduled' && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          // Handle reschedule
                          alert('Reschedule feature coming soon!');
                        }}
                      >
                        Reschedule
                      </Button>
                    )}

                    {session.status === 'completed' && (
                      <Button
                        variant="outline"
                        onClick={() => {
                          // View session notes
                          alert('Session notes feature coming soon!');
                        }}
                      >
                        View Notes
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}