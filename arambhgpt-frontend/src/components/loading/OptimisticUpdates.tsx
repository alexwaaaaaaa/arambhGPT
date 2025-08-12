'use client';

import React, { useState, useCallback, useRef } from 'react';
import { Message } from '@/types';

interface OptimisticMessage extends Message {
    isOptimistic?: boolean;
    isPending?: boolean;
    error?: string;
}

interface UseOptimisticMessagesOptions {
    onSendMessage: (content: string) => Promise<Message>;
    onError?: (error: Error, optimisticMessage: OptimisticMessage) => void;
}

interface UseOptimisticMessagesReturn {
    messages: OptimisticMessage[];
    sendMessage: (content: string) => Promise<void>;
    retryMessage: (messageId: string) => Promise<void>;
    removeOptimisticMessage: (messageId: string) => void;
    isLoading: boolean;
}

export function useOptimisticMessages({
    onSendMessage,
    onError
}: UseOptimisticMessagesOptions): UseOptimisticMessagesReturn {
    const [messages, setMessages] = useState<OptimisticMessage[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const optimisticIdCounter = useRef(0);

    const generateOptimisticId = useCallback(() => {
        return `optimistic_${Date.now()}_${++optimisticIdCounter.current}`;
    }, []);

    const sendMessage = useCallback(async (content: string) => {
        const optimisticId = generateOptimisticId();
        const optimisticMessage: OptimisticMessage = {
            id: optimisticId,
            content,
            sender: 'user',
            created_at: new Date().toISOString(),
            isOptimistic: true,
            isPending: true,
        };

        // Add optimistic message immediately
        setMessages(prev => [...prev, optimisticMessage]);
        setIsLoading(true);

        try {
            // Send the actual message
            const actualMessage = await onSendMessage(content);

            // Replace optimistic message with actual message
            setMessages(prev =>
                prev.map(msg =>
                    msg.id === optimisticId
                        ? { ...actualMessage, isOptimistic: false, isPending: false }
                        : msg
                )
            );
        } catch (error) {
            // Mark optimistic message as failed
            setMessages(prev =>
                prev.map(msg =>
                    msg.id === optimisticId
                        ? {
                            ...msg,
                            isPending: false,
                            error: error instanceof Error ? error.message : 'Failed to send message'
                        }
                        : msg
                )
            );

            if (onError) {
                onError(error instanceof Error ? error : new Error('Unknown error'), optimisticMessage);
            }
        } finally {
            setIsLoading(false);
        }
    }, [onSendMessage, onError, generateOptimisticId]);

    const retryMessage = useCallback(async (messageId: string) => {
        const message = messages.find(msg => msg.id === messageId);
        if (!message || !message.error) return;

        // Reset message state
        setMessages(prev =>
            prev.map(msg =>
                msg.id === messageId
                    ? { ...msg, isPending: true, error: undefined }
                    : msg
            )
        );

        try {
            const actualMessage = await onSendMessage(message.content);

            // Replace with actual message
            setMessages(prev =>
                prev.map(msg =>
                    msg.id === messageId
                        ? { ...actualMessage, isOptimistic: false, isPending: false }
                        : msg
                )
            );
        } catch (error) {
            // Mark as failed again
            setMessages(prev =>
                prev.map(msg =>
                    msg.id === messageId
                        ? {
                            ...msg,
                            isPending: false,
                            error: error instanceof Error ? error.message : 'Failed to send message'
                        }
                        : msg
                )
            );

            if (onError && message) {
                onError(error instanceof Error ? error : new Error('Unknown error'), message);
            }
        }
    }, [messages, onSendMessage, onError]);

    const removeOptimisticMessage = useCallback((messageId: string) => {
        setMessages(prev => prev.filter(msg => msg.id !== messageId));
    }, []);

    return {
        messages,
        sendMessage,
        retryMessage,
        removeOptimisticMessage,
        isLoading,
    };
}

// Component for displaying optimistic message states
interface OptimisticMessageIndicatorProps {
    message: OptimisticMessage;
    onRetry?: () => void;
    onRemove?: () => void;
}

export function OptimisticMessageIndicator({
    message,
    onRetry,
    onRemove
}: OptimisticMessageIndicatorProps) {
    if (!message.isOptimistic) return null;

    if (message.isPending) {
        return (
            <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-gray-400"></div>
                <span>Sending...</span>
            </div>
        );
    }

    if (message.error) {
        return (
            <div className="flex items-center space-x-2 text-xs text-red-600 mt-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span>Failed to send</span>
                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="text-blue-600 hover:text-blue-800 underline"
                    >
                        Retry
                    </button>
                )}
                {onRemove && (
                    <button
                        onClick={onRemove}
                        className="text-red-600 hover:text-red-800 underline"
                    >
                        Remove
                    </button>
                )}
            </div>
        );
    }

    return null;
}

// Hook for optimistic updates in general
interface UseOptimisticUpdatesOptions<T> {
    onUpdate: (item: T) => Promise<T>;
    onError?: (error: Error, item: T) => void;
}

export function useOptimisticUpdates<T extends { id: string }>({
    onUpdate,
    onError
}: UseOptimisticUpdatesOptions<T>) {
    const [pendingUpdates, setPendingUpdates] = useState<Set<string>>(new Set());
    const [failedUpdates, setFailedUpdates] = useState<Map<string, string>>(new Map());

    const updateItem = useCallback(async (item: T) => {
        const itemId = item.id;

        // Mark as pending
        setPendingUpdates(prev => new Set(prev).add(itemId));
        setFailedUpdates(prev => {
            const newMap = new Map(prev);
            newMap.delete(itemId);
            return newMap;
        });

        try {
            await onUpdate(item);

            // Remove from pending on success
            setPendingUpdates(prev => {
                const newSet = new Set(prev);
                newSet.delete(itemId);
                return newSet;
            });
        } catch (error) {
            // Mark as failed
            setPendingUpdates(prev => {
                const newSet = new Set(prev);
                newSet.delete(itemId);
                return newSet;
            });

            setFailedUpdates(prev =>
                new Map(prev).set(itemId, error instanceof Error ? error.message : 'Update failed')
            );

            if (onError) {
                onError(error instanceof Error ? error : new Error('Unknown error'), item);
            }
        }
    }, [onUpdate, onError]);

    const retryUpdate = useCallback(async (item: T) => {
        await updateItem(item);
    }, [updateItem]);

    const clearError = useCallback((itemId: string) => {
        setFailedUpdates(prev => {
            const newMap = new Map(prev);
            newMap.delete(itemId);
            return newMap;
        });
    }, []);

    return {
        updateItem,
        retryUpdate,
        clearError,
        isPending: (itemId: string) => pendingUpdates.has(itemId),
        getError: (itemId: string) => failedUpdates.get(itemId),
        hasError: (itemId: string) => failedUpdates.has(itemId),
    };
}