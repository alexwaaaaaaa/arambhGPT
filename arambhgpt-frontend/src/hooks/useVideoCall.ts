'use client';

import { useState, useRef, useCallback } from 'react';

interface UseVideoCallProps {
  professionalId: string;
  onCallEnd?: () => void;
}

export function useVideoCall({ professionalId, onCallEnd }: UseVideoCallProps) {
  const [isCallActive, setIsCallActive] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('disconnected');
  
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  const startCall = useCallback(async () => {
    try {
      setIsCallActive(true);
      setConnectionStatus('connecting');
      setCallDuration(0);

      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      
      localStreamRef.current = stream;

      // Start call timer
      intervalRef.current = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);

      // Simulate connection (in real app, use WebRTC)
      setTimeout(() => {
        setConnectionStatus('connected');
      }, 2000);

    } catch (error) {
      console.error('Error starting video call:', error);
      setConnectionStatus('disconnected');
      setIsCallActive(false);
    }
  }, []);

  const endCall = useCallback(() => {
    // Stop local stream
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }

    // Clear timer
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Close peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    setIsCallActive(false);
    setConnectionStatus('disconnected');
    setCallDuration(0);
    
    onCallEnd?.();
  }, [onCallEnd]);

  const toggleVideo = useCallback(() => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoEnabled;
        setIsVideoEnabled(!isVideoEnabled);
      }
    }
  }, [isVideoEnabled]);

  const toggleAudio = useCallback(() => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isAudioEnabled;
        setIsAudioEnabled(!isAudioEnabled);
      }
    }
  }, [isAudioEnabled]);

  return {
    isCallActive,
    isVideoEnabled,
    isAudioEnabled,
    callDuration,
    connectionStatus,
    localStream: localStreamRef.current,
    remoteStream: remoteStreamRef.current,
    startCall,
    endCall,
    toggleVideo,
    toggleAudio
  };
}