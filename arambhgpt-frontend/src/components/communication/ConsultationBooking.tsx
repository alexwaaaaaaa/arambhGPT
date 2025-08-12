'use client';

import React, { useState } from 'react';
import { Button, Card, Input, Modal } from '@/components/ui';
import { useAuth } from '@/contexts/AuthContext';

interface Expert {
  id: string;
  name: string;
  title: string;
  specialization: string[];
  experience: number;
  rating: number;
  totalReviews: number;
  availability: 'online' | 'busy' | 'offline';
  rates: {
    chat: number;
    voice: number;
    video: number;
  };
  languages: string[];
  profileImage?: string;
  nextAvailable?: string;
}

interface ConsultationBookingProps {
  expert: Expert;
  isOpen: boolean;
  onClose: () => void;
  onBookingConfirm: (bookingDetails: any) => void;
}

export function ConsultationBooking({ expert, isOpen, onClose, onBookingConfirm }: ConsultationBookingProps) {
  const { user } = useAuth();
  const [selectedType, setSelectedType] = useState<'chat' | 'voice' | 'video'>('chat');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [duration, setDuration] = useState(30);
  const [concerns, setConcerns] = useState('');
  const [isBooking, setIsBooking] = useState(false);

  // Generate available time slots
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 20; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push(time);
      }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();
  const totalCost = duration * expert.rates[selectedType];

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime || !concerns.trim()) {
      alert('Please fill all required fields');
      return;
    }

    setIsBooking(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      const bookingDetails = {
        expertId: expert.id,
        expertName: expert.name,
        patientId: user?.id,
        patientName: user?.name,
        type: selectedType,
        date: selectedDate,
        time: selectedTime,
        duration,
        concerns,
        totalCost,
        status: 'confirmed'
      };

      onBookingConfirm(bookingDetails);
      onClose();
      
      // Generate session ID and redirect to consultation
      const sessionId = `session_${expert.id}_${Date.now()}`;
      
      alert(`Consultation booked successfully! 
      
Expert: ${expert.name}
Type: ${selectedType.toUpperCase()}
Date: ${selectedDate}
Time: ${selectedTime}
Duration: ${duration} minutes
Total Cost: ₹${totalCost}

You will receive a confirmation email shortly.`);

      // Redirect to consultation page
      setTimeout(() => {
        window.location.href = `/consultation/${sessionId}`;
      }, 2000);

    } catch (error) {
      alert('Booking failed. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Book Consultation">
      <div className="space-y-6">
        {/* Expert Info */}
        <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-2xl text-white">👨‍⚕️</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{expert.name}</h3>
              <p className="text-gray-600">{expert.title}</p>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-yellow-500">⭐</span>
                <span className="text-sm text-gray-600">{expert.rating} ({expert.totalReviews} reviews)</span>
                <span className="text-sm text-gray-400">•</span>
                <span className="text-sm text-gray-600">{expert.experience} years exp</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Consultation Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select Consultation Type *
          </label>
          <div className="grid grid-cols-3 gap-3">
            {(['chat', 'voice', 'video'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedType === type
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">
                    {type === 'chat' && '💬'}
                    {type === 'voice' && '🎤'}
                    {type === 'video' && '📹'}
                  </div>
                  <div className="font-medium capitalize">{type}</div>
                  <div className="text-sm text-gray-600">₹{expert.rates[type]}/min</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Date Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Date *
          </label>
          <Input
            type="date"
            value={selectedDate}
            onChange={setSelectedDate}
            min={new Date().toISOString().split('T')[0]}
            max={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
          />
        </div>

        {/* Time Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Time *
          </label>
          <select
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Choose time slot</option>
            {timeSlots.map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
          </select>
        </div>

        {/* Duration */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duration (minutes)
          </label>
          <select
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value={15}>15 minutes</option>
            <option value={30}>30 minutes</option>
            <option value={45}>45 minutes</option>
            <option value={60}>60 minutes</option>
          </select>
        </div>

        {/* Concerns */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Describe your concerns *
          </label>
          <textarea
            value={concerns}
            onChange={(e) => setConcerns(e.target.value)}
            placeholder="Please describe what you'd like to discuss in this consultation..."
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            This helps the expert prepare for your session
          </p>
        </div>

        {/* Cost Summary */}
        <Card className="p-4 bg-green-50 border-green-200">
          <h4 className="font-semibold text-gray-900 mb-2">Cost Summary</h4>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Consultation Type:</span>
              <span className="capitalize">{selectedType}</span>
            </div>
            <div className="flex justify-between">
              <span>Rate per minute:</span>
              <span>₹{expert.rates[selectedType]}</span>
            </div>
            <div className="flex justify-between">
              <span>Duration:</span>
              <span>{duration} minutes</span>
            </div>
            <div className="border-t border-green-300 pt-1 mt-2">
              <div className="flex justify-between font-semibold">
                <span>Total Cost:</span>
                <span>₹{totalCost}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
            disabled={isBooking}
          >
            Cancel
          </Button>
          <Button
            onClick={handleBooking}
            disabled={isBooking || !selectedDate || !selectedTime || !concerns.trim()}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
          >
            {isBooking ? (
              <div className="flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Booking...
              </div>
            ) : (
              `Book for ₹${totalCost}`
            )}
          </Button>
        </div>

        {/* Terms */}
        <div className="text-xs text-gray-500 text-center">
          By booking, you agree to our{' '}
          <a href="#" className="text-blue-500 hover:underline">Terms of Service</a>
          {' '}and{' '}
          <a href="#" className="text-blue-500 hover:underline">Privacy Policy</a>
        </div>
      </div>
    </Modal>
  );
}