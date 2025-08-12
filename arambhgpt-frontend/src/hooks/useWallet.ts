'use client';

import { useState, useEffect } from 'react';
import { WalletBalance, Transaction, ActiveSession } from '@/types/wallet';
import { useAuth } from './useAuth';

export function useWallet() {
  const { user } = useAuth();
  const [balance, setBalance] = useState<WalletBalance | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeSession, setActiveSession] = useState<ActiveSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch wallet balance
  const fetchBalance = async () => {
    if (!user) return;
    
    try {
      const response = await fetch(`http://localhost:8000/api/wallet/balance?userId=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setBalance(data);
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  // Fetch transaction history
  const fetchTransactions = async () => {
    if (!user) return;
    
    try {
      const response = await fetch(`http://localhost:8000/api/wallet/transactions?userId=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setTransactions(data);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  // Add money to wallet
  const rechargeWallet = async (amount: number, paymentMethod: string) => {
    if (!user) throw new Error('User not authenticated');
    
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/wallet/recharge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          amount,
          paymentMethod
        })
      });

      if (response.ok) {
        const result = await response.json();
        await fetchBalance();
        await fetchTransactions();
        return result;
      } else {
        throw new Error('Recharge failed');
      }
    } catch (error) {
      console.error('Recharge error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Start consultation session
  const startSession = async (professionalId: string, type: 'chat' | 'voice' | 'video', rate: number) => {
    if (!user) throw new Error('User not authenticated');
    if (!balance || balance.balance < rate) throw new Error('Insufficient balance');

    try {
      const response = await fetch('http://localhost:8000/api/wallet/start-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          professionalId,
          type,
          rate
        })
      });

      if (response.ok) {
        const session = await response.json();
        setActiveSession(session);
        return session;
      } else {
        throw new Error('Failed to start session');
      }
    } catch (error) {
      console.error('Start session error:', error);
      throw error;
    }
  };

  // End consultation session
  const endSession = async (sessionId: string) => {
    if (!sessionId) return;

    try {
      const response = await fetch('http://localhost:8000/api/wallet/end-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId })
      });

      if (response.ok) {
        const result = await response.json();
        setActiveSession(null);
        await fetchBalance();
        await fetchTransactions();
        return result;
      }
    } catch (error) {
      console.error('End session error:', error);
      throw error;
    }
  };

  // Check if user has sufficient balance
  const hasSufficientBalance = (requiredAmount: number): boolean => {
    return balance ? balance.balance >= requiredAmount : false;
  };

  // Get active session duration in minutes
  const getSessionDuration = (): number => {
    if (!activeSession) return 0;
    const startTime = new Date(activeSession.startTime);
    const now = new Date();
    return Math.floor((now.getTime() - startTime.getTime()) / (1000 * 60));
  };

  // Calculate current session cost
  const getCurrentSessionCost = (): number => {
    if (!activeSession) return 0;
    const duration = getSessionDuration();
    return duration * activeSession.rate;
  };

  useEffect(() => {
    if (user) {
      fetchBalance();
      fetchTransactions();
    }
  }, [user]);

  // Auto-update session cost every minute
  useEffect(() => {
    if (activeSession) {
      const interval = setInterval(() => {
        const currentCost = getCurrentSessionCost();
        setActiveSession(prev => prev ? { ...prev, totalCost: currentCost } : null);
      }, 60000); // Update every minute

      return () => clearInterval(interval);
    }
  }, [activeSession]);

  return {
    balance,
    transactions,
    activeSession,
    isLoading,
    rechargeWallet,
    startSession,
    endSession,
    hasSufficientBalance,
    getSessionDuration,
    getCurrentSessionCost,
    fetchBalance,
    fetchTransactions
  };
}