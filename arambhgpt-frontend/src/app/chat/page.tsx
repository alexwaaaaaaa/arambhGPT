'use client';

import React from 'react';
import { AuthGuard } from '@/components/auth';
import { ChatInterface } from '@/components/chat/ChatInterface';

export default function ChatPage() {
  return (
    <AuthGuard>
      {/* Simple Chat Interface without sidebar */}
      <div className="h-[calc(100vh-4rem)] bg-gradient-to-br from-teal-50 via-orange-50 to-coral-50 relative overflow-hidden">

        {/* Decorative Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Floating Lotus Petals */}
          <div className="absolute top-10 left-10 w-20 h-20 bg-gradient-to-br from-teal-200 to-teal-300 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute top-32 right-20 w-16 h-16 bg-gradient-to-br from-orange-200 to-orange-300 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-20 left-32 w-24 h-24 bg-gradient-to-br from-coral-200 to-coral-300 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-40 right-10 w-12 h-12 bg-gradient-to-br from-teal-300 to-orange-300 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '0.5s' }}></div>

          {/* Subtle Pattern Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        </div>

        {/* Main Chat Area - Full Width */}
        <div className="flex flex-col h-full relative z-10">
          {/* Chat Header */}
          <div className="bg-white/90 backdrop-blur-sm border-b border-teal-200 px-4 py-3 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {/* ArambhGPT Logo & Title */}
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white text-lg font-bold">🪷</span>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-teal-600 to-orange-600 bg-clip-text text-transparent">
                      ArambhGPT
                    </h1>
                    <p className="text-sm text-gray-600">Your AI Wellness Companion</p>
                  </div>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center space-x-2 bg-emerald-50 px-3 py-2 rounded-full border border-emerald-200">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-emerald-700">Online</span>
              </div>
            </div>
          </div>

          {/* Chat Interface - Full Width */}
          <div className="flex-1 relative">
            <ChatInterface
              className="h-full"
            />
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}