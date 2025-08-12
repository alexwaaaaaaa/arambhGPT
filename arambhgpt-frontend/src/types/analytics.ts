export interface MoodCorrelation {
  factor: string;
  correlation: number; // -1 to 1
  significance: 'low' | 'medium' | 'high';
  description: string;
}

export interface MoodPattern {
  pattern: string;
  frequency: number;
  description: string;
  recommendation: string;
}

export interface MoodPrediction {
  date: string;
  predictedMood: number;
  confidence: number;
  factors: string[];
}

export interface AdvancedMoodStats {
  correlations: MoodCorrelation[];
  patterns: MoodPattern[];
  predictions: MoodPrediction[];
  weeklyTrends: {
    day: string;
    averageMood: number;
    count: number;
  }[];
  monthlyTrends: {
    month: string;
    averageMood: number;
    count: number;
  }[];
  emotionFrequency: {
    emotion: string;
    count: number;
    percentage: number;
  }[];
  activityImpact: {
    activity: string;
    averageMoodAfter: number;
    frequency: number;
    impact: 'positive' | 'negative' | 'neutral';
  }[];
}

export interface ExportOptions {
  format: 'pdf' | 'csv' | 'json';
  dateRange: {
    start: string;
    end: string;
  };
  includeCharts: boolean;
  includeAnalytics: boolean;
  includeRecommendations: boolean;
}