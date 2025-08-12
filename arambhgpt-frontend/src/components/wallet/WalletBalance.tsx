'use client';

import React from 'react';
import { Card } from '@/components/ui';
import { useWallet } from '@/hooks/useWallet';

interface WalletBalanceProps {
  showDetails?: boolean;
  className?: string;
}

export function WalletBalance({ showDetails = false, className = '' }: WalletBalanceProps) {
  const { balance, activeSession, getCurrentSessionCost } = useWallet();

  const currentSessionCost = getCurrentSessionCost();
  const availableBalance = balance ? balance.balance - currentSessionCost : 0;

  return (
    <Card className={`p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-600">Wallet Balance</div>
          <div className="text-2xl font-bold text-teal-600">
            ₹{balance?.balance?.toFixed(2) || '0.00'}
          </div>
          {activeSession && (
            <div className="text-xs text-red-600 mt-1">
              Session cost: ₹{currentSessionCost.toFixed(2)}
            </div>
          )}
        </div>
        <div className="text-3xl">💰</div>
      </div>
      
      {showDetails && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Available:</span>
            <span className="font-medium">₹{availableBalance.toFixed(2)}</span>
          </div>
          {activeSession && (
            <div className="flex justify-between text-sm text-red-600">
              <span>Reserved:</span>
              <span>₹{currentSessionCost.toFixed(2)}</span>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}