'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Message, ChatResponse } from '@/types';
import { MessageBubble } from './MessageBubble';
import { ChatInput, ChatInputRef } from './ChatInput';

import { LoadingSpinner, ErrorMessage, Button } from '@/components/ui';
import { useAIContext } from '@/hooks';
import { apiClient } from '@/lib/api';

interface ChatInterfaceProps {
  conversationId?: string;
  onNewConversation?: (conversation: any) => void;
  className?: string;
  showHeader?: boolean;
  mobileOptimized?: boolean;
}

export function ChatInterface({
  conversationId,
  onNewConversation,
  className = '',
  showHeader = true,
  mobileOptimized = false
}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<ChatInputRef>(null);
  const { getPersonalizedPrompt, analyzeMessage, updateContext } = useAIContext();

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Global keyboard shortcut to focus input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Focus input when user starts typing (but not on special keys)
      if (!e.ctrlKey && !e.metaKey && !e.altKey && 
          e.key.length === 1 && 
          document.activeElement?.tagName !== 'INPUT' && 
          document.activeElement?.tagName !== 'TEXTAREA' &&
          chatInputRef.current) {
        chatInputRef.current.focus();
      }
      
      // Focus input on '/' key
      if (e.key === '/' && 
          document.activeElement?.tagName !== 'INPUT' && 
          document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        if (chatInputRef.current) {
          chatInputRef.current.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Load conversation messages if conversationId is provided
  useEffect(() => {
    if (conversationId) {
      loadConversationMessages(conversationId);
    } else {
      // Show welcome message for new conversations
      setMessages([
        {
          id: 'welcome',
          content: `Hey! Main Honey hun, tumhara AI friend. 

Main yahan hun tumhari baat sunne ke liye. Tum jo bhi feel kar rahe ho, jo bhi mind mein hai - share kar sakte ho. Hindi, English, Hinglish - jo comfortable lage use karo.

Kaise ho? Kya chal raha hai aaj?`,
          sender: 'ai',
          ai_provider: 'system',
          created_at: new Date().toISOString(),
        },
      ]);
    }
  }, [conversationId]);

  const loadConversationMessages = async (id: string) => {
    try {
      setIsInitialLoading(true);
      setError(null);
      const conversation = await apiClient.getConversation(id);
      setMessages(conversation.messages);
    } catch (err) {
      console.error('Failed to load conversation:', err);
      setError('Failed to load conversation. Please try again.');
    } finally {
      setIsInitialLoading(false);
    }
  };

  const handleVoiceMessage = async (audioBlob: Blob) => {
    // For now, show a placeholder message for voice
    // In future, we can add speech-to-text conversion
    const voiceMessage = "🎤 Voice message (Speech-to-text coming soon!)";
    await handleSendMessage(voiceMessage);
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return;

    // Create user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content,
      sender: 'user',
      created_at: new Date().toISOString(),
    };

    // Add user message to chat
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      // Analyze message and get personalized prompt
      const analysis = await analyzeMessage(content);
      const personalizedPrompt = await getPersonalizedPrompt(content);

      // Send personalized message to AI
      const response: ChatResponse = await apiClient.sendMessage(personalizedPrompt);

      // Create AI response message
      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        content: response.response,
        sender: 'ai',
        ai_provider: response.ai_provider,
        created_at: new Date().toISOString(),
      };

      // Add AI response to chat
      setMessages(prev => [...prev, aiMessage]);

      // Auto-focus input after AI response
      setTimeout(() => {
        if (chatInputRef.current) {
          chatInputRef.current.focus();
        }
      }, 100);

      // If this is a new conversation, create it in the backend
      if (!conversationId && onNewConversation) {
        try {
          const conversation = await apiClient.createConversation();

          // Save both messages to the conversation
          await apiClient.addMessageToConversation(conversation.id, {
            content: userMessage.content,
            sender: 'user',
          });

          await apiClient.addMessageToConversation(conversation.id, {
            content: aiMessage.content,
            sender: 'ai',
            ai_provider: response.ai_provider,
          });

          onNewConversation(conversation);
        } catch (saveError) {
          console.error('Failed to save conversation:', saveError);
          // Continue with chat even if saving fails
        }
      } else if (conversationId) {
        // Save messages to existing conversation
        try {
          await apiClient.addMessageToConversation(conversationId, {
            content: userMessage.content,
            sender: 'user',
          });

          await apiClient.addMessageToConversation(conversationId, {
            content: aiMessage.content,
            sender: 'ai',
            ai_provider: response.ai_provider,
          });
        } catch (saveError) {
          console.error('Failed to save messages:', saveError);
          // Continue with chat even if saving fails
        }
      }
      // }

    } catch (err) {
      console.error('Failed to send message:', err);
      setError('Failed to send message. Please try again.');

      // Remove the user message if sending failed
      setMessages(prev => prev.filter(msg => msg.id !== userMessage.id));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setError(null);
    // Get the last user message and resend it
    const lastUserMessage = messages.filter(msg => msg.sender === 'user').pop();
    if (lastUserMessage) {
      handleSendMessage(lastUserMessage.content);
    }
  };

  if (isInitialLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading conversation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full ${className} relative`}>
      {/* Messages area with beautiful lotus-themed design */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto cursor-text relative"
        style={{ scrollBehavior: 'smooth' }}
        onClick={(e) => {
          // Focus input when clicking in chat area (but not on interactive elements)
          const target = e.target as HTMLElement;
          if (!target.closest('button') && !target.closest('a') && !target.closest('input') && !target.closest('textarea')) {
            if (chatInputRef.current) {
              chatInputRef.current.focus();
            }
          }
        }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-br from-teal-400 to-orange-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-32 right-32 w-40 h-40 bg-gradient-to-br from-coral-400 to-teal-400 rounded-full blur-3xl"></div>
        </div>

        <div className="w-full max-w-4xl mx-auto px-4 py-8 relative z-10">
          {/* Welcome Section for New Chats */}
          {messages.length === 1 && messages[0].id === 'welcome' && (
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-teal-500 to-orange-500 rounded-full mb-6 shadow-xl">
                <span className="text-3xl">🪷</span>
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-orange-600 bg-clip-text text-transparent mb-4">
                Welcome to ArambhGPT
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Your personal AI wellness companion. Share your thoughts, feelings, and experiences in Hindi, English, or Hinglish.
              </p>
              
              {/* Quick Start Suggestions */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                <button
                  onClick={() => {
                    handleSendMessage("मैं आज थोड़ा परेशान हूं");
                    setTimeout(() => chatInputRef.current?.focus(), 500);
                  }}
                  className="p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-teal-200 hover:border-teal-300 hover:bg-white/90 transition-all duration-300 text-left group"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">😔</span>
                    <div>
                      <p className="font-medium text-gray-800">मैं आज थोड़ा परेशान हूं</p>
                      <p className="text-sm text-gray-600">Share your feelings</p>
                    </div>
                  </div>
                </button>
                
                <button
                  onClick={() => {
                    handleSendMessage("I need some motivation today");
                    setTimeout(() => chatInputRef.current?.focus(), 500);
                  }}
                  className="p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-orange-200 hover:border-orange-300 hover:bg-white/90 transition-all duration-300 text-left group"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">💪</span>
                    <div>
                      <p className="font-medium text-gray-800">I need motivation</p>
                      <p className="text-sm text-gray-600">Get inspired</p>
                    </div>
                  </div>
                </button>
                
                <button
                  onClick={() => {
                    handleSendMessage("Can you help me with stress management?");
                    setTimeout(() => chatInputRef.current?.focus(), 500);
                  }}
                  className="p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-coral-200 hover:border-coral-300 hover:bg-white/90 transition-all duration-300 text-left group"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">🧘</span>
                    <div>
                      <p className="font-medium text-gray-800">Stress management</p>
                      <p className="text-sm text-gray-600">Find peace</p>
                    </div>
                  </div>
                </button>
                
                <button
                  onClick={() => {
                    handleSendMessage("मुझे किसी से बात करनी है");
                    setTimeout(() => chatInputRef.current?.focus(), 500);
                  }}
                  className="p-4 bg-white/80 backdrop-blur-sm rounded-xl border border-teal-200 hover:border-teal-300 hover:bg-white/90 transition-all duration-300 text-left group"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">💬</span>
                    <div>
                      <p className="font-medium text-gray-800">मुझे बात करनी है</p>
                      <p className="text-sm text-gray-600">Let's talk</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="space-y-6">
            {messages.map((message, index) => (
              <div key={message.id} className="group w-full">
                {/* Hide welcome message after first user message */}
                {!(message.id === 'welcome' && messages.length > 1) && (
                  <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                    <div className={`max-w-[85%] md:max-w-[70%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                      <MessageBubble
                        message={message}
                        isUser={message.sender === 'user'}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Enhanced Typing indicator */}
          {isLoading && (
            <div className="w-full flex justify-start mt-6">
              <div className="max-w-[80%] md:max-w-[60%]">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl rounded-bl-md px-6 py-4 shadow-lg border border-teal-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">🪷</span>
                    </div>
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-teal-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-coral-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm text-gray-600 font-medium">ArambhGPT is thinking...</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Error message */}
          {error && (
            <div className="w-full mt-6">
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <span className="text-red-500 text-xl">⚠️</span>
                  <div className="flex-1">
                    <p className="text-red-800 font-medium">Something went wrong</p>
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                  <button
                    onClick={handleRetry}
                    className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-medium transition-colors"
                  >
                    Retry
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Scroll anchor */}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Enhanced Input area */}
      <div className="border-t border-teal-200 bg-white/90 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <ChatInput
            ref={chatInputRef}
            onSendMessage={handleSendMessage}
            onVoiceMessage={handleVoiceMessage}
            isLoading={isLoading}
            disabled={!!error}
          />
        </div>
      </div>
    </div>
  );
}