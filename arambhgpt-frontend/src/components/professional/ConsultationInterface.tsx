'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button, Card } from '@/components/ui';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { VideoCallInterface } from '@/components/video/VideoCallInterface';

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

interface ConsultationInterfaceProps {
  session: ConsultationSession;
  onEndSession: () => void;
  onSessionUpdate: (session: ConsultationSession) => void;
}

export function ConsultationInterface({ 
  session, 
  onEndSession, 
  onSessionUpdate 
}: ConsultationInterfaceProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [sessionNotes, setSessionNotes] = useState('');
  const [sessionDuration, setSessionDuration] = useState(0);
  const [isSessionActive, setIsSessionActive] = useState(session.status === 'active');
  
  const timerRef = useRef<NodeJS.Timeout>();
  const startTimeRef = useRef<Date>();

  useEffect(() => {
    if (isSessionActive) {
      startTimeRef.current = new Date();
      timerRef.current = setInterval(() => {
        if (startTimeRef.current) {
          const elapsed = Math.floor((Date.now() - startTimeRef.current.getTime()) / 1000);
          setSessionDuration(elapsed);
        }
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isSessionActive]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartSession = () => {
    setIsSessionActive(true);
    onSessionUpdate({ ...session, status: 'active' });
  };

  const handleEndSession = () => {
    setIsSessionActive(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    onSessionUpdate({ ...session, status: 'completed' });
    onEndSession();
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Implement recording logic here
  };

  const renderConsultationContent = () => {
    switch (session.type) {
      case 'chat':
        return (
          <div className="flex-1 flex flex-col">
            <ChatInterface
              conversationId={session.id}
              onNewConversation={() => {}}
              className="flex-1"
            />
          </div>
        );

      case 'voice':
        return (
          <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-teal-50 to-orange-50">
            <div className="text-center mb-8">
              <div className="w-32 h-32 bg-gradient-to-br from-teal-500 to-orange-500 rounded-full flex items-center justify-center mb-6 mx-auto shadow-xl">
                <span className="text-5xl">🎤</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Voice Consultation</h3>
              <p className="text-gray-600">High-quality audio consultation in progress</p>
            </div>

            {/* Voice Controls */}
            <div className="flex space-x-4 mb-8">
              <Button
                onClick={toggleRecording}
                className={`px-6 py-3 rounded-full ${
                  isRecording 
                    ? 'bg-red-500 hover:bg-red-600 text-white' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                }`}
              >
                {isRecording ? '⏹️ Stop Recording' : '🔴 Start Recording'}
              </Button>
              
              <Button
                variant="outline"
                className="px-6 py-3 rounded-full border-gray-300"
              >
                🔇 Mute
              </Button>
              
              <Button
                variant="outline"
                className="px-6 py-3 rounded-full border-gray-300"
              >
                📞 Hold
              </Button>
            </div>

            {/* Audio Visualizer Placeholder */}
            <div className="w-full max-w-md h-20 bg-white/80 rounded-lg flex items-center justify-center border border-teal-200">
              <div className="flex space-x-1">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-teal-400 rounded-full animate-pulse"
                    style={{
                      height: `${Math.random() * 40 + 10}px`,
                      animationDelay: `${i * 0.1}s`
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        );

      case 'video':
        return (
          <VideoCallInterface
            sessionId={session.id}
            isHost={true}
            onEndCall={handleEndSession}
          />
        );

      default:
        return <div>Unsupported consultation type</div>;
    }
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Session Header */}
      <div className="bg-gradient-to-r from-teal-500 to-orange-500 text-white px-6 py-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-2xl">
                {session.type === 'chat' ? '💬' : session.type === 'voice' ? '🎤' : '📹'}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-bold">
                {session.type.charAt(0).toUpperCase() + session.type.slice(1)} Consultation
              </h2>
              <p className="text-white/80">
                with {session.patientName} • ₹{session.rate}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            {/* Session Timer */}
            <div className="text-center">
              <div className="text-2xl font-bold">{formatDuration(sessionDuration)}</div>
              <div className="text-sm text-white/80">Duration</div>
            </div>

            {/* Session Status */}
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                isSessionActive ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'
              }`}></div>
              <span className="font-medium">
                {isSessionActive ? 'Active' : 'Waiting'}
              </span>
            </div>

            {/* Session Controls */}
            <div className="flex space-x-2">
              {!isSessionActive ? (
                <Button
                  onClick={handleStartSession}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
                >
                  Start Session
                </Button>
              ) : (
                <Button
                  onClick={handleEndSession}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                >
                  End Session
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Consultation Area */}
      <div className="flex-1 flex">
        {/* Consultation Content */}
        <div className="flex-1">
          {renderConsultationContent()}
        </div>

        {/* Session Notes Sidebar */}
        <div className="w-80 bg-gray-50 border-l border-gray-200 p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Session Notes</h3>
          
          {/* Patient Info */}
          <Card className="p-4 mb-4">
            <h4 className="font-medium text-gray-900 mb-2">Patient Information</h4>
            <div className="space-y-2 text-sm">
              <div><span className="font-medium">Name:</span> {session.patientName}</div>
              <div><span className="font-medium">Session Type:</span> {session.type}</div>
              <div><span className="font-medium">Duration:</span> {session.duration} mins</div>
              <div><span className="font-medium">Rate:</span> ₹{session.rate}</div>
            </div>
          </Card>

          {/* Notes Area */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Session Notes
            </label>
            <textarea
              value={sessionNotes}
              onChange={(e) => setSessionNotes(e.target.value)}
              placeholder="Add your session notes here..."
              rows={10}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm"
            />
          </div>

          {/* Quick Actions */}
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full text-sm"
              onClick={() => {
                // Implement prescription feature
                alert('Prescription feature coming soon!');
              }}
            >
              📝 Add Prescription
            </Button>
            
            <Button
              variant="outline"
              className="w-full text-sm"
              onClick={() => {
                // Implement follow-up scheduling
                alert('Follow-up scheduling coming soon!');
              }}
            >
              📅 Schedule Follow-up
            </Button>
            
            <Button
              variant="outline"
              className="w-full text-sm"
              onClick={() => {
                // Save notes
                alert('Notes saved successfully!');
              }}
            >
              💾 Save Notes
            </Button>
          </div>

          {/* Emergency Actions */}
          <Card className="p-3 mt-4 bg-red-50 border-red-200">
            <h4 className="font-medium text-red-900 mb-2 text-sm">Emergency Actions</h4>
            <Button
              className="w-full bg-red-500 hover:bg-red-600 text-white text-sm"
              onClick={() => {
                // Implement emergency protocol
                alert('Emergency protocol activated!');
              }}
            >
              🚨 Emergency Protocol
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}