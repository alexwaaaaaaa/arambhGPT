'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button, LoadingSpinner } from '@/components/ui';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onVoiceMessage?: (audioBlob: Blob) => void;
  isLoading?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export interface ChatInputRef {
  focus: () => void;
  blur: () => void;
}

export const ChatInput = React.forwardRef<ChatInputRef, ChatInputProps>(({
  onSendMessage,
  onVoiceMessage,
  isLoading = false,
  disabled = false,
  placeholder = "Type a message...",
  className = '',
}, ref) => {
  const [message, setMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  // Common emojis for quick access
  const quickEmojis = ['😊', '😂', '❤️', '👍', '🙏', '😢', '😡', '🤔', '💪', '🎉', '🔥', '✨'];

  // Auto-focus on mount
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea && !disabled) {
      // Focus after a small delay to ensure component is fully mounted
      setTimeout(() => {
        textarea.focus();
      }, 100);
    }
  }, [disabled]);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }, [message]);

  // Expose focus methods via ref
  React.useImperativeHandle(ref, () => ({
    focus: () => textareaRef.current?.focus(),
    blur: () => textareaRef.current?.blur(),
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
      setShowEmojiPicker(false);
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as any);
    }
  };

  const handleEmojiClick = (emoji: string) => {
    setMessage(prev => prev + emoji);
    textareaRef.current?.focus();
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/wav' });
        onVoiceMessage?.(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };
      
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className={`bg-white/95 backdrop-blur-sm border-t border-teal-200 shadow-lg ${className}`}>
      {/* Enhanced Emoji Picker */}
      {showEmojiPicker && (
        <div className="px-6 py-4 border-b border-teal-100 bg-gradient-to-r from-teal-50 to-orange-50">
          <div className="flex flex-wrap gap-3">
            {quickEmojis.map((emoji, index) => (
              <button
                key={index}
                onClick={() => handleEmojiClick(emoji)}
                className="text-2xl hover:bg-white/80 hover:scale-110 rounded-xl p-3 transition-all duration-200 shadow-sm border border-transparent hover:border-teal-200"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Enhanced Main Input Area */}
      <div className="p-6">
        <form onSubmit={handleSubmit} className="flex items-end gap-4">
          {/* Left Actions */}
          <div className="flex items-center gap-3">
            {/* Emoji Button */}
            <button
              type="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className={`
                p-3 rounded-full transition-all duration-200 transform hover:scale-110 shadow-sm
                ${showEmojiPicker 
                  ? 'bg-gradient-to-br from-orange-400 to-coral-500 text-white' 
                  : 'bg-gradient-to-br from-orange-100 to-coral-100 text-orange-600 hover:from-orange-200 hover:to-coral-200'
                }
              `}
              disabled={disabled}
            >
              <span className="text-lg">😊</span>
            </button>
          </div>

          {/* Enhanced Text Input */}
          <div className="flex-1 relative">
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Share your thoughts in Hindi, English, or Hinglish..."
                disabled={disabled || isLoading}
                rows={1}
                className={`
                  chat-input w-full px-6 py-4 bg-white/90 backdrop-blur-sm rounded-2xl border-2 
                  focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 focus:bg-white
                  disabled:opacity-50 disabled:cursor-not-allowed
                  resize-none overflow-hidden
                  placeholder-gray-500 text-gray-900
                  transition-all duration-300 shadow-sm
                  hover:border-teal-300 hover:shadow-md
                  ${isFocused 
                    ? 'border-teal-400 shadow-lg ring-2 ring-teal-400/20' 
                    : 'border-teal-200'
                  }
                `}
                style={{ minHeight: '56px', maxHeight: '120px' }}
              />
              
              {/* Input decoration */}
              <div className="absolute right-4 top-4 flex items-center space-x-2 pointer-events-none">
                <div className="flex space-x-1">
                  <div className="w-1 h-1 bg-teal-400 rounded-full opacity-60"></div>
                  <div className="w-1 h-1 bg-orange-400 rounded-full opacity-60"></div>
                  <div className="w-1 h-1 bg-coral-400 rounded-full opacity-60"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Right Actions */}
          <div className="flex items-center gap-3">
            {/* Voice Button */}
            <button
              type="button"
              onMouseDown={startRecording}
              onMouseUp={stopRecording}
              onTouchStart={startRecording}
              onTouchEnd={stopRecording}
              className={`
                p-3 rounded-full transition-all duration-200 transform shadow-lg
                flex items-center justify-center
                ${isRecording 
                  ? 'bg-gradient-to-br from-red-500 to-red-600 text-white scale-110 animate-pulse' 
                  : 'bg-gradient-to-br from-teal-100 to-teal-200 text-teal-600 hover:from-teal-200 hover:to-teal-300 hover:scale-110'
                }
              `}
              disabled={disabled || !onVoiceMessage}
              title={isRecording ? "Recording... Release to send" : "Hold to record voice message"}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </button>

            {/* Send Button */}
            <button
              type="submit"
              disabled={!message.trim() || isLoading || disabled}
              className="
                p-4 bg-gradient-to-br from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 
                text-white rounded-full shadow-lg
                disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
                transition-all duration-200 transform hover:scale-110 hover:shadow-xl
                flex items-center justify-center
              "
              title="Send message"
            >
              {isLoading ? (
                <LoadingSpinner size="sm" color="white" />
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </div>
        </form>

        {/* Enhanced Status Indicators */}
        <div className="mt-4 flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            {isRecording && (
              <span className="flex items-center gap-2 text-red-500 animate-pulse bg-red-50 px-3 py-1 rounded-full border border-red-200">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                Recording voice message...
              </span>
            )}
            {!isRecording && (
              <span className="text-gray-500 bg-gray-50 px-3 py-1 rounded-full">
                Press Enter to send • Shift+Enter for new line • Type anywhere to focus
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-gradient-to-r from-teal-50 to-orange-50 px-3 py-1 rounded-full border border-teal-200">
              <span className="text-teal-600">🇬🇧</span>
              <span className="text-orange-600">🇮🇳</span>
              <span className="text-coral-600">🌐</span>
              <span className="text-xs text-gray-600 font-medium">Multi-language</span>
            </div>
            {message.length > 800 && (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                message.length > 950 
                  ? 'text-red-600 bg-red-50 border border-red-200' 
                  : 'text-yellow-600 bg-yellow-50 border border-yellow-200'
              }`}>
                {message.length}/1000
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

ChatInput.displayName = 'ChatInput';