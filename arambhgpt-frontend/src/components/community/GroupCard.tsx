'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { apiClient } from '@/lib/api';

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
  recent_activity?: number;
  daily_messages?: number;
  new_members?: number;
}

interface GroupCardProps {
  group: Group;
  onJoin: () => void;
  onUpdate: () => void;
}

export function GroupCard({ group, onJoin, onUpdate }: GroupCardProps) {
  const [joining, setJoining] = useState(false);

  const handleJoinGroup = async () => {
    try {
      setJoining(true);
      
      // For demo purposes, simulate joining
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      alert(`Successfully joined "${group.name}"! 🎉`);
      
      onJoin();
    } catch (error) {
      console.error('Failed to join group:', error);
      alert('Failed to join group. Please try again.');
    } finally {
      setJoining(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      'mental_health': '🧠',
      'anxiety_support': '💙',
      'depression_support': '🌈',
      'relationship_advice': '💕',
      'family_issues': '👨‍👩‍👧‍👦',
      'career_stress': '💼',
      'student_support': '📚',
      'lgbtq_support': '🏳️‍🌈',
      'addiction_recovery': '🌟',
      'grief_support': '🕊️',
      'wellness_tips': '🌱',
      'meditation_mindfulness': '🧘‍♀️'
    };
    return icons[category] || '🤝';
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'अभी-अभी';
    if (diffInHours < 24) return `${diffInHours} घंटे पहले`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} दिन पहले`;
    return `${Math.floor(diffInDays / 7)} हफ्ते पहले`;
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
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
        
        {/* Match Score or Activity Indicators */}
        {group.match_score !== undefined && (
          <div className="bg-teal-100 text-teal-800 px-2 py-1 rounded-full text-xs font-medium">
            {Math.round(group.match_score * 100)}% match
          </div>
        )}
        
        {group.daily_messages !== undefined && group.daily_messages > 0 && (
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

      {/* Activity Stats */}
      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
        <span>Created {formatTimeAgo(group.created_at)}</span>
        {group.recent_activity !== undefined && (
          <span>{group.recent_activity} messages this week</span>
        )}
        {group.new_members !== undefined && group.new_members > 0 && (
          <span>+{group.new_members} new members</span>
        )}
      </div>

      {/* Actions */}
      <div className="flex space-x-3">
        <Button
          onClick={handleJoinGroup}
          disabled={joining}
          className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
        >
          {joining ? 'Joining...' : 'Join Group'}
        </Button>
        <Button
          variant="outline"
          className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg"
          onClick={() => {
            // Navigate to group details
            window.location.href = `/community/groups/${group.id}`;
          }}
        >
          View
        </Button>
      </div>

      {/* Special Badges */}
      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
        <div className="flex space-x-2">
          {group.member_count > 100 && (
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
              🏆 Popular
            </span>
          )}
          {group.recent_activity && group.recent_activity > 20 && (
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
  );
}