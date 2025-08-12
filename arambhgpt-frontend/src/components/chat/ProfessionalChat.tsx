'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Card, Button, Input, LoadingSpinner } from '@/components/ui';

interface Message {
  id: string;
  sender: 'professional' | 'client';
  content: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file';
}

interface ProfessionalChatProps {
  clientId: string;
  clientName: string;
  sessionId: string;
  onEndSession?: () => void;
}

export function ProfessionalChat({ 
  clientId, 
  clientName, 
  sessionId, 
  onEndSession 
}: ProfessionalChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'client',
      content: 'Hello doctor, I\'ve been feeling very anxious lately and need some guidance.',
      timestamp: new Date(Date.now() - 300000),
      type: 'text'
    },
    {
      id: '2',
      sender: 'professional',
      content: 'Hello! I understand you\'re experiencing anxiety. Can you tell me more about when these feelings started and what might be triggering them?',
      timestamp: new Date(Date.now() - 240000),
      type: 'text'
    },
    {
      id: '3',
      sender: 'client',
      content: 'It started about 2 weeks ago when I got a new job. I keep worrying about making mistakes.',
      timestamp: new Date(Date.now() - 180000),
      type: 'text'
    }
  ]);
  
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [sessionTime, setSessionTime] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Session timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSessionTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      sender: 'professional',
      content: newMessage,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');

    // Simulate client typing
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      // Add a mock client response
      const clientResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'client',
        content: 'Thank you for your advice. That makes sense.',
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, clientResponse]);
    }, 2000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-lg">👤</span>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{clientName}</h3>
              <p className="text-sm text-gray-600">Session ID: {sessionId}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              Session Time: <span className="font-mono font-medium">{formatTime(sessionTime)}</span>
            </div>
            <Button size="sm" variant="outline">
              📞 Voice Call
            </Button>
            <Button size="sm" variant="outline">
              🎥 Video Call
            </Button>
            <Button size="sm" variant="outline" onClick={onEndSession}>
              End Session
            </Button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'professional' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.sender === 'professional'
                  ? 'bg-teal-600 text-white'
                  : 'bg-white text-gray-900 border border-gray-200'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p className={`text-xs mt-1 ${
                message.sender === 'professional' ? 'text-teal-100' : 'text-gray-500'
              }`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-900 border border-gray-200 px-4 py-2 rounded-lg">
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

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-center space-x-3">
          <Button size="sm" variant="outline">
            📎
          </Button>
          <div className="flex-1">
            <Input
              value={newMessage}
              onChange={(value) => setNewMessage(value)}
              placeholder="Type your message..."
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            />
          </div>
          <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
            Send
          </Button>
        </div>
      </div>

      {/* Session Notes Panel */}
      <div className="bg-gray-100 border-t border-gray-200 p-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm font-medium text-gray-900">Session Notes</h4>
          <Button size="sm" variant="outline">
            Save Notes
          </Button>
        </div>
        <textarea
          className="w-full h-20 p-2 text-sm border border-gray-300 rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-teal-500"
          placeholder="Add your session notes here..."
        />
      </div>
    </div>
  );
}