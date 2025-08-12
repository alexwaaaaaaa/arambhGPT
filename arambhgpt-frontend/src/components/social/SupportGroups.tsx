'use client';

import React, { useState } from 'react';
import { Card, Button, Input, Modal } from '@/components/ui';
import { SupportGroup, GroupMessage } from '@/types/social';

interface SupportGroupsProps {
  className?: string;
}

// Mock data for demo
const mockGroups: SupportGroup[] = [
  {
    id: '1',
    name: 'Anxiety Support Circle',
    description: 'A safe space to share experiences and coping strategies for anxiety',
    memberCount: 127,
    isPrivate: false,
    tags: ['anxiety', 'support', 'coping'],
    createdAt: '2024-01-15',
    moderators: ['mod1']
  },
  {
    id: '2',
    name: 'Depression Warriors',
    description: 'Together we fight depression with understanding and support',
    memberCount: 89,
    isPrivate: false,
    tags: ['depression', 'support', 'recovery'],
    createdAt: '2024-02-01',
    moderators: ['mod2']
  },
  {
    id: '3',
    name: 'Mindfulness & Meditation',
    description: 'Practice mindfulness together and share meditation experiences',
    memberCount: 156,
    isPrivate: false,
    tags: ['mindfulness', 'meditation', 'wellness'],
    createdAt: '2024-01-20',
    moderators: ['mod3']
  }
];

const mockMessages: GroupMessage[] = [
  {
    id: '1',
    groupId: '1',
    authorId: 'user1',
    authorName: 'Anonymous User',
    content: 'Had a tough day with anxiety today. The breathing exercises really helped though. Thank you all for the support! 🙏',
    isAnonymous: true,
    reactions: [
      { emoji: '❤️', count: 5, userIds: ['u1', 'u2', 'u3', 'u4', 'u5'] },
      { emoji: '🤗', count: 3, userIds: ['u6', 'u7', 'u8'] }
    ],
    createdAt: '2024-03-10T14:30:00Z'
  },
  {
    id: '2',
    groupId: '1',
    authorId: 'user2',
    authorName: 'Sarah M.',
    content: 'You\'re doing great! Remember, progress isn\'t always linear. Every small step counts. 💪',
    isAnonymous: false,
    reactions: [
      { emoji: '👏', count: 8, userIds: ['u1', 'u3', 'u4', 'u5', 'u9', 'u10', 'u11', 'u12'] }
    ],
    createdAt: '2024-03-10T15:15:00Z'
  }
];

export function SupportGroups({ className = '' }: SupportGroupsProps) {
  const [selectedGroup, setSelectedGroup] = useState<SupportGroup | null>(null);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);

  const handleJoinGroup = (group: SupportGroup) => {
    setSelectedGroup(group);
    setShowGroupModal(true);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedGroup) return;

    // In a real app, this would send to backend
    console.log('Sending message:', {
      groupId: selectedGroup.id,
      content: newMessage,
      isAnonymous
    });

    setNewMessage('');
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Support Groups
        </h2>
        <p className="text-gray-600">
          Connect with others who understand your journey
        </p>
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockGroups.map((group) => (
          <Card key={group.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="space-y-4">
              {/* Group Header */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {group.name}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {group.description}
                </p>
              </div>

              {/* Group Stats */}
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{group.memberCount} members</span>
                <div className="flex items-center space-x-1">
                  {group.isPrivate ? (
                    <>
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                      <span>Private</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                      <span>Public</span>
                    </>
                  )}
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {group.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-teal-100 text-teal-800 text-xs rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Join Button */}
              <Button
                onClick={() => handleJoinGroup(group)}
                className="w-full"
                size="sm"
              >
                Join Group
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Create Group Button */}
      <div className="text-center">
        <Button variant="outline" size="lg">
          Create New Group
        </Button>
      </div>

      {/* Group Chat Modal */}
      <Modal
        isOpen={showGroupModal}
        onClose={() => setShowGroupModal(false)}
        title={selectedGroup?.name || 'Group Chat'}
        size="lg"
      >
        {selectedGroup && (
          <div className="space-y-4">
            {/* Group Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">{selectedGroup.description}</p>
              <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                <span>{selectedGroup.memberCount} members</span>
                <span>Moderated community</span>
              </div>
            </div>

            {/* Messages */}
            <div className="max-h-64 overflow-y-auto space-y-3">
              {mockMessages
                .filter(msg => msg.groupId === selectedGroup.id)
                .map((message) => (
                  <div key={message.id} className="bg-white p-3 rounded-lg border">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                          {message.isAnonymous ? '👤' : message.authorName.charAt(0)}
                        </div>
                        <div>
                          <span className="text-sm font-medium">
                            {message.isAnonymous ? 'Anonymous' : message.authorName}
                          </span>
                          <span className="text-xs text-gray-500 ml-2">
                            {formatTime(message.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-700 mb-2">{message.content}</p>
                    
                    {/* Reactions */}
                    <div className="flex items-center space-x-2">
                      {message.reactions.map((reaction, index) => (
                        <button
                          key={index}
                          className="flex items-center space-x-1 px-2 py-1 bg-gray-100 rounded-full text-xs hover:bg-gray-200"
                        >
                          <span>{reaction.emoji}</span>
                          <span>{reaction.count}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
            </div>

            {/* Message Input */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="anonymous"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                />
                <label htmlFor="anonymous" className="text-sm text-gray-700">
                  Post anonymously
                </label>
              </div>
              
              <div className="flex space-x-2">
                <Input
                  value={newMessage}
                  onChange={(value) => setNewMessage(value)}
                  placeholder="Share your thoughts with the group..."
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  size="sm"
                >
                  Send
                </Button>
              </div>
            </div>

            {/* Community Guidelines */}
            <div className="text-xs text-gray-500 bg-yellow-50 p-3 rounded">
              <strong>Community Guidelines:</strong> Be respectful, supportive, and kind. 
              No medical advice. Report inappropriate content to moderators.
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}