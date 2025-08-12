'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { useWebRTCCall } from '../../hooks/useWebRTCCall';

interface CallInterfaceProps {
  otherUserId: string;
  otherUserName: string;
  callType: 'audio' | 'video';
  isInitiator?: boolean;
  onCallEnd?: () => void;
}

export const CallInterface: React.FC<CallInterfaceProps> = ({
  otherUserId,
  otherUserName,
  callType,
  isInitiator = false,
  onCallEnd
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(callType === 'audio');
  const [callDuration, setCallDuration] = useState(0);
  const [showIncomingCall, setShowIncomingCall] = useState(false);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const {
    isConnected,
    currentCall,
    localStream,
    remoteStream,
    connectionStatus,
    startCall,
    acceptCall,
    rejectCall,
    endCall,
    toggleAudio,
    toggleVideo
  } = useWebRTCCall({
    onIncomingCall: (callSession) => {
      if (!isInitiator) {
        setShowIncomingCall(true);
      }
    },
    onCallEnded: () => {
      onCallEnd?.();
    },
    onCallAccepted: () => {
      setShowIncomingCall(false);
    },
    onCallRejected: () => {
      setShowIncomingCall(false);
      onCallEnd?.();
    }
  });

  // Update video elements when streams change
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  // Call duration timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (currentCall?.status === 'connected') {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(interval);
  }, [currentCall?.status]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartCall = async () => {
    try {
      await startCall(otherUserId, callType);
    } catch (error) {
      console.error('Failed to start call:', error);
      alert('Failed to start call. Please check your camera/microphone permissions.');
    }
  };

  const handleToggleAudio = () => {
    const muted = toggleAudio();
    setIsMuted(muted);
  };

  const handleToggleVideo = () => {
    if (callType === 'audio') return;
    const videoOff = toggleVideo();
    setIsVideoOff(videoOff);
  };

  const handleEndCall = () => {
    endCall();
    setCallDuration(0);
  };

  // Incoming call modal
  if (showIncomingCall && currentCall) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <div className="mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">👨‍⚕️</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Incoming {currentCall.callType} call</h3>
            <p className="text-gray-600">{otherUserName}</p>
          </div>
          
          <div className="flex space-x-4 justify-center">
            <Button
              onClick={rejectCall}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full"
            >
              Decline
            </Button>
            <Button
              onClick={acceptCall}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full"
            >
              Accept
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Connection status
  if (connectionStatus === 'connecting' || currentCall?.status === 'calling') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold mb-2">
            {currentCall?.status === 'calling' ? 'Calling...' : 'Connecting...'}
          </h3>
          <p className="text-gray-600 mb-4">{otherUserName}</p>
          <Button onClick={handleEndCall} className="bg-red-500 hover:bg-red-600">
            Cancel
          </Button>
        </Card>
      </div>
    );
  }

  // Pre-call state
  if (!currentCall || currentCall.status === 'ended') {
    return (
      <Card className="p-6 text-center">
        <div className="mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">
              {callType === 'video' ? '📹' : '🎤'}
            </span>
          </div>
          <h3 className="text-lg font-semibold mb-2">
            {callType === 'video' ? 'Video Call' : 'Audio Call'}
          </h3>
          <p className="text-gray-600 mb-4">
            Ready to start {callType} consultation with {otherUserName}
          </p>
        </div>
        
        <Button 
          onClick={handleStartCall} 
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-3"
          disabled={!isConnected}
        >
          {isConnected ? `Start ${callType === 'video' ? 'Video' : 'Audio'} Call` : 'Connecting...'}
        </Button>
      </Card>
    );
  }

  // Active call interface
  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gray-900 text-white p-4 flex justify-between items-center">
        <div>
          <h3 className="font-semibold">
            {callType === 'video' ? 'Video' : 'Audio'} Call - {otherUserName}
          </h3>
          <p className="text-sm text-gray-300">
            {currentCall.status === 'connected' ? formatDuration(callDuration) : 'Connecting...'}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${
            currentCall.status === 'connected' ? 'bg-green-400' : 'bg-yellow-400'
          } animate-pulse`}></div>
          <span className="text-sm capitalize">{currentCall.status}</span>
        </div>
      </div>

      {/* Video/Audio Content */}
      <div className="flex-1 relative">
        {callType === 'video' ? (
          <>
            {/* Remote Video */}
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover bg-gray-800"
            />
            
            {/* Local Video */}
            <div className="absolute top-4 right-4 w-48 h-36 bg-gray-800 rounded-lg overflow-hidden border-2 border-white shadow-lg">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              {isVideoOff && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                  <span className="text-white text-4xl">👤</span>
                </div>
              )}
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs">
                You
              </div>
            </div>

            {/* Remote user placeholder when no stream */}
            {!remoteStream && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                <div className="text-center text-white">
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-5xl">👨‍⚕️</span>
                  </div>
                  <h3 className="text-xl font-semibold">{otherUserName}</h3>
                  <p className="text-gray-300">Connecting...</p>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Audio Call UI */
          <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900">
            <div className="text-center text-white">
              <div className="w-40 h-40 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-6xl">🎤</span>
              </div>
              <h3 className="text-2xl font-semibold mb-2">{otherUserName}</h3>
              <p className="text-blue-200 text-lg">
                {currentCall.status === 'connected' ? formatDuration(callDuration) : 'Connecting...'}
              </p>
              <div className="mt-4 flex justify-center">
                <div className={`w-4 h-4 rounded-full ${
                  currentCall.status === 'connected' ? 'bg-green-400' : 'bg-yellow-400'
                } animate-pulse`}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-gray-900 p-6 flex justify-center space-x-6">
        {/* Mute/Unmute */}
        <Button
          onClick={handleToggleAudio}
          className={`${
            isMuted ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-600 hover:bg-gray-700'
          } w-14 h-14 rounded-full text-white transition-colors`}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          <span className="text-xl">{isMuted ? '🔇' : '🎤'}</span>
        </Button>
        
        {/* Video Toggle (only for video calls) */}
        {callType === 'video' && (
          <Button
            onClick={handleToggleVideo}
            className={`${
              isVideoOff ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-600 hover:bg-gray-700'
            } w-14 h-14 rounded-full text-white transition-colors`}
            title={isVideoOff ? 'Turn on video' : 'Turn off video'}
          >
            <span className="text-xl">{isVideoOff ? '📵' : '📹'}</span>
          </Button>
        )}
        
        {/* End Call */}
        <Button
          onClick={handleEndCall}
          className="bg-red-500 hover:bg-red-600 w-14 h-14 rounded-full text-white transition-colors"
          title="End call"
        >
          <span className="text-xl">📞</span>
        </Button>
      </div>
    </div>
  );
};