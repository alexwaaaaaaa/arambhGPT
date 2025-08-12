'use client';

import React, { useState, useEffect } from 'react';
import { ConversationSummary } from '@/types';
import { ConversationItem } from './ConversationItem';
import { Button, Input, LoadingSpinner, ErrorMessage } from '@/components/ui';
import { useConversations } from '@/hooks';

interface ChatSidebarProps {
  activeConversationId?: string;
  onConversationSelect?: (id: string) => void;
  onNewChat?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  className?: string;
}

export function ChatSidebar({
  activeConversationId,
  onConversationSelect,
  onNewChat,
  isCollapsed = false,
  onToggleCollapse,
  className = '',
}: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showArchived, setShowArchived] = useState(false);

  const {
    conversations,
    isLoading,
    error,
    hasMore,
    totalCount,
    loadConversations,
    loadMore,
    refresh,
    deleteConversation,
    updateConversation,
    clearError,
  } = useConversations();

  // Filter conversations based on search and archive status
  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = !searchQuery ||
      conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.last_message_preview.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesArchiveFilter = showArchived ? conv.is_archived : !conv.is_archived;

    return matchesSearch && matchesArchiveFilter;
  });

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      loadConversations({
        page: 1,
        limit: 20,
        search: query.trim(),
        archived: showArchived,
      });
    } else {
      loadConversations({
        page: 1,
        limit: 20,
        archived: showArchived,
      });
    }
  };

  // Handle archive filter toggle
  const handleArchiveToggle = () => {
    const newShowArchived = !showArchived;
    setShowArchived(newShowArchived);
    loadConversations({
      page: 1,
      limit: 20,
      search: searchQuery,
      archived: newShowArchived,
    });
  };

  // Handle conversation actions
  const handleRename = async (id: string, newTitle: string) => {
    try {
      await updateConversation(id, { title: newTitle });
    } catch (error) {
      console.error('Failed to rename conversation:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteConversation(id);
      // If deleted conversation was active, start new chat
      if (id === activeConversationId && onNewChat) {
        onNewChat();
      }
    } catch (error) {
      console.error('Failed to delete conversation:', error);
    }
  };

  const handleArchive = async (id: string, archived: boolean) => {
    try {
      await updateConversation(id, { is_archived: archived });
    } catch (error) {
      console.error('Failed to archive conversation:', error);
    }
  };

  const handleClearAllHistory = async () => {
    try {
      // Delete all conversations one by one
      const deletePromises = conversations.map(conv => deleteConversation(conv.id));
      await Promise.all(deletePromises);
      
      // Start new chat if there was an active conversation
      if (activeConversationId && onNewChat) {
        onNewChat();
      }
    } catch (error) {
      console.error('Failed to clear all history:', error);
    }
  };

  if (isCollapsed) {
    return (
      <div className={`w-16 bg-white border-r border-gray-200 flex flex-col ${className}`}>
        {/* Collapse toggle */}
        <div className="p-4">
          <button
            onClick={onToggleCollapse}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
            title="Expand sidebar"
          >
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* New chat button */}
        <div className="px-4 pb-4">
          <button
            onClick={onNewChat}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="New chat"
            disabled={!onNewChat}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-80 bg-white border-r border-gray-200 flex flex-col ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Conversations</h2>

          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="p-1 rounded hover:bg-gray-100 transition-colors"
              title="Collapse sidebar"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
        </div>

        {/* New chat button */}
        <Button
          onClick={onNewChat}
          className="w-full mb-4"
          variant="primary"
          disabled={!onNewChat}
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Chat
        </Button>

        {/* Search */}
        <Input
          type="search"
          placeholder="Search conversations..."
          value={searchQuery}
          onChange={handleSearch}
          className="mb-3"
        />

        {/* Archive toggle and Clear All */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">
            {showArchived ? 'Archived' : 'Active'} ({filteredConversations.length})
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleArchiveToggle}
              className="text-sm text-teal-600 hover:text-teal-700 transition-colors"
            >
              {showArchived ? 'Show Active' : 'Show Archived'}
            </button>
            {conversations.length > 0 && (
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to delete all conversations? This action cannot be undone.')) {
                    handleClearAllHistory();
                  }
                }}
                className="text-sm text-red-600 hover:text-red-700 transition-colors"
                title="Clear all history"
              >
                Clear All
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="p-4">
          <ErrorMessage
            message={error}
            variant="card"
            onRetry={() => {
              clearError();
              refresh();
            }}
          />
        </div>
      )}

      {/* Conversations list */}
      <div className="flex-1 overflow-y-auto">
        {isLoading && conversations.length === 0 ? (
          <div className="flex items-center justify-center p-8">
            <div className="text-center">
              <LoadingSpinner size="md" />
              <p className="mt-2 text-sm text-gray-600">Loading conversations...</p>
            </div>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-gray-900 mb-1">
              {searchQuery ? 'No conversations found' : showArchived ? 'No archived conversations' : 'No conversations yet'}
            </h3>
            <p className="text-sm text-gray-500">
              {searchQuery
                ? 'Try adjusting your search terms'
                : showArchived
                  ? 'Archived conversations will appear here'
                  : 'Start a new conversation to get started'
              }
            </p>
          </div>
        ) : (
          <div className="p-2">
            {filteredConversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                isActive={conversation.id === activeConversationId}
                onClick={() => onConversationSelect?.(conversation.id)}
                onRename={handleRename}
                onDelete={handleDelete}
                onArchive={handleArchive}
                className="mb-2"
              />
            ))}

            {/* Load more button */}
            {hasMore && (
              <div className="p-4 text-center">
                <Button
                  onClick={loadMore}
                  variant="outline"
                  size="sm"
                  isLoading={isLoading}
                  disabled={isLoading}
                >
                  {isLoading ? 'Loading...' : 'Load More'}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer stats */}
      {totalCount > 0 && (
        <div className="p-4 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500">
            {totalCount} total conversation{totalCount !== 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  );
}