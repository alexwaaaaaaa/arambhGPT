export type MoodLevel = 1 | 2 | 3 | 4 | 5;

export interface MoodEntry {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD format
  mood: MoodLevel;
  emotions: string[]; // ['happy', 'anxious', 'calm', etc.]
  notes?: string;
  activities?: string[]; // ['exercise', 'meditation', 'work', etc.]
  sleepHours?: number;
  stressLevel?: MoodLevel;
  energyLevel?: MoodLevel;
  createdAt: string;
  updatedAt: string;
}

export interface MoodStats {
  averageMood: number;
  totalEntries: number;
  streakDays: number;
  mostCommonMood: MoodLevel;
  moodTrend: 'improving' | 'declining' | 'stable';
  weeklyAverage: number;
  monthlyAverage: number;
}

export interface MoodChart {
  date: string;
  mood: number;
  stress?: number;
  energy?: number;
}

export const MOOD_LABELS: Record<MoodLevel, string> = {
  1: 'Very Low',
  2: 'Low', 
  3: 'Neutral',
  4: 'Good',
  5: 'Excellent'
};

export const MOOD_COLORS: Record<MoodLevel, string> = {
  1: '#ef4444', // red-500
  2: '#f97316', // orange-500
  3: '#eab308', // yellow-500
  4: '#22c55e', // green-500
  5: '#06b6d4'  // cyan-500
};

export const MOOD_EMOJIS: Record<MoodLevel, string> = {
  1: '😢',
  2: '😕',
  3: '😐',
  4: '😊',
  5: '😄'
};

export const COMMON_EMOTIONS = [
  'happy', 'sad', 'anxious', 'calm', 'excited', 'tired',
  'stressed', 'relaxed', 'angry', 'peaceful', 'worried', 'confident',
  'lonely', 'grateful', 'frustrated', 'hopeful', 'overwhelmed', 'content'
];

export const COMMON_ACTIVITIES = [
  'exercise', 'meditation', 'work', 'socializing', 'reading',
  'music', 'nature', 'cooking', 'gaming', 'studying',
  'family time', 'self-care', 'creative work', 'volunteering'
];