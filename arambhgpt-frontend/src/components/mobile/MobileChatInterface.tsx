'use client';

import React, { useState, useEffect } from 'react';
import { ChatInterface, ChatSidebar } from '@/components/chat';
import { MoodQuickEntry } from '@/components/mood';
import { Button } from '@/components/ui';
import { useConversations } from '@/hooks';
import { ConversationSummary } from '@/types';

interface MobileChatInterfaceProps {
  className?: string;
}

export function MobileChatInterface({ className = '' }: MobileChatInterfaceProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentConversation, setCurrentConversation] = useState<ConversationSummary | null>(null);
  const { conversations } = useConversations();

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle conversation selection
  const handleConversationSelect = (conversationId: string) => {
    const conversation = conversations.find(conv => conv.id === conversationId);
    if (conversation) {
      setCurrentConversation(conversation);
    }
    setIsSidebarOpen(false);
  };

  // Handle new chat
  const handleNewChat = () => {
    setCurrentConversation(null);
    setIsSidebarOpen(false);
  };

  // Close sidebar when conversation changes on mobile
  useEffect(() => {
    if (isMobile && currentConversation) {
      setIsSidebarOpen(false);
    }
  }, [currentConversation, isMobile]);

  // Close sidebar on mobile when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isMobile && isSidebarOpen) {
        const sidebar = document.getElementById('mobile-sidebar');
        const toggleButton = document.getElementById('mobile-sidebar-toggle');

        if (sidebar && !sidebar.contains(event.target as Node) &&
          toggleButton && !toggleButton.contains(event.target as Node)) {
          setIsSidebarOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile, isSidebarOpen]);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isMobile && isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobile, isSidebarOpen]);

  if (!isMobile) {
    // Desktop layout - balanced design
    return (
      <div className={`flex h-screen bg-gray-50 ${className}`}>
        {/* Left Sidebar */}
        <ChatSidebar
          className="w-72 bg-white border-r border-gray-200 shadow-sm"
          activeConversationId={currentConversation?.id}
          onConversationSelect={handleConversationSelect}
          onNewChat={handleNewChat}
        />
        
        {/* Main Chat Area - Properly centered */}
        <div className="flex-1 flex justify-center bg-gray-50">
          <div className="w-full max-w-6xl bg-white shadow-sm relative">
            {/* Mood Quick Entry - Desktop */}
            <div className="absolute top-4 right-4 z-10">
              <MoodQuickEntry />
            </div>
            
            <ChatInterface
              className="h-full"
              conversationId={currentConversation?.id}
          onNewConversation={(conversation) => {
            // Convert Conversation to ConversationSummary format
            const conversationSummary: ConversationSummary = {
              id: conversation.id,
              title: conversation.title || 'New Chat',
              last_message_preview: conversation.messages[conversation.messages.length - 1]?.content || '',
              message_count: conversation.messages.length,
              created_at: conversation.created_at,
              updated_at: conversation.updated_at,
              is_archived: false,
              last_message_timestamp: ''
            };
            setCurrentConversation(conversationSummary);
          }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative h-screen overflow-hidden ${className}`}>
      {/* Mobile Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200 z-10 relative">
        <Button
          id="mobile-sidebar-toggle"
          variant="outline"
          size="sm"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="flex items-center space-x-2 flex-shrink-0"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span>Chats</span>
        </Button>

        <div className="flex-1 flex justify-center">
          <h1 className="text-lg font-semibold text-gray-900 text-center truncate px-4">
            {currentConversation?.title || 'ArambhGPT'}
          </h1>
        </div>

        <div className="w-20 flex-shrink-0"> {/* Spacer for balance */}</div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20">
          <div
            id="mobile-sidebar"
            className="absolute left-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-xl transform transition-transform duration-300 ease-in-out"
          >
            {/* Sidebar Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Conversations</h2>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsSidebarOpen(false)}
                className="p-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Button>
            </div>

            {/* Sidebar Content */}
            <div className="h-full overflow-hidden">
              <ChatSidebar
                className="h-full border-none"
                activeConversationId={currentConversation?.id}
                onConversationSelect={handleConversationSelect}
                onNewChat={handleNewChat}
              />
            </div>
          </div>
        </div>
      )}

      {/* Chat Interface */}
      <div className="h-full pt-0 relative">
        {/* Mood Quick Entry - Mobile */}
        <div className="absolute top-2 left-4 right-4 z-10">
          <MoodQuickEntry />
        </div>
        
        <ChatInterface
          className="h-full"
          conversationId={currentConversation?.id}
          showHeader={false}
          mobileOptimized={true}
          onNewConversation={(conversation) => {
            // Convert Conversation to ConversationSummary format
            const conversationSummary: ConversationSummary = {
              id: conversation.id,
              title: conversation.title || 'New Chat',
              last_message_preview: conversation.messages[conversation.messages.length - 1]?.content || '',
              message_count: conversation.messages.length,
              created_at: conversation.created_at,
              updated_at: conversation.updated_at,
              is_archived: false,
              last_message_timestamp: ''
            };
            setCurrentConversation(conversationSummary);
          }}
        />
      </div>
    </div>
  );
}