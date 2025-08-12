'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

interface VoiceChatOptions {
  onTranscript?: (text: string) => void;
  onError?: (error: string) => void;
  language?: string;
}

interface VoiceChatReturn {
  isListening: boolean;
  isSupported: boolean;
  transcript: string;
  confidence: number;
  startListening: () => void;
  stopListening: () => void;
  speak: (text: string) => void;
  isSpeaking: boolean;
  stopSpeaking: () => void;
  error: string | null;
}

export function useVoiceChat({
  onTranscript,
  onError,
  language = 'en-US'
}: VoiceChatOptions = {}): VoiceChatReturn {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  // Check browser support
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const speechSynthesis = window.speechSynthesis;
    
    if (SpeechRecognition && speechSynthesis) {
      setIsSupported(true);
      synthRef.current = speechSynthesis;
      
      // Initialize speech recognition
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = language;
      
      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };
      
      recognition.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0].transcript;
            setConfidence(result[0].confidence);
          } else {
            interimTranscript += result[0].transcript;
          }
        }
        
        const fullTranscript = finalTranscript || interimTranscript;
        setTranscript(fullTranscript);
        
        if (finalTranscript && onTranscript) {
          onTranscript(finalTranscript);
        }
      };
      
      recognition.onerror = (event) => {
        const errorMessage = `Speech recognition error: ${event.error}`;
        setError(errorMessage);
        setIsListening(false);
        if (onError) onError(errorMessage);
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      recognitionRef.current = recognition;
    } else {
      setIsSupported(false);
      setError('Speech recognition not supported in this browser');
    }
  }, [language, onTranscript, onError]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      setTranscript('');
      setError(null);
      recognitionRef.current.start();
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  }, [isListening]);

  const speak = useCallback((text: string) => {
    if (synthRef.current && text) {
      // Stop any ongoing speech
      synthRef.current.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language;
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 0.8;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => {
        setIsSpeaking(false);
        setError('Speech synthesis error');
      };
      
      synthRef.current.speak(utterance);
    }
  }, [language]);

  const stopSpeaking = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  }, []);

  return {
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
  };
}