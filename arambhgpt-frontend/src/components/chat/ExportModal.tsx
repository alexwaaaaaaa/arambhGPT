'use client';

import React, { useState } from 'react';
import { Modal, Button, Dropdown, LoadingSpinner, ErrorMessage } from '@/components/ui';
import { ExportOptions } from '@/types';
import { apiClient } from '@/lib/api';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  conversationIds?: string[];
  allConversations?: boolean;
}

export function ExportModal({ 
  isOpen, 
  onClose, 
  conversationIds = [], 
  allConversations = false 
}: ExportModalProps) {
  const [format, setFormat] = useState<'json' | 'txt' | 'pdf'>('json');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [exportProgress, setExportProgress] = useState(0);

  const formatOptions = [
    { value: 'json', label: 'JSON - Machine readable format' },
    { value: 'txt', label: 'TXT - Plain text format' },
    { value: 'pdf', label: 'PDF - Formatted document' },
  ];

  const handleExport = async () => {
    try {
      setIsExporting(true);
      setError(null);
      setExportProgress(0);

      const exportOptions: ExportOptions = {
        format,
        conversation_ids: allConversations ? [] : conversationIds,
        ...(dateFrom && { date_from: dateFrom }),
        ...(dateTo && { date_to: dateTo }),
      };

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setExportProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const blob = await apiClient.exportConversations({ options: exportOptions });
      
      // Complete progress
      clearInterval(progressInterval);
      setExportProgress(100);

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Generate filename
      const timestamp = new Date().toISOString().split('T')[0];
      const conversationText = allConversations 
        ? 'all-conversations' 
        : `${conversationIds.length}-conversations`;
      link.download = `arambhgpt-${conversationText}-${timestamp}.${format}`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Close modal after successful export
      setTimeout(() => {
        onClose();
        resetForm();
      }, 1000);

    } catch (err) {
      console.error('Export failed:', err);
      setError('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  const resetForm = () => {
    setFormat('json');
    setDateFrom('');
    setDateTo('');
    setError(null);
    setExportProgress(0);
  };

  const handleClose = () => {
    if (!isExporting) {
      onClose();
      resetForm();
    }
  };

  const getExportDescription = () => {
    if (allConversations) {
      return 'Export all your conversations';
    }
    if (conversationIds.length === 1) {
      return 'Export 1 selected conversation';
    }
    return `Export ${conversationIds.length} selected conversations`;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Export Conversations"
      size="md"
      closeOnOverlayClick={!isExporting}
    >
      <div className="space-y-6">
        {/* Export Description */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div className="ml-3">
              <h4 className="text-sm font-medium text-blue-800">
                {getExportDescription()}
              </h4>
              <p className="text-sm text-blue-700 mt-1">
                Your conversations will be exported securely and can be used for backup or analysis.
              </p>
            </div>
          </div>
        </div>

        {/* Format Selection */}
        <div>
          <Dropdown
            label="Export Format"
            options={formatOptions}
            value={format}
            onChange={(value) => setFormat(value as 'json' | 'txt' | 'pdf')}
          />
        </div>

        {/* Date Range Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              From Date (Optional)
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              disabled={isExporting}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              To Date (Optional)
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              disabled={isExporting}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50"
            />
          </div>
        </div>

        {/* Export Progress */}
        {isExporting && (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Exporting...</span>
              <span className="text-sm text-gray-600">{exportProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-teal-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${exportProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <ErrorMessage
            message={error}
            variant="card"
            onRetry={() => {
              setError(null);
              handleExport();
            }}
          />
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isExporting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleExport}
            isLoading={isExporting}
            disabled={isExporting || (conversationIds.length === 0 && !allConversations)}
          >
            {isExporting ? (
              <>
                <LoadingSpinner size="sm" color="white" className="mr-2" />
                Exporting...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export {format.toUpperCase()}
              </>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}