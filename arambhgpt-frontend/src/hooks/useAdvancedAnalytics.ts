'use client';

import { useState, useEffect, useCallback } from 'react';
import { AdvancedMoodStats, MoodCorrelation, MoodPattern, MoodPrediction } from '@/types/analytics';
import { MoodEntry } from '@/types/mood';
import { useMoodTracking } from './useMoodTracking';

interface UseAdvancedAnalyticsReturn {
  analytics: AdvancedMoodStats | null;
  isLoading: boolean;
  error: string | null;
  generateReport: (dateRange?: { start: string; end: string }) => Promise<void>;
  exportData: (format: 'pdf' | 'csv' | 'json') => Promise<void>;
}

export function useAdvancedAnalytics(): UseAdvancedAnalyticsReturn {
  const { moodHistory } = useMoodTracking();
  const [analytics, setAnalytics] = useState<AdvancedMoodStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate correlations between mood and various factors
  const calculateCorrelations = useCallback((entries: MoodEntry[]): MoodCorrelation[] => {
    const correlations: MoodCorrelation[] = [];

    // Sleep correlation
    const sleepEntries = entries.filter(e => e.sleepHours);
    if (sleepEntries.length > 5) {
      const sleepCorr = calculatePearsonCorrelation(
        sleepEntries.map(e => e.sleepHours!),
        sleepEntries.map(e => e.mood)
      );
      
      correlations.push({
        factor: 'Sleep Hours',
        correlation: sleepCorr,
        significance: Math.abs(sleepCorr) > 0.5 ? 'high' : Math.abs(sleepCorr) > 0.3 ? 'medium' : 'low',
        description: sleepCorr > 0.3 
          ? 'Better sleep is associated with improved mood'
          : sleepCorr < -0.3 
          ? 'Poor sleep may negatively impact mood'
          : 'Sleep shows minimal correlation with mood'
      });
    }

    // Stress correlation
    const stressEntries = entries.filter(e => e.stressLevel);
    if (stressEntries.length > 5) {
      const stressCorr = calculatePearsonCorrelation(
        stressEntries.map(e => e.stressLevel!),
        stressEntries.map(e => e.mood)
      );
      
      correlations.push({
        factor: 'Stress Level',
        correlation: stressCorr,
        significance: Math.abs(stressCorr) > 0.5 ? 'high' : Math.abs(stressCorr) > 0.3 ? 'medium' : 'low',
        description: stressCorr < -0.3 
          ? 'Higher stress levels are associated with lower mood'
          : stressCorr > 0.3 
          ? 'Interestingly, stress shows positive correlation with mood'
          : 'Stress shows minimal correlation with mood'
      });
    }

    // Day of week correlation
    const dayMoods = entries.reduce((acc, entry) => {
      const day = new Date(entry.date).getDay();
      if (!acc[day]) acc[day] = [];
      acc[day].push(entry.mood);
      return acc;
    }, {} as Record<number, number[]>);

    const dayAverages = Object.entries(dayMoods).map(([day, moods]) => ({
      day: parseInt(day),
      avg: moods.reduce((sum, mood) => sum + mood, 0) / moods.length
    }));

    if (dayAverages.length >= 5) {
      const bestDay = dayAverages.reduce((best, current) => 
        current.avg > best.avg ? current : best
      );
      const worstDay = dayAverages.reduce((worst, current) => 
        current.avg < worst.avg ? current : worst
      );

      const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      
      correlations.push({
        factor: 'Day of Week',
        correlation: (bestDay.avg - worstDay.avg) / 4, // Normalize to -1 to 1 range
        significance: Math.abs(bestDay.avg - worstDay.avg) > 1 ? 'high' : 'medium',
        description: `${dayNames[bestDay.day]} tends to be your best day (${bestDay.avg.toFixed(1)}), while ${dayNames[worstDay.day]} tends to be more challenging (${worstDay.avg.toFixed(1)})`
      });
    }

    return correlations;
  }, []);

  // Calculate Pearson correlation coefficient
  const calculatePearsonCorrelation = (x: number[], y: number[]): number => {
    const n = x.length;
    if (n !== y.length || n === 0) return 0;

    const sumX = x.reduce((sum, val) => sum + val, 0);
    const sumY = y.reduce((sum, val) => sum + val, 0);
    const sumXY = x.reduce((sum, val, i) => sum + val * y[i], 0);
    const sumX2 = x.reduce((sum, val) => sum + val * val, 0);
    const sumY2 = y.reduce((sum, val) => sum + val * val, 0);

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));

    return denominator === 0 ? 0 : numerator / denominator;
  };

  // Identify mood patterns
  const identifyPatterns = useCallback((entries: MoodEntry[]): MoodPattern[] => {
    const patterns: MoodPattern[] = [];

    // Weekly patterns
    const weeklyData = entries.reduce((acc, entry) => {
      const week = getWeekNumber(new Date(entry.date));
      if (!acc[week]) acc[week] = [];
      acc[week].push(entry.mood);
      return acc;
    }, {} as Record<number, number[]>);

    const weeklyAverages = Object.values(weeklyData).map(moods => 
      moods.reduce((sum, mood) => sum + mood, 0) / moods.length
    );

    if (weeklyAverages.length > 4) {
      const variance = calculateVariance(weeklyAverages);
      if (variance < 0.5) {
        patterns.push({
          pattern: 'Stable Weekly Mood',
          frequency: weeklyAverages.length,
          description: 'Your mood remains relatively consistent week to week',
          recommendation: 'Continue your current routine as it provides good stability'
        });
      } else if (variance > 1.5) {
        patterns.push({
          pattern: 'Variable Weekly Mood',
          frequency: weeklyAverages.length,
          description: 'Your mood varies significantly between weeks',
          recommendation: 'Consider identifying triggers that cause weekly mood fluctuations'
        });
      }
    }

    // Activity patterns
    const activityMoods = entries.reduce((acc, entry) => {
      entry.activities?.forEach(activity => {
        if (!acc[activity]) acc[activity] = [];
        acc[activity].push(entry.mood);
      });
      return acc;
    }, {} as Record<string, number[]>);

    Object.entries(activityMoods).forEach(([activity, moods]) => {
      if (moods.length >= 3) {
        const avgMood = moods.reduce((sum, mood) => sum + mood, 0) / moods.length;
        if (avgMood >= 4) {
          patterns.push({
            pattern: `Positive Activity: ${activity}`,
            frequency: moods.length,
            description: `${activity} is associated with better mood (avg: ${avgMood.toFixed(1)})`,
            recommendation: `Consider incorporating more ${activity} into your routine`
          });
        }
      }
    });

    return patterns;
  }, []);

  // Calculate variance
  const calculateVariance = (values: number[]): number => {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    return squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
  };

  // Get week number
  const getWeekNumber = (date: Date): number => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000;
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  // Generate mood predictions
  const generatePredictions = useCallback((entries: MoodEntry[]): MoodPrediction[] => {
    if (entries.length < 7) return [];

    const predictions: MoodPrediction[] = [];
    const recentEntries = entries.slice(-14); // Last 2 weeks
    const avgMood = recentEntries.reduce((sum, entry) => sum + entry.mood, 0) / recentEntries.length;
    
    // Simple trend-based prediction
    const trend = recentEntries.slice(-7).reduce((sum, entry) => sum + entry.mood, 0) / 7 - 
                  recentEntries.slice(-14, -7).reduce((sum, entry) => sum + entry.mood, 0) / 7;

    for (let i = 1; i <= 7; i++) {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + i);
      
      let predictedMood = avgMood + (trend * i * 0.1); // Dampen the trend
      predictedMood = Math.max(1, Math.min(5, predictedMood)); // Clamp between 1-5

      predictions.push({
        date: futureDate.toISOString().split('T')[0],
        predictedMood,
        confidence: Math.max(0.3, 0.8 - (i * 0.1)), // Decreasing confidence over time
        factors: trend > 0 ? ['Positive trend'] : trend < 0 ? ['Declining trend'] : ['Stable pattern']
      });
    }

    return predictions;
  }, []);

  // Generate comprehensive analytics
  const generateAnalytics = useCallback((entries: MoodEntry[]): AdvancedMoodStats => {
    // Weekly trends
    const weeklyTrends = entries.reduce((acc, entry) => {
      const day = new Date(entry.date).toLocaleDateString('en-US', { weekday: 'long' });
      const existing = acc.find(item => item.day === day);
      if (existing) {
        existing.averageMood = (existing.averageMood * existing.count + entry.mood) / (existing.count + 1);
        existing.count++;
      } else {
        acc.push({ day, averageMood: entry.mood, count: 1 });
      }
      return acc;
    }, [] as { day: string; averageMood: number; count: number }[]);

    // Monthly trends
    const monthlyTrends = entries.reduce((acc, entry) => {
      const month = new Date(entry.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      const existing = acc.find(item => item.month === month);
      if (existing) {
        existing.averageMood = (existing.averageMood * existing.count + entry.mood) / (existing.count + 1);
        existing.count++;
      } else {
        acc.push({ month, averageMood: entry.mood, count: 1 });
      }
      return acc;
    }, [] as { month: string; averageMood: number; count: number }[]);

    // Emotion frequency
    const emotionCounts = entries.reduce((acc, entry) => {
      entry.emotions.forEach(emotion => {
        acc[emotion] = (acc[emotion] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    const totalEmotions = Object.values(emotionCounts).reduce((sum, count) => sum + count, 0);
    const emotionFrequency = Object.entries(emotionCounts).map(([emotion, count]) => ({
      emotion,
      count,
      percentage: (count / totalEmotions) * 100
    })).sort((a, b) => b.count - a.count);

    // Activity impact
    const activityMoods = entries.reduce((acc, entry) => {
      entry.activities?.forEach(activity => {
        if (!acc[activity]) acc[activity] = [];
        acc[activity].push(entry.mood);
      });
      return acc;
    }, {} as Record<string, number[]>);

    const activityImpact = Object.entries(activityMoods).map(([activity, moods]) => {
      const averageMoodAfter = moods.reduce((sum, mood) => sum + mood, 0) / moods.length;
      return {
        activity,
        averageMoodAfter,
        frequency: moods.length,
        impact: averageMoodAfter >= 4 ? 'positive' as const : averageMoodAfter <= 2 ? 'negative' as const : 'neutral' as const
      };
    }).sort((a, b) => b.averageMoodAfter - a.averageMoodAfter);

    return {
      correlations: calculateCorrelations(entries),
      patterns: identifyPatterns(entries),
      predictions: generatePredictions(entries),
      weeklyTrends,
      monthlyTrends,
      emotionFrequency,
      activityImpact
    };
  }, [calculateCorrelations, identifyPatterns, generatePredictions]);

  // Generate report
  const generateReport = useCallback(async (dateRange?: { start: string; end: string }) => {
    setIsLoading(true);
    setError(null);

    try {
      let filteredEntries = moodHistory;

      if (dateRange) {
        filteredEntries = moodHistory.filter(entry => {
          const entryDate = new Date(entry.date);
          const startDate = new Date(dateRange.start);
          const endDate = new Date(dateRange.end);
          return entryDate >= startDate && entryDate <= endDate;
        });
      }

      if (filteredEntries.length === 0) {
        throw new Error('No mood data available for the selected date range');
      }

      const analytics = generateAnalytics(filteredEntries);
      setAnalytics(analytics);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate analytics');
    } finally {
      setIsLoading(false);
    }
  }, [moodHistory, generateAnalytics]);

  // Export data
  const exportData = useCallback(async (format: 'pdf' | 'csv' | 'json') => {
    if (!analytics) return;

    try {
      let data: string;
      let filename: string;
      let mimeType: string;

      switch (format) {
        case 'json':
          data = JSON.stringify(analytics, null, 2);
          filename = `mood-analytics-${new Date().toISOString().split('T')[0]}.json`;
          mimeType = 'application/json';
          break;
        
        case 'csv':
          // Convert to CSV format
          const csvData = [
            'Date,Mood,Emotions,Activities,Sleep Hours,Stress Level,Energy Level',
            ...moodHistory.map(entry => 
              `${entry.date},${entry.mood},"${entry.emotions.join(';')}","${entry.activities?.join(';') || ''}",${entry.sleepHours || ''},${entry.stressLevel || ''},${entry.energyLevel || ''}`
            )
          ].join('\n');
          data = csvData;
          filename = `mood-data-${new Date().toISOString().split('T')[0]}.csv`;
          mimeType = 'text/csv';
          break;
        
        default:
          throw new Error('PDF export not implemented yet');
      }

      // Create and download file
      const blob = new Blob([data], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export data');
    }
  }, [analytics, moodHistory]);

  // Auto-generate analytics when mood history changes
  useEffect(() => {
    if (moodHistory.length > 0) {
      generateReport();
    }
  }, [moodHistory, generateReport]);

  return {
    analytics,
    isLoading,
    error,
    generateReport,
    exportData
  };
}