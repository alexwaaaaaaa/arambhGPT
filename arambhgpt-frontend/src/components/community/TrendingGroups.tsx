'use client';

import React from 'react';
import { Card } from '@/components/ui/Card';
import { GroupCard } from './GroupCard';

interface Group {
  id: string;
  name: string;
  description: string;
  category: string;
  member_count: number;
  tags: string[];
  created_at: string;
  is_private: boolean;
  daily_messages?: number;
  new_members?: number;
}

interface TrendingGroupsProps {
  groups: Group[];
  onJoinGroup: () => void;
}

export function TrendingGroups({ groups, onJoinGroup }: TrendingGroupsProps) {
  const hotGroups = groups.filter(g => (g.daily_messages || 0) > 10).slice(0, 2);
  const growingGroups = groups.filter(g => (g.new_members || 0) > 5).slice(0, 2);
  const allTrending = groups.slice(0, 6);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <Card className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-8">
        <div className="max-w-3xl">
          <h2 className="text-2xl font-bold mb-4">
            🔥 Trending Support Groups
          </h2>
          <p className="text-orange-100 mb-6">
            सबसे active और popular groups जहाँ लोग actively support कर रहे हैं। 
            यहाँ आपको तुरंत response और active community मिलेगी।
          </p>
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <span className="bg-white bg-opacity-20 rounded-full p-1">⚡</span>
              <span>High Activity</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="bg-white bg-opacity-20 rounded-full p-1">📈</span>
              <span>Growing Fast</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="bg-white bg-opacity-20 rounded-full p-1">🌟</span>
              <span>Popular Choice</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Hot Groups - Most Active Today */}
      {hotGroups.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            🔥 आज सबसे Active Groups
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {hotGroups.map((group) => (
              <div key={group.id} className="relative">
                <GroupCard
                  group={group}
                  onJoin={onJoinGroup}
                  onUpdate={onJoinGroup}
                />
                {/* Hot Badge */}
                <div className="absolute -top-2 -right-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
                  🔥 HOT
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Growing Groups */}
      {growingGroups.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            📈 तेजी से बढ़ रहे Groups
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {growingGroups.map((group) => (
              <div key={group.id} className="relative">
                <GroupCard
                  group={group}
                  onJoin={onJoinGroup}
                  onUpdate={onJoinGroup}
                />
                {/* Growing Badge */}
                <div className="absolute -top-2 -right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                  📈 +{group.new_members}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trending Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 text-center bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {groups.reduce((sum, g) => sum + (g.daily_messages || 0), 0)}
          </div>
          <div className="text-blue-800 font-medium">Messages Today</div>
          <div className="text-blue-600 text-sm mt-1">Across all trending groups</div>
        </Card>
        
        <Card className="p-6 text-center bg-gradient-to-br from-green-50 to-green-100">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {groups.reduce((sum, g) => sum + (g.new_members || 0), 0)}
          </div>
          <div className="text-green-800 font-medium">New Members</div>
          <div className="text-green-600 text-sm mt-1">Joined this week</div>
        </Card>
        
        <Card className="p-6 text-center bg-gradient-to-br from-purple-50 to-purple-100">
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {groups.reduce((sum, g) => sum + g.member_count, 0)}
          </div>
          <div className="text-purple-800 font-medium">Total Members</div>
          <div className="text-purple-600 text-sm mt-1">In trending groups</div>
        </Card>
      </div>

      {/* All Trending Groups */}
      <div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          सभी Trending Groups
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allTrending.map((group, index) => (
            <div key={group.id} className="relative">
              <GroupCard
                group={group}
                onJoin={onJoinGroup}
                onUpdate={onJoinGroup}
              />
              {/* Trending Rank */}
              <div className="absolute top-4 left-4 bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
                #{index + 1}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* No Trending Groups */}
      {groups.length === 0 && (
        <Card className="p-8 text-center">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            कोई trending groups नहीं मिले
          </h3>
          <p className="text-gray-600 mb-4">
            अभी कोई groups trending नहीं हैं। नए groups explore करें या खुद का group बनाएं!
          </p>
        </Card>
      )}

      {/* Trending Tips */}
      <Card className="p-6 bg-orange-50 border-orange-200">
        <h4 className="font-semibold text-orange-900 mb-3 flex items-center">
          🔥 Trending Groups के फायदे
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-orange-800">
          <div className="flex items-start space-x-2">
            <span className="text-orange-600 mt-0.5">⚡</span>
            <div>
              <strong>Quick Response:</strong> Active members से तुरंत reply मिलता है
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-orange-600 mt-0.5">🌟</span>
            <div>
              <strong>Quality Content:</strong> Regular discussions और valuable insights
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-orange-600 mt-0.5">👥</span>
            <div>
              <strong>Active Community:</strong> Engaged members जो genuinely help करते हैं
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-orange-600 mt-0.5">📈</span>
            <div>
              <strong>Growing Network:</strong> नए connections और friendships बनाने का chance
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}