'use client';

import React, { useState } from 'react';
import { Button, Card, Input, Modal } from '@/components/ui';

interface WithdrawModalProps {
    isOpen: boolean;
    onClose: () => void;
    availableBalance: number;
    professionalId: string;
    onWithdrawSuccess?: () => void;
}

export function WithdrawModal({ isOpen, onClose, availableBalance, professionalId, onWithdrawSuccess }: WithdrawModalProps) {
    const [amount, setAmount] = useState('');
    const [bankAccount, setBankAccount] = useState('');
    const [ifscCode, setIfscCode] = useState('');
    const [accountHolder, setAccountHolder] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const withdrawAmount = parseFloat(amount) || 0;
    const minWithdraw = 100;
    const maxWithdraw = availableBalance;

    const handleWithdraw = async () => {
        if (withdrawAmount < minWithdraw || withdrawAmount > maxWithdraw) {
            alert(`Please enter amount between ₹${minWithdraw} and ₹${maxWithdraw}`);
            return;
        }

        if (!bankAccount || !ifscCode || !accountHolder) {
            alert('Please fill all bank details');
            return;
        }

        setIsProcessing(true);
        try {
            const response = await fetch(`http://localhost:8000/api/wallet/professional/withdraw?professionalId=${professionalId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('professional_token')}`
                },
                body: JSON.stringify({
                    amount: withdrawAmount,
                    bank_account: bankAccount,
                    ifsc_code: ifscCode,
                    account_holder: accountHolder
                })
            });

            if (response.ok) {
                alert('Withdrawal request submitted successfully! It will be processed within 2-3 business days.');
                setAmount('');
                setBankAccount('');
                setIfscCode('');
                setAccountHolder('');
                onClose();
                if (onWithdrawSuccess) {
                    onWithdrawSuccess();
                }
            } else {
                throw new Error('Failed to process withdrawal');
            }
        } catch (error) {
            console.error('Withdrawal error:', error);
            alert('Failed to process withdrawal. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="💰 Withdraw Earnings">
            <div className="space-y-6">
                {/* Balance Info */}
                <Card className="p-4 bg-green-50 border-green-200">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">
                            ₹{availableBalance.toFixed(2)}
                        </div>
                        <div className="text-sm text-green-700">Available for Withdrawal</div>
                        <div className="text-xs text-gray-600 mt-1">
                            (After 30% platform commission deduction)
                        </div>
                    </div>
                </Card>

                {/* Withdrawal Amount */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Withdrawal Amount *
                    </label>
                    <Input
                        type="number"
                        value={amount}
                        onChange={(value) => setAmount(value)}
                        placeholder={`Min: ₹${minWithdraw}, Max: ₹${maxWithdraw}`}
                        min={minWithdraw}
                        max={maxWithdraw}
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Minimum: ₹{minWithdraw}</span>
                        <span>Maximum: ₹{maxWithdraw}</span>
                    </div>
                </div>

                {/* Quick Amount Buttons */}
                <div className="grid grid-cols-3 gap-2">
                    {[
                        Math.min(500, maxWithdraw),
                        Math.min(1000, maxWithdraw),
                        maxWithdraw
                    ].map((quickAmount) => (
                        <Button
                            key={quickAmount}
                            variant="outline"
                            size="sm"
                            onClick={() => setAmount(quickAmount.toString())}
                            disabled={quickAmount < minWithdraw}
                        >
                            {quickAmount === maxWithdraw ? 'All' : `₹${quickAmount}`}
                        </Button>
                    ))}
                </div>

                {/* Bank Details */}
                <div className="space-y-4">
                    <h3 className="font-medium text-gray-900">Bank Account Details</h3>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Account Holder Name *
                        </label>
                        <Input
                            value={accountHolder}
                            onChange={(value) => setAccountHolder(value)}
                            placeholder="As per bank records"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Bank Account Number *
                        </label>
                        <Input
                            value={bankAccount}
                            onChange={(value) => setBankAccount(value)}
                            placeholder="Enter account number"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            IFSC Code *
                        </label>
                        <Input
                            value={ifscCode}
                            onChange={(value) => setIfscCode(value.toUpperCase())}
                            placeholder="e.g., SBIN0001234"
                        />
                    </div>
                </div>

                {/* Processing Info */}
                <Card className="p-4 bg-blue-50 border-blue-200">
                    <div className="text-sm text-blue-800">
                        <div className="font-medium mb-2">📋 Withdrawal Process:</div>
                        <ul className="space-y-1 text-xs">
                            <li>• Processing time: 2-3 business days</li>
                            <li>• No additional charges from our side</li>
                            <li>• Bank charges (if any) will be deducted by your bank</li>
                            <li>• You'll receive SMS/email confirmation</li>
                        </ul>
                    </div>
                </Card>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isProcessing}
                        className="flex-1"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleWithdraw}
                        disabled={isProcessing || withdrawAmount < minWithdraw || withdrawAmount > maxWithdraw}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                    >
                        {isProcessing ? (
                            <div className="flex items-center space-x-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Processing...</span>
                            </div>
                        ) : (
                            `Withdraw ₹${withdrawAmount.toFixed(2)}`
                        )}
                    </Button>
                </div>
            </div>
        </Modal>
    );
}