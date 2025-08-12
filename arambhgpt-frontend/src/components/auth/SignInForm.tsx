'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, ErrorMessage } from '@/components/ui';
import { useAuth } from '@/hooks';
import { SignInData } from '@/types';

interface SignInFormProps {
  onSuccess?: () => void;
  className?: string;
}

export function SignInForm({ onSuccess, className = '' }: SignInFormProps) {
  const router = useRouter();
  const { signIn, isLoading, error, clearError } = useAuth();
  
  const [formData, setFormData] = useState<SignInData>({
    email: '',
    password: '',
  });
  
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [rememberMe, setRememberMe] = useState(false);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Email validation
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: keyof SignInData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    // Clear API error when user makes changes
    if (error) {
      clearError();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await signIn(formData);
      
      // Immediate success feedback
      console.log('Sign in successful!');
      
      // Success callback or redirect
      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/chat');
      }
    } catch (err: any) {
      // Show specific error message
      console.error('Sign in failed:', err);
      
      // Set user-friendly error message
      if (err.message?.includes('timeout')) {
        setValidationErrors({ email: 'Connection timeout - please try again' });
      } else if (err.message?.includes('Incorrect email or password')) {
        setValidationErrors({ password: 'Incorrect email or password' });
      } else {
        setValidationErrors({ email: 'Sign in failed - please try again' });
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleSubmit(e as any);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`space-y-6 ${className}`}>
      {/* API Error */}
      {error && (
        <ErrorMessage 
          message={error} 
          variant="card"
          onRetry={clearError}
        />
      )}

      {/* Email Field */}
      <Input
        type="email"
        label="Email Address"
        placeholder="Enter your email address"
        value={formData.email}
        onChange={(value) => handleInputChange('email', value)}
        onKeyDown={handleKeyDown}
        error={validationErrors.email}
        required
        disabled={isLoading}
      />

      {/* Password Field */}
      <div>
        <Input
          type="password"
          label="Password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={(value) => handleInputChange('password', value)}
          onKeyDown={handleKeyDown}
          error={validationErrors.password}
          required
          disabled={isLoading}
        />
        
        {/* Forgot Password Link */}
        <div className="mt-2 text-right">
          <a 
            href="/forgot-password" 
            className="text-sm text-teal-600 hover:text-teal-700 underline"
          >
            Forgot your password?
          </a>
        </div>
      </div>

      {/* Remember Me Checkbox */}
      <div className="flex items-center">
        <input
          id="remember-me"
          type="checkbox"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
          disabled={isLoading}
          className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
        />
        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
          Remember me for 30 days
        </label>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        isLoading={isLoading}
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? 'Signing In...' : 'Sign In'}
      </Button>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">New to ArambhGPT?</span>
        </div>
      </div>

      {/* Sign Up Link */}
      <div className="text-center">
        <a 
          href="/signup" 
          className="w-full inline-flex justify-center py-2 px-4 border border-teal-600 rounded-md shadow-sm text-sm font-medium text-teal-600 bg-white hover:bg-teal-50 transition-colors"
        >
          Create a new account
        </a>
      </div>

      {/* Demo Account Info */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div className="ml-3 text-left">
              <h3 className="text-sm font-medium text-gray-800">
                Want to try without signing up?
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Use demo account: <code className="bg-gray-200 px-1 rounded">demo@arambhgpt.com</code> / <code className="bg-gray-200 px-1 rounded">demo123</code>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setFormData({ email: 'demo@arambhgpt.com', password: 'demo123' });
              handleSubmit({ preventDefault: () => {} } as React.FormEvent);
            }}
            disabled={isLoading}
            className="ml-4 px-3 py-1 text-xs bg-teal-600 text-white rounded hover:bg-teal-700 disabled:opacity-50"
          >
            Quick Demo
          </button>
        </div>
      </div>
    </form>
  );
}