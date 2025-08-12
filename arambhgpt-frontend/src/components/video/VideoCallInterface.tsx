'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui';

interface VideoCallInterfaceProps {
  sessionId: string;
  isHost?: boolean;
  onEndCall: () => void;
  className?: string;
}

export function VideoCallInterface({
  sessionId,
  isHost = false,
  onEndCall,
  className = ''
}: VideoCallInterfaceProps) {
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const [participantName, setParticipantName] = useState('Dr. Smith');

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Initialize WebRTC connection
    initializeCall();
    
    // Start call timer
    timerRef.current = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      // Cleanup WebRTC connections
      cleanupCall();
    };
  }, []);

  const initializeCall = async () => {
    try {
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Simulate connection after 2 seconds
      setTimeout(() => {
        setConnectionStatus('connected');
      }, 2000);
    } catch (error) {
      console.error('Failed to initialize call:', error);
      setConnectionStatus('disconnected');
    }
  };

  const cleanupCall = () => {
    // Stop all media tracks
    if (localVideoRef.current?.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const toggleVideo = () => {
    setIsVideoEnabled(!isVideoEnabled);
    if (localVideoRef.current?.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoEnabled;
      }
    }
  };

  const toggleAudio = () => {
    setIsAudioEnabled(!isAudioEnabled);
    if (localVideoRef.current?.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isAudioEnabled;
      }
    }
  };

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: true
        });
        
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = screenStream;
        }
        
        setIsScreenSharing(true);
      } else {
        // Switch back to camera
        const cameraStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = cameraStream;
        }
        
        setIsScreenSharing(false);
      }
    } catch (error) {
      console.error('Screen sharing failed:', error);
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // Implement recording logic
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`relative h-full bg-gradient-to-br from-gray-900 to-gray-800 ${className}`}>
      {/* Connection Status */}
      {connectionStatus === 'connecting' && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/90 backdrop-blur-sm z-50">
          <div className="text-center text-white">
            <div className="w-20 h-20 border-4 border-teal-400 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <h3 className="text-xl font-semibold mb-2">Connecting to {participantName}...</h3>
            <p className="text-gray-300">Please wait while we establish the connection</p>
          </div>
        </div>
      )}

      {/* Main Video Area */}
      <div className="relative h-full">
        {/* Remote Video (Main) */}
        <div className="relative w-full h-full bg-gray-800 rounded-lg overflow-hidden">
          {connectionStatus === 'connected' ? (
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
              poster="/placeholder-avatar.png"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center text-white">
                <div className="w-32 h-32 bg-gradient-to-br from-teal-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-5xl">👨‍⚕️</span>
                </div>
                <h3 className="text-xl font-semibold">{participantName}</h3>
                <p className="text-gray-300">Waiting to join...</p>
              </div>
            </div>
          )}

          {/* Participant Name Overlay */}
          <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-lg">
            <span className="font-medium">{participantName}</span>
          </div>
        </div>

        {/* Local Video (Picture-in-Picture) */}
        <div className="absolute top-6 right-6 w-56 h-40 bg-gray-800 rounded-xl overflow-hidden shadow-2xl border-2 border-white/20">
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
          {!isVideoEnabled && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
              <span className="text-white text-5xl">👤</span>
            </div>
          )}
          
          {/* Local Video Label */}
          <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded text-xs">
            You
          </div>
        </div>

        {/* Call Info Header */}
        <div className="absolute top-6 left-6 bg-black/60 backdrop-blur-sm text-white px-4 py-3 rounded-xl">
          <div className="flex items-center space-x-4">
            <div className={`w-3 h-3 rounded-full ${
              connectionStatus === 'connected' ? 'bg-green-400' : 'bg-red-400'
            } animate-pulse`}></div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold">{formatDuration(callDuration)}</span>
              <span className="text-sm text-gray-300">•</span>
              <span className="text-sm text-gray-300">HD Video</span>
            </div>
            {isRecording && (
              <div className="flex items-center space-x-2 bg-red-500/20 px-2 py-1 rounded-lg">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Recording</span>
              </div>
            )}
          </div>
        </div>

        {/* Screen Sharing Indicator */}
        {isScreenSharing && (
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-blue-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-xl">
            <div className="flex items-center space-x-2">
              <span className="text-lg">🖥️</span>
              <span className="font-medium">Screen Sharing Active</span>
            </div>
          </div>
        )}

        {/* Main Call Controls */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center space-x-3 bg-black/80 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-2xl">
            {/* Audio Toggle */}
            <div title={isAudioEnabled ? 'Mute Audio' : 'Unmute Audio'}>
              <Button
                onClick={toggleAudio}
                className={`w-14 h-14 rounded-full transition-all duration-200 ${
                  isAudioEnabled 
                    ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                    : 'bg-red-500 hover:bg-red-600 text-white'
                }`}
              >
                <span className="text-xl">{isAudioEnabled ? '🎤' : '🔇'}</span>
              </Button>
            </div>

            {/* Video Toggle */}
            <div title={isVideoEnabled ? 'Turn Off Video' : 'Turn On Video'}>
              <Button
                onClick={toggleVideo}
                className={`w-14 h-14 rounded-full transition-all duration-200 ${
                  isVideoEnabled 
                    ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                    : 'bg-red-500 hover:bg-red-600 text-white'
                }`}
              >
                <span className="text-xl">{isVideoEnabled ? '📹' : '📵'}</span>
              </Button>
            </div>

            {/* Screen Share */}
            <div title={isScreenSharing ? 'Stop Sharing' : 'Share Screen'}>
              <Button
                onClick={toggleScreenShare}
                className={`w-14 h-14 rounded-full transition-all duration-200 ${
                  isScreenSharing 
                    ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                    : 'bg-gray-700 hover:bg-gray-600 text-white'
                }`}
              >
                <span className="text-xl">🖥️</span>
              </Button>
            </div>

            {/* Recording (Host Only) */}
            {isHost && (
              <div title={isRecording ? 'Stop Recording' : 'Start Recording'}>
                <Button
                  onClick={toggleRecording}
                  className={`w-14 h-14 rounded-full transition-all duration-200 ${
                    isRecording 
                      ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
                      : 'bg-gray-700 hover:bg-gray-600 text-white'
                  }`}
                >
                  <span className="text-xl">{isRecording ? '⏹️' : '🔴'}</span>
                </Button>
              </div>
            )}

            {/* End Call */}
            <div title="End Call">
              <Button
                onClick={onEndCall}
                className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 text-white transition-all duration-200 hover:scale-110"
              >
                <span className="text-xl">📞</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Secondary Controls */}
        <div className="absolute bottom-8 right-8">
          <div className="flex flex-col space-y-3">
            {/* Chat Toggle */}
            <div title="Open Chat">
              <Button
                className="w-12 h-12 rounded-full bg-gray-700/80 hover:bg-gray-600 text-white backdrop-blur-sm transition-all duration-200"
                onClick={() => {
                  alert('In-call chat feature coming soon!');
                }}
              >
                <span className="text-lg">💬</span>
              </Button>
            </div>

            {/* Settings */}
            <div title="Settings">
              <Button
                className="w-12 h-12 rounded-full bg-gray-700/80 hover:bg-gray-600 text-white backdrop-blur-sm transition-all duration-200"
                onClick={() => {
                  alert('Call settings coming soon!');
                }}
              >
                <span className="text-lg">⚙️</span>
              </Button>
            </div>

            {/* Fullscreen */}
            <div title="Toggle Fullscreen">
              <Button
                className="w-12 h-12 rounded-full bg-gray-700/80 hover:bg-gray-600 text-white backdrop-blur-sm transition-all duration-200"
                onClick={() => {
                  if (document.fullscreenElement) {
                    document.exitFullscreen();
                  } else {
                    document.documentElement.requestFullscreen();
                  }
                }}
              >
                <span className="text-lg">⛶</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Connection Quality Indicator */}
        <div className="absolute top-6 right-80 bg-black/60 backdrop-blur-sm text-white px-3 py-2 rounded-lg">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              <div className="w-1 h-3 bg-green-400 rounded-full"></div>
              <div className="w-1 h-4 bg-green-400 rounded-full"></div>
              <div className="w-1 h-2 bg-gray-400 rounded-full"></div>
            </div>
            <span className="text-xs">Good</span>
          </div>
        </div>
      </div>
    </div>
  );
}