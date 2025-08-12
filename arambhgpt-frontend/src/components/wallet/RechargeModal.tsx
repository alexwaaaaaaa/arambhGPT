'use client';

import React, { useState } from 'react';
import { Button, Card, Modal } from '@/components/ui';
import { useWallet } from '@/hooks/useWallet';
import { RechargeOption } from '@/types/wallet';

interface RechargeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function RechargeModal({ isOpen, onClose }: RechargeModalProps) {
    const { rechargeWallet, isLoading } = useWallet();
    const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
    const [customAmount, setCustomAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('upi');

    const rechargeOptions: RechargeOption[] = [
        { amount: 100, bonus: 0 },
        { amount: 250, bonus: 25, popular: true },
        { amount: 500, bonus: 75 },
        { amount: 1000, bonus: 200 },
        { amount: 2000, bonus: 500 },
        { amount: 5000, bonus: 1500 }
    ];

    const paymentMethods = [
        { id: 'upi', name: 'UPI', icon: '📱', description: 'PhonePe, GPay, Paytm' },
        { id: 'card', name: 'Credit/Debit Card', icon: '💳', description: 'Visa, Mastercard, RuPay' },
        { id: 'netbanking', name: 'Net Banking', icon: '🏦', description: 'All major banks' },
        { id: 'wallet', name: 'Digital Wallet', icon: '💰', description: 'Paytm, PhonePe wallet' }
    ];

    const handleRecharge = async () => {
        const amount = selectedAmount || parseFloat(customAmount);
        if (!amount || amount < 10) {
            alert('Minimum recharge amount is ₹10');
            return;
        }

        try {
            const result = await rechargeWallet(amount, paymentMethod);

            if (result.paymentOrder && result.paymentOrder.test_mode) {
                // For test mode, simulate successful payment
                alert(`Test Payment Successful!\nAmount: ₹${amount}\nBonus: ₹${result.bonus}\nTotal Credit: ₹${result.totalCredit}`);
                onClose();
                setSelectedAmount(null);
                setCustomAmount('');
            } else if (result.paymentOrder) {
                // Redirect to payment gateway
                window.open(result.paymentOrder.payment_url, '_blank');
                alert('Please complete the payment in the new window. Your wallet will be updated automatically.');
                onClose();
                setSelectedAmount(null);
                setCustomAmount('');
            }
        } catch (error) {
            alert('Recharge failed. Please try again.');
        }
    };

    const getTotalAmount = () => {
        const baseAmount = selectedAmount || parseFloat(customAmount) || 0;
        const option = rechargeOptions.find(opt => opt.amount === baseAmount);
        return baseAmount + (option?.bonus || 0);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <div className="p-6">
                {/* Header */}
                <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Add Money to Wallet</h2>
                    <p className="text-gray-600">Choose an amount to recharge your wallet</p>
                </div>

                {/* Recharge Options */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Recharge</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {rechargeOptions.map((option) => (
                            <div
                                key={option.amount}
                                className={`relative cursor-pointer transition-all duration-200 ${selectedAmount === option.amount
                                    ? 'ring-2 ring-teal-500'
                                    : 'hover:shadow-md'
                                    }`}
                                onClick={() => {
                                    setSelectedAmount(option.amount);
                                    setCustomAmount('');
                                }}
                            >
                                <Card className="p-4 text-center">
                                    {option.popular && (
                                        <div className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full">
                                            Popular
                                        </div>
                                    )}
                                    <div className="text-xl font-bold text-gray-900">
                                        ₹{option.amount}
                                    </div>
                                    {option.bonus > 0 && (
                                        <div className="text-sm text-green-600 font-medium">
                                            +₹{option.bonus} bonus
                                        </div>
                                    )}
                                    <div className="text-xs text-gray-500 mt-1">
                                        Total: ₹{option.amount + option.bonus}
                                    </div>
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Custom Amount */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Custom Amount</h3>
                    <div className="flex items-center space-x-2">
                        <span className="text-gray-500">₹</span>
                        <input
                            type="number"
                            value={customAmount}
                            onChange={(e) => {
                                setCustomAmount(e.target.value);
                                setSelectedAmount(null);
                            }}
                            placeholder="Enter amount (min ₹10)"
                            min="10"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        />
                    </div>
                </div>

                {/* Payment Methods */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Payment Method</h3>
                    <div className="space-y-2">
                        {paymentMethods.map((method) => (
                            <div
                                key={method.id}
                                className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 ${paymentMethod === method.id
                                    ? 'border-teal-500 bg-teal-50'
                                    : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                onClick={() => setPaymentMethod(method.id)}
                            >
                                <div className="flex items-center space-x-3">
                                    <span className="text-2xl">{method.icon}</span>
                                    <div className="flex-1">
                                        <div className="font-medium text-gray-900">{method.name}</div>
                                        <div className="text-sm text-gray-500">{method.description}</div>
                                    </div>
                                    <div className={`w-4 h-4 rounded-full border-2 ${paymentMethod === method.id
                                        ? 'border-teal-500 bg-teal-500'
                                        : 'border-gray-300'
                                        }`}>
                                        {paymentMethod === method.id && (
                                            <div className="w-full h-full rounded-full bg-white scale-50"></div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Summary */}
                {(selectedAmount || customAmount) && (
                    <Card className="p-4 bg-gradient-to-r from-teal-50 to-orange-50 border-teal-200 mb-6">
                        <h4 className="font-semibold text-gray-900 mb-2">Recharge Summary</h4>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span>Base Amount:</span>
                                <span>₹{selectedAmount || parseFloat(customAmount) || 0}</span>
                            </div>
                            {selectedAmount && rechargeOptions.find(opt => opt.amount === selectedAmount)?.bonus && (
                                <div className="flex justify-between text-green-600">
                                    <span>Bonus:</span>
                                    <span>+₹{rechargeOptions.find(opt => opt.amount === selectedAmount)?.bonus}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-lg font-bold text-teal-600 pt-2 border-t border-teal-200">
                                <span>Total Credit:</span>
                                <span>₹{getTotalAmount()}</span>
                            </div>
                        </div>
                    </Card>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-4">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="flex-1"
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleRecharge}
                        className="flex-1 bg-gradient-to-r from-teal-500 to-orange-500 hover:from-teal-600 hover:to-orange-600 text-white"
                        disabled={isLoading || (!selectedAmount && !customAmount)}
                    >
                        {isLoading ? (
                            <div className="flex items-center space-x-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Processing...</span>
                            </div>
                        ) : (
                            `Recharge ₹${getTotalAmount()}`
                        )}
                    </Button>
                </div>

                {/* Security Note */}
                <div className="mt-4 text-xs text-gray-500 text-center">
                    🔒 Your payment is secured with 256-bit SSL encryption
                </div>
            </div>
        </Modal>
    );
}