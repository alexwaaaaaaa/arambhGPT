'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Container } from '@/components/layout';
import { Card, Button, Input, LoadingSpinner } from '@/components/ui';
import { useProfessionalAuth } from '@/hooks/useProfessionalAuth';
import { ConsultationBooking } from '@/components/communication/ConsultationBooking';

// Type definition for professional
interface Professional {
  id: string;
  name: string;
  title: string;
  specializations: string[];
  languages: string[];
  experience: string;
  rating: number;
  reviews: number;
  availability: 'online' | 'busy' | 'offline';
  pricing: {
    chat: number;
    voice: number;
    video: number;
  };
  image: string;
  location: string;
}

// Type definition for expert data used in booking
interface ExpertData {
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
  nextAvailable: string;
}

// Mock data for professionals
const mockProfessionals: Professional[] = [
  {
    id: '1',
    name: 'Dr. Priya Sharma',
    title: 'Clinical Psychologist',
    specializations: ['Anxiety', 'Depression', 'Trauma Therapy'],
    languages: ['Hindi', 'English', 'Punjabi'],
    experience: '8 years',
    rating: 4.9,
    reviews: 156,
    availability: 'online',
    pricing: {
      chat: 50,
      voice: 80,
      video: 120
    },
    image: '/api/placeholder/150/150',
    location: 'Delhi, India'
  },
  {
    id: '2',
    name: 'Dr. Rajesh Kumar',
    title: 'Psychiatrist',
    specializations: ['Bipolar Disorder', 'ADHD', 'Medication Management'],
    languages: ['Hindi', 'English', 'Bengali'],
    experience: '12 years',
    rating: 4.8,
    reviews: 203,
    availability: 'busy',
    pricing: {
      chat: 60,
      voice: 100,
      video: 150
    },
    image: '/api/placeholder/150/150',
    location: 'Mumbai, India'
  },
  {
    id: '3',
    name: 'Dr. Anita Patel',
    title: 'Counseling Psychologist',
    specializations: ['Relationship Counseling', 'Family Therapy', 'Stress Management'],
    languages: ['Hindi', 'English', 'Gujarati'],
    experience: '6 years',
    rating: 4.7,
    reviews: 89,
    availability: 'online',
    pricing: {
      chat: 45,
      voice: 75,
      video: 110
    },
    image: '/api/placeholder/150/150',
    location: 'Ahmedabad, India'
  },
  {
    id: '4',
    name: 'Dr. Suresh Reddy',
    title: 'Clinical Psychologist',
    specializations: ['Addiction Recovery', 'Behavioral Therapy', 'Mindfulness'],
    languages: ['Telugu', 'English', 'Hindi'],
    experience: '10 years',
    rating: 4.9,
    reviews: 134,
    availability: 'online',
    pricing: {
      chat: 55,
      voice: 85,
      video: 125
    },
    image: '/api/placeholder/150/150',
    location: 'Hyderabad, India'
  },
  {
    id: '5',
    name: 'Dr. Meera Nair',
    title: 'Child Psychologist',
    specializations: ['Child Development', 'Learning Disabilities', 'Autism Spectrum'],
    languages: ['Malayalam', 'English', 'Hindi'],
    experience: '9 years',
    rating: 4.8,
    reviews: 112,
    availability: 'offline',
    pricing: {
      chat: 50,
      voice: 80,
      video: 120
    },
    image: '/api/placeholder/150/150',
    location: 'Kochi, India'
  },
  {
    id: '6',
    name: 'Dr. Arjun Singh',
    title: 'Psychiatrist',
    specializations: ['Mood Disorders', 'Anxiety Disorders', 'Sleep Disorders'],
    languages: ['Hindi', 'English', 'Marathi'],
    experience: '15 years',
    rating: 4.9,
    reviews: 267,
    availability: 'online',
    pricing: {
      chat: 65,
      voice: 105,
      video: 160
    },
    image: '/api/placeholder/150/150',
    location: 'Pune, India'
  }
];

const categories = [
  { id: 'all', label: 'All Experts', count: mockProfessionals.length },
  { id: 'psychologist', label: 'Psychologists', count: 4 },
  { id: 'psychiatrist', label: 'Psychiatrists', count: 2 },
  { id: 'counselor', label: 'Counselors', count: 1 }
];

export default function ProfessionalsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState<ExpertData | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const { isProfessional } = useProfessionalAuth();

  const handleBookConsultation = (professional: Professional) => {
    // Convert the professional data to match the expected format
    const expertData = {
      id: professional.id,
      name: professional.name,
      title: professional.title,
      specialization: professional.specializations,
      experience: parseInt(professional.experience),
      rating: professional.rating,
      totalReviews: professional.reviews,
      availability: professional.availability,
      rates: {
        chat: professional.pricing.chat,
        voice: professional.pricing.voice,
        video: professional.pricing.video
      },
      languages: professional.languages,
      nextAvailable: professional.availability === 'online' ? 'Available now' :
        professional.availability === 'busy' ? 'Available in 2 hours' : 'Available tomorrow'
    };

    setSelectedExpert(expertData);
    setIsBookingOpen(true);
  };

  const handleBookingConfirm = (bookingDetails: any) => {
    console.log('Booking confirmed:', bookingDetails);
    // Here you would typically send the booking to your backend
    alert(`Consultation booked successfully with ${bookingDetails.expertName}!`);
  };

  // Filter professionals based on search and category
  const filteredProfessionals = mockProfessionals.filter(professional => {
    const matchesSearch = professional.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      professional.specializations.some(spec =>
        spec.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      professional.languages.some(lang =>
        lang.toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      professional.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'all' ||
      professional.title.toLowerCase().includes(selectedCategory);

    return matchesSearch && matchesCategory;
  });

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'online': return 'text-green-600 bg-green-100';
      case 'busy': return 'text-yellow-600 bg-yellow-100';
      case 'offline': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getAvailabilityText = (availability: string) => {
    switch (availability) {
      case 'online': return '🟢 Available Now';
      case 'busy': return '🟡 Busy';
      case 'offline': return '🔴 Offline';
      default: return '🔴 Offline';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Container>
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🏥 Mental Health Experts
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect with verified mental health professionals who understand your culture and language.
            Get personalized therapy sessions via chat, voice, or video calls.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            {/* Search Bar */}
            <div className="flex-1 w-full">
              <Input
                type="text"
                placeholder="Search by name, specialization, language, or city..."
                value={searchTerm}
                onChange={(value) => setSearchTerm(value)}
                className="w-full"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === category.id
                    ? 'bg-teal-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-teal-50 border border-gray-300'
                    }`}
                >
                  {category.label} ({category.count})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredProfessionals.length} expert{filteredProfessionals.length !== 1 ? 's' : ''}
            {searchTerm && ` for "${searchTerm}"`}
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        )}

        {/* Professionals Grid */}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfessionals.map((professional) => (
              <Card key={professional.id} className="p-6 hover:shadow-lg transition-shadow">
                {/* Professional Info */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-teal-100 to-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">👨‍⚕️</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{professional.name}</h3>
                    <p className="text-sm text-gray-600">{professional.title}</p>
                    <p className="text-xs text-gray-500">{professional.experience} experience</p>
                  </div>
                </div>

                {/* Availability Status */}
                <div className="mb-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAvailabilityColor(professional.availability)}`}>
                    {getAvailabilityText(professional.availability)}
                  </span>
                </div>

                {/* Rating and Reviews */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    <span className="text-yellow-400">⭐</span>
                    <span className="text-sm font-medium text-gray-900 ml-1">{professional.rating}</span>
                  </div>
                  <span className="text-sm text-gray-500">({professional.reviews} reviews)</span>
                </div>

                {/* Specializations */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Specializations:</h4>
                  <div className="flex flex-wrap gap-1">
                    {professional.specializations.slice(0, 2).map((spec, index) => (
                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {spec}
                      </span>
                    ))}
                    {professional.specializations.length > 2 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{professional.specializations.length - 2} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Languages */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Languages:</h4>
                  <p className="text-sm text-gray-600">{professional.languages.join(', ')}</p>
                </div>

                {/* Location */}
                <div className="mb-4">
                  <p className="text-sm text-gray-600">📍 {professional.location}</p>
                </div>

                {/* Pricing */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Session Rates:</h4>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="text-center">
                      <p className="text-gray-600">💬 Chat</p>
                      <p className="font-medium">₹{professional.pricing.chat}/min</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-600">🎤 Voice</p>
                      <p className="font-medium">₹{professional.pricing.voice}/min</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-600">🎥 Video</p>
                      <p className="font-medium">₹{professional.pricing.video}/min</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2">
                  <Button
                    className="w-full"
                    disabled={professional.availability === 'offline'}
                    onClick={() => handleBookConsultation(professional)}
                  >
                    {professional.availability === 'online' ? '💬 Book Session Now' :
                      professional.availability === 'busy' ? '📅 Schedule Later' :
                        '🔴 Currently Unavailable'}
                  </Button>
                  <Button variant="outline" className="w-full">
                    👁️ View Profile
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* No Results */}
        {!isLoading && filteredProfessionals.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">🔍</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No experts found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search terms or filters to find the right expert for you.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Professional Dashboard CTA - Only show if user is NOT a professional */}
        {!isProfessional && (
          <div className="mt-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-8 text-white text-center">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold mb-4">
                👨‍⚕️ Are You a Mental Health Professional?
              </h2>
              <p className="text-lg text-purple-100 mb-6">
                Join our platform and help people heal while growing your practice.
                Manage appointments, connect with clients, and make a difference.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/professional/signin">
                  <Button className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3">
                    🔐 Professional Sign In
                  </Button>
                </Link>
                <Link href="/professional/signup">
                  <Button variant="outline" className="border-white text-white hover:bg-white hover:text-purple-600 px-8 py-3">
                    🚀 Join as Professional
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Professional Dashboard CTA - Only show if user IS a professional */}
        {isProfessional && (
          <div className="mt-16 bg-gradient-to-r from-green-600 to-teal-600 rounded-lg p-8 text-white text-center">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold mb-4">
                👨‍⚕️ Welcome Back, Professional!
              </h2>
              <p className="text-lg text-green-100 mb-6">
                Manage your appointments, connect with clients, and track your practice growth.
              </p>
              <Link href="/professional/dashboard">
                <Button className="bg-white text-green-600 hover:bg-gray-100 px-8 py-3">
                  💼 Go to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-8 bg-white rounded-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Why Choose Our Mental Health Experts? 🌟
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">✅</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Verified Professionals</h3>
              <p className="text-gray-600">All our experts are licensed and verified mental health professionals with proven experience.</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">🗣️</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Multi-Language Support</h3>
              <p className="text-gray-600">Connect with experts who speak your language and understand your cultural background.</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">100% Confidential</h3>
              <p className="text-gray-600">All sessions are completely private and secure. Your mental health journey is safe with us.</p>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-sm text-gray-500">
              💝 Professional sessions start from ₹45/min • Available 24/7 • Instant booking available
            </p>
          </div>
        </div>

        {/* Booking Modal */}
        {selectedExpert && (
          <ConsultationBooking
            expert={selectedExpert}
            isOpen={isBookingOpen}
            onClose={() => {
              setIsBookingOpen(false);
              setSelectedExpert(null);
            }}
            onBookingConfirm={handleBookingConfirm}
          />
        )}
      </Container>
    </div>
  );
}