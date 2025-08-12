'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CreateGroupModal } from '@/components/community/CreateGroupModal';

export default function CommunityPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('recommended');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [groups, setGroups] = useState([
    {
      id: '1',
      name: 'Anxiety Support Circle',
      description: 'एक safe space जहाँ आप अपनी anxiety के बारे में बात कर सकते हैं और दूसरों से support ले सकते हैं।',
      members: 45,
      category: '💙 Anxiety Support',
      tags: ['anxiety', 'support', 'hindi'],
      isJoined: false
    },
    {
      id: '2', 
      name: 'Student Mental Health',
      description: 'Students के लिए mental health support group। Exam stress, career pressure के बारे में बात करें।',
      members: 78,
      category: '📚 Student Support',
      tags: ['students', 'exam-stress', 'career'],
      isJoined: false
    },
    {
      id: '3',
      name: 'Family Issues Support', 
      description: 'Family problems, generation gap, और ghar की tensions के बारे में discuss करने के लिए।',
      members: 32,
      category: '👨‍👩‍👧‍👦 Family Issues',
      tags: ['family', 'relationships', 'support'],
      isJoined: false
    },
    {
      id: '4',
      name: 'Depression Recovery Warriors',
      description: 'Depression से लड़ने वाले warriors का group। यहाँ हम एक-दूसरे को motivate करते हैं।',
      members: 156,
      category: '🌈 Depression Support', 
      tags: ['depression', 'recovery', 'motivation'],
      isJoined: false
    }
  ]);

  const handleJoinGroup = (groupId: string, groupName: string) => {
    setGroups(prevGroups => 
      prevGroups.map(group => 
        group.id === groupId 
          ? { 
              ...group, 
              isJoined: !group.isJoined,
              members: group.isJoined ? group.members - 1 : group.members + 1
            }
          : group
      )
    );
    
    const group = groups.find(g => g.id === groupId);
    const action = group?.isJoined ? 'left' : 'joined';
    alert(`Successfully ${action} "${groupName}"! ${group?.isJoined ? '👋' : '🎉'}`);
  };

  const handleCreateGroup = (groupData: any) => {
    const newGroup = {
      id: groupData.id,
      name: groupData.name,
      description: groupData.description,
      members: 1,
      category: `${getCategoryIcon(groupData.category)} ${getCategoryName(groupData.category)}`,
      tags: groupData.tags,
      isJoined: true
    };
    
    setGroups(prevGroups => [newGroup, ...prevGroups]);
    setShowCreateModal(false);
    alert(`Group "${groupData.name}" created successfully! 🎉`);
  };

  const getCategoryIcon = (categoryId: string) => {
    const icons: Record<string, string> = {
      'mental_health': '🧠',
      'anxiety_support': '💙',
      'depression_support': '🌈',
      'relationship_advice': '💕',
      'family_issues': '👨‍👩‍👧‍👦',
      'career_stress': '💼',
      'student_support': '📚',
      'wellness_tips': '🌱'
    };
    return icons[categoryId] || '🤝';
  };

  const getCategoryName = (categoryId: string) => {
    const names: Record<string, string> = {
      'mental_health': 'Mental Health',
      'anxiety_support': 'Anxiety Support',
      'depression_support': 'Depression Support',
      'relationship_advice': 'Relationship Advice',
      'family_issues': 'Family Issues',
      'career_stress': 'Career Stress',
      'student_support': 'Student Support',
      'wellness_tips': 'Wellness Tips'
    };
    return names[categoryId] || 'Support';
  };

  const filteredGroups = activeTab === 'my-groups' 
    ? groups.filter(group => group.isJoined)
    : groups;

  const tabs = [
    { id: 'recommended', label: 'तुम्हारे लिए', icon: '🎯' },
    { id: 'trending', label: 'Trending', icon: '🔥' },
    { id: 'all', label: 'सभी Groups', icon: '🌐' },
    { id: 'my-groups', label: 'मेरे Groups', icon: '👥' }
  ];

  return (
    <ProtectedRoute>
      <PageLayout>
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Community Support Groups
              </h1>
              <p className="text-gray-600">
                Connect with others, share experiences, and find support
              </p>
            </div>
            <Button
              onClick={() => setShowCreateModal(true)}
              className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-lg"
            >
              + नया Group बनाएं
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6 text-center">
              <div className="text-2xl font-bold text-teal-600 mb-2">50+</div>
              <div className="text-gray-600">Active Groups</div>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-2">1,200+</div>
              <div className="text-gray-600">Members</div>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">24/7</div>
              <div className="text-gray-600">Support</div>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-2xl font-bold text-purple-600 mb-2">Safe</div>
              <div className="text-gray-600">Anonymous</div>
            </Card>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
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

          {/* Groups Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGroups.map((group) => (
              <Card key={group.id} className="p-6 hover:shadow-lg transition-shadow">
                {/* Header */}
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-900 text-lg mb-2">
                    {group.name}
                  </h3>
                  <div className="text-sm text-gray-500 mb-2">
                    {group.category} • {group.members} members
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4">
                  {group.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {group.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex space-x-3">
                  <Button
                    onClick={() => handleJoinGroup(group.id, group.name)}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium ${
                      group.isJoined
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-teal-600 hover:bg-teal-700 text-white'
                    }`}
                  >
                    {group.isJoined ? 'Leave Group' : 'Join Group'}
                  </Button>
                  <Button
                    onClick={() => router.push(`/community/groups/${group.id}`)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg"
                  >
                    View
                  </Button>
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                  <div className="flex space-x-2">
                    {group.members > 100 && (
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                        🏆 Popular
                      </span>
                    )}
                    {group.isJoined && (
                      <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                        ✅ Joined
                      </span>
                    )}
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                      ⚡ Active
                    </span>
                  </div>
                  <div className="text-xs text-gray-400">
                    Safe Space 🛡️
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Info Section */}
          <Card className="mt-8 p-6 bg-teal-50 border-teal-200">
            <h3 className="font-semibold text-teal-900 mb-3">
              🤝 Community Guidelines
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-teal-800">
              <div>• Respectful और supportive environment बनाए रखें</div>
              <div>• Personal information share करने से बचें</div>
              <div>• Professional medical advice नहीं दें</div>
              <div>• Anonymous participation का option है</div>
            </div>
          </Card>

          {/* Empty State for My Groups */}
          {activeTab === 'my-groups' && filteredGroups.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">👥</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                आपने अभी तक कोई group join नहीं किया है
              </h3>
              <p className="text-gray-600 mb-6">
                नए groups explore करें और अपनी community बनाएं
              </p>
              <Button
                onClick={() => setActiveTab('recommended')}
                className="bg-teal-600 hover:bg-teal-700 text-white"
              >
                Groups Explore करें
              </Button>
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
      </PageLayout>
    </ProtectedRoute>
  );
}