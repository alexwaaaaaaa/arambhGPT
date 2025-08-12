'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/layout';
import { Card, Button, Input, ErrorMessage, LoadingSpinner } from '@/components/ui';
import { useProfessional } from '@/hooks/useProfessional';

export default function ProfessionalSignUpPage() {
  const router = useRouter();
  const { signUp, loading, error: professionalError } = useProfessional();
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
  const [error, setError] = useState('');

  const handleInputChange = (name: string) => (value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Clear error when user types
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      const professionalData = {
        ...formData,
        specializations: formData.specializations.split(',').map(s => s.trim()),
        languages: formData.languages.split(',').map(l => l.trim())
      };

      await signUp(professionalData);
      router.push('/professional/signin?message=Registration successful! Please sign in.');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 py-12">
      <Container>
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl text-white">👨‍⚕️</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Join as Mental Health Expert
            </h1>
            <p className="text-gray-600">
              Help people heal and grow while building your practice online
            </p>
          </div>

          {/* Registration Form */}
          <Card className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {(error || professionalError) && (
                <ErrorMessage message={error || professionalError || ''} />
              )}

              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleInputChange('name')}
                    placeholder="Dr. Priya Sharma"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Expert Email *
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange('email')}
                    placeholder="dr.priya@hospital.com"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password *
                  </label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleInputChange('password')}
                    placeholder="Minimum 6 characters"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm Password *
                  </label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange('confirmPassword')}
                    placeholder="Confirm your password"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Professional Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Expert Title *
                  </label>
                  <select
                    id="title"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleSelectChange}
                    disabled={loading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
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
                  <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-2">
                    Years of Experience *
                  </label>
                  <Input
                    id="experience"
                    name="experience"
                    type="number"
                    required
                    value={formData.experience}
                    onChange={handleInputChange('experience')}
                    placeholder="5"
                    min="1"
                    max="50"
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="specializations" className="block text-sm font-medium text-gray-700 mb-2">
                  Specializations * <span className="text-xs text-gray-500">(comma separated)</span>
                </label>
                <Input
                  id="specializations"
                  name="specializations"
                  type="text"
                  required
                  value={formData.specializations}
                  onChange={handleInputChange('specializations')}
                  placeholder="Anxiety, Depression, Trauma Therapy, PTSD"
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="languages" className="block text-sm font-medium text-gray-700 mb-2">
                  Languages Spoken * <span className="text-xs text-gray-500">(comma separated)</span>
                </label>
                <Input
                  id="languages"
                  name="languages"
                  type="text"
                  required
                  value={formData.languages}
                  onChange={handleInputChange('languages')}
                  placeholder="Hindi, English, Punjabi"
                  disabled={loading}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700 mb-2">
                    License Number *
                  </label>
                  <Input
                    id="licenseNumber"
                    name="licenseNumber"
                    type="text"
                    required
                    value={formData.licenseNumber}
                    onChange={handleInputChange('licenseNumber')}
                    placeholder="PSY123456"
                    disabled={loading}
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={handleInputChange('phone')}
                    placeholder="+91 9876543210"
                    disabled={loading}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <Input
                  id="location"
                  name="location"
                  type="text"
                  required
                  value={formData.location}
                  onChange={handleInputChange('location')}
                  placeholder="Delhi, India"
                  disabled={loading}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <LoadingSpinner size="sm" className="mr-2" />
                    Creating Account...
                  </div>
                ) : (
                  '🚀 Create Expert Account'
                )}
              </Button>
            </form>

            {/* Links */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an expert account?{' '}
                <Link href="/professional/signin" className="text-teal-600 hover:text-teal-700 font-medium">
                  Sign In
                </Link>
              </p>
            </div>
          </Card>

          {/* Verification Notice */}
          <Card className="mt-6 p-4 bg-yellow-50 border-yellow-200">
            <div className="flex items-start">
              <span className="text-yellow-600 mr-2">⚠️</span>
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-1">Account Verification Required</p>
                <p>Your expert credentials will be verified within 24-48 hours. You'll receive an email confirmation once approved.</p>
              </div>
            </div>
          </Card>
        </div>
      </Container>
    </div>
  );
}