'use client';

import React, { useState } from 'react';
import { Modal, Button, Input, ErrorMessage, LoadingSpinner } from '@/components/ui';
import { apiClient } from '@/lib/api';

interface ProfessionalSignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function ProfessionalSignupModal({ 
  isOpen, 
  onClose, 
  onSuccess 
}: ProfessionalSignupModalProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    title: '',
    specializations: '',
    experience: '',
    languages: '',
    licenseNumber: '',
    location: '',
    phone: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleInputValueChange = (name: string) => (value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleNextStep = () => {
    // Validate current step
    if (step === 1) {
      if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
        setError('Please fill in all required fields');
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters long');
        return;
      }
    }
    
    if (step === 2) {
      if (!formData.title || !formData.specializations || !formData.experience || !formData.languages) {
        setError('Please fill in all required fields');
        return;
      }
    }

    setStep(step + 1);
    setError('');
  };

  const handlePrevStep = () => {
    setStep(step - 1);
    setError('');
  };

  const handleSubmit = async () => {
    if (!formData.licenseNumber || !formData.location || !formData.phone) {
      setError('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const professionalData = {
        ...formData,
        specializations: formData.specializations.split(',').map(s => s.trim()),
        languages: formData.languages.split(',').map(l => l.trim())
      };

      await apiClient.professionalSignUp(professionalData);
      onSuccess?.();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      title: '',
      specializations: '',
      experience: '',
      languages: '',
      licenseNumber: '',
      location: '',
      phone: ''
    });
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Join as Mental Health Professional">
      <div className="space-y-6">
        {/* Progress Indicator */}
        <div className="flex items-center justify-center space-x-2">
          {[1, 2, 3].map((stepNumber) => (
            <div
              key={stepNumber}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                stepNumber <= step
                  ? 'bg-teal-600 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {stepNumber}
            </div>
          ))}
        </div>

        {error && <ErrorMessage message={error} />}

        {/* Step 1: Basic Information */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-center">Basic Information</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <Input
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleInputValueChange('name')}
                placeholder="Dr. Priya Sharma"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Professional Email *
              </label>
              <Input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputValueChange('email')}
                placeholder="dr.priya@hospital.com"
                disabled={isLoading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password *
                </label>
                <Input
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleInputValueChange('password')}
                  placeholder="Minimum 6 characters"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password *
                </label>
                <Input
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputValueChange('confirmPassword')}
                  placeholder="Confirm password"
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Professional Details */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-center">Professional Details</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Professional Title *
                </label>
                <select
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  <option value="">Select Title</option>
                  <option value="Clinical Psychologist">Clinical Psychologist</option>
                  <option value="Counseling Psychologist">Counseling Psychologist</option>
                  <option value="Psychiatrist">Psychiatrist</option>
                  <option value="Licensed Counselor">Licensed Counselor</option>
                  <option value="Marriage & Family Therapist">Marriage & Family Therapist</option>
                  <option value="Child Psychologist">Child Psychologist</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Years of Experience *
                </label>
                <Input
                  name="experience"
                  type="number"
                  required
                  value={formData.experience}
                  onChange={handleInputValueChange('experience')}
                  placeholder="5"
                  min="1"
                  max="50"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Specializations * <span className="text-xs text-gray-500">(comma separated)</span>
              </label>
              <Input
                name="specializations"
                type="text"
                required
                value={formData.specializations}
                onChange={handleInputValueChange('specializations')}
                placeholder="Anxiety, Depression, Trauma Therapy"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Languages Spoken * <span className="text-xs text-gray-500">(comma separated)</span>
              </label>
              <Input
                name="languages"
                type="text"
                required
                value={formData.languages}
                onChange={handleInputValueChange('languages')}
                placeholder="Hindi, English, Punjabi"
                disabled={isLoading}
              />
            </div>
          </div>
        )}

        {/* Step 3: Verification Details */}
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-center">Verification Details</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                License Number *
              </label>
              <Input
                name="licenseNumber"
                type="text"
                required
                value={formData.licenseNumber}
                onChange={handleInputValueChange('licenseNumber')}
                placeholder="PSY123456"
                disabled={isLoading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <Input
                  name="phone"
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={handleInputValueChange('phone')}
                  placeholder="+91 9876543210"
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <Input
                  name="location"
                  type="text"
                  required
                  value={formData.location}
                  onChange={handleInputValueChange('location')}
                  placeholder="Delhi, India"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
              <div className="flex items-start">
                <span className="text-yellow-600 mr-2">⚠️</span>
                <div className="text-sm text-yellow-800">
                  <p className="font-medium mb-1">Verification Required</p>
                  <p>Your credentials will be verified within 24-48 hours before account activation.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between pt-4">
          <div>
            {step > 1 && (
              <Button variant="outline" onClick={handlePrevStep} disabled={isLoading}>
                Previous
              </Button>
            )}
          </div>

          <div className="space-x-2">
            <Button variant="outline" onClick={handleClose} disabled={isLoading}>
              Cancel
            </Button>
            
            {step < 3 ? (
              <Button onClick={handleNextStep} disabled={isLoading}>
                Next
              </Button>
            ) : (
              <Button onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center">
                    <LoadingSpinner size="sm" className="mr-2" />
                    Creating Account...
                  </div>
                ) : (
                  'Create Account'
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}