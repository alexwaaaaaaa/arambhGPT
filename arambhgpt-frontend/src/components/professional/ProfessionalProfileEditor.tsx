'use client';

import React, { useState, useEffect } from 'react';
import { Button, Card, Input } from '@/components/ui';
import { useProfessional } from '@/hooks/useProfessional';

interface ProfessionalProfile {
    id: string;
    name: string;
    email: string;
    title: string;
    gender: 'male' | 'female' | 'other' | 'prefer-not-to-say';
    age?: number;
    specialization: string[];
    experience: number;
    bio: string;
    education: string[];
    certifications: string[];
    languages: string[];
    availability: 'online' | 'busy' | 'offline';
    rates: {
        chat: number;
        voice: number;
        video: number;
    };
    location: {
        city: string;
        country: string;
    };
    profileImage?: string;
    phone?: string;
    website?: string;
    socialLinks?: {
        linkedin?: string;
        twitter?: string;
    };
}

export function ProfessionalProfileEditor() {
    const { professional, loading, isAuthenticated } = useProfessional();
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    
    // Initialize profile with professional data or defaults
    const [profile, setProfile] = useState<ProfessionalProfile>({
        id: professional?.id || 'prof_priya_001',
        name: professional?.name || 'Priya Sharma',
        email: professional?.email || 'priya@arambhgpt.com',
        title: professional?.title || 'Clinical Psychologist',
        gender: 'female' as const,
        age: 32,
        specialization: professional?.specialization || ['Anxiety', 'Depression', 'Trauma Therapy'],
        experience: professional?.experience || 8,
        bio: 'Experienced clinical psychologist specializing in anxiety, depression, and trauma therapy. I provide compassionate, evidence-based treatment to help individuals overcome mental health challenges and achieve emotional well-being.',
        education: ['M.A. Clinical Psychology - Delhi University', 'Ph.D. Psychology - AIIMS Delhi'],
        certifications: ['Licensed Clinical Psychologist', 'Cognitive Behavioral Therapy Certified', 'EMDR Therapy Certified'],
        languages: ['English', 'Hindi', 'Punjabi'],
        availability: professional?.availability || 'online' as const,
        rates: {
            chat: professional?.chat_rate || 500,
            voice: professional?.call_rate || 800,
            video: professional?.video_rate || 1200
        },
        location: {
            city: 'Delhi',
            country: 'India'
        },
        phone: '+91 98765 43210',
        website: 'https://drpriyasharma.com',
        socialLinks: {
            linkedin: 'https://linkedin.com/in/drpriyasharma',
            twitter: 'https://twitter.com/drpriyasharma'
        }
    });

    // Update profile when professional data loads
    useEffect(() => {
        if (professional) {
            setProfile(prev => ({
                ...prev,
                id: professional.id,
                name: professional.name,
                email: professional.email,
                title: professional.title,
                specialization: professional.specialization || prev.specialization,
                experience: professional.experience || prev.experience,
                availability: professional.availability || prev.availability,
                rates: {
                    chat: professional.chat_rate || prev.rates.chat,
                    voice: professional.call_rate || prev.rates.voice,
                    video: professional.video_rate || prev.rates.video
                }
            }));
        }
    }, [professional]);

    const [newSpecialization, setNewSpecialization] = useState('');
    const [newEducation, setNewEducation] = useState('');
    const [newCertification, setNewCertification] = useState('');
    const [newLanguage, setNewLanguage] = useState('');

    const handleInputChange = (field: string, value: any) => {
        setProfile(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleNestedInputChange = (parent: string, field: string, value: any) => {
        setProfile(prev => {
            if (parent === 'rates') {
                return {
                    ...prev,
                    rates: {
                        ...prev.rates,
                        [field]: value
                    }
                };
            } else if (parent === 'location') {
                return {
                    ...prev,
                    location: {
                        ...prev.location,
                        [field]: value
                    }
                };
            } else if (parent === 'socialLinks') {
                return {
                    ...prev,
                    socialLinks: {
                        ...prev.socialLinks,
                        [field]: value
                    }
                };
            }
            return prev;
        });
    };

    const addToArray = (field: keyof ProfessionalProfile, value: string, setter: (value: string) => void) => {
        if (value.trim()) {
            setProfile(prev => ({
                ...prev,
                [field]: [...(prev[field] as string[]), value.trim()]
            }));
            setter('');
        }
    };

    const removeFromArray = (field: keyof ProfessionalProfile, index: number) => {
        setProfile(prev => ({
            ...prev,
            [field]: (prev[field] as string[]).filter((_, i) => i !== index)
        }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // API call to save profile
            const response = await fetch('http://localhost:8000/api/professionals/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('professional_token')}`
                },
                body: JSON.stringify(profile)
            });

            if (response.ok) {
                alert('Profile updated successfully!');
                setIsEditing(false); // Exit edit mode after successful save
            } else {
                throw new Error('Failed to update profile');
            }
        } catch (error) {
            console.error('Save error:', error);
            alert('Failed to save profile. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setIsEditing(false);
        // Reset form to original values if needed
    };

    // Show loading state
    if (loading) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="animate-pulse space-y-6">
                    <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-32 bg-gray-200 rounded"></div>
                    <div className="h-48 bg-gray-200 rounded"></div>
                    <div className="h-32 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    // Show authentication required message
    if (!isAuthenticated) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="text-center py-12">
                    <div className="w-20 h-20 mx-auto bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center mb-6">
                        <span className="text-3xl">🔒</span>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
                    <p className="text-gray-600 mb-6">Please sign in to access your professional profile.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {isEditing ? 'Edit Professional Profile' : 'Professional Profile'}
                    </h1>
                    <p className="text-gray-600">
                        {isEditing ? 'Update your information and consultation rates' : 'View and manage your professional information'}
                    </p>
                </div>
                {!isEditing && (
                    <Button
                        onClick={() => setIsEditing(true)}
                        className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                    >
                        ✏️ Edit Profile
                    </Button>
                )}
            </div>

            {/* Profile Picture */}
            <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Picture</h2>
                <div className="flex items-center space-x-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        {profile.profileImage ? (
                            <img 
                                src={profile.profileImage} 
                                alt="Profile" 
                                className="w-24 h-24 rounded-full object-cover"
                            />
                        ) : (
                            <span className="text-3xl text-white">
                                {profile.gender === 'female' ? '👩‍⚕️' : profile.gender === 'male' ? '👨‍⚕️' : '🧑‍⚕️'}
                            </span>
                        )}
                    </div>
                    {isEditing ? (
                        <div>
                            <p className="text-sm text-gray-600 mb-2">Upload a professional photo (optional)</p>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        // In a real app, you'd upload to a server
                                        const reader = new FileReader();
                                        reader.onload = (e) => {
                                            handleInputChange('profileImage', e.target?.result as string);
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                }}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                            />
                            <p className="text-xs text-gray-500 mt-1">Recommended: 400x400px, max 2MB</p>
                        </div>
                    ) : (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">Dr. {profile.name}</h3>
                            <p className="text-gray-600">{profile.title}</p>
                            <p className="text-sm text-gray-500 mt-1">
                                {profile.experience} years experience • {profile.age ? `${profile.age} years old` : ''} • {profile.location.city}, {profile.location.country}
                            </p>
                        </div>
                    )}
                </div>
            </Card>

            {/* Basic Information */}
            <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
                {isEditing ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                                <Input
                                    value={profile.name}
                                    onChange={(value) => handleInputChange('name', value)}
                                    placeholder="Dr. John Doe"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                                <Input
                                    value={profile.email}
                                    onChange={(value) => handleInputChange('email', value)}
                                    placeholder="doctor@example.com"
                                    type="email"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Professional Title *</label>
                                <Input
                                    value={profile.title}
                                    onChange={(value) => handleInputChange('title', value)}
                                    placeholder="Psychiatrist, Clinical Psychologist"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
                                <select
                                    value={profile.gender}
                                    onChange={(e) => handleInputChange('gender', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                    <option value="prefer-not-to-say">Prefer not to say</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                                <Input
                                    value={profile.age || ''}
                                    onChange={(value) => handleInputChange('age', parseInt(value) || undefined)}
                                    placeholder="35"
                                    type="number"
                                    min="18"
                                    max="100"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Experience (Years) *</label>
                                <Input
                                    value={profile.experience}
                                    onChange={(value) => handleInputChange('experience', parseInt(value) || 0)}
                                    placeholder="5"
                                    type="number"
                                    min="0"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                                <Input
                                    value={profile.phone || ''}
                                    onChange={(value) => handleInputChange('phone', value)}
                                    placeholder="+91 98765 43210"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                                <Input
                                    value={profile.website || ''}
                                    onChange={(value) => handleInputChange('website', value)}
                                    placeholder="https://yourwebsite.com"
                                />
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Professional Bio *</label>
                            <textarea
                                value={profile.bio}
                                onChange={(e) => handleInputChange('bio', e.target.value)}
                                placeholder="Tell patients about your experience, approach, and specialties..."
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </>
                ) : (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="text-sm font-medium text-gray-500 mb-1">Full Name</h4>
                                <p className="text-lg text-gray-900">Dr. {profile.name}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-500 mb-1">Email</h4>
                                <p className="text-lg text-gray-900">{profile.email}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-500 mb-1">Professional Title</h4>
                                <p className="text-lg text-gray-900">{profile.title}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-500 mb-1">Gender</h4>
                                <p className="text-lg text-gray-900 capitalize">{profile.gender.replace('-', ' ')}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-500 mb-1">Age</h4>
                                <p className="text-lg text-gray-900">{profile.age || 'Not specified'} years</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-500 mb-1">Experience</h4>
                                <p className="text-lg text-gray-900">{profile.experience} years</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-500 mb-1">Phone</h4>
                                <p className="text-lg text-gray-900">{profile.phone || 'Not provided'}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-500 mb-1">Website</h4>
                                <p className="text-lg text-gray-900">
                                    {profile.website ? (
                                        <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                            {profile.website}
                                        </a>
                                    ) : 'Not provided'}
                                </p>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-sm font-medium text-gray-500 mb-2">Professional Bio</h4>
                            <p className="text-gray-900 leading-relaxed">{profile.bio}</p>
                        </div>
                    </div>
                )}
            </Card>

            {/* Location */}
            <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Location</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                        <Input
                            value={profile.location.city}
                            onChange={(value) => handleNestedInputChange('location', 'city', value)}
                            placeholder="Mumbai"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                        <Input
                            value={profile.location.country}
                            onChange={(value) => handleNestedInputChange('location', 'country', value)}
                            placeholder="India"
                        />
                    </div>
                </div>
            </Card>

            {/* Consultation Rates */}
            <Card className="p-6 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">💰 Consultation Rates</h2>
                {isEditing ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">💬 Chat Rate (₹/min) *</label>
                                <Input
                                    value={profile.rates.chat}
                                    onChange={(value) => handleNestedInputChange('rates', 'chat', parseFloat(value) || 0)}
                                    placeholder="150"
                                    type="number"
                                    min="1"
                                />
                                <p className="text-xs text-gray-500 mt-1">Recommended: ₹100-200/min</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">🎤 Voice Rate (₹/min) *</label>
                                <Input
                                    value={profile.rates.voice}
                                    onChange={(value) => handleNestedInputChange('rates', 'voice', parseFloat(value) || 0)}
                                    placeholder="250"
                                    type="number"
                                    min="1"
                                />
                                <p className="text-xs text-gray-500 mt-1">Recommended: ₹200-300/min</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">📹 Video Rate (₹/min) *</label>
                                <Input
                                    value={profile.rates.video}
                                    onChange={(value) => handleNestedInputChange('rates', 'video', parseFloat(value) || 0)}
                                    placeholder="400"
                                    type="number"
                                    min="1"
                                />
                                <p className="text-xs text-gray-500 mt-1">Recommended: ₹300-500/min</p>
                            </div>
                        </div>
                        <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                            <p className="text-sm text-blue-800">
                                💡 <strong>Pricing Tips:</strong> Set competitive rates based on your experience.
                                Higher rates attract serious clients, while lower rates increase booking volume.
                            </p>
                        </div>
                    </>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center p-4 bg-white rounded-lg border-2 border-green-200">
                            <div className="text-3xl mb-2">💬</div>
                            <h4 className="font-semibold text-gray-900 mb-1">Chat Session</h4>
                            <p className="text-2xl font-bold text-green-600">₹{profile.rates.chat}</p>
                            <p className="text-sm text-gray-500">per minute</p>
                        </div>
                        <div className="text-center p-4 bg-white rounded-lg border-2 border-blue-200">
                            <div className="text-3xl mb-2">🎤</div>
                            <h4 className="font-semibold text-gray-900 mb-1">Voice Call</h4>
                            <p className="text-2xl font-bold text-blue-600">₹{profile.rates.voice}</p>
                            <p className="text-sm text-gray-500">per minute</p>
                        </div>
                        <div className="text-center p-4 bg-white rounded-lg border-2 border-purple-200">
                            <div className="text-3xl mb-2">📹</div>
                            <h4 className="font-semibold text-gray-900 mb-1">Video Call</h4>
                            <p className="text-2xl font-bold text-purple-600">₹{profile.rates.video}</p>
                            <p className="text-sm text-gray-500">per minute</p>
                        </div>
                    </div>
                )}
            </Card>

            {/* Specializations */}
            <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Specializations</h2>
                <div className="flex flex-wrap gap-2 mb-4">
                    {profile.specialization.map((spec, index) => (
                        <span
                            key={index}
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 ${
                                isEditing ? 'cursor-pointer' : ''
                            }`}
                        >
                            {spec}
                            {isEditing && (
                                <button
                                    onClick={() => removeFromArray('specialization', index)}
                                    className="ml-2 text-blue-600 hover:text-blue-800"
                                >
                                    ×
                                </button>
                            )}
                        </span>
                    ))}
                </div>
                {isEditing && (
                    <div className="flex space-x-2">
                        <Input
                            value={newSpecialization}
                            onChange={(value) => setNewSpecialization(value)}
                            placeholder="Add specialization (e.g., Anxiety, Depression)"
                            className="flex-1"
                        />
                        <Button
                            onClick={() => addToArray('specialization', newSpecialization, setNewSpecialization)}
                            variant="outline"
                        >
                            Add
                        </Button>
                    </div>
                )}
            </Card>

            {/* Education */}
            <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Education</h2>
                <div className="space-y-2 mb-4">
                    {profile.education.map((edu, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-900">{edu}</span>
                            <button
                                onClick={() => removeFromArray('education', index)}
                                className="text-red-600 hover:text-red-800"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
                <div className="flex space-x-2">
                    <Input
                        value={newEducation}
                        onChange={(value) => setNewEducation(value)}
                        placeholder="Add education (e.g., MBBS - Medical College)"
                        className="flex-1"
                    />
                    <Button
                        onClick={() => addToArray('education', newEducation, setNewEducation)}
                        variant="outline"
                    >
                        Add
                    </Button>
                </div>
            </Card>

            {/* Certifications */}
            <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Certifications</h2>
                <div className="space-y-2 mb-4">
                    {profile.certifications.map((cert, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <span className="text-gray-900">{cert}</span>
                            <button
                                onClick={() => removeFromArray('certifications', index)}
                                className="text-red-600 hover:text-red-800"
                            >
                                Remove
                            </button>
                        </div>
                    ))}
                </div>
                <div className="flex space-x-2">
                    <Input
                        value={newCertification}
                        onChange={(value) => setNewCertification(value)}
                        placeholder="Add certification (e.g., Board Certified Psychiatrist)"
                        className="flex-1"
                    />
                    <Button
                        onClick={() => addToArray('certifications', newCertification, setNewCertification)}
                        variant="outline"
                    >
                        Add
                    </Button>
                </div>
            </Card>

            {/* Languages */}
            <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Languages</h2>
                <div className="flex flex-wrap gap-2 mb-4">
                    {profile.languages.map((lang, index) => (
                        <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800"
                        >
                            {lang}
                            <button
                                onClick={() => removeFromArray('languages', index)}
                                className="ml-2 text-green-600 hover:text-green-800"
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>
                <div className="flex space-x-2">
                    <Input
                        value={newLanguage}
                        onChange={(value) => setNewLanguage(value)}
                        placeholder="Add language (e.g., English, Hindi)"
                        className="flex-1"
                    />
                    <Button
                        onClick={() => addToArray('languages', newLanguage, setNewLanguage)}
                        variant="outline"
                    >
                        Add
                    </Button>
                </div>
            </Card>

            {/* Social Links */}
            <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Social Links</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                        <Input
                            value={profile.socialLinks?.linkedin || ''}
                            onChange={(value) => handleNestedInputChange('socialLinks', 'linkedin', value)}
                            placeholder="https://linkedin.com/in/yourprofile"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Twitter</label>
                        <Input
                            value={profile.socialLinks?.twitter || ''}
                            onChange={(value) => handleNestedInputChange('socialLinks', 'twitter', value)}
                            placeholder="https://twitter.com/yourhandle"
                        />
                    </div>
                </div>
            </Card>

            {/* Availability Status */}
            <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Availability Status</h2>
                <div className="flex space-x-4">
                    {[
                        { value: 'online', label: '🟢 Online', color: 'bg-green-100 text-green-800 border-green-300' },
                        { value: 'busy', label: '🟡 Busy', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
                        { value: 'offline', label: '🔴 Offline', color: 'bg-red-100 text-red-800 border-red-300' }
                    ].map((status) => (
                        <button
                            key={status.value}
                            onClick={() => handleInputChange('availability', status.value)}
                            className={`px-4 py-2 rounded-lg border-2 transition-colors ${profile.availability === status.value
                                ? status.color
                                : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200'
                                }`}
                        >
                            {status.label}
                        </button>
                    ))}
                </div>
            </Card>

            {/* Save/Cancel Buttons - Only show in edit mode */}
            {isEditing && (
                <div className="flex justify-end space-x-4">
                    <Button
                        variant="outline"
                        onClick={handleCancel}
                        disabled={isSaving}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
                    >
                        {isSaving ? (
                            <div className="flex items-center space-x-2">
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                <span>Saving...</span>
                            </div>
                        ) : (
                            'Save Profile'
                        )}
                    </Button>
                </div>
            )}

            {/* Preview Card */}
            <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">👀 Profile Preview</h2>
                <div className="bg-white p-4 rounded-lg border">
                    <div className="flex items-start space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            {profile.profileImage ? (
                                <img 
                                    src={profile.profileImage} 
                                    alt="Profile" 
                                    className="w-16 h-16 rounded-full object-cover"
                                />
                            ) : (
                                <span className="text-2xl text-white">
                                    {profile.gender === 'female' ? '👩‍⚕️' : profile.gender === 'male' ? '👨‍⚕️' : '🧑‍⚕️'}
                                </span>
                            )}
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900">Dr. {profile.name}</h3>
                            <p className="text-gray-600">{profile.title}</p>
                            <p className="text-sm text-gray-500">
                                {profile.experience} years experience • {profile.age ? `${profile.age} years old` : ''} • {profile.location.city}, {profile.location.country}
                            </p>
                            <div className="flex items-center space-x-4 mt-2">
                                <span className="text-sm text-green-600">💬 ₹{profile.rates.chat}/min</span>
                                <span className="text-sm text-blue-600">🎤 ₹{profile.rates.voice}/min</span>
                                <span className="text-sm text-purple-600">📹 ₹{profile.rates.video}/min</span>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                                {profile.specialization.slice(0, 3).map((spec, index) => (
                                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                        {spec}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}