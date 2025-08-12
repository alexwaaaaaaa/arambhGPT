'use client';

import React from 'react';
import Link from 'next/link';
import { PageLayout } from '@/components/layout';
import { Button, Card } from '@/components/ui';
import { useIsAuthenticated } from '@/hooks';

export default function AboutPage() {
  const isAuthenticated = useIsAuthenticated();

  return (
    <PageLayout maxWidth="full" padding={false}>
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-orange-50 to-cyan-50 w-full">
        {/* Hero Section */}
        <section className="pt-20 pb-16 bg-gradient-to-br from-teal-50 via-orange-50 to-cyan-50 w-full relative overflow-hidden">
          {/* Lotus-Inspired Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-96 h-96 bg-teal-200 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob"></div>
            <div className="absolute top-0 right-0 w-80 h-80 bg-orange-200 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-20 w-72 h-72 bg-cyan-200 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-4000"></div>
          </div>

          <div className="relative w-full px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-7xl mx-auto">
              <div className="mb-8 flex justify-center">
                <div className="w-24 h-24 bg-gradient-to-br from-teal-500 to-orange-500 rounded-full flex items-center justify-center shadow-2xl">
                  <span className="text-4xl">🪷</span>
                </div>
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold mb-8">
                <span className="bg-gradient-to-r from-teal-800 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  About
                </span>
                <span className="bg-gradient-to-r from-orange-500 via-coral-500 to-orange-400 bg-clip-text text-transparent">
                  ArambhGPT
                </span>
              </h1>
              <p className="text-2xl sm:text-3xl text-teal-700 max-w-5xl mx-auto leading-relaxed mb-8">
                🪷 Your compassionate AI companion for mental health and wellness
                <br className="hidden sm:block" />
                <span className="text-xl text-orange-600">
                  Designed to understand and support you in your preferred language - Hindi, English, या Hinglish
                </span>
              </p>

              {/* Feature Pills */}
              <div className="flex flex-wrap justify-center gap-6 text-lg">
                <span className="bg-teal-100/90 backdrop-blur-sm text-teal-800 px-6 py-3 rounded-full border-2 border-teal-200 font-semibold">
                  🌍 Multi-Language Support
                </span>
                <span className="bg-orange-100/90 backdrop-blur-sm text-orange-800 px-6 py-3 rounded-full border-2 border-orange-200 font-semibold">
                  🤗 Culturally Aware
                </span>
                <span className="bg-cyan-100/90 backdrop-blur-sm text-cyan-800 px-6 py-3 rounded-full border-2 border-cyan-200 font-semibold">
                  🔒 100% Private
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-24 bg-gradient-to-b from-orange-50 to-teal-50 w-full">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-teal-800 to-orange-600 bg-clip-text text-transparent mb-8">
                  🪷 Our Story & Mission
                </h2>
                <p className="text-2xl text-teal-700 max-w-4xl mx-auto leading-relaxed">
                  Mental health support shouldn't be limited by language, culture, or accessibility barriers
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-16">
                <div className="space-y-6">
                  <h3 className="text-3xl font-bold text-gray-900 mb-6">
                    🌍 Breaking Language Barriers
                  </h3>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    <strong className="text-teal-600">"Dil ki baat sirf apni bhasha mein hi keh sakte hain"</strong> - We understand that emotions flow best in your mother tongue.
                    That's why ArambhGPT speaks your language - literally.
                  </p>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Whether you want to say <em className="text-orange-600">"I'm feeling anxious"</em>,
                    <em className="text-teal-600">"मैं परेशान हूं"</em>, or
                    <em className="text-coral-600">"Yaar, bahut tension ho rahi hai"</em> -
                    we understand it all. Because mental health support should feel like talking to a friend who truly gets you.
                  </p>
                  <div className="bg-gradient-to-r from-teal-100 to-orange-100 p-6 rounded-2xl">
                    <h4 className="text-xl font-semibold text-gray-900 mb-3">💭 Real Talk, Real Support</h4>
                    <p className="text-gray-700">
                      No formal therapy jargon. No complicated English. Just genuine conversations
                      in the language that feels most comfortable to you - because healing happens
                      when you can truly express yourself.
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-teal-50 to-orange-100 rounded-3xl p-10 shadow-xl">
                  <div className="text-center">
                    <div className="w-24 h-24 mx-auto bg-gradient-to-br from-teal-500 to-orange-500 rounded-full flex items-center justify-center mb-6 shadow-lg">
                      <span className="text-4xl">🗣️</span>
                    </div>
                    <h4 className="text-2xl font-bold text-gray-900 mb-4">Multi-Language AI</h4>
                    <p className="text-gray-700 text-lg leading-relaxed">
                      Trained to understand cultural nuances, Indian family dynamics,
                      and the unique challenges faced by our community.
                      <br /><br />
                      <span className="text-teal-600 font-semibold">English • Hindi • Hinglish</span>
                      <br />
                      <span className="text-orange-600">सब समझते हैं, सब support करते हैं</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Why We Built This */}
              <div className="bg-gradient-to-br from-cyan-50 to-teal-100 rounded-3xl p-12 shadow-xl">
                <div className="text-center mb-10">
                  <h3 className="text-3xl font-bold text-gray-900 mb-6">
                    🤔 Why We Built ArambhGPT
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-red-400 to-pink-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                      <span className="text-2xl">😔</span>
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-3">The Problem</h4>
                    <p className="text-gray-700">
                      Mental health support in India often feels disconnected from our culture.
                      Expensive therapy, language barriers, and social stigma keep people from getting help.
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                      <span className="text-2xl">💡</span>
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-3">Our Solution</h4>
                    <p className="text-gray-700">
                      An AI companion that understands Indian emotions, family pressures,
                      and cultural context. Available 24/7, completely private, and free to start.
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-400 to-teal-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                      <span className="text-2xl">🌟</span>
                    </div>
                    <h4 className="text-xl font-bold text-gray-900 mb-3">The Impact</h4>
                    <p className="text-gray-700">
                      Thousands of people now have a safe space to share their feelings,
                      get support, and work towards better mental health - in their own language.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What We Do Section */}
        <section className="py-24 bg-gradient-to-r from-teal-50 via-orange-50 to-cyan-50 w-full">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-20">
                <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-teal-800 to-orange-600 bg-clip-text text-transparent mb-8">
                  🪷 How We Support You
                </h2>
                <p className="text-2xl text-teal-700 max-w-4xl mx-auto leading-relaxed">
                  Real support for real people, in real language - no therapy jargon, just genuine care
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Active Listening */}
                <div className="group relative bg-gradient-to-br from-teal-50 to-cyan-100 p-8 rounded-3xl shadow-xl hover:shadow-2xl transform hover:-translate-y-3 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-400/20 to-cyan-400/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative text-center">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                      <span className="text-3xl">👂</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Active Listening</h3>
                    <p className="text-gray-700 leading-relaxed">
                      <strong className="text-teal-600">"Bas sunne wala chahiye"</strong> - We get it.
                      Sometimes you just need someone to listen without judging.
                      Share your heart out, we're here for you.
                    </p>
                  </div>
                </div>

                {/* Personalized Guidance */}
                <div className="group relative bg-gradient-to-br from-orange-50 to-coral-100 p-8 rounded-3xl shadow-xl hover:shadow-2xl transform hover:-translate-y-3 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 to-coral-400/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative text-center">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-orange-500 to-coral-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                      <span className="text-3xl">🎯</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Personalized Guidance</h3>
                    <p className="text-gray-700 leading-relaxed">
                      No generic advice here. We understand your unique situation -
                      family pressure, work stress, relationship issues.
                      <strong className="text-orange-600">Tailored support, just for you.</strong>
                    </p>
                  </div>
                </div>

                {/* 24/7 Availability */}
                <div className="group relative bg-gradient-to-br from-cyan-50 to-teal-100 p-8 rounded-3xl shadow-xl hover:shadow-2xl transform hover:-translate-y-3 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-teal-400/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative text-center">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-cyan-500 to-teal-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                      <span className="text-3xl">🌙</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">24/7 Availability</h3>
                    <p className="text-gray-700 leading-relaxed">
                      <strong className="text-cyan-600">2 AM ko anxiety attack?</strong>
                      Sunday ko depression? We're always here.
                      Mental health doesn't follow office hours, and neither do we.
                    </p>
                  </div>
                </div>

                {/* Emotional Support */}
                <div className="group relative bg-gradient-to-br from-pink-50 to-rose-100 p-8 rounded-3xl shadow-xl hover:shadow-2xl transform hover:-translate-y-3 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-400/20 to-rose-400/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative text-center">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                      <span className="text-3xl">💝</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Emotional Support</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Your feelings are valid. Your struggles are real.
                      <strong className="text-pink-600">"Sab theek ho jayega"</strong> -
                      and we'll be with you every step of the way to make sure it does.
                    </p>
                  </div>
                </div>

                {/* Cultural Understanding */}
                <div className="group relative bg-gradient-to-br from-purple-50 to-indigo-100 p-8 rounded-3xl shadow-xl hover:shadow-2xl transform hover:-translate-y-3 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-400/20 to-indigo-400/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative text-center">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                      <span className="text-3xl">🏠</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Cultural Understanding</h3>
                    <p className="text-gray-700 leading-relaxed">
                      We understand Indian family dynamics, societal pressure, and cultural expectations.
                      <strong className="text-purple-600">No explaining needed</strong> - we just get it.
                    </p>
                  </div>
                </div>

                {/* Privacy & Security */}
                <div className="group relative bg-gradient-to-br from-green-50 to-emerald-100 p-8 rounded-3xl shadow-xl hover:shadow-2xl transform hover:-translate-y-3 transition-all duration-300">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-emerald-400/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <div className="relative text-center">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                      <span className="text-3xl">🔐</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Complete Privacy</h3>
                    <p className="text-gray-700 leading-relaxed">
                      <strong className="text-green-600">"Kisi ko pata nahi chalega"</strong> -
                      Your secrets are safe. Encrypted conversations, no data sharing,
                      complete confidentiality. Promise.
                    </p>
                  </div>
                </div>
              </div>

              {/* Real User Stories */}
              <div className="mt-20 bg-gradient-to-br from-teal-100 to-orange-100 rounded-3xl p-12 shadow-xl">
                <div className="text-center mb-12">
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">
                    💬 Real Stories, Real Impact
                  </h3>
                  <p className="text-xl text-gray-700">
                    Here's what people are saying (names changed for privacy)
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <p className="text-gray-700 italic mb-4">
                      "Finally, someone who understands when I say 'ghar wale samjhte nahi'.
                      ArambhGPT gets the family pressure thing without me having to explain Indian culture."
                    </p>
                    <p className="text-teal-600 font-semibold">- Priya, 24, Mumbai</p>
                  </div>

                  <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <p className="text-gray-700 italic mb-4">
                      "3 AM anxiety attacks ke liye perfect hai. No judgment, just support.
                      'Bas thoda sa vent karna tha' - and it actually helped."
                    </p>
                    <p className="text-orange-600 font-semibold">- Rahul, 28, Delhi</p>
                  </div>

                  <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <p className="text-gray-700 italic mb-4">
                      "I can switch between English and Hindi mid-conversation.
                      It feels like talking to a friend who actually understands my emotions."
                    </p>
                    <p className="text-cyan-600 font-semibold">- Anjali, 31, Bangalore</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Technology & Innovation Section */}
        <section className="py-24 bg-gradient-to-b from-gray-50 to-white w-full">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-teal-800 to-orange-600 bg-clip-text text-transparent mb-8">
                  🚀 Technology That Cares
                </h2>
                <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                  Advanced AI meets human empathy - built specifically for Indian mental health needs
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                <div className="space-y-8">
                  <div className="bg-gradient-to-br from-teal-50 to-cyan-50 p-8 rounded-3xl shadow-lg">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full flex items-center justify-center mr-4">
                        <span className="text-xl">🧠</span>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">AI That Understands Culture</h3>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      Our AI is trained on Indian cultural contexts, family dynamics, and social pressures.
                      It understands concepts like "log kya kahenge", joint family stress, and career vs. passion dilemmas.
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-orange-50 to-red-50 p-8 rounded-3xl shadow-lg">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mr-4">
                        <span className="text-xl">🗣️</span>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">Natural Language Processing</h3>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      Switch seamlessly between Hindi, English, and Hinglish. Our NLP understands emotions,
                      context, and cultural nuances in all three languages.
                    </p>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-3xl shadow-lg">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-4">
                        <span className="text-xl">🔒</span>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">Privacy-First Architecture</h3>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      End-to-end encryption, no data sharing, and complete anonymity.
                      Your conversations are yours alone - we can't read them even if we wanted to.
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-3xl shadow-lg">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mr-4">
                        <span className="text-xl">📊</span>
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900">Personalized Learning</h3>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      The more you chat, the better we understand your unique situation,
                      communication style, and what kind of support works best for you.
                    </p>
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div className="bg-gradient-to-r from-teal-500 via-blue-500 to-purple-600 rounded-3xl p-12 text-white shadow-2xl">
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold mb-4">Our Impact in Numbers</h3>
                  <p className="text-xl opacity-90">Making mental health support accessible across India</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">50,000+</div>
                    <div className="text-lg opacity-90">Active Users</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">1M+</div>
                    <div className="text-lg opacity-90">Conversations</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">15+</div>
                    <div className="text-lg opacity-90">Languages Supported</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold mb-2">4.9⭐</div>
                    <div className="text-lg opacity-90">User Rating</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Team & Values Section */}
        <section className="py-24 bg-gradient-to-b from-white to-gray-50 w-full">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-teal-800 to-orange-600 bg-clip-text text-transparent mb-8">
                  👥 Our Team & Values
                </h2>
                <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                  Built by mental health advocates, technologists, and people who've been there
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                <Card className="p-8 bg-gradient-to-br from-teal-50 to-cyan-50 border-teal-200 hover:shadow-xl transition-all duration-300">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-teal-500 to-cyan-500 rounded-full flex items-center justify-center mb-6 shadow-lg">
                      <span className="text-2xl">💝</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Empathy First</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Every feature, every response, every interaction is designed with genuine care and understanding.
                      Technology should feel human, not robotic.
                    </p>
                  </div>
                </Card>

                <Card className="p-8 bg-gradient-to-br from-orange-50 to-red-50 border-orange-200 hover:shadow-xl transition-all duration-300">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mb-6 shadow-lg">
                      <span className="text-2xl">🌍</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Cultural Sensitivity</h3>
                    <p className="text-gray-700 leading-relaxed">
                      We celebrate India's diversity. Our team includes people from different states,
                      languages, and backgrounds to ensure inclusive support.
                    </p>
                  </div>
                </Card>

                <Card className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 hover:shadow-xl transition-all duration-300">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-6 shadow-lg">
                      <span className="text-2xl">🔒</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Privacy & Trust</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Your mental health journey is deeply personal. We've built our entire platform
                      around protecting your privacy and earning your trust.
                    </p>
                  </div>
                </Card>

                <Card className="p-8 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 hover:shadow-xl transition-all duration-300">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-lg">
                      <span className="text-2xl">🚀</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Continuous Innovation</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Mental health support is evolving. We're constantly learning, improving,
                      and adding new features based on user feedback and research.
                    </p>
                  </div>
                </Card>

                <Card className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 hover:shadow-xl transition-all duration-300">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mb-6 shadow-lg">
                      <span className="text-2xl">🤝</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Community Support</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Mental health is not a solo journey. We're building a supportive community
                      where people can connect, share, and heal together.
                    </p>
                  </div>
                </Card>

                <Card className="p-8 bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 hover:shadow-xl transition-all duration-300">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mb-6 shadow-lg">
                      <span className="text-2xl">💡</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Accessibility</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Quality mental health support shouldn't be a luxury. We're committed to
                      making our platform accessible and affordable for everyone.
                    </p>
                  </div>
                </Card>
              </div>

              {/* Future Vision */}
              <div className="bg-gradient-to-br from-teal-100 via-blue-100 to-purple-100 rounded-3xl p-12 shadow-xl">
                <div className="text-center mb-8">
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">
                    🌟 Our Vision for the Future
                  </h3>
                  <p className="text-xl text-gray-700">
                    Building a mentally healthier India, one conversation at a time
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <h4 className="text-xl font-bold text-gray-900 mb-3">🏥 Professional Network</h4>
                    <p className="text-gray-700">
                      Connecting users with licensed therapists, counselors, and psychiatrists
                      for professional support when needed. AI + Human expertise = Better outcomes.
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <h4 className="text-xl font-bold text-gray-900 mb-3">📱 Mobile-First Experience</h4>
                    <p className="text-gray-700">
                      Developing native mobile apps with offline support, voice interactions,
                      and seamless integration with your daily routine.
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <h4 className="text-xl font-bold text-gray-900 mb-3">🎓 Mental Health Education</h4>
                    <p className="text-gray-700">
                      Creating awareness programs, workshops, and resources to reduce stigma
                      and promote mental health literacy across India.
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-2xl shadow-lg">
                    <h4 className="text-xl font-bold text-gray-900 mb-3">🌐 Regional Expansion</h4>
                    <p className="text-gray-700">
                      Adding support for more Indian languages and dialects, understanding
                      regional cultural nuances, and making mental health support truly local.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-r from-teal-600 via-orange-600 to-cyan-600 relative overflow-hidden w-full">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative w-full px-4 sm:px-6 lg:px-8">
            <div className="text-center text-white max-w-7xl mx-auto">
              <div className="mb-8">
                <span className="text-6xl">🪷</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold mb-8">
                Ready to Start Your Wellness Journey?
              </h2>
              <p className="text-2xl text-orange-100 mb-12 max-w-4xl mx-auto leading-relaxed">
                Join thousands of people who've found support, understanding, and healing through ArambhGPT
                <br className="hidden sm:block" />
                <span className="text-xl">🌟 Free to start • 🔒 Completely private • 🌍 Available 24/7</span>
              </p>

              {isAuthenticated ? (
                <Link href="/chat">
                  <Button size="lg" className="bg-white text-teal-600 hover:bg-gray-100 font-bold py-6 px-16 rounded-full shadow-xl transform hover:scale-105 transition-all duration-200 text-2xl">
                    🪷 Start Chatting Now
                  </Button>
                </Link>
              ) : (
                <div className="flex flex-col sm:flex-row gap-8 justify-center">
                  <Link href="/signup">
                    <Button size="lg" className="w-full sm:w-auto bg-white text-teal-600 hover:bg-gray-100 font-bold py-6 px-16 rounded-full shadow-xl transform hover:scale-105 transition-all duration-200 text-2xl">
                      🚀 Get Started Free
                    </Button>
                  </Link>
                  <Link href="/signin">
                    <Button size="lg" variant="outline" className="w-full sm:w-auto border-3 border-white text-white hover:bg-white hover:text-teal-600 font-bold py-6 px-16 rounded-full transition-all duration-200 text-2xl">
                      🔐 Sign In
                    </Button>
                  </Link>
                </div>
              )}

              <div className="mt-12 flex flex-wrap justify-center gap-6 text-lg">
                <span className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full border border-white/30 font-semibold">
                  ✅ No Credit Card Required
                </span>
                <span className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full border border-white/30 font-semibold">
                  🤗 Start Chatting Immediately
                </span>
                <span className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-full border border-white/30 font-semibold">
                  💬 Hindi, English, Hinglish
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}