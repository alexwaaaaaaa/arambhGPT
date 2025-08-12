'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (groupData: any) => void;
}

export function CreateGroupModal({ isOpen, onClose, onSubmit }: CreateGroupModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    tags: '',
    rules: '',
    isPrivate: false
  });
  const [loading, setLoading] = useState(false);

  const categories = [
    { id: 'mental_health', name: 'Mental Health', icon: '🧠' },
    { id: 'anxiety_support', name: 'Anxiety Support', icon: '💙' },
    { id: 'depression_support', name: 'Depression Support', icon: '🌈' },
    { id: 'relationship_advice', name: 'Relationship Advice', icon: '💕' },
    { id: 'family_issues', name: 'Family Issues', icon: '👨‍👩‍👧‍👦' },
    { id: 'career_stress', name: 'Career Stress', icon: '💼' },
    { id: 'student_support', name: 'Student Support', icon: '📚' },
    { id: 'wellness_tips', name: 'Wellness Tips', icon: '🌱' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate loading
    setTimeout(() => {
      const groupData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        id: Date.now().toString(),
        members: 1
      };
      
      onSubmit(groupData);
      setLoading(false);
    }, 1000);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="नया Support Group बनाएं">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Group Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Group का नाम *
          </label>
          <Input
            type="text"
            value={formData.name}
            onChange={(value) => handleInputChange('name', value)}
            placeholder="जैसे: Anxiety Support Circle"
            required
            className="w-full"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="इस group के बारे में बताएं... यह किसके लिए है और कैसे help करेगा?"
            required
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category *
          </label>
          <div className="grid grid-cols-2 gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => handleInputChange('category', category.id)}
                className={`p-3 border rounded-lg text-left transition-colors ${
                  formData.category === category.id
                    ? 'border-teal-500 bg-teal-50 text-teal-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{category.icon}</span>
                  <span className="text-sm font-medium">{category.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags (comma separated)
          </label>
          <Input
            type="text"
            value={formData.tags}
            onChange={(value) => handleInputChange('tags', value)}
            placeholder="anxiety, support, hindi, safe-space"
            className="w-full"
          />
          <p className="text-xs text-gray-500 mt-1">
            Tags से लोगों को आपका group ढूंढने में आसानी होगी
          </p>
        </div>

        {/* Group Rules */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Group Rules (Optional)
          </label>
          <textarea
            value={formData.rules}
            onChange={(e) => handleInputChange('rules', e.target.value)}
            placeholder="Group के rules और guidelines..."
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>

        {/* Privacy Setting */}
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="isPrivate"
            checked={formData.isPrivate}
            onChange={(e) => handleInputChange('isPrivate', e.target.checked)}
            className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
          />
          <label htmlFor="isPrivate" className="text-sm text-gray-700">
            Private Group बनाएं (केवल invite पर join हो सकेंगे)
          </label>
        </div>

        {/* Guidelines */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">📋 Community Guidelines</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Respectful और supportive environment बनाए रखें</li>
            <li>• Personal information share करने से बचें</li>
            <li>• Professional medical advice नहीं दें</li>
            <li>• Spam या inappropriate content post न करें</li>
          </ul>
        </div>

        {/* Actions */}
        <div className="flex space-x-3 pt-4">
          <Button
            type="button"
            onClick={onClose}
            className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading || !formData.name || !formData.description || !formData.category}
            className="flex-1 bg-teal-600 hover:bg-teal-700 text-white"
          >
            {loading ? 'Creating...' : 'Group बनाएं'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}