'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';

export interface CallSession {
  callId: string;
  callType: 'audio' | 'video';
  status: 'calling' | 'connected' | 'ended' | 'rejected';
  otherUserId: string;
  startTime: string;
  endTime?: string;
}

export interface UseWebRTCCallProps {
  onIncomingCall?: (callSession: CallSession) => void;
  onCallEnded?: () => void;
  onCallAccepted?: () => void;
  onCallRejected?: () => void;
}

export const useWebRTCCall = ({
  onIncomingCall,
  onCallEnded,
  onCallAccepted,
  onCallRejected
}: UseWebRTCCallProps = {}) => {
  const { user } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [currentCall, setCurrentCall] = useState<CallSession | null>(null);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  
  const websocketRef = useRef<WebSocket | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  // Initialize WebSocket connection
  const initializeWebSocket = useCallback(() => {
    if (!user?.id) return;

    const wsUrl = `ws://localhost:8000/api/webrtc/webrtc/${user.id}`;
    websocketRef.current = new WebSocket(wsUrl);

    websocketRef.current.onopen = () => {
      console.log('WebRTC signaling connected');
      setIsConnected(true);
      setConnectionStatus('connected');
    };

    websocketRef.current.onmessage = async (event) => {
      const message = JSON.parse(event.data);
      await handleSignalingMessage(message);
    };

    websocketRef.current.onclose = () => {
      console.log('WebRTC signaling disconnected');
      setIsConnected(false);
      setConnectionStatus('disconnected');
    };

    websocketRef.current.onerror = (error) => {
      console.error('WebRTC signaling error:', error);
      setConnectionStatus('disconnected');
    };
  }, [user?.id]);

  // Handle signaling messages
  const handleSignalingMessage = async (message: any) => {
    const { type } = message;

    switch (type) {
      case 'incoming_call':
        const incomingCall: CallSession = {
          callId: message.call_id,
          callType: message.call_type,
          status: 'calling',
          otherUserId: message.caller_id,
          startTime: new Date().toISOString()
        };
        setCurrentCall(incomingCall);
        onIncomingCall?.(incomingCall);
        break;

      case 'call_accepted':
        if (currentCall) {
          setCurrentCall({ ...currentCall, status: 'connected' });
          onCallAccepted?.();
          await createOffer();
        }
        break;

      case 'call_rejected':
        if (currentCall) {
          setCurrentCall({ ...currentCall, status: 'rejected' });
          onCallRejected?.();
          cleanup();
        }
        break;

      case 'offer':
        await handleOffer(message.offer);
        break;

      case 'answer':
        await handleAnswer(message.answer);
        break;

      case 'ice_candidate':
        await handleIceCandidate(message.candidate);
        break;

      case 'call_ended':
        endCall();
        break;
    }
  };

  // Initialize peer connection
  const initializePeerConnection = async () => {
    const peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    });

    peerConnectionRef.current = peerConnection;

    // Add local stream tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStreamRef.current!);
      });
    }

    // Handle remote stream
    peerConnection.ontrack = (event) => {
      console.log('Received remote stream');
      setRemoteStream(event.streams[0]);
      if (currentCall) {
        setCurrentCall({ ...currentCall, status: 'connected' });
      }
    };

    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
      if (event.candidate && websocketRef.current && currentCall) {
        websocketRef.current.send(JSON.stringify({
          type: 'ice_candidate',
          call_id: currentCall.callId,
          candidate: event.candidate
        }));
      }
    };

    // Handle connection state changes
    peerConnection.onconnectionstatechange = () => {
      console.log('Connection state:', peerConnection.connectionState);
      if (peerConnection.connectionState === 'failed') {
        endCall();
      }
    };
  };

  // Create WebRTC offer
  const createOffer = async () => {
    if (!peerConnectionRef.current || !currentCall) return;

    try {
      const offer = await peerConnectionRef.current.createOffer();
      await peerConnectionRef.current.setLocalDescription(offer);

      if (websocketRef.current) {
        websocketRef.current.send(JSON.stringify({
          type: 'offer',
          call_id: currentCall.callId,
          offer: offer
        }));
      }
    } catch (error) {
      console.error('Error creating offer:', error);
    }
  };

  // Handle WebRTC offer
  const handleOffer = async (offer: RTCSessionDescriptionInit) => {
    if (!peerConnectionRef.current || !currentCall) return;

    try {
      await peerConnectionRef.current.setRemoteDescription(offer);
      const answer = await peerConnectionRef.current.createAnswer();
      await peerConnectionRef.current.setLocalDescription(answer);

      if (websocketRef.current) {
        websocketRef.current.send(JSON.stringify({
          type: 'answer',
          call_id: currentCall.callId,
          answer: answer
        }));
      }
    } catch (error) {
      console.error('Error handling offer:', error);
    }
  };

  // Handle WebRTC answer
  const handleAnswer = async (answer: RTCSessionDescriptionInit) => {
    if (!peerConnectionRef.current) return;

    try {
      await peerConnectionRef.current.setRemoteDescription(answer);
    } catch (error) {
      console.error('Error handling answer:', error);
    }
  };

  // Handle ICE candidate
  const handleIceCandidate = async (candidate: RTCIceCandidateInit) => {
    if (!peerConnectionRef.current) return;

    try {
      await peerConnectionRef.current.addIceCandidate(candidate);
    } catch (error) {
      console.error('Error handling ICE candidate:', error);
    }
  };

  // Start a call
  const startCall = async (otherUserId: string, callType: 'audio' | 'video') => {
    try {
      setConnectionStatus('connecting');

      // Get user media
      const constraints = {
        video: callType === 'video',
        audio: true
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      localStreamRef.current = stream;
      setLocalStream(stream);

      // Initialize peer connection
      await initializePeerConnection();

      // Send call request
      if (websocketRef.current && websocketRef.current.readyState === WebSocket.OPEN) {
        websocketRef.current.send(JSON.stringify({
          type: 'call_request',
          callee_id: otherUserId,
          call_type: callType
        }));

        // Create temporary call session
        const callSession: CallSession = {
          callId: `temp_${Date.now()}`, // Will be updated when response comes
          callType,
          status: 'calling',
          otherUserId,
          startTime: new Date().toISOString()
        };
        setCurrentCall(callSession);
      }

    } catch (error) {
      console.error('Error starting call:', error);
      setConnectionStatus('disconnected');
      throw error;
    }
  };

  // Accept incoming call
  const acceptCall = async () => {
    if (!currentCall) return;

    try {
      // Get user media
      const constraints = {
        video: currentCall.callType === 'video',
        audio: true
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      localStreamRef.current = stream;
      setLocalStream(stream);

      // Initialize peer connection
      await initializePeerConnection();

      // Send accept response
      if (websocketRef.current) {
        websocketRef.current.send(JSON.stringify({
          type: 'call_response',
          call_id: currentCall.callId,
          action: 'accept'
        }));
      }

    } catch (error) {
      console.error('Error accepting call:', error);
      rejectCall();
    }
  };

  // Reject incoming call
  const rejectCall = () => {
    if (!currentCall) return;

    if (websocketRef.current) {
      websocketRef.current.send(JSON.stringify({
        type: 'call_response',
        call_id: currentCall.callId,
        action: 'reject'
      }));
    }

    cleanup();
  };

  // End current call
  const endCall = () => {
    if (currentCall && websocketRef.current) {
      websocketRef.current.send(JSON.stringify({
        type: 'end_call',
        call_id: currentCall.callId
      }));
    }

    cleanup();
    onCallEnded?.();
  };

  // Toggle audio
  const toggleAudio = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        return !audioTrack.enabled; // Return muted state
      }
    }
    return false;
  };

  // Toggle video
  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        return !videoTrack.enabled; // Return video off state
      }
    }
    return false;
  };

  // Cleanup resources
  const cleanup = () => {
    // Stop local stream
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }

    // Close peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    setLocalStream(null);
    setRemoteStream(null);
    setCurrentCall(null);
    setConnectionStatus('disconnected');
  };

  // Initialize on mount
  useEffect(() => {
    if (user?.id) {
      initializeWebSocket();
    }

    return () => {
      cleanup();
      if (websocketRef.current) {
        websocketRef.current.close();
      }
    };
  }, [user?.id, initializeWebSocket]);

  return {
    // State
    isConnected,
    currentCall,
    localStream,
    remoteStream,
    connectionStatus,

    // Actions
    startCall,
    acceptCall,
    rejectCall,
    endCall,
    toggleAudio,
    toggleVideo,

    // Refs for video elements
    localStreamRef,
    remoteStreamRef: { current: remoteStream }
  };
};