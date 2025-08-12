'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/layout';
import { Card, Logo } from '@/components/ui';
import { SignUpForm } from '@/components/auth/SignUpForm';
import { useIsAuthenticated } from '@/hooks';

export default function SignUpPage() {
  const router = useRouter();
  const isAuthenticated = useIsAuthenticated();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/chat');
    }
  }, [isAuthenticated, router]);

  // Don't render if already authenticated
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <Container size="sm">
        <div className="text-center mb-8">
          <Logo size="lg" className="justify-center" />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Join ArambhGPT and start your mental wellness journey
          </p>
        </div>

        <Card className="shadow-lg">
          <SignUpForm />
        </Card>

        {/* Additional Information */}
        <div className="mt-8 text-center">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <div className="ml-3 text-left">
                <h3 className="text-sm font-medium text-blue-800">
                  Your privacy is our priority
                </h3>
                <p className="mt-1 text-sm text-blue-700">
                  All conversations are encrypted and confidential. We never share your personal information or chat history.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto bg-teal-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">24/7 Support</h3>
            <p className="text-xs text-gray-600">Available anytime you need</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 mx-auto bg-orange-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
              </svg>
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Multi-Language</h3>
            <p className="text-xs text-gray-600">English, Hindi, Hinglish</p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 mx-auto bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Secure & Private</h3>
            <p className="text-xs text-gray-600">End-to-end encrypted</p>
          </div>
        </div>
      </Container>
    </div>
  );
}