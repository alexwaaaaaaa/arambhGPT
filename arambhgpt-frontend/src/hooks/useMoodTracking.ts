'use client';

import { useState, useEffect, useCallback } from 'react';
import { MoodEntry, MoodLevel, MoodStats, MoodChart } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { apiClient } from '@/lib/api';

interface UseMoodTrackingReturn {
    todaysMood: MoodEntry | null;
    moodHistory: MoodEntry[];
    moodStats: MoodStats | null;
    chartData: MoodChart[];
    isLoading: boolean;
    error: string | null;
    saveMoodEntry: (entry: Partial<MoodEntry>) => Promise<void>;
    getMoodHistory: (days?: number) => Promise<void>;
    deleteMoodEntry: (id: string) => Promise<void>;
    hasLoggedToday: boolean;
}

export function useMoodTracking(): UseMoodTrackingReturn {
    const { user } = useAuth();
    const [todaysMood, setTodaysMood] = useState<MoodEntry | null>(null);
    const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
    const [moodStats, setMoodStats] = useState<MoodStats | null>(null);
    const [chartData, setChartData] = useState<MoodChart[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const today = new Date().toISOString().split('T')[0];
    const hasLoggedToday = todaysMood !== null;

    // Load mood data from API
    const loadMoodData = useCallback(async () => {
        if (!user || !apiClient.isAuthenticated()) return;

        try {
            setIsLoading(true);
            setError(null);

            // Get mood entries from API
            const moods = await apiClient.getMoodEntries();
            setMoodHistory(moods);

            // Find today's mood
            const todayMood = moods.find((mood: any) => mood.date === today);
            setTodaysMood(todayMood || null);

            // Generate chart data
            const last30Days = moods
                .filter((mood: any) => {
                    const moodDate = new Date(mood.date);
                    const thirtyDaysAgo = new Date();
                    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                    return moodDate >= thirtyDaysAgo;
                })
                .sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .map((mood: any) => ({
                    date: mood.date,
                    mood: mood.mood,
                    stress: mood.stress_level,
                    energy: mood.energy_level || 3
                }));

            setChartData(last30Days);

            // Get stats from API
            try {
                const stats = await apiClient.getMoodStats();
                setMoodStats({
                    averageMood: stats.average_mood,
                    totalEntries: stats.total_entries,
                    streakDays: stats.streak_days,
                    mostCommonMood: 3 as MoodLevel, // Default fallback
                    moodTrend: stats.mood_trend,
                    weeklyAverage: stats.weekly_average,
                    monthlyAverage: stats.monthly_average
                });
            } catch (statsError) {
                console.error('Failed to load mood stats:', statsError);
                // Fallback to local calculation if API fails
                if (moods.length > 0) {
                    const avgMood = moods.reduce((sum: number, mood: any) => sum + mood.mood, 0) / moods.length;
                    setMoodStats({
                        averageMood: avgMood,
                        totalEntries: moods.length,
                        streakDays: 0,
                        mostCommonMood: 3 as MoodLevel,
                        moodTrend: 'stable',
                        weeklyAverage: avgMood,
                        monthlyAverage: avgMood
                    });
                }
            }

        } catch (err) {
            console.error('Failed to load mood data:', err);
            setError('Failed to load mood data');
            
            // Fallback to localStorage if API fails
            try {
                const savedMoods = localStorage.getItem(`mood-data-${user.id}`);
                if (savedMoods) {
                    const moods: MoodEntry[] = JSON.parse(savedMoods);
                    setMoodHistory(moods);
                    const todayMood = moods.find(mood => mood.date === today);
                    setTodaysMood(todayMood || null);
                }
            } catch (localError) {
                console.error('Failed to load from localStorage:', localError);
            }
        } finally {
            setIsLoading(false);
        }
    }, [user, today]);

    // Save mood entry
    const saveMoodEntry = useCallback(async (entry: Partial<MoodEntry>) => {
        if (!user || !apiClient.isAuthenticated()) return;

        try {
            setIsLoading(true);
            setError(null);

            const moodData = {
                date: entry.date || today,
                mood: entry.mood!,
                emotions: entry.emotions || [],
                activities: entry.activities || [],
                sleep_hours: entry.sleepHours,
                stress_level: entry.stressLevel,
                notes: entry.notes
            };

            // Save to API
            const savedEntry = await apiClient.createMoodEntry(moodData);

            // Update local state
            if (savedEntry.date === today) {
                setTodaysMood({
                    id: savedEntry.id,
                    userId: user.id,
                    date: savedEntry.date,
                    mood: savedEntry.mood,
                    emotions: savedEntry.emotions || [],
                    notes: savedEntry.notes,
                    activities: savedEntry.activities || [],
                    sleepHours: savedEntry.sleep_hours,
                    stressLevel: savedEntry.stress_level,
                    energyLevel: entry.energyLevel || 3,
                    createdAt: savedEntry.created_at,
                    updatedAt: savedEntry.updated_at
                });
            }

            // Reload data to update stats
            await loadMoodData();

        } catch (err) {
            console.error('Failed to save mood entry:', err);
            setError('Failed to save mood entry');
            
            // Fallback to localStorage
            try {
                const moodEntry: MoodEntry = {
                    id: entry.id || `mood-${Date.now()}`,
                    userId: user.id,
                    date: entry.date || today,
                    mood: entry.mood!,
                    emotions: entry.emotions || [],
                    notes: entry.notes,
                    activities: entry.activities,
                    sleepHours: entry.sleepHours,
                    stressLevel: entry.stressLevel,
                    energyLevel: entry.energyLevel,
                    createdAt: entry.createdAt || new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };

                const savedMoods = localStorage.getItem(`mood-data-${user.id}`);
                const moods: MoodEntry[] = savedMoods ? JSON.parse(savedMoods) : [];
                const filteredMoods = moods.filter(mood => mood.date !== moodEntry.date);
                filteredMoods.push(moodEntry);
                localStorage.setItem(`mood-data-${user.id}`, JSON.stringify(filteredMoods));

                if (moodEntry.date === today) {
                    setTodaysMood(moodEntry);
                }
            } catch (localError) {
                console.error('Failed to save to localStorage:', localError);
            }
        } finally {
            setIsLoading(false);
        }
    }, [user, today, loadMoodData]);

    // Get mood history
    const getMoodHistory = useCallback(async (days = 30) => {
        setIsLoading(true);
        loadMoodData();
        setIsLoading(false);
    }, [loadMoodData]);

    // Delete mood entry
    const deleteMoodEntry = useCallback(async (id: string) => {
        if (!user) return;

        try {
            const savedMoods = localStorage.getItem(`mood-data-${user.id}`);
            if (savedMoods) {
                const moods: MoodEntry[] = JSON.parse(savedMoods);
                const filteredMoods = moods.filter(mood => mood.id !== id);
                localStorage.setItem(`mood-data-${user.id}`, JSON.stringify(filteredMoods));

                loadMoodData();
            }
        } catch (err) {
            setError('Failed to delete mood entry');
        }
    }, [user, loadMoodData]);

    // Load data on mount
    useEffect(() => {
        loadMoodData();
    }, [loadMoodData]);

    return {
        todaysMood,
        moodHistory,
        moodStats,
        chartData,
        isLoading,
        error,
        saveMoodEntry,
        getMoodHistory,
        deleteMoodEntry,
        hasLoggedToday
    };
}