'use client';

import React, { useState } from 'react';
import { User } from '@/types';
import { Card, Button, Input, ErrorMessage, LoadingSpinner } from '@/components/ui';
import { useAuth } from '@/hooks';
import { apiClient } from '@/lib/api';

interface AccountSettingsProps {
  user: User;
  className?: string;
}

export function AccountSettings({ user, className = '' }: AccountSettingsProps) {
  const { refreshUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: user.name,
    email: user.email,
  });

  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // This would be implemented when we create the API endpoint
      // await apiClient.updateProfile(profileForm);
      
      // For now, simulate success
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      
      // Refresh user data
      if (refreshUser) {
        await refreshUser();
      }
      
    } catch (err) {
      console.error('Profile update failed:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('New passwords do not match.');
      setIsLoading(false);
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setError('New password must be at least 8 characters long.');
      setIsLoading(false);
      return;
    }

    try {
      // This would be implemented when we create the API endpoint
      // await apiClient.changePassword({
      //   current_password: passwordForm.currentPassword,
      //   new_password: passwordForm.newPassword,
      // });
      
      // For now, simulate success
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess('Password changed successfully!');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      
    } catch (err) {
      console.error('Password change failed:', err);
      setError('Failed to change password. Please check your current password and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAccountDeletion = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // This would be implemented when we create the API endpoint
      // await apiClient.deleteAccount();
      
      // For now, simulate success and redirect
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real implementation, this would sign out the user and redirect
      alert('Account deletion would be processed here. This is a demo.');
      
    } catch (err) {
      console.error('Account deletion failed:', err);
      setError('Failed to delete account. Please try again.');
    } finally {
      setIsLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex">
            <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="ml-3 text-sm text-green-800">{success}</p>
          </div>
        </div>
      )}

      {error && (
        <ErrorMessage
          message={error}
          variant="card"
        />
      )}

      {/* Profile Information */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
          {!isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </Button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleProfileUpdate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={profileForm.name}
                onChange={(value) => setProfileForm(prev => ({ ...prev, name: value }))}
                required
                disabled={isLoading}
              />
              
              <Input
                label="Email Address"
                type="email"
                value={profileForm.email}
                onChange={(value) => setProfileForm(prev => ({ ...prev, email: value }))}
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setProfileForm({ name: user.name, email: user.email });
                }}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={isLoading}
                disabled={isLoading}
              >
                Save Changes
              </Button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <p className="text-gray-900">{user.name}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <p className="text-gray-900">{user.email}</p>
            </div>
          </div>
        )}
      </Card>

      {/* Change Password */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <Input
            label="Current Password"
            type="password"
            value={passwordForm.currentPassword}
            onChange={(value) => setPasswordForm(prev => ({ ...prev, currentPassword: value }))}
            required
            disabled={isLoading}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="New Password"
              type="password"
              value={passwordForm.newPassword}
              onChange={(value) => setPasswordForm(prev => ({ ...prev, newPassword: value }))}
              required
              disabled={isLoading}
              minLength={8}
            />
            
            <Input
              label="Confirm New Password"
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(value) => setPasswordForm(prev => ({ ...prev, confirmPassword: value }))}
              required
              disabled={isLoading}
              minLength={8}
            />
          </div>
          
          <div className="flex justify-end">
            <Button
              type="submit"
              isLoading={isLoading}
              disabled={isLoading || !passwordForm.currentPassword || !passwordForm.newPassword}
            >
              Change Password
            </Button>
          </div>
        </form>
      </Card>

      {/* Danger Zone */}
      <Card>
        <h3 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h3>
        <div className="border border-red-200 rounded-lg p-4 bg-red-50">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="font-medium text-red-800">Delete Account</h4>
              <p className="text-sm text-red-600 mt-1">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
            </div>
            
            {!showDeleteConfirm ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDeleteConfirm(true)}
                className="border-red-300 text-red-700 hover:bg-red-100"
              >
                Delete Account
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleAccountDeletion}
                  isLoading={isLoading}
                  disabled={isLoading}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  {isLoading ? (
                    <>
                      <LoadingSpinner size="sm" color="white" className="mr-2" />
                      Deleting...
                    </>
                  ) : (
                    'Confirm Delete'
                  )}
                </Button>
              </div>
            )}
          </div>
          
          {showDeleteConfirm && (
            <div className="mt-4 p-3 bg-red-100 rounded border border-red-200">
              <p className="text-sm text-red-800 font-medium">
                Are you sure you want to delete your account?
              </p>
              <p className="text-sm text-red-600 mt-1">
                This will permanently delete all your conversations, messages, and account data.
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}