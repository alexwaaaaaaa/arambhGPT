'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface Message {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  isAnonymous: boolean;
}

interface Group {
  id: string;
  name: string;
  description: string;
  members: number;
  category: string;
  tags: string[];
  isJoined: boolean;
  rules: string[];
  messages: Message[];
}

export default function GroupViewPage() {
  const params = useParams();
  const router = useRouter();
  const groupId = params.id as string;
  
  const [group, setGroup] = useState<Group | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);

  useEffect(() => {
    // Load group data (dummy data)
    const demoGroups: Record<string, Group> = {
      '1': {
        id: '1',
        name: 'Anxiety Support Circle',
        description: 'एक safe space जहाँ आप अपनी anxiety के बारे में बात कर सकते हैं और दूसरों से support ले सकते हैं।',
        members: 45,
        category: '💙 Anxiety Support',
        tags: ['anxiety', 'support', 'hindi'],
        isJoined: false,
        rules: [
          'Respectful और supportive environment बनाए रखें',
          'Personal information share करने से बचें',
          'Professional medical advice नहीं दें',
          'Anonymous participation का option है'
        ],
        messages: [
          {
            id: '1',
            author: 'Anonymous User',
            content: 'Hi everyone! Main yahan naya hun. Anxiety ke saath deal karna bahut mushkil hai.',
            timestamp: '2 hours ago',
            isAnonymous: true
          },
          {
            id: '2',
            author: 'Support Member',
            content: 'Welcome! Yahan sab log understanding hain. Koi bhi sawal puch sakte ho.',
            timestamp: '1 hour ago',
            isAnonymous: true
          },
          {
            id: '3',
            author: 'Helper',
            content: 'Breathing exercises try kiye hain? Main share kar sakta hun kuch techniques.',
            timestamp: '30 minutes ago',
            isAnonymous: true
          }
        ]
      },
      '2': {
        id: '2',
        name: 'Student Mental Health',
        description: 'Students के लिए mental health support group। Exam stress, career pressure के बारे में बात करें।',
        members: 78,
        category: '📚 Student Support',
        tags: ['students', 'exam-stress', 'career'],
        isJoined: false,
        rules: [
          'Study tips aur mental health advice share करें',
          'Exam anxiety के बारे में openly discuss करें',
          'Career guidance aur support provide करें'
        ],
        messages: [
          {
            id: '1',
            author: 'Student Helper',
            content: 'Exam season aa raha hai. Koi tips share kar sakta hai stress manage karne ke liye?',
            timestamp: '3 hours ago',
            isAnonymous: true
          },
          {
            id: '2',
            author: 'Study Buddy',
            content: 'Pomodoro technique try karo! 25 min study, 5 min break. Bahut helpful hai.',
            timestamp: '2 hours ago',
            isAnonymous: true
          }
        ]
      },
      '3': {
        id: '3',
        name: 'Family Issues Support',
        description: 'Family problems, generation gap, और ghar की tensions के बारे में discuss करने के लिए।',
        members: 32,
        category: '👨‍👩‍👧‍👦 Family Issues',
        tags: ['family', 'relationships', 'support'],
        isJoined: false,
        rules: [
          'Family conflicts को respectfully discuss करें',
          'Generation gap issues share करें',
          'Practical solutions suggest करें'
        ],
        messages: [
          {
            id: '1',
            author: 'Family Member',
            content: 'Parents ko kaise samjhaun ki mental health bhi important hai?',
            timestamp: '4 hours ago',
            isAnonymous: true
          }
        ]
      },
      '4': {
        id: '4',
        name: 'Depression Recovery Warriors',
        description: 'Depression से लड़ने वाले warriors का group। यहाँ हम एक-दूसरे को motivate करते हैं।',
        members: 156,
        category: '🌈 Depression Support',
        tags: ['depression', 'recovery', 'motivation'],
        isJoined: false,
        rules: [
          'Positive support aur motivation provide करें',
          'Recovery journey share करें',
          'Professional help encourage करें'
        ],
        messages: [
          {
            id: '1',
            author: 'Warrior',
            content: 'Today was a good day! Small victories bhi celebrate karna chahiye.',
            timestamp: '1 hour ago',
            isAnonymous: true
          },
          {
            id: '2',
            author: 'Supporter',
            content: 'Absolutely! Every small step matters. Proud of you! 💪',
            timestamp: '45 minutes ago',
            isAnonymous: true
          }
        ]
      }
    };

    const foundGroup = demoGroups[groupId];
    if (foundGroup) {
      setGroup(foundGroup);
    }
  }, [groupId]);

  const handleJoinGroup = () => {
    if (group) {
      setGroup({
        ...group,
        isJoined: !group.isJoined,
        members: group.isJoined ? group.members - 1 : group.members + 1
      });
      
      const action = group.isJoined ? 'left' : 'joined';
      alert(`Successfully ${action} "${group.name}"! ${group.isJoined ? '👋' : '🎉'}`);
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim() && group) {
      const message: Message = {
        id: Date.now().toString(),
        author: isAnonymous ? 'Anonymous User' : 'You',
        content: newMessage,
        timestamp: 'Just now',
        isAnonymous
      };

      setGroup({
        ...group,
        messages: [...group.messages, message]
      });
      
      setNewMessage('');
    }
  };

  if (!group) {
    return (
      <ProtectedRoute>
        <PageLayout>
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Group Not Found</h1>
              <Button onClick={() => router.push('/community')}>
                Back to Community
              </Button>
            </div>
          </div>
        </PageLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <PageLayout>
        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Button
              onClick={() => router.push('/community')}
              className="text-gray-600 hover:text-gray-900"
            >
              ← Back to Community
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Group Info */}
            <div className="lg:col-span-1">
              <Card className="p-6 mb-6">
                <div className="text-center mb-4">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {group.name}
                  </h1>
                  <div className="text-sm text-gray-500 mb-4">
                    {group.category} • {group.members} members
                  </div>
                  
                  <Button
                    onClick={handleJoinGroup}
                    className={`w-full py-2 px-4 rounded-lg font-medium ${
                      group.isJoined
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-teal-600 hover:bg-teal-700 text-white'
                    }`}
                  >
                    {group.isJoined ? 'Leave Group' : 'Join Group'}
                  </Button>
                </div>

                <div className="mb-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-600 text-sm">{group.description}</p>
                </div>

                <div className="mb-4">
                  <h3 className="font-semibold text-gray-900 mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {group.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Group Rules</h3>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {group.rules.map((rule, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-teal-600 mr-2">•</span>
                        {rule}
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            </div>

            {/* Chat Area */}
            <div className="lg:col-span-2">
              <Card className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Group Discussion
                </h2>

                {!group.isJoined ? (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-4">🔒</div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Join to participate
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Group में join करें discussion में participate करने के लिए
                    </p>
                    <Button
                      onClick={handleJoinGroup}
                      className="bg-teal-600 hover:bg-teal-700 text-white"
                    >
                      Join Group
                    </Button>
                  </div>
                ) : (
                  <>
                    {/* Messages */}
                    <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                      {group.messages.map((message) => (
                        <div key={message.id} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-gray-900">
                                {message.author}
                              </span>
                              {message.isAnonymous && (
                                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                                  Anonymous
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-gray-500">
                              {message.timestamp}
                            </span>
                          </div>
                          <p className="text-gray-700">{message.content}</p>
                        </div>
                      ))}
                    </div>

                    {/* Message Input */}
                    <div className="border-t pt-4">
                      <div className="flex items-center space-x-2 mb-3">
                        <input
                          type="checkbox"
                          id="anonymous"
                          checked={isAnonymous}
                          onChange={(e) => setIsAnonymous(e.target.checked)}
                          className="rounded"
                        />
                        <label htmlFor="anonymous" className="text-sm text-gray-600">
                          Post anonymously
                        </label>
                      </div>
                      
                      <div className="flex space-x-3">
                        <Input
                          value={newMessage}
                          onChange={(value) => setNewMessage(value)}
                          placeholder="Type your message..."
                          className="flex-1"
                          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        />
                        <Button
                          onClick={handleSendMessage}
                          disabled={!newMessage.trim()}
                          className="bg-teal-600 hover:bg-teal-700 text-white px-6"
                        >
                          Send
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </Card>
            </div>
          </div>
        </div>
      </PageLayout>
    </ProtectedRoute>
  );
}