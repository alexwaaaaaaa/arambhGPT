'use client';

import React, { useState } from 'react';
import { Button, Card, Modal } from '@/components/ui';
import { useWallet } from '@/hooks/useWallet';
import { WalletBalance } from '@/components/wallet/WalletBalance';

interface Professional {
    id: string;
    name: string;
    title: string;
    specialization: string[];
    experience: number;
    rating: number;
    chat_rate: number;
    call_rate: number;
    video_rate: number;
    availability: string;
}

interface BookingModalProps {
    professional: Professional;
    isOpen: boolean;
    onClose: () => void;
    onBooking: (bookingData: any) => void;
}

type ConsultationType = 'chat' | 'voice' | 'video';

export function BookingModal({ professional, isOpen, onClose, onBooking }: BookingModalProps) {
    const [selectedType, setSelectedType] = useState<ConsultationType>('chat');
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [issue, setIssue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { balance, hasSufficientBalance } = useWallet();

    const consultationTypes = [
        {
            type: 'chat' as ConsultationType,
            icon: '💬',
            title: 'Text Chat',
            description: 'Secure messaging with professional',
            rate: professional.chat_rate,
            duration: '30 mins',
            features: ['Instant messaging', 'File sharing', 'Session notes']
        },
        {
            type: 'voice' as ConsultationType,
            icon: '🎤',
            title: 'Voice Call',
            description: 'Audio consultation call',
            rate: professional.call_rate,
            duration: '45 mins',
            features: ['High-quality audio', 'Call recording', 'Private & secure']
        },
        {
            type: 'video' as ConsultationType,
            icon: '📹',
            title: 'Video Call',
            description: 'Face-to-face video consultation',
            rate: professional.video_rate,
            duration: '60 mins',
            features: ['HD video quality', 'Screen sharing', 'Session recording']
        }
    ];

    const timeSlots = [
        '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
        '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
        '06:00 PM', '07:00 PM', '08:00 PM'
    ];

    const handleBooking = async () => {
        if (!selectedDate || !selectedTime || !issue.trim()) {
            alert('Please fill all required fields');
            return;
        }

        setIsLoading(true);
        try {
            const bookingData = {
                professionalId: professional.id,
                type: selectedType,
                date: selectedDate,
                time: selectedTime,
                issue: issue.trim(),
                rate: consultationTypes.find(t => t.type === selectedType)?.rate,
                duration: consultationTypes.find(t => t.type === selectedType)?.duration
            };

            await onBooking(bookingData);
            onClose();
        } catch (error) {
            console.error('Booking failed:', error);
            alert('Booking failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const selectedConsultation = consultationTypes.find(t => t.type === selectedType);

    return (
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
            <div className="p-6">
                {/* Header */}
                <div className="flex items-center space-x-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-orange-500 rounded-full flex items-center justify-center">
                        <span className="text-2xl">👨‍⚕️</span>
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Book Consultation</h2>
                        <p className="text-gray-600">Dr. {professional.name} • {professional.title}</p>
                    </div>
                </div>

                {/* Wallet Balance */}
                <div className="mb-6">
                    <WalletBalance showDetails={true} />
                </div>

                {/* Consultation Type Selection */}
                <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Choose Consultation Type</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {consultationTypes.map((consultation) => (
                            <div
                                key={consultation.type}
                                className="cursor-pointer transition-all duration-200"
                                onClick={() => setSelectedType(consultation.type)}
                            >
                                <Card
                                    className={`p-4 transition-all duration-200 ${selectedType === consultation.type
                                            ? 'ring-2 ring-teal-500 bg-teal-50 border-teal-200'
                                            : 'hover:shadow-md border-gray-200'
                                        }`}
                                >
                                    <div className="text-center">
                                        <div className="text-3xl mb-2">{consultation.icon}</div>
                                        <h4 className="font-semibold text-gray-900 mb-1">{consultation.title}</h4>
                                        <p className="text-sm text-gray-600 mb-2">{consultation.description}</p>
                                        <div className="text-lg font-bold text-teal-600 mb-2">
                                            ₹{consultation.rate}
                                        </div>
                                        <div className="text-xs text-gray-500 mb-3">{consultation.duration}</div>
                                        <div className="space-y-1">
                                            {consultation.features.map((feature, index) => (
                                                <div key={index} className="text-xs text-gray-600 flex items-center">
                                                    <span className="w-1 h-1 bg-teal-400 rounded-full mr-2"></span>
                                                    {feature}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Date & Time Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Date *
                        </label>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Time *
                        </label>
                        <select
                            value={selectedTime}
                            onChange={(e) => setSelectedTime(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                            required
                        >
                            <option value="">Choose time slot</option>
                            {timeSlots.map((time) => (
                                <option key={time} value={time}>
                                    {time}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Issue Description */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Describe your concern *
                    </label>
                    <textarea
                        value={issue}
                        onChange={(e) => setIssue(e.target.value)}
                        placeholder="Please describe your mental health concern or what you'd like to discuss..."
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                        required
                    />
                </div>

                {/* Booking Summary */}
                {selectedConsultation && (
                    <Card className="p-4 bg-gradient-to-r from-teal-50 to-orange-50 border-teal-200 mb-6">
                        <h4 className="font-semibold text-gray-900 mb-2">Booking Summary</h4>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span>Consultation Type:</span>
                                <span className="font-medium">{selectedConsultation.title}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Duration:</span>
                                <span className="font-medium">{selectedConsultation.duration}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Professional:</span>
                                <span className="font-medium">Dr. {professional.name}</span>
                            </div>
                            {selectedDate && selectedTime && (
                                <div className="flex justify-between">
                                    <span>Date & Time:</span>
                                    <span className="font-medium">{selectedDate} at {selectedTime}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-lg font-bold text-teal-600 pt-2 border-t border-teal-200">
                                <span>Total Amount:</span>
                                <span>₹{selectedConsultation.rate}</span>
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
                        onClick={handleBooking}
                        className="flex-1 bg-gradient-to-r from-teal-500 to-orange-500 hover:from-teal-600 hover:to-orange-600 text-white"
                        disabled={isLoading || !hasSufficientBalance(selectedConsultation?.rate || 0)}
                    >
                        {isLoading ? (
                            <div className="flex items-center space-x-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Booking...</span>
                            </div>
                        ) : (
                            `Book ${selectedConsultation?.title} - ₹${selectedConsultation?.rate}`
                        )}
                    </Button>
                </div>

                {/* Terms & Conditions */}
                <div className="mt-4 text-xs text-gray-500 text-center">
                    By booking, you agree to our{' '}
                    <a href="/terms" className="text-teal-600 hover:underline">Terms of Service</a>
                    {' '}and{' '}
                    <a href="/privacy" className="text-teal-600 hover:underline">Privacy Policy</a>
                </div>
            </div>
        </Modal>
    );
}