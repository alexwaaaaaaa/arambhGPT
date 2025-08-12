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
  match_score?: number;
}

interface GroupRecommendationsProps {
  groups: Group[];
  onJoinGroup: () => void;
}

export function GroupRecommendations({ groups, onJoinGroup }: GroupRecommendationsProps) {
  const topRecommendations = groups.slice(0, 3);
  const otherRecommendations = groups.slice(3);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <Card className="bg-gradient-to-r from-teal-500 to-blue-600 text-white p-8">
        <div className="max-w-3xl">
          <h2 className="text-2xl font-bold mb-4">
            🎯 आपके लिए Perfect Groups
          </h2>
          <p className="text-teal-100 mb-6">
            आपकी conversations और interests के आधार पर हमने ये groups suggest किए हैं। 
            यहाँ आपको similar experiences वाले लोग मिलेंगे जो आपकी journey को समझते हैं।
          </p>
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <span className="bg-white bg-opacity-20 rounded-full p-1">🛡️</span>
              <span>Safe & Anonymous</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="bg-white bg-opacity-20 rounded-full p-1">💬</span>
              <span>24/7 Support</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="bg-white bg-opacity-20 rounded-full p-1">🤝</span>
              <span>Peer Support</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Top Recommendations */}
      {topRecommendations.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            ⭐ Top Matches for You
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {topRecommendations.map((group) => (
              <div key={group.id} className="relative">
                <GroupCard
                  group={group}
                  onJoin={onJoinGroup}
                  onUpdate={onJoinGroup}
                />
                {/* Match Badge */}
                <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                  {Math.round((group.match_score || 0) * 100)}% Match
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Why These Groups */}
      <Card className="p-6 bg-amber-50 border-amber-200">
        <h4 className="font-semibold text-amber-900 mb-3 flex items-center">
          🤔 ये Groups क्यों recommend किए गए?
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-amber-800">
          <div className="flex items-start space-x-2">
            <span className="text-amber-600 mt-0.5">💭</span>
            <div>
              <strong>Your Conversations:</strong> आपकी चैट history से पता चला कि आप इन topics में interested हैं
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-amber-600 mt-0.5">📊</span>
            <div>
              <strong>Activity Level:</strong> ये groups active हैं और regular support provide करते हैं
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-amber-600 mt-0.5">👥</span>
            <div>
              <strong>Community Size:</strong> Perfect size - न ज्यादा crowded, न बहुत छोटे
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <span className="text-amber-600 mt-0.5">🎯</span>
            <div>
              <strong>Similar Interests:</strong> आपके जैसे ही challenges face करने वाले लोग
            </div>
          </div>
        </div>
      </Card>

      {/* Other Recommendations */}
      {otherRecommendations.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            अन्य Recommended Groups
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherRecommendations.map((group) => (
              <GroupCard
                key={group.id}
                group={group}
                onJoin={onJoinGroup}
                onUpdate={onJoinGroup}
              />
            ))}
          </div>
        </div>
      )}

      {/* No Recommendations */}
      {groups.length === 0 && (
        <Card className="p-8 text-center">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Recommendations तैयार हो रहे हैं...
          </h3>
          <p className="text-gray-600 mb-4">
            कुछ और conversations के बाद हम आपके लिए perfect groups suggest करेंगे।
            अभी के लिए trending groups check करें!
          </p>
        </Card>
      )}

      {/* Tips */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
          💡 Group Join करने के Tips
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div>• पहले group के rules और description पढ़ें</div>
          <div>• Anonymous रहना चाहते हैं तो settings check करें</div>
          <div>• Active participation से ज्यादा support मिलता है</div>
          <div>• Respectful और supportive रहें</div>
        </div>
      </Card>
    </div>
  );
}