'use client';

import React, { useState } from 'react';
import { Button, Card, Modal } from '@/components/ui';
import { WithdrawModal } from '@/components/professional/WithdrawModal';
import { TransactionHistory } from '@/components/wallet/TransactionHistory';
import { useProfessionalAuth } from '@/hooks/useProfessionalAuth';
import { useEffect } from 'react';

// TypeScript interfaces
interface ProfessionalBalance {
    balance: number;
    totalEarned: number;
    totalWithdrawn: number;
}

interface ProfessionalEarnings {
    totalSessions: number;
    totalGrossEarnings: number;
    totalCommission: number;
    totalNetEarnings: number;
    commissionRate: number;
}

interface WithdrawalRecord {
    id: string;
    amount: number;
    bankAccount: string;
    ifscCode: string;
    accountHolder: string;
    status: 'pending' | 'completed' | 'failed';
    requestedAt: string;
    processedAt?: string;
    transactionId?: string;
    notes?: string;
}

export function ProfessionalWalletDashboard() {
    const { professionalUser } = useProfessionalAuth();
    const [balance, setBalance] = useState<ProfessionalBalance>({ balance: 0, totalEarned: 0, totalWithdrawn: 0 });
    const [earnings, setEarnings] = useState<ProfessionalEarnings>({ totalSessions: 0, totalGrossEarnings: 0, totalCommission: 0, totalNetEarnings: 0, commissionRate: 0.30 });
    const [withdrawals, setWithdrawals] = useState<WithdrawalRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);
    const [showTransactions, setShowTransactions] = useState(false);

    // Fetch professional wallet data
    useEffect(() => {
        const fetchWalletData = async () => {
            if (!professionalUser?.id) return;

            try {
                setIsLoading(true);

                // Fetch balance
                const balanceResponse = await fetch(`http://localhost:8000/api/wallet/professional/balance?professionalId=${professionalUser.id}`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('professional_token')}` }
                });
                if (balanceResponse.ok) {
                    const balanceData = await balanceResponse.json();
                    setBalance(balanceData);
                }

                // Fetch earnings
                const earningsResponse = await fetch(`http://localhost:8000/api/wallet/professional/earnings?professionalId=${professionalUser.id}`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('professional_token')}` }
                });
                if (earningsResponse.ok) {
                    const earningsData = await earningsResponse.json();
                    setEarnings(earningsData);
                }

                // Fetch withdrawals
                const withdrawalsResponse = await fetch(`http://localhost:8000/api/wallet/professional/withdrawals?professionalId=${professionalUser.id}`, {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('professional_token')}` }
                });
                if (withdrawalsResponse.ok) {
                    const withdrawalsData = await withdrawalsResponse.json();
                    setWithdrawals(withdrawalsData);
                }
            } catch (error) {
                console.error('Error fetching wallet data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchWalletData();
    }, [professionalUser?.id]);

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Professional Wallet</h1>
                <p className="text-gray-600">Manage your consultation earnings and account balance</p>
            </div>

            {/* Professional Info */}
            <Card className="p-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-medium opacity-90">Dr. {professionalUser?.name || 'Professional'}</h2>
                        <div className="text-4xl font-bold mt-2">
                            ₹{balance.balance?.toFixed(2) || '0.00'}
                        </div>
                        <p className="text-sm opacity-75 mt-1">
                            Available for Withdrawal (After 30% Platform Fee)
                        </p>
                        <div className="flex items-center space-x-4 mt-2">
                            <span className="text-sm opacity-75">
                                💼 Professional Account
                            </span>
                            <span className="text-sm opacity-75">
                                🏥 {professionalUser?.title || 'Mental Health Expert'}
                            </span>
                        </div>
                        <div className="text-xs opacity-60 mt-1">
                            💡 Minimum withdrawal: ₹100
                        </div>
                    </div>
                    <div className="text-6xl opacity-20">👨‍⚕️</div>
                </div>
            </Card>

            {/* Active Session - Professionals don't have active sessions like users */}

            {/* Professional Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-6 text-center">
                    <div className="text-3xl mb-2">💼</div>
                    <div className="text-2xl font-bold text-blue-600">{earnings.totalSessions}</div>
                    <div className="text-sm text-gray-600">Total Sessions</div>
                    <div className="text-xs text-gray-500 mt-1">All time</div>
                </Card>

                <Card className="p-6 text-center">
                    <div className="text-3xl mb-2">💰</div>
                    <div className="text-2xl font-bold text-green-600">₹{earnings.totalNetEarnings?.toFixed(0) || '0'}</div>
                    <div className="text-sm text-gray-600">Net Earnings</div>
                    <div className="text-xs text-gray-500 mt-1">After commission</div>
                </Card>

                <Card className="p-6 text-center">
                    <div className="text-3xl mb-2">🏦</div>
                    <div className="text-2xl font-bold text-purple-600">₹{balance.totalWithdrawn?.toFixed(0) || '0'}</div>
                    <div className="text-sm text-gray-600">Total Withdrawn</div>
                    <div className="text-xs text-gray-500 mt-1">To bank account</div>
                </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button
                    onClick={() => setShowWithdrawModal(true)}
                    className="h-16 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
                    disabled={isLoading || (balance.balance || 0) < 100}
                >
                    <div className="flex items-center space-x-3">
                        <span className="text-2xl">💰</span>
                        <div className="text-left">
                            <div className="font-semibold">Withdraw Earnings</div>
                            <div className="text-sm opacity-90">Transfer to bank account</div>
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
                            <div className="text-sm text-gray-600">View earnings & expenses</div>
                        </div>
                    </div>
                </Button>
            </div>

            {/* Earnings Overview */}
            <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Earnings Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h4 className="font-medium text-gray-700 mb-3">This Month</h4>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Total Sessions:</span>
                                <span className="font-medium text-gray-900">{earnings.totalSessions}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Gross Earnings:</span>
                                <span className="font-medium text-gray-500">₹{earnings.totalGrossEarnings?.toFixed(2) || '0.00'}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-red-600">Platform Fee ({(earnings.commissionRate * 100).toFixed(0)}%):</span>
                                <span className="font-medium text-red-600">-₹{earnings.totalCommission?.toFixed(2) || '0.00'}</span>
                            </div>
                            <div className="flex justify-between pt-2 border-t border-gray-200">
                                <span className="font-semibold">Net Earnings:</span>
                                <span className="font-bold text-green-600">₹{earnings.totalNetEarnings?.toFixed(2) || '0.00'}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-blue-600">Available Balance:</span>
                                <span className="font-medium text-blue-600">₹{balance.balance?.toFixed(2) || '0.00'}</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-medium text-gray-700 mb-3">Recent Withdrawals</h4>
                        <div className="space-y-2 text-sm">
                            {withdrawals.slice(0, 4).map((withdrawal, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <span className={`w-2 h-2 rounded-full ${withdrawal.status === 'completed' ? 'bg-green-400' :
                                            withdrawal.status === 'pending' ? 'bg-yellow-400' : 'bg-red-400'
                                            }`}></span>
                                        <span>₹{withdrawal.amount} to ****{withdrawal.bankAccount}</span>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded-full ${withdrawal.status === 'completed' ? 'bg-green-100 text-green-800' :
                                        withdrawal.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                        {withdrawal.status}
                                    </span>
                                </div>
                            ))}
                            {withdrawals.length === 0 && (
                                <div className="text-gray-500 text-center py-2">
                                    No withdrawals yet
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Card>

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

                {withdrawals.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        <div className="text-4xl mb-2">💼</div>
                        <p>No transactions yet</p>
                        <p className="text-sm">Your professional earnings will appear here</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {withdrawals.slice(0, 5).map((withdrawal) => (
                            <div
                                key={withdrawal.id}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-red-100 text-red-600">
                                        💰
                                    </div>
                                    <div>
                                        <div className="font-medium text-gray-900">
                                            Withdrawal to {withdrawal.accountHolder}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {new Date(withdrawal.requestedAt).toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-semibold text-red-600">
                                        -₹{withdrawal.amount.toFixed(2)}
                                    </div>
                                    <div className={`text-xs px-2 py-1 rounded-full ${withdrawal.status === 'completed' ? 'bg-green-100 text-green-800' :
                                        withdrawal.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                        {withdrawal.status}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Card>

            {/* Professional Tips */}
            <Card className="p-6 bg-blue-50 border-blue-200">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">💡 Professional Tips</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
                    <div className="flex items-start space-x-2">
                        <span>⭐</span>
                        <div>
                            <div className="font-medium">Maintain High Ratings</div>
                            <div>Quality consultations lead to better earnings</div>
                        </div>
                    </div>
                    <div className="flex items-start space-x-2">
                        <span>⏰</span>
                        <div>
                            <div className="font-medium">Set Availability</div>
                            <div>More available hours = more consultations</div>
                        </div>
                    </div>
                    <div className="flex items-start space-x-2">
                        <span>📈</span>
                        <div>
                            <div className="font-medium">Track Performance</div>
                            <div>Monitor your earnings and session metrics</div>
                        </div>
                    </div>
                    <div className="flex items-start space-x-2">
                        <span>💰</span>
                        <div>
                            <div className="font-medium">Withdraw Earnings</div>
                            <div>Regular withdrawals to your bank account</div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Modals */}
            <WithdrawModal
                isOpen={showWithdrawModal}
                onClose={() => setShowWithdrawModal(false)}
                availableBalance={balance.balance || 0}
                professionalId={professionalUser?.id || ''}
                onWithdrawSuccess={() => {
                    // Refresh wallet data after successful withdrawal
                    window.location.reload();
                }}
            />

            <TransactionHistory
                isOpen={showTransactions}
                onClose={() => setShowTransactions(false)}
                transactions={withdrawals.map(w => ({
                    id: w.id,
                    userId: professionalUser?.id || '',
                    type: 'debit' as const,
                    amount: w.amount,
                    description: `Withdrawal to ${w.accountHolder}`,
                    category: 'refund' as const,
                    consultationType: undefined,
                    professionalId: undefined,
                    professionalName: undefined,
                    sessionId: undefined,
                    timestamp: w.requestedAt,
                    status: w.status
                }))}
            />
        </div>
    );
}