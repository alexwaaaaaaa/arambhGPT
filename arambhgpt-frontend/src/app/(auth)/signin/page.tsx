'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/layout';
import { Card, Logo } from '@/components/ui';
import { SignInForm } from '@/components/auth/SignInForm';
import { useIsAuthenticated } from '@/hooks';

export default function SignInPage() {
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
            Welcome back
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to continue your mental wellness journey
          </p>
        </div>

        <Card className="shadow-lg">
          <SignInForm />
        </Card>

        {/* Quick Access Features */}
        <div className="mt-8 text-center">
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-teal-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div className="ml-3 text-left">
                <h3 className="text-sm font-medium text-teal-800">
                  Your conversations are waiting
                </h3>
                <p className="mt-1 text-sm text-teal-700">
                  Access your chat history, continue previous conversations, and get personalized support.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Support Options */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
            <div className="w-10 h-10 mx-auto bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Need Help?</h3>
            <p className="text-xs text-gray-600 mt-1">
              <a href="/support" className="text-blue-600 hover:text-blue-700 underline">
                Contact Support
              </a>
            </p>
          </div>

          <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
            <div className="w-10 h-10 mx-auto bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Learn More</h3>
            <p className="text-xs text-gray-600 mt-1">
              <a href="/about" className="text-purple-600 hover:text-purple-700 underline">
                About ArambhGPT
              </a>
            </p>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>
            Protected by industry-standard encryption. 
            <a href="/security" className="text-teal-600 hover:text-teal-700 underline ml-1">
              Learn about our security
            </a>
          </p>
        </div>
      </Container>
    </div>
  );
}