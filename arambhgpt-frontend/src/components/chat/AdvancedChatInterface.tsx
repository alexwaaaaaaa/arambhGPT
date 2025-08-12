'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface Message {
  id: string;
  content: string;
  sender: 'professional' | 'patient';
  timestamp: Date;
  type: 'text' | 'image' | 'document' | 'voice' | 'video';
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  isRead?: boolean;
}

interface AdvancedChatProps {
  patientId: string;
  patientName: string;
  professionalName: string;
  isActive: boolean;
  onClose: () => void;
  onStartVideoCall: () => void;
  onStartVoiceCall: () => void;
}

export function AdvancedChatInterface({
  patientId,
  patientName,
  professionalName,
  isActive,
  onClose,
  onStartVideoCall,
  onStartVoiceCall
}: AdvancedChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: `Hello ${patientName}, I'm ${professionalName}. How are you feeling today?`,
      sender: 'professional',
      timestamp: new Date(Date.now() - 300000),
      type: 'text',
      isRead: true
    },
    {
      id: '2',
      content: 'Hi Doctor, I\'ve been feeling quite anxious lately. I wanted to share some documents with you.',
      sender: 'patient',
      timestamp: new Date(Date.now() - 240000),
      type: 'text',
      isRead: true
    }
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const recordingIntervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isRecording) {
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
      setRecordingTime(0);
    }

    return () => {
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
    };
  }, [isRecording]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = (content: string, type: 'text' | 'image' | 'document' | 'voice' = 'text', fileData?: any) => {
    if (!content.trim() && type === 'text') return;

    const newMsg: Message = {
      id: Date.now().toString(),
      content: content || fileData?.name || 'File shared',
      sender: 'professional',
      timestamp: new Date(),
      type,
      fileUrl: fileData?.url,
      fileName: fileData?.name,
      fileSize: fileData?.size,
      isRead: false
    };

    setMessages(prev => [...prev, newMsg]);
    setNewMessage('');
    
    // Simulate patient response
    if (type === 'text') {
      setIsTyping(true);
      setTimeout(() => {
        const responses = [
          "Thank you for your message. That's very helpful.",
          "I understand. Can you tell me more about that?",
          "That makes sense. How long have you been experiencing this?",
          "I appreciate you sharing that with me. Let's work through this together.",
          "That's a great insight. How do you feel about trying some coping strategies?"
        ];

        const patientResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: responses[Math.floor(Math.random() * responses.length)],
          sender: 'patient',
          timestamp: new Date(),
          type: 'text',
          isRead: false
        };

        setMessages(prev => [...prev, patientResponse]);
        setIsTyping(false);
      }, 2000);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'document' | 'image') => {
    const file = event.target.files?.[0];
    if (file) {
      const fileData = {
        name: file.name,
        size: file.size,
        url: URL.createObjectURL(file)
      };
      sendMessage('', type, fileData);
    }
  };

  const startVoiceRecording = () => {
    setIsRecording(true);
    // In real implementation, start actual voice recording
  };

  const stopVoiceRecording = () => {
    setIsRecording(false);
    // In real implementation, stop recording and send voice message
    const voiceData = {
      name: `Voice message ${recordingTime}s`,
      size: recordingTime * 1000,
      url: '#'
    };
    sendMessage('', 'voice', voiceData);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const emojis = ['😊', '😢', '😰', '😡', '😴', '🤔', '👍', '👎', '❤️', '🙏'];

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            ←
          </button>
          <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
            {patientName.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{patientName}</h3>
            <div className="flex items-center space-x-2 text-sm">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-gray-600">Online</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            onClick={onStartVoiceCall}
            className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-full"
          >
            📞
          </Button>
          <Button
            onClick={onStartVideoCall}
            className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full"
          >
            🎥
          </Button>
          <Button className="p-2 hover:bg-gray-100 rounded-full">
            ⋮
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'professional' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-xs lg:max-w-md ${
              message.sender === 'professional'
                ? 'bg-teal-600 text-white'
                : 'bg-white text-gray-900 border border-gray-200'
            } rounded-lg p-3 shadow-sm`}>
              
              {/* Text Message */}
              {message.type === 'text' && (
                <p className="text-sm">{message.content}</p>
              )}

              {/* Image Message */}
              {message.type === 'image' && (
                <div>
                  <img 
                    src={message.fileUrl} 
                    alt={message.fileName}
                    className="rounded-lg max-w-full h-auto mb-2"
                  />
                  <p className="text-xs opacity-75">{message.fileName}</p>
                </div>
              )}

              {/* Document Message */}
              {message.type === 'document' && (
                <div className="flex items-center space-x-3 p-2 bg-black/10 rounded-lg">
                  <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xs">📄</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{message.fileName}</p>
                    <p className="text-xs opacity-75">{formatFileSize(message.fileSize || 0)}</p>
                  </div>
                  <button className="text-xs underline">Download</button>
                </div>
              )}

              {/* Voice Message */}
              {message.type === 'voice' && (
                <div className="flex items-center space-x-3 p-2">
                  <button className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">▶️</span>
                  </button>
                  <div className="flex-1">
                    <div className="w-full bg-black/20 rounded-full h-1">
                      <div className="bg-white h-1 rounded-full" style={{ width: '30%' }}></div>
                    </div>
                    <p className="text-xs opacity-75 mt-1">{message.fileName}</p>
                  </div>
                </div>
              )}

              {/* Timestamp */}
              <div className="flex items-center justify-between mt-2">
                <p className={`text-xs ${
                  message.sender === 'professional' ? 'text-teal-100' : 'text-gray-500'
                }`}>
                  {formatTime(message.timestamp)}
                </p>
                {message.sender === 'professional' && (
                  <span className="text-xs text-teal-100">
                    {message.isRead ? '✓✓' : '✓'}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
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

      {/* Voice Recording Overlay */}
      {isRecording && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
          <div className="bg-white rounded-lg p-6 text-center">
            <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
              <span className="text-white text-2xl">🎤</span>
            </div>
            <p className="text-lg font-semibold mb-2">Recording...</p>
            <p className="text-2xl font-mono text-red-500 mb-4">{formatRecordingTime(recordingTime)}</p>
            <div className="flex space-x-3">
              <Button
                onClick={stopVoiceRecording}
                className="bg-green-600 hover:bg-green-700 text-white px-6"
              >
                Send
              </Button>
              <Button
                onClick={() => setIsRecording(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="absolute bottom-20 left-4 bg-white border border-gray-200 rounded-lg p-3 shadow-lg">
          <div className="grid grid-cols-5 gap-2">
            {emojis.map((emoji, index) => (
              <button
                key={index}
                onClick={() => {
                  setNewMessage(prev => prev + emoji);
                  setShowEmojiPicker(false);
                }}
                className="text-2xl hover:bg-gray-100 rounded p-1"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <div className="flex items-center space-x-3">
          {/* Attachment Button */}
          <div className="relative">
            <button 
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
              onClick={() => fileInputRef.current?.click()}
            >
              📎
            </button>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".pdf,.doc,.docx,.txt"
              onChange={(e) => handleFileUpload(e, 'document')}
            />
          </div>

          {/* Image Button */}
          <button 
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
            onClick={() => imageInputRef.current?.click()}
          >
            🖼️
          </button>
          <input
            ref={imageInputRef}
            type="file"
            className="hidden"
            accept="image/*"
            onChange={(e) => handleFileUpload(e, 'image')}
          />

          {/* Emoji Button */}
          <button 
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            😊
          </button>

          {/* Text Input */}
          <div className="flex-1">
            <Input
              value={newMessage}
              onChange={setNewMessage}
              placeholder="Type your message..."
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(newMessage);
                }
              }}
            />
          </div>

          {/* Voice/Send Button */}
          {newMessage.trim() ? (
            <Button
              onClick={() => sendMessage(newMessage)}
              className="bg-teal-600 hover:bg-teal-700 text-white px-4"
            >
              Send
            </Button>
          ) : (
            <button
              onMouseDown={startVoiceRecording}
              onMouseUp={stopVoiceRecording}
              onTouchStart={startVoiceRecording}
              onTouchEnd={stopVoiceRecording}
              className="p-2 bg-teal-600 hover:bg-teal-700 text-white rounded-full"
            >
              🎤
            </button>
          )}
        </div>
        
        <div className="mt-2 text-xs text-gray-500 text-center">
          🔒 End-to-end encrypted • Professional consultation in progress
        </div>
      </div>
    </div>
  );
}