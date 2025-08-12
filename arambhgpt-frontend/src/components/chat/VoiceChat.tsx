'use client';

import React, { useState } from 'react';
import { useVoiceChat } from '@/hooks/useVoiceChat';
import { Button } from '@/components/ui';

interface VoiceChatProps {
  onVoiceMessage: (message: string) => void;
  onSpeakResponse: (text: string) => void;
  isEnabled?: boolean;
  className?: string;
}

export function VoiceChat({ 
  onVoiceMessage, 
  onSpeakResponse,
  isEnabled = true,
  className = '' 
}: VoiceChatProps) {
  const [autoSpeak, setAutoSpeak] = useState(false);
  
  const {
    isListening,
    isSupported,
    transcript,
    confidence,
    startListening,
    stopListening,
    speak,
    isSpeaking,
    stopSpeaking,
    error,
  } = useVoiceChat({
    onTranscript: (text) => {
      if (text.trim()) {
        onVoiceMessage(text.trim());
      }
    },
    onError: (error) => {
      console.error('Voice chat error:', error);
    },
    language: 'en-US'
  });

  const handleSpeakResponse = (text: string) => {
    speak(text);
    onSpeakResponse(text);
  };

  if (!isSupported) {
    return (
      <div className={`text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg ${className}`}>
        <p className="text-sm text-yellow-800">
          🎤 Voice chat is not supported in your browser. Please use Chrome, Edge, or Safari.
        </p>
      </div>
    );
  }

  if (!isEnabled) {
    return null;
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Voice Controls */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
        <div className="flex items-center space-x-4">
          {/* Microphone Button */}
          <Button
            onClick={isListening ? stopListening : startListening}
            variant={isListening ? 'danger' : 'primary'}
            size="sm"
            className={`flex items-center space-x-2 ${isListening ? 'animate-pulse' : ''}`}
          >
            {isListening ? (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a2 2 0 114 0v4a2 2 0 11-4 0V7z" clipRule="evenodd" />
                </svg>
                <span>Stop</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                </svg>
                <span>Speak</span>
              </>
            )}
          </Button>

          {/* Speaker Button */}
          <Button
            onClick={isSpeaking ? stopSpeaking : () => handleSpeakResponse('Hello! I can speak your messages.')}
            variant={isSpeaking ? 'danger' : 'secondary'}
            size="sm"
            className={`flex items-center space-x-2 ${isSpeaking ? 'animate-pulse' : ''}`}
          >
            {isSpeaking ? (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.617 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.617l3.766-3.793a1 1 0 011.617.793z" clipRule="evenodd" />
                  <path d="M14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 11-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" />
                </svg>
                <span>Stop</span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.617 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.617l3.766-3.793a1 1 0 011.617.793zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 11-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" />
                </svg>
                <span>Test</span>
              </>
            )}
          </Button>
        </div>

        {/* Auto-speak Toggle */}
        <div className="flex items-center space-x-2">
          <label className="text-sm text-gray-600">Auto-speak responses:</label>
          <button
            onClick={() => setAutoSpeak(!autoSpeak)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              autoSpeak ? 'bg-teal-600' : 'bg-gray-200'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                autoSpeak ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Live Transcript */}
      {isListening && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-blue-800">Listening...</span>
          </div>
          {transcript && (
            <div className="space-y-2">
              <p className="text-sm text-blue-700">
                <strong>You said:</strong> "{transcript}"
              </p>
              {confidence > 0 && (
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-blue-600">Confidence:</span>
                  <div className="flex-1 bg-blue-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${confidence * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-blue-600">{Math.round(confidence * 100)}%</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">
            <strong>Error:</strong> {error}
          </p>
        </div>
      )}

      {/* Voice Chat Instructions */}
      <div className="text-xs text-gray-500 space-y-1">
        <p>🎤 <strong>Voice Input:</strong> Click "Speak" and talk to send voice messages</p>
        <p>🔊 <strong>Voice Output:</strong> Enable auto-speak to hear AI responses</p>
        <p>🌐 <strong>Languages:</strong> Supports English, Hindi, and mixed languages</p>
      </div>
    </div>
  );
}