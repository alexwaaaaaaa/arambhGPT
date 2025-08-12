'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useVirtualScroll } from '@/lib/performance';

interface VirtualizedListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  overscan?: number;
  className?: string;
  onScroll?: (scrollTop: number) => void;
  loadMore?: () => void;
  hasMore?: boolean;
  isLoading?: boolean;
}

export function VirtualizedList<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  overscan = 5,
  className = '',
  onScroll,
  loadMore,
  hasMore = false,
  isLoading = false,
}: VirtualizedListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [virtualScroll, updateScrollTop] = useVirtualScroll({
    itemHeight,
    containerHeight,
    itemCount: items.length,
    overscan,
  });

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const newScrollTop = e.currentTarget.scrollTop;
    setScrollTop(newScrollTop);
    updateScrollTop(newScrollTop);
    onScroll?.(newScrollTop);

    // Load more when near bottom
    if (loadMore && hasMore && !isLoading) {
      const { scrollHeight, scrollTop, clientHeight } = e.currentTarget;
      if (scrollHeight - scrollTop - clientHeight < itemHeight * 5) {
        loadMore();
      }
    }
  }, [updateScrollTop, onScroll, loadMore, hasMore, isLoading, itemHeight]);

  return (
    <div
      ref={containerRef}
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: virtualScroll.totalHeight, position: 'relative' }}>
        <div
          style={{
            transform: `translateY(${virtualScroll.offsetY}px)`,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
          }}
        >
          {virtualScroll.visibleItems.map((index) => (
            <div
              key={index}
              style={{
                height: itemHeight,
                overflow: 'hidden',
              }}
            >
              {renderItem(items[index], index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Specialized virtualized conversation list
interface VirtualizedConversationListProps {
  conversations: any[];
  onConversationSelect: (id: string) => void;
  activeConversationId?: string;
  className?: string;
  loadMore?: () => void;
  hasMore?: boolean;
  isLoading?: boolean;
}

export function VirtualizedConversationList({
  conversations,
  onConversationSelect,
  activeConversationId,
  className = '',
  loadMore,
  hasMore,
  isLoading,
}: VirtualizedConversationListProps) {
  const renderConversation = useCallback((conversation: any, index: number) => (
    <div
      className={`
        p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors
        ${conversation.id === activeConversationId ? 'bg-teal-50 border-teal-200' : ''}
      `}
      onClick={() => onConversationSelect(conversation.id)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900 truncate">
            {conversation.title}
          </h3>
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
            {conversation.last_message_preview}
          </p>
        </div>
        <div className="ml-2 flex-shrink-0">
          <span className="text-xs text-gray-400">
            {new Date(conversation.updated_at).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  ), [onConversationSelect, activeConversationId]);

  return (
    <VirtualizedList
      items={conversations}
      itemHeight={80}
      containerHeight={600}
      renderItem={renderConversation}
      className={className}
      loadMore={loadMore}
      hasMore={hasMore}
      isLoading={isLoading}
    />
  );
}

// Virtualized message list for chat
interface VirtualizedMessageListProps {
  messages: any[];
  className?: string;
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoading?: boolean;
}

export function VirtualizedMessageList({
  messages,
  className = '',
  onLoadMore,
  hasMore,
  isLoading,
}: VirtualizedMessageListProps) {
  const renderMessage = useCallback((message: any, index: number) => (
    <div className={`p-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
      <div
        className={`
          inline-block max-w-xs lg:max-w-md px-4 py-2 rounded-lg
          ${message.role === 'user'
            ? 'bg-teal-600 text-white'
            : 'bg-gray-200 text-gray-900'
          }
        `}
      >
        <p className="text-sm">{message.content}</p>
        <p className="text-xs opacity-75 mt-1">
          {new Date(message.created_at).toLocaleTimeString()}
        </p>
      </div>
    </div>
  ), []);

  return (
    <VirtualizedList
      items={messages}
      itemHeight={100}
      containerHeight={500}
      renderItem={renderMessage}
      className={className}
      loadMore={onLoadMore}
      hasMore={hasMore}
      isLoading={isLoading}
    />
  );
}