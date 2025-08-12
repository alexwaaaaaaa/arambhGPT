'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button, Card, Input } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';
import { useProfessional } from '@/hooks/useProfessional';

interface Message {
  id: string;
  senderId: string;
  senderType: 'patient' | 'expert';
  senderName: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file';
  status: 'sent' | 'delivered' | 'read';
}

interface ChatSession {
  id: string;
  patientId: string;
  patientName: string;
  expertId: string;
  expertName: string;
  sessionType: 'chat' | 'voice' | 'video';
  status: 'active' | 'ended' | 'scheduled';
  startTime: Date;
  duration: number; // in minutes
  rate: number; // per minute
  totalCost: number;
}

interface PatientExpertChatProps {
  sessionId: string;
  isExpert?: boolean;
}

export function PatientExpertChat({ sessionId, isExpert = false }: PatientExpertChatProps) {
  const { user } = useAuth();
  const { professional } = useProfessional();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [session, setSession] = useState<ChatSession | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [sessionTimer, setSessionTimer] = useState(0);

  // Mock session data
  useEffect(() => {
    const mockSession: ChatSession = {
      id: sessionId,
      patientId: 'patient_123',
      patientName: 'Rahul Sharma',
      expertId: 'prof_priya_001',
      expertName: 'Dr. Priya Sharma',
      sessionType: 'chat',
      status: 'active',
      startTime: new Date(),
      duration: 0,
      rate: isExpert ? (professional?.chat_rate || 500) : 500,
      totalCost: 0
    };
    setSession(mockSession);
    setConnectionStatus('connected');

    // Mock messages
    const mockMessages: Message[] = [
      {
        id: '1',
        senderId: isExpert ? 'patient_123' : 'prof_priya_001',
        senderType: isExpert ? 'patient' : 'expert',
        senderName: isExpert ? 'Rahul Sharma' : 'Dr. Priya Sharma',
        content: isExpert 
          ? 'Hello Doctor, I have been feeling very anxious lately. Can you help me?'
          : 'Hello Rahul! I understand you\'re feeling anxious. I\'m here to help. Can you tell me more about when these feelings started?',
        timestamp: new Date(Date.now() - 300000),
        type: 'text',
        status: 'read'
      },
      {
        id: '2',
        senderId: isExpert ? 'prof_priya_001' : 'patient_123',
        senderType: isExpert ? 'expert' : 'patient',
        senderName: isExpert ? 'Dr. Priya Sharma' : 'Rahul Sharma',
        content: isExpert
          ? 'Hello Rahul! I understand you\'re feeling anxious. I\'m here to help. Can you tell me more about when these feelings started?'
          : 'It started about 2 weeks ago. I have been having trouble sleeping and concentrating at work.',
        timestamp: new Date(Date.now() - 240000),
        type: 'text',
        status: 'read'
      }
    ];
    setMessages(mockMessages);
  }, [sessionId, isExpert, professional]);

  // Session timer
  useEffect(() => {
    if (session?.status === 'active') {
      const timer = setInterval(() => {
        setSessionTimer(prev => prev + 1);
      }, 60000); // Update every minute

      return () => clearInterval(timer);
    }
  }, [session]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!newMessage.trim() || !session) return;

    const message: Message = {
      id: Date.now().toString(),
      senderId: isExpert ? (professional?.id || 'expert') : (user?.id || 'patient'),
      senderType: isExpert ? 'expert' : 'patient',
      senderName: isExpert ? (professional?.name || 'Expert') : (user?.name || 'Patient'),
      content: newMessage.trim(),
      timestamp: new Date(),
      type: 'text',
      status: 'sent'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulate typing indicator
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      // Simulate response (in real app, this would come from WebSocket)
      if (isExpert) {
        // Patient response simulation
        const patientResponse: Message = {
          id: (Date.now() + 1).toString(),
          senderId: 'patient_123',
          senderType: 'patient',
          senderName: 'Rahul Sharma',
          content: 'Thank you for understanding. That helps a lot.',
          timestamp: new Date(),
          type: 'text',
          status: 'sent'
        };
        setTimeout(() => setMessages(prev => [...prev, patientResponse]), 2000);
      } else {
        // Expert response simulation
        const expertResponse: Message = {
          id: (Date.now() + 1).toString(),
          senderId: 'prof_priya_001',
          senderType: 'expert',
          senderName: 'Dr. Priya Sharma',
          content: 'I understand how difficult this must be for you. Let\'s work through this together. Have you noticed any specific triggers?',
          timestamp: new Date(),
          type: 'text',
          status: 'sent'
        };
        setTimeout(() => setMessages(prev => [...prev, expertResponse]), 3000);
      }
    }, 1500);
  };

  const endSession = () => {
    if (session) {
      const updatedSession = {
        ...session,
        status: 'ended' as const,
        duration: sessionTimer,
        totalCost: sessionTimer * session.rate
      };
      setSession(updatedSession);
      alert(`Session ended. Duration: ${sessionTimer} minutes. Total cost: ₹${updatedSession.totalCost}`);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!session) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <Card className="p-4 rounded-none border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-lg">
                {isExpert ? '👤' : '👨‍⚕️'}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                {isExpert ? session.patientName : session.expertName}
              </h3>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className={`w-2 h-2 rounded-full ${
                  connectionStatus === 'connected' ? 'bg-green-500' : 
                  connectionStatus === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'
                }`}></div>
                <span className="capitalize">{connectionStatus}</span>
                {session.status === 'active' && (
                  <>
                    <span>•</span>
                    <span>₹{session.rate}/min</span>
                  </>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {session.status === 'active' && (
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">
                  {formatTime(sessionTimer * 60)}
                </div>
                <div className="text-xs text-gray-500">
                  ₹{(sessionTimer * session.rate).toFixed(0)}
                </div>
              </div>
            )}
            
            <div className="flex space-x-2">
              <Button size="sm" variant="outline" className="text-green-600 border-green-300">
                📞 Voice
              </Button>
              <Button size="sm" variant="outline" className="text-blue-600 border-blue-300">
                📹 Video
              </Button>
              {session.status === 'active' && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="text-red-600 border-red-300"
                  onClick={endSession}
                >
                  End Session
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => {
          const isOwnMessage = isExpert ? message.senderType === 'expert' : message.senderType === 'patient';
          
          return (
            <div
              key={message.id}
              className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                isOwnMessage
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-gray-900 border'
              }`}>
                <div className="text-sm font-medium mb-1">
                  {message.senderName}
                </div>
                <div className="text-sm">
                  {message.content}
                </div>
                <div className={`text-xs mt-1 ${
                  isOwnMessage ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                  {isOwnMessage && (
                    <span className="ml-1">
                      {message.status === 'sent' && '✓'}
                      {message.status === 'delivered' && '✓✓'}
                      {message.status === 'read' && '✓✓'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border rounded-2xl px-4 py-2 max-w-xs">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      {session.status === 'active' && (
        <Card className="p-4 rounded-none border-t">
          <div className="flex space-x-2">
            <Input
              value={newMessage}
              onChange={setNewMessage}
              placeholder={`Type your message to ${isExpert ? session.patientName : session.expertName}...`}
              className="flex-1"
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            />
            <Button 
              onClick={sendMessage}
              disabled={!newMessage.trim()}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              Send
            </Button>
          </div>
          
          <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
            <div className="flex space-x-4">
              <button className="hover:text-blue-500">📎 Attach</button>
              <button className="hover:text-blue-500">😊 Emoji</button>
              <button className="hover:text-blue-500">🎤 Voice Note</button>
            </div>
            <div>
              Session rate: ₹{session.rate}/minute
            </div>
          </div>
        </Card>
      )}

      {session.status === 'ended' && (
        <Card className="p-4 rounded-none border-t bg-gray-100">
          <div className="text-center">
            <p className="text-gray-600 mb-2">Session ended</p>
            <p className="text-sm text-gray-500">
              Duration: {session.duration} minutes • Total: ₹{session.totalCost}
            </p>
            <div className="flex justify-center space-x-2 mt-3">
              <Button size="sm" variant="outline">
                📝 Leave Review
              </Button>
              <Button size="sm" variant="outline">
                📄 Download Transcript
              </Button>
              <Button size="sm" className="bg-blue-500 text-white">
                💳 Make Payment
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}