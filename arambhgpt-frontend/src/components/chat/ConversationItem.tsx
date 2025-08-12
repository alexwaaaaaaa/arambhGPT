'use client';

import React, { useState } from 'react';
import { ConversationSummary } from '@/types';
import { Badge } from '@/components/ui';

interface ConversationItemProps {
  conversation: ConversationSummary;
  isActive?: boolean;
  onClick: () => void;
  onRename?: (id: string, newTitle: string) => void;
  onDelete?: (id: string) => void;
  onArchive?: (id: string, archived: boolean) => void;
  className?: string;
}

export function ConversationItem({
  conversation,
  isActive = false,
  onClick,
  onRename,
  onDelete,
  onArchive,
  className = '',
}: ConversationItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(conversation.title);
  const [showMenu, setShowMenu] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  };

  const handleRename = () => {
    if (onRename && editTitle.trim() !== conversation.title) {
      onRename(conversation.id, editTitle.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRename();
    } else if (e.key === 'Escape') {
      setEditTitle(conversation.title);
      setIsEditing(false);
    }
  };

  const handleMenuAction = (action: string) => {
    setShowMenu(false);
    
    switch (action) {
      case 'rename':
        setIsEditing(true);
        break;
      case 'archive':
        if (onArchive) onArchive(conversation.id, !conversation.is_archived);
        break;
      case 'delete':
        if (onDelete && confirm('Are you sure you want to delete this conversation?')) {
          onDelete(conversation.id);
        }
        break;
    }
  };

  return (
    <div
      className={`
        relative group p-3 rounded-lg cursor-pointer transition-colors
        ${isActive 
          ? 'bg-teal-50 border-l-4 border-teal-500' 
          : 'hover:bg-gray-50 border-l-4 border-transparent'
        }
        ${conversation.is_archived ? 'opacity-60' : ''}
        ${className}
      `}
      onClick={!isEditing ? onClick : undefined}
    >
      {/* Main content */}
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          {/* Title */}
          {isEditing ? (
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onBlur={handleRename}
              onKeyDown={handleKeyDown}
              className="w-full text-sm font-medium bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-teal-500"
              autoFocus
            />
          ) : (
            <h3 className="text-sm font-medium text-gray-900 truncate">
              {conversation.title}
            </h3>
          )}

          {/* Preview */}
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
            {conversation.last_message_preview}
          </p>

          {/* Metadata */}
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center space-x-2">
              <span className="text-xs text-gray-400">
                {formatDate(conversation.last_message_timestamp)}
              </span>
              
              {conversation.message_count > 0 && (
                <Badge variant="default" size="sm" className="text-xs">
                  {conversation.message_count}
                </Badge>
              )}
              
              {conversation.is_archived && (
                <Badge variant="warning" size="sm" className="text-xs">
                  Archived
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Menu button */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
            className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-gray-200 transition-opacity"
          >
            <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>

          {/* Dropdown menu */}
          {showMenu && (
            <div className="absolute right-0 top-8 w-32 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-10">
              <button
                onClick={() => handleMenuAction('rename')}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Rename
              </button>
              <button
                onClick={() => handleMenuAction('archive')}
                className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                {conversation.is_archived ? 'Unarchive' : 'Archive'}
              </button>
              <button
                onClick={() => handleMenuAction('delete')}
                className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Click outside to close menu */}
      {showMenu && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowMenu(false)}
        />
      )}
    </div>
  );
}