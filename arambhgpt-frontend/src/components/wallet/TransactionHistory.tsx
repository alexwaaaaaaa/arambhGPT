'use client';

import React, { useState } from 'react';
import { Button, Modal } from '@/components/ui';
import { Transaction } from '@/types/wallet';

interface TransactionHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
}

export function TransactionHistory({ isOpen, onClose, transactions }: TransactionHistoryProps) {
  const [filter, setFilter] = useState<'all' | 'credit' | 'debit'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount'>('date');

  const filteredTransactions = transactions
    .filter(transaction => filter === 'all' || transaction.type === filter)
    .sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      } else {
        return b.amount - a.amount;
      }
    });

  const getTransactionIcon = (transaction: Transaction) => {
    if (transaction.category === 'recharge') return '💳';
    if (transaction.category === 'consultation') {
      switch (transaction.consultationType) {
        case 'chat': return '💬';
        case 'voice': return '🎤';
        case 'video': return '📹';
        default: return '💬';
      }
    }
    if (transaction.category === 'refund') return '↩️';
    return transaction.type === 'credit' ? '↗️' : '↙️';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'failed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const totalCredit = transactions
    .filter(t => t.type === 'credit' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalDebit = transactions
    .filter(t => t.type === 'debit' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Transaction History</h2>
            <p className="text-gray-600">View all your wallet transactions</p>
          </div>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="text-2xl font-bold text-green-600">₹{totalCredit.toFixed(2)}</div>
            <div className="text-sm text-green-700">Total Credits</div>
          </div>
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="text-2xl font-bold text-red-600">₹{totalDebit.toFixed(2)}</div>
            <div className="text-sm text-red-700">Total Debits</div>
          </div>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{transactions.length}</div>
            <div className="text-sm text-blue-700">Total Transactions</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Filter:</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'all' | 'credit' | 'debit')}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            >
              <option value="all">All Transactions</option>
              <option value="credit">Credits Only</option>
              <option value="debit">Debits Only</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'amount')}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            >
              <option value="date">Date</option>
              <option value="amount">Amount</option>
            </select>
          </div>
        </div>

        {/* Transactions List */}
        <div className="max-h-96 overflow-y-auto">
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">📝</div>
              <p>No transactions found</p>
              <p className="text-sm">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.type === 'credit' 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {getTransactionIcon(transaction)}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {transaction.description}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(transaction.timestamp).toLocaleString()}
                      </div>
                      {transaction.professionalName && (
                        <div className="text-sm text-gray-600">
                          with Dr. {transaction.professionalName}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-semibold text-lg ${
                      transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {transaction.type === 'credit' ? '+' : '-'}₹{transaction.amount.toFixed(2)}
                    </div>
                    <div className={`text-xs px-2 py-1 rounded-full ${getStatusColor(transaction.status)}`}>
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Export Options */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing {filteredTransactions.length} of {transactions.length} transactions
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                📊 Export CSV
              </Button>
              <Button variant="outline" size="sm">
                📄 Export PDF
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}