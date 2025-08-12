'use client';

import React, { useState, useEffect } from 'react';
import { Modal, Input, Button, Dropdown, LoadingSpinner, ErrorMessage } from '@/components/ui';
import { SearchRequest, SearchResult, DropdownOption } from '@/types';
import { apiClient } from '@/lib/api';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResultSelect: (conversationId: string) => void;
}

export function SearchModal({ isOpen, onClose, onResultSelect }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  
  // Filters
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [archived, setArchived] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  // Dropdown options
  const archivedOptions: DropdownOption[] = [
    { value: 'all', label: 'All Conversations' },
    { value: 'false', label: 'Active Only' },
    { value: 'true', label: 'Archived Only' },
  ];

  // Clear search when modal closes
  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResults([]);
      setError(null);
      setHasSearched(false);
      setPage(1);
      setDateFrom('');
      setDateTo('');
      setArchived('all');
    }
  }, [isOpen]);

  const performSearch = async (searchQuery: string, pageNum: number = 1, append: boolean = false) => {
    if (!searchQuery.trim()) return;

    try {
      setIsLoading(true);
      setError(null);

      const searchRequest: SearchRequest = {
        query: searchQuery.trim(),
        page: pageNum,
        limit: 10,
        ...(dateFrom && { date_from: dateFrom }),
        ...(dateTo && { date_to: dateTo }),
        ...(archived !== 'all' && { archived: archived === 'true' }),
      };

      const response = await apiClient.searchConversations(searchRequest);
      
      if (append) {
        setResults(prev => [...prev, ...response.results]);
      } else {
        setResults(response.results);
      }
      
      setHasMore(response.has_more);
      setPage(pageNum);
      setHasSearched(true);

    } catch (err) {
      console.error('Search failed:', err);
      setError('Search failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      performSearch(query, 1, false);
    }
  };

  const handleLoadMore = () => {
    if (hasMore && !isLoading && query.trim()) {
      performSearch(query, page + 1, true);
    }
  };

  const handleResultClick = (conversationId: string) => {
    onResultSelect(conversationId);
    onClose();
  };

  const highlightText = (text: string, searchQuery: string) => {
    if (!searchQuery.trim()) return text;
    
    const regex = new RegExp(`(${searchQuery.trim()})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Search Conversations"
      size="lg"
    >
      <div className="space-y-6">
        {/* Search Form */}
        <form onSubmit={handleSearch} className="space-y-4">
          <Input
            type="search"
            placeholder="Search conversations, messages, or topics..."
            value={query}
            onChange={setQuery}
            className="text-lg"
            autoFocus
          />

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                From Date
              </label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To Date
              </label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <Dropdown
              label="Status"
              options={archivedOptions}
              value={archived}
              onChange={setArchived}
            />
          </div>

          <div className="flex justify-between items-center">
            <Button
              type="submit"
              isLoading={isLoading}
              disabled={!query.trim() || isLoading}
            >
              {isLoading ? 'Searching...' : 'Search'}
            </Button>

            {(dateFrom || dateTo || archived !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setDateFrom('');
                  setDateTo('');
                  setArchived('all');
                }}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Clear Filters
              </button>
            )}
          </div>
        </form>

        {/* Error Message */}
        {error && (
          <ErrorMessage
            message={error}
            variant="card"
            onRetry={() => performSearch(query, 1, false)}
          />
        )}

        {/* Search Results */}
        <div className="max-h-96 overflow-y-auto">
          {hasSearched && results.length === 0 && !isLoading && (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
              <p className="text-gray-500">
                Try adjusting your search terms or filters
              </p>
            </div>
          )}

          {results.map((result) => (
            <div
              key={result.conversation.id}
              onClick={() => handleResultClick(result.conversation.id)}
              className="p-4 border border-gray-200 rounded-lg mb-3 cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-gray-900">
                  {highlightText(result.conversation.title, query)}
                </h3>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <span>{formatDate(result.conversation.created_at)}</span>
                  {result.conversation.is_archived && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded">
                      Archived
                    </span>
                  )}
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-2">
                {highlightText(result.conversation.last_message_preview, query)}
              </p>

              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>{result.conversation.message_count} messages</span>
                <span>Relevance: {Math.round(result.relevance_score * 100)}%</span>
              </div>

              {/* Highlights */}
              {result.highlights.length > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-100">
                  <p className="text-xs text-gray-500 mb-1">Matching content:</p>
                  {result.highlights.slice(0, 2).map((highlight, index) => (
                    <p key={index} className="text-xs text-gray-600 italic">
                      "{highlightText(highlight, query)}"
                    </p>
                  ))}
                </div>
              )}
            </div>
          ))}

          {/* Load More Button */}
          {hasMore && (
            <div className="text-center py-4">
              <Button
                onClick={handleLoadMore}
                variant="outline"
                size="sm"
                isLoading={isLoading}
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : 'Load More Results'}
              </Button>
            </div>
          )}

          {/* Loading State */}
          {isLoading && results.length === 0 && (
            <div className="text-center py-8">
              <LoadingSpinner size="lg" />
              <p className="mt-4 text-gray-600">Searching conversations...</p>
            </div>
          )}
        </div>

        {/* Search Tips */}
        {!hasSearched && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-blue-800 mb-2">Search Tips:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Search for specific words, phrases, or topics</li>
              <li>• Use date filters to narrow down results</li>
              <li>• Filter by active or archived conversations</li>
              <li>• Results are ranked by relevance</li>
            </ul>
          </div>
        )}
      </div>
    </Modal>
  );
}