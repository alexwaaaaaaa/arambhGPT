'use client';

import React, { useState } from 'react';
import { Message } from '@/types';

interface MessageBubbleProps {
  message: Message;
  isUser: boolean;
  className?: string;
}

export function MessageBubble({ message, isUser, className = '' }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy message:', err);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className={`group relative mb-6 ${className}`}>
      <div className={`flex items-end space-x-3 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div
            className={`
              w-10 h-10 rounded-full flex items-center justify-center shadow-lg
              ${isUser
                ? 'bg-gradient-to-br from-teal-500 to-teal-600 text-white'
                : 'bg-gradient-to-br from-orange-400 to-coral-500 text-white'
              }
            `}
          >
            {isUser ? (
              <span className="text-lg">👤</span>
            ) : (
              <span className="text-lg">🪷</span>
            )}
          </div>
        </div>

        {/* Message bubble */}
        <div className="flex-1 max-w-[80%]">
          <div
            className={`
              relative px-5 py-4 rounded-2xl shadow-lg backdrop-blur-sm border
              ${isUser
                ? 'bg-gradient-to-br from-teal-500 to-teal-600 text-white border-teal-300 rounded-br-md'
                : 'bg-white/90 text-gray-800 border-orange-200 rounded-bl-md'
              }
            `}
          >
            {/* AI Provider Badge */}
            {!isUser && message.ai_provider && (
              <div className="mb-3">
                <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-100 to-coral-100 px-3 py-1 rounded-full border border-orange-200">
                  <span className="text-sm">
                    {message.ai_provider === 'gemini' ? '✨' : '🍯'}
                  </span>
                  <span className="text-xs font-medium text-orange-700">
                    {message.ai_provider === 'gemini' ? 'Gemini AI' : 'Honey AI'}
                  </span>
                </div>
              </div>
            )}

            {/* Message content */}
            <div className="whitespace-pre-wrap break-words leading-relaxed">
              {message.content}
            </div>

            {/* Copy button */}
            <button
              onClick={handleCopy}
              className={`
                absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-200
                p-2 rounded-lg hover:scale-110 focus:outline-none
                ${isUser 
                  ? 'text-white/70 hover:text-white hover:bg-white/20' 
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                }
              `}
              title="Copy message"
            >
              {copied ? (
                <div className="flex items-center space-x-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs">Copied!</span>
                </div>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              )}
            </button>

            {/* Message tail */}
            <div
              className={`
                absolute bottom-0 w-4 h-4
                ${isUser
                  ? 'right-0 translate-x-2 bg-gradient-to-br from-teal-500 to-teal-600'
                  : 'left-0 -translate-x-2 bg-white/90'
                }
              `}
              style={{
                clipPath: isUser 
                  ? 'polygon(0 0, 100% 0, 0 100%)' 
                  : 'polygon(100% 0, 0 0, 100% 100%)'
              }}
            />
          </div>

          {/* Timestamp and metadata */}
          <div className={`mt-2 flex items-center space-x-2 text-xs text-gray-500 ${isUser ? 'justify-end' : 'justify-start'}`}>
            <span className="bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full border border-gray-200">
              {formatTime(message.created_at)}
            </span>
            {!isUser && message.ai_provider && (
              <span className="bg-orange-50 text-orange-600 px-2 py-1 rounded-full border border-orange-200">
                AI Response
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}