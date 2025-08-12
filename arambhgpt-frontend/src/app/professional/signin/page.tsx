'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Container } from '@/components/layout';
import { Card, Button, Input, ErrorMessage, LoadingSpinner } from '@/components/ui';
import { useProfessional } from '@/hooks/useProfessional';

export default function ProfessionalSignInPage() {
  const { signIn, loading, error: professionalError } = useProfessional();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleInputChange = (name: string) => (value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      await signIn(formData);
      // signIn function already handles redirect to dashboard
    } catch (err: any) {
      setError(err.message || 'Sign in failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 py-12">
      <Container>
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl text-white">👨‍⚕️</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Expert Sign In
            </h1>
            <p className="text-gray-600">
              Access your expert dashboard and manage your practice
            </p>
          </div>

          {/* Sign In Form */}
          <Card className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {(error || professionalError) && (
                <ErrorMessage message={error || professionalError || ''} />
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Expert Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  placeholder="dr.example@hospital.com"
                  disabled={loading}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange('password')}
                  placeholder="Enter your password"
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
                    Signing In...
                  </div>
                ) : (
                  '🔐 Sign In to Dashboard'
                )}
              </Button>
            </form>

            {/* Links */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don't have an expert account?{' '}
                <Link href="/professional/signup" className="text-teal-600 hover:text-teal-700 font-medium">
                  Register as Expert
                </Link>
              </p>
            </div>
          </Card>

          {/* Demo Credentials */}
          <Card className="mt-6 p-4 bg-blue-50 border-blue-200">
            <h3 className="text-sm font-medium text-blue-900 mb-2">Demo Credentials:</h3>
            <div className="text-xs text-blue-800 space-y-1">
              <p><strong>Email:</strong> dr.priya@demo.com</p>
              <p><strong>Password:</strong> priya123</p>
            </div>
          </Card>
        </div>
      </Container>
    </div>
  );
}