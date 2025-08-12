'use client';

import React, { useState } from 'react';
import { Button, Card, Modal } from '@/components/ui';
import { useWallet } from '@/hooks/useWallet';
import { RechargeModal } from './RechargeModal';
import { TransactionHistory } from './TransactionHistory';
import { ActiveSessionCard } from './ActiveSessionCard';

export function WalletDashboard() {
  const { balance, transactions, activeSession, isLoading } = useWallet();
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [showTransactions, setShowTransactions] = useState(false);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Wallet</h1>
        <p className="text-gray-600">Manage your consultation credits</p>
      </div>

      {/* Balance Card */}
      <Card className="p-6 bg-gradient-to-r from-teal-500 to-orange-500 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium opacity-90">Available Balance</h2>
            <div className="text-4xl font-bold mt-2">
              ₹{balance?.balance?.toFixed(2) || '0.00'}
            </div>
            <p className="text-sm opacity-75 mt-1">
              Last updated: {balance?.lastUpdated ? new Date(balance.lastUpdated).toLocaleString() : 'Never'}
            </p>
          </div>
          <div className="text-6xl opacity-20">💰</div>
        </div>
      </Card>

      {/* Active Session */}
      {activeSession && (
        <ActiveSessionCard session={activeSession} />
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button
          onClick={() => setShowRechargeModal(true)}
          className="h-16 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
          disabled={isLoading}
        >
          <div className="flex items-center space-x-3">
            <span className="text-2xl">💳</span>
            <div className="text-left">
              <div className="font-semibold">Add Money</div>
              <div className="text-sm opacity-90">Recharge your wallet</div>
            </div>
          </div>
        </Button>

        <Button
          variant="outline"
          onClick={() => setShowTransactions(true)}
          className="h-16 border-2 border-gray-300 hover:border-gray-400"
        >
          <div className="flex items-center space-x-3">
            <span className="text-2xl">📊</span>
            <div className="text-left">
              <div className="font-semibold">Transaction History</div>
              <div className="text-sm text-gray-600">View all transactions</div>
            </div>
          </div>
        </Button>
      </div>

      {/* Recent Transactions */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowTransactions(true)}
          >
            View All
          </Button>
        </div>

        {transactions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">📝</div>
            <p>No transactions yet</p>
            <p className="text-sm">Your transaction history will appear here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.slice(0, 5).map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    transaction.type === 'credit' 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-red-100 text-red-600'
                  }`}>
                    {transaction.type === 'credit' ? '↗️' : '↙️'}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {transaction.description}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(transaction.timestamp).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className={`font-semibold ${
                  transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Usage Tips */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">💡 Wallet Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div className="flex items-start space-x-2">
            <span>💬</span>
            <div>
              <div className="font-medium">Chat Consultations</div>
              <div>Most affordable option for quick queries</div>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <span>🎤</span>
            <div>
              <div className="font-medium">Voice Calls</div>
              <div>Perfect for detailed discussions</div>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <span>📹</span>
            <div>
              <div className="font-medium">Video Calls</div>
              <div>Best for comprehensive consultations</div>
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <span>⚡</span>
            <div>
              <div className="font-medium">Auto-billing</div>
              <div>Charges are calculated per minute</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Modals */}
      <RechargeModal
        isOpen={showRechargeModal}
        onClose={() => setShowRechargeModal(false)}
      />

      <TransactionHistory
        isOpen={showTransactions}
        onClose={() => setShowTransactions(false)}
        transactions={transactions}
      />
    </div>
  );
}