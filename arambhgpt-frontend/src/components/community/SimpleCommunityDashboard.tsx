'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface Group {
  id: string;
  name: string;
  description: string;
  category: string;
  member_count: number;
  tags: string[];
  created_at: string;
  is_private: boolean;
  match_score?: number;
  daily_messages?: number;
  new_members?: number;
}

export function SimpleCommunityDashboard() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'recommended' | 'trending' | 'all' | 'my-groups'>('recommended');

  useEffect(() => {
    loadGroups();
  }, [activeTab]);

  const loadGroups = () => {
    setLoading(true);
    
    // Simulate loading delay
    setTimeout(() => {
      const demoGroups = {
        recommended: [
          {
            id: 'rec-1',
            name: 'Anxiety Support Circle',
            description: 'एक safe space जहाँ आप अपनी anxiety के बारे में बात कर सकते हैं और दूसरों से support ले सकते हैं।',
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
            description: 'Family problems, generation gap, और ghar की tensions के बारे में discuss करने के लिए।',
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
            description: 'Depression से लड़ने वाले warriors का group। यहाँ हम एक-दूसरे को motivate करते हैं।',
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
            description: 'Job pressure, career changes, और workplace stress के बारे में बात करने के लिए।',
            category: 'career_stress',
            member_count: 89,
            tags: ['career', 'job-stress', 'workplace', 'solutions'],
            created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
            is_private: false,
            daily_messages: 32,
            new_members: 8
          }
        ],
        all: [
          {
            id: 'all-1',
            name: 'Mindfulness & Meditation',
            description: 'Meditation, mindfulness, और spiritual wellness के लिए। Daily practices share करें।',
            category: 'meditation_mindfulness',
            member_count: 123,
            tags: ['meditation', 'mindfulness', 'spirituality', 'peace'],
            created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
            is_private: false
          },
          {
            id: 'all-2',
            name: 'LGBTQ+ Safe Haven',
            description: 'LGBTQ+ community के लिए safe और supportive space। Identity और acceptance के लिए।',
            category: 'lgbtq_support',
            member_count: 54,
            tags: ['lgbtq', 'identity', 'acceptance', 'safe-space'],
            created_at: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
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
    }, 800);
  };

  const handleJoinGroup = (groupId: string, groupName: string) => {
    alert(`Successfully joined "${groupName}"! 🎉`);
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      'anxiety_support': '💙',
      'depression_support': '🌈',
      'student_support': '📚',
      'family_issues': '👨‍👩‍👧‍👦',
      'career_stress': '💼',
      'meditation_mindfulness': '🧘‍♀️',
      'lgbtq_support': '🏳️‍🌈'
    };
    return icons[category] || '🤝';
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
          onClick={() => alert('Group creation feature coming soon! 🚀')}
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.map((group) => (
            <Card key={group.id} className="p-6 hover:shadow-lg transition-shadow duration-200">
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{getCategoryIcon(group.category)}</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">{group.name}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span>{group.member_count} members</span>
                      {group.is_private && (
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs">
                          Private
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Badges */}
                {group.match_score && (
                  <div className="bg-teal-100 text-teal-800 px-2 py-1 rounded-full text-xs font-medium">
                    {Math.round(group.match_score * 100)}% match
                  </div>
                )}
                
                {group.daily_messages && group.daily_messages > 0 && (
                  <div className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                    🔥 {group.daily_messages} messages today
                  </div>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                {group.description}
              </p>

              {/* Tags */}
              {group.tags && group.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {group.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
                    >
                      #{tag}
                    </span>
                  ))}
                  {group.tags.length > 3 && (
                    <span className="text-gray-500 text-xs">
                      +{group.tags.length - 3} more
                    </span>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-3">
                <Button
                  onClick={() => handleJoinGroup(group.id, group.name)}
                  className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Join Group
                </Button>
                <Button
                  className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg"
                  onClick={() => alert(`Viewing details for "${group.name}"`)}
                >
                  View
                </Button>
              </div>

              {/* Footer */}
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                <div className="flex space-x-2">
                  {group.member_count > 100 && (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                      🏆 Popular
                    </span>
                  )}
                  {group.daily_messages && group.daily_messages > 20 && (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                      ⚡ Active
                    </span>
                  )}
                </div>
                
                <div className="text-xs text-gray-400">
                  Safe Space 🛡️
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && groups.length === 0 && (
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
        </div>
      )}
    </div>
  );
}