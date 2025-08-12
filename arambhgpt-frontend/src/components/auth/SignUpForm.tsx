'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, ErrorMessage } from '@/components/ui';
import { useAuth } from '@/hooks';
import { SignUpData } from '@/types';

interface SignUpFormProps {
  onSuccess?: () => void;
  className?: string;
}

export function SignUpForm({ onSuccess, className = '' }: SignUpFormProps) {
  const router = useRouter();
  const { signUp, isLoading, error, clearError } = useAuth();
  
  const [formData, setFormData] = useState<SignUpData>({
    name: '',
    email: '',
    password: '',
    city: '',
    country: '',
  });
  
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Name validation
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    // City validation
    if (!formData.city.trim()) {
      errors.city = 'City is required';
    } else if (formData.city.trim().length < 2) {
      errors.city = 'City must be at least 2 characters';
    }

    // Country validation
    if (!formData.country.trim()) {
      errors.country = 'Country is required';
    } else if (formData.country.trim().length < 2) {
      errors.country = 'Country must be at least 2 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      errors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }

    // Confirm password validation
    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (confirmPassword !== formData.password) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (field: keyof SignUpData, value: string) => {
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

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    
    // Clear validation error when user starts typing
    if (validationErrors.confirmPassword) {
      setValidationErrors(prev => ({ ...prev, confirmPassword: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await signUp(formData);
      
      // Success callback or redirect
      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/chat');
      }
    } catch (err) {
      // Error is handled by the useAuth hook
      console.error('Sign up failed:', err);
    }
  };

  const getPasswordStrength = (password: string): { strength: number; label: string; color: string } => {
    if (!password) return { strength: 0, label: '', color: '' };
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;

    const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];
    
    return {
      strength,
      label: labels[strength - 1] || '',
      color: colors[strength - 1] || 'bg-gray-300'
    };
  };

  const passwordStrength = getPasswordStrength(formData.password);

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

      {/* Name Field */}
      <Input
        type="text"
        label="Full Name"
        placeholder="Enter your full name"
        value={formData.name}
        onChange={(value) => handleInputChange('name', value)}
        error={validationErrors.name}
        required
        disabled={isLoading}
      />

      {/* Email Field */}
      <Input
        type="email"
        label="Email Address"
        placeholder="Enter your email address"
        value={formData.email}
        onChange={(value) => handleInputChange('email', value)}
        error={validationErrors.email}
        required
        disabled={isLoading}
      />

      {/* City and Country Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          type="text"
          label="City"
          placeholder="Enter your city"
          value={formData.city}
          onChange={(value) => handleInputChange('city', value)}
          error={validationErrors.city}
          required
          disabled={isLoading}
        />
        
        <Input
          type="text"
          label="Country"
          placeholder="Enter your country"
          value={formData.country}
          onChange={(value) => handleInputChange('country', value)}
          error={validationErrors.country}
          required
          disabled={isLoading}
        />
      </div>

      {/* Password Field */}
      <div>
        <Input
          type="password"
          label="Password"
          placeholder="Create a strong password"
          value={formData.password}
          onChange={(value) => handleInputChange('password', value)}
          error={validationErrors.password}
          required
          disabled={isLoading}
        />
        
        {/* Password Strength Indicator */}
        {formData.password && (
          <div className="mt-2">
            <div className="flex items-center space-x-2">
              <div className="flex-1 bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`}
                  style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                />
              </div>
              <span className="text-xs text-gray-600">
                {passwordStrength.label}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Confirm Password Field */}
      <Input
        type="password"
        label="Confirm Password"
        placeholder="Confirm your password"
        value={confirmPassword}
        onChange={handleConfirmPasswordChange}
        error={validationErrors.confirmPassword}
        required
        disabled={isLoading}
      />

      {/* Terms and Conditions */}
      <div className="text-sm text-gray-600">
        By creating an account, you agree to our{' '}
        <a href="/terms" className="text-teal-600 hover:text-teal-700 underline">
          Terms of Service
        </a>{' '}
        and{' '}
        <a href="/privacy" className="text-teal-600 hover:text-teal-700 underline">
          Privacy Policy
        </a>
        .
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        isLoading={isLoading}
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? 'Creating Account...' : 'Create Account'}
      </Button>

      {/* Sign In Link */}
      <div className="text-center text-sm text-gray-600">
        Already have an account?{' '}
        <a href="/signin" className="text-teal-600 hover:text-teal-700 font-medium">
          Sign in here
        </a>
      </div>
    </form>
  );
}