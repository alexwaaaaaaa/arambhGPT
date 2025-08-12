'use client';

import React, { useState } from 'react';
import { MoodLevel, MOOD_LABELS, MOOD_EMOJIS, COMMON_EMOTIONS, COMMON_ACTIVITIES } from '@/types';
import { Button, Card, Input } from '@/components/ui';
import { useMoodTracking } from '@/hooks';

interface MoodEntryProps {
    onComplete?: () => void;
    className?: string;
}

export function MoodEntry({ onComplete, className = '' }: MoodEntryProps) {
    const { saveMoodEntry, isLoading, todaysMood } = useMoodTracking();

    const [mood, setMood] = useState<MoodLevel>(todaysMood?.mood || 3);
    const [emotions, setEmotions] = useState<string[]>(todaysMood?.emotions || []);
    const [activities, setActivities] = useState<string[]>(todaysMood?.activities || []);
    const [notes, setNotes] = useState(todaysMood?.notes || '');
    const [sleepHours, setSleepHours] = useState(todaysMood?.sleepHours || 8);
    const [stressLevel, setStressLevel] = useState<MoodLevel>(todaysMood?.stressLevel || 3);
    const [energyLevel, setEnergyLevel] = useState<MoodLevel>(todaysMood?.energyLevel || 3);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        await saveMoodEntry({
            mood,
            emotions,
            activities,
            notes: notes.trim() || undefined,
            sleepHours,
            stressLevel,
            energyLevel
        });

        if (onComplete) {
            onComplete();
        }
    };

    const toggleEmotion = (emotion: string) => {
        setEmotions(prev =>
            prev.includes(emotion)
                ? prev.filter(e => e !== emotion)
                : [...prev, emotion]
        );
    };

    const toggleActivity = (activity: string) => {
        setActivities(prev =>
            prev.includes(activity)
                ? prev.filter(a => a !== activity)
                : [...prev, activity]
        );
    };

    return (
        <Card className={`max-w-2xl mx-auto ${className}`}>
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Header */}
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        How are you feeling today?
                    </h2>
                    <p className="text-gray-600">
                        Take a moment to reflect on your mood and well-being
                    </p>
                </div>

                {/* Mood Selection */}
                <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                        Overall Mood
                    </label>
                    <div className="flex justify-between items-center space-x-2">
                        {([1, 2, 3, 4, 5] as MoodLevel[]).map((level) => (
                            <button
                                key={level}
                                type="button"
                                onClick={() => setMood(level)}
                                className={`flex-1 p-4 rounded-lg border-2 transition-all duration-200 ${mood === level
                                    ? 'border-teal-500 bg-teal-50 shadow-md'
                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                    }`}
                            >
                                <div className="text-3xl mb-2">{MOOD_EMOJIS[level]}</div>
                                <div className="text-xs font-medium text-gray-700">
                                    {MOOD_LABELS[level]}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Emotions */}
                <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                        What emotions are you experiencing? (Select all that apply)
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {COMMON_EMOTIONS.map((emotion) => (
                            <button
                                key={emotion}
                                type="button"
                                onClick={() => toggleEmotion(emotion)}
                                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${emotions.includes(emotion)
                                    ? 'bg-teal-100 text-teal-800 border border-teal-300'
                                    : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                                    }`}
                            >
                                {emotion}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Stress and Energy Levels */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Stress Level */}
                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">
                            Stress Level: {MOOD_LABELS[stressLevel]}
                        </label>
                        <input
                            type="range"
                            min="1"
                            max="5"
                            value={stressLevel}
                            onChange={(e) => setStressLevel(Number(e.target.value) as MoodLevel)}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                            <span>Low</span>
                            <span>High</span>
                        </div>
                    </div>

                    {/* Energy Level */}
                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-700">
                            Energy Level: {MOOD_LABELS[energyLevel]}
                        </label>
                        <input
                            type="range"
                            min="1"
                            max="5"
                            value={energyLevel}
                            onChange={(e) => setEnergyLevel(Number(e.target.value) as MoodLevel)}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        />
                        <div className="flex justify-between text-xs text-gray-500">
                            <span>Low</span>
                            <span>High</span>
                        </div>
                    </div>
                </div>

                {/* Sleep Hours */}
                <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                        Hours of Sleep Last Night
                    </label>
                    <Input
                        type="number"
                        min="0"
                        max="24"
                        step="0.5"
                        value={sleepHours}
                        onChange={(value) => setSleepHours(Number(value))}
                        className="w-full"
                    />
                </div>

                {/* Activities */}
                <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                        Activities Today (Select all that apply)
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {COMMON_ACTIVITIES.map((activity) => (
                            <button
                                key={activity}
                                type="button"
                                onClick={() => toggleActivity(activity)}
                                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${activities.includes(activity)
                                    ? 'bg-blue-100 text-blue-800 border border-blue-300'
                                    : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                                    }`}
                            >
                                {activity}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Notes */}
                <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                        Additional Notes (Optional)
                    </label>
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="How was your day? Any thoughts or reflections..."
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                </div>

                {/* Submit Button */}
                <div className="flex justify-end space-x-3">
                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="px-8"
                    >
                        {isLoading ? 'Saving...' : todaysMood ? 'Update Entry' : 'Save Entry'}
                    </Button>
                </div>
            </form>
        </Card>
    );
}