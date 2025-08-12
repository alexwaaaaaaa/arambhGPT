'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { apiClient } from '@/lib/api';
import { GroupCard } from './GroupCard';
import { CreateGroupModal } from './CreateGroupModal';
import { GroupRecommendations } from './GroupRecommendations';
import { TrendingGroups } from './TrendingGroups';

interface Group {
  id: string;
  name: string;
  description: string;
  category: string;
  member_count: number;
  tags: string[];
  created_at: string;
  is_private: boolean;
}

export function CommunityDashboard() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'recommended' | 'trending' | 'my-groups'>('recommended');

  useEffect(() => {
    loadGroups();
  }, [activeTab]);

  const loadGroups = () => {
    setLoading(true);
    
    // Simulate loading delay
    setTimeout(() => {
      // Demo data for different tabs
      const demoGroups = {
        recommended: [
          {
            id: 'rec-1',
            name: 'Anxiety Support Circle',
            description: 'एक safe space जहाँ आप अपनी anxiety के बारे में बात कर सकते हैं और दूसरों से support ले सकते हैं। यहाँ आपको समझने वाले लोग मिलेंगे।',
            category: 'anxiety_support',
            member_count: 45,
            tags: ['anxiety', 'support', 'hindi', 'safe-space'],
            created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            is_private: false,
            match_score: 0.92
          },
          {
            id: 'rec-2',
            name: 'Student Mental Health Hub',
            description: 'Students के लिए mental health support group। Exam stress, career pressure, और academic challenges के बारे में बात करें।',
            category: 'student_support',
            member_count: 78,
            tags: ['students', 'exam-stress', 'career', 'mental-health'],
            created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
            is_private: false,
            match_score: 0.87
          },
          {
            id: 'rec-3',
            name: 'Family Issues Support',
            description: 'Family problems, generation gap, और ghar की tensions के बारे में discuss करने के लिए। Indian family dynamics को समझने वाले लोग।',
            category: 'family_issues',
            member_count: 32,
            tags: ['family', 'relationships', 'generation-gap', 'support'],
            created_at: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
            is_private: false,
            match_score: 0.75
          }
        ],
        trending: [
          {
            id: 'trend-1',
            name: 'Depression Recovery Warriors',
            description: 'Depression से लड़ने वाले warriors का group। यहाँ हम एक-दूसरे को motivate करते हैं और recovery journey share करते हैं।',
            category: 'depression_support',
            member_count: 156,
            tags: ['depression', 'recovery', 'motivation', 'warriors'],
            created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            is_private: false,
            daily_messages: 45,
            new_members: 12
          },
          {
            id: 'trend-2',
            name: 'Career Stress Solutions',
            description: 'Job pressure, career changes, और workplace stress के बारे में बात करने के लिए। Practical solutions और support मिलता है।',
            category: 'career_stress',
            member_count: 89,
            tags: ['career', 'job-stress', 'workplace', 'solutions'],
            created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
            is_private: false,
            daily_messages: 32,
            new_members: 8
          },
          {
            id: 'trend-3',
            name: 'Relationship Advice Circle',
            description: 'Relationship problems, dating issues, और love life की complications के बारे में discuss करें। Experienced members से advice लें।',
            category: 'relationship_advice',
            member_count: 67,
            tags: ['relationships', 'dating', 'love', 'advice'],
            created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
            is_private: false,
            daily_messages: 28,
            new_members: 6
          }
        ],
        all: [
          {
            id: 'all-1',
            name: 'Mindfulness & Meditation',
            description: 'Meditation, mindfulness, और spiritual wellness के लिए। Daily practices share करें और inner peace find करें।',
            category: 'meditation_mindfulness',
            member_count: 123,
            tags: ['meditation', 'mindfulness', 'spirituality', 'peace'],
            created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
            is_private: false
          },
          {
            id: 'all-2',
            name: 'LGBTQ+ Safe Haven',
            description: 'LGBTQ+ community के लिए safe और supportive space। Identity, acceptance, और community support के लिए।',
            category: 'lgbtq_support',
            member_count: 54,
            tags: ['lgbtq', 'identity', 'acceptance', 'safe-space'],
            created_at: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
            is_private: false
          },
          {
            id: 'all-3',
            name: 'Wellness Tips & Tricks',
            description: 'Daily wellness tips, healthy habits, और lifestyle improvements के लिए। Practical advice और motivation।',
            category: 'wellness_tips',
            member_count: 98,
            tags: ['wellness', 'health', 'lifestyle', 'tips'],
            created_at: new Date(Date.now() - 150 * 24 * 60 * 60 * 1000).toISOString(),
            is_private: false
          }
        ],
        'my-groups': [
          {
            id: 'my-1',
            name: 'My Anxiety Support Circle',
            description: 'आपका joined group - Anxiety support के लिए।',
            category: 'anxiety_support',
            member_count: 45,
            tags: ['anxiety', 'support', 'joined'],
            created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            is_private: false
          }
        ]
      };
      
      setGroups(demoGroups[activeTab] || demoGroups.all);
      setLoading(false);
    }, 500); // Simulate loading delay
  };

  const handleCreateGroup = (groupData: any) => {
    // For demo, just show success and close modal
    alert(`Group "${groupData.name}" created successfully! 🎉`);
    setShowCreateModal(false);
    loadGroups();
  };

  const tabs = [
    { id: 'recommended', label: 'तुम्हारे लिए', icon: '🎯' },
    { id: 'trending', label: 'Trending', icon: '🔥' },
    { id: 'all', label: 'सभी Groups', icon: '🌐' },
    { id: 'my-groups', label: 'मेरे Groups', icon: '👥' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Community Support Groups
          </h1>
          <p className="text-gray-600">
            Connect with others, share experiences, and find support in our caring community
          </p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg font-medium"
        >
          + नया Group बनाएं
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 text-center">
          <div className="text-2xl font-bold text-teal-600 mb-2">50+</div>
          <div className="text-gray-600">Active Groups</div>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-2xl font-bold text-blue-600 mb-2">1,200+</div>
          <div className="text-gray-600">Community Members</div>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-2xl font-bold text-green-600 mb-2">24/7</div>
          <div className="text-gray-600">Support Available</div>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-2xl font-bold text-purple-600 mb-2">Safe</div>
          <div className="text-gray-600">Anonymous Space</div>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-md font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-white text-teal-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex justify-center py-12">
          <LoadingSpinner size="lg" />
        </div>
      ) : (
        <div className="space-y-8">
          {/* Special sections for recommended and trending */}
          {activeTab === 'recommended' && (
            <GroupRecommendations groups={groups} onJoinGroup={loadGroups} />
          )}
          
          {activeTab === 'trending' && (
            <TrendingGroups groups={groups} onJoinGroup={loadGroups} />
          )}

          {/* Groups Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map((group) => (
              <GroupCard
                key={group.id}
                group={group}
                onJoin={loadGroups}
                onUpdate={loadGroups}
              />
            ))}
          </div>

          {groups.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🤝</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {activeTab === 'my-groups' ? 'आपने अभी तक कोई group join नहीं किया है' : 'कोई groups नहीं मिले'}
              </h3>
              <p className="text-gray-600 mb-6">
                {activeTab === 'my-groups' 
                  ? 'नए groups explore करें और अपनी community बनाएं'
                  : 'नया group बनाएं या बाद में वापस आएं'
                }
              </p>
              {activeTab === 'my-groups' && (
                <Button
                  onClick={() => setActiveTab('recommended')}
                  className="bg-teal-600 hover:bg-teal-700 text-white"
                >
                  Groups Explore करें
                </Button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Create Group Modal */}
      {showCreateModal && (
        <CreateGroupModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateGroup}
        />
      )}
    </div>
  );
}