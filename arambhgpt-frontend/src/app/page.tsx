'use client';

import React from 'react';
import Link from 'next/link';
import { PageLayout } from '@/components/layout';
import { Button } from '@/components/ui';
import { useAuth } from '@/hooks';
import { useProfessional } from '@/hooks/useProfessional';

export default function HomePage() {
  const { isAuthenticated, user } = useAuth();
  const { professional, isAuthenticated: isProfessionalAuthenticated } = useProfessional();

  // Check if user is a professional/expert
  const isExpert = isProfessionalAuthenticated && professional;
  
  // Expert/Professional Homepage
  if (isExpert) {
    return (
      <PageLayout maxWidth="full" padding={false}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-teal-50">
          {/* Expert Hero Section */}
          <section className="relative overflow-hidden py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h1 className="text-5xl sm:text-6xl font-bold mb-6">
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Welcome Dr.
                  </span>
                  <br />
                  <span className="text-gray-800">
                    {professional?.name || 'Professional'}
                  </span>
                </h1>
                
                <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                  Manage your practice, connect with patients, and make a meaningful impact in mental healthcare.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/professional/dashboard">
                    <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-3">
                      Open Dashboard
                    </Button>
                  </Link>
                  <Link href="/professional/profile">
                    <Button variant="outline" size="lg" className="border-blue-500 text-blue-600 hover:bg-blue-50 px-8 py-3">
                      Manage Profile
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Expert Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
                <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                  <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                    <span className="text-2xl">👥</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Patient Management</h3>
                  <p className="text-gray-600 mb-6">
                    View and manage your patient consultations, track progress, and provide personalized care.
                  </p>
                  <Link href="/professional/dashboard" className="text-blue-600 font-medium hover:text-blue-700">
                    Manage Patients →
                  </Link>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                  <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                    <span className="text-2xl">📊</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Practice Analytics</h3>
                  <p className="text-gray-600 mb-6">
                    Track your sessions, earnings, and practice growth with detailed insights and reports.
                  </p>
                  <Link href="/professional/dashboard" className="text-purple-600 font-medium hover:text-purple-700">
                    View Analytics →
                  </Link>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                  <div className="w-16 h-16 bg-teal-100 rounded-lg flex items-center justify-center mb-6">
                    <span className="text-2xl">💰</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">Earnings & Wallet</h3>
                  <p className="text-gray-600 mb-6">
                    Monitor consultation earnings and manage withdrawals with transparent fee structure.
                  </p>
                  <Link href="/professional/profile" className="text-teal-600 font-medium hover:text-teal-700">
                    View Earnings →
                  </Link>
                </div>
              </div>

              {/* Quick Actions for Experts */}
              <div className="mt-16 bg-white rounded-2xl p-8 shadow-lg">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
                  Quick Actions
                </h2>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Link href="/professional/dashboard" className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
                    <span className="text-3xl mb-2">📋</span>
                    <span className="text-sm font-medium text-gray-700">Dashboard</span>
                  </Link>
                  
                  <Link href="/professional/profile" className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
                    <span className="text-3xl mb-2">👨‍⚕️</span>
                    <span className="text-sm font-medium text-gray-700">Profile</span>
                  </Link>
                  
                  <Link href="/professional/consultations" className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
                    <span className="text-3xl mb-2">💬</span>
                    <span className="text-sm font-medium text-gray-700">Consultations</span>
                  </Link>
                  
                  <Link href="/wallet" className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
                    <span className="text-3xl mb-2">💳</span>
                    <span className="text-sm font-medium text-gray-700">Wallet</span>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </PageLayout>
    );
  }

  // Patient/User Homepage
  return (
    <PageLayout maxWidth="full" padding={false}>
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        {/* User Home Section */}
        <section className="relative overflow-hidden py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h1 className="text-5xl sm:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                  Welcome to
                </span>
                <br />
                <span className="text-gray-800">
                  ArambhGPT
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Your personal AI mental health companion. Get support, track your mood, 
                and connect with professional experts whenever you need them.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/chat">
                  <Button size="lg" className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-3">
                    Start Chatting
                  </Button>
                </Link>
                <Link href="/mood">
                  <Button variant="outline" size="lg" className="border-green-500 text-green-600 hover:bg-green-50 px-8 py-3">
                    Track Mood
                  </Button>
                </Link>
              </div>
            </div>

            {/* Main Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                  <span className="text-2xl">🤖</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">AI Companion</h3>
                <p className="text-gray-600 mb-6">
                  Chat with your personal AI companion anytime. Get support, guidance, and a listening ear 24/7.
                </p>
                <Link href="/chat" className="text-green-600 font-medium hover:text-green-700">
                  Start Chatting →
                </Link>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                  <span className="text-2xl">📈</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Mood Insights</h3>
                <p className="text-gray-600 mb-6">
                  Track your emotional well-being with beautiful charts and personalized insights for better mental health.
                </p>
                <Link href="/mood" className="text-blue-600 font-medium hover:text-blue-700">
                  View Insights →
                </Link>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                  <span className="text-2xl">👨‍⚕️</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Expert Support</h3>
                <p className="text-gray-600 mb-6">
                  Connect with licensed mental health professionals for personalized care and professional guidance.
                </p>
                <Link href="/consultation/dr-priya" className="text-purple-600 font-medium hover:text-purple-700">
                  Find Experts →
                </Link>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-16 bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">
                Quick Actions
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link href="/chat" className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
                  <span className="text-3xl mb-2">💬</span>
                  <span className="text-sm font-medium text-gray-700">Chat Now</span>
                </Link>
                
                <Link href="/mood" className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
                  <span className="text-3xl mb-2">😊</span>
                  <span className="text-sm font-medium text-gray-700">Log Mood</span>
                </Link>
                
                <Link href="/wellness" className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
                  <span className="text-3xl mb-2">🧘‍♀️</span>
                  <span className="text-sm font-medium text-gray-700">Wellness</span>
                </Link>
                
                <Link href="/consultation/dr-priya" className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
                  <span className="text-3xl mb-2">👩‍⚕️</span>
                  <span className="text-sm font-medium text-gray-700">Find Expert</span>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}