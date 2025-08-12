'use client';

import React, { useState, useEffect } from 'react';
import { Button, Card } from '@/components/ui';
import { ActiveSession } from '@/types/wallet';
import { useWallet } from '@/hooks/useWallet';

interface ActiveSessionCardProps {
  session: ActiveSession;
}

export function ActiveSessionCard({ session }: ActiveSessionCardProps) {
  const { endSession, getCurrentSessionCost, getSessionDuration } = useWallet();
  const [duration, setDuration] = useState(0);
  const [cost, setCost] = useState(0);

  useEffect(() => {
    const updateSession = () => {
      setDuration(getSessionDuration());
      setCost(getCurrentSessionCost());
    };

    updateSession();
    const interval = setInterval(updateSession, 1000); // Update every second

    return () => clearInterval(interval);
  }, [session]);

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const getSessionIcon = () => {
    switch (session.type) {
      case 'chat': return '💬';
      case 'voice': return '🎤';
      case 'video': return '📹';
      default: return '💬';
    }
  };

  const getSessionTypeLabel = () => {
    switch (session.type) {
      case 'chat': return 'Text Chat';
      case 'voice': return 'Voice Call';
      case 'video': return 'Video Call';
      default: return 'Chat';
    }
  };

  const handleEndSession = async () => {
    if (confirm('Are you sure you want to end this session?')) {
      try {
        await endSession(session.id);
      } catch (error) {
        alert('Failed to end session. Please try again.');
      }
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-r from-red-50 to-orange-50 border-red-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="text-3xl">{getSessionIcon()}</div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Active Session</h3>
            <p className="text-sm text-gray-600">{getSessionTypeLabel()} in progress</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-red-600">LIVE</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">{formatDuration(duration)}</div>
          <div className="text-xs text-gray-500">Duration</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">₹{cost.toFixed(2)}</div>
          <div className="text-xs text-gray-500">Current Cost</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">₹{session.rate}</div>
          <div className="text-xs text-gray-500">Per Minute</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-teal-600">
            {session.status === 'active' ? '▶️' : '⏸️'}
          </div>
          <div className="text-xs text-gray-500 capitalize">{session.status}</div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Session started at {new Date(session.startTime).toLocaleTimeString()}
        </div>
        <Button
          onClick={handleEndSession}
          className="bg-red-500 hover:bg-red-600 text-white"
          size="sm"
        >
          End Session
        </Button>
      </div>

      {/* Cost Breakdown */}
      <div className="mt-4 p-3 bg-white rounded-lg border">
        <div className="text-sm text-gray-600 mb-2">Cost Breakdown:</div>
        <div className="flex justify-between text-sm">
          <span>{duration} minutes × ₹{session.rate}/min</span>
          <span className="font-semibold">₹{cost.toFixed(2)}</span>
        </div>
      </div>

      {/* Warning for low balance */}
      <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-lg">
        <div className="flex items-center space-x-2 text-yellow-800 text-sm">
          <span>⚠️</span>
          <span>Session will auto-end when wallet balance is insufficient</span>
        </div>
      </div>
    </Card>
  );
}