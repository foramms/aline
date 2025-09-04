export interface JournalEntry {
  id: string;
  date: Date;
  title?: string;
  content: string;
  mood: number; // 1-5 scale
  tags: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  themes: string[];
  wordCount: number;
  timeSpent: number; // in minutes
  prompt?: string;
}

export interface MoodTrend {
  date: string;
  mood: number;
  sentiment: string;
}

export interface Theme {
  name: string;
  count: number;
  sentiment: number;
  trend: 'up' | 'down' | 'stable';
}

export interface Insight {
  id: string;
  type: 'pattern' | 'achievement' | 'suggestion';
  title: string;
  description: string;
  confidence: number;
  date: Date;
}

export interface WeeklyReflection {
  weekStart: Date;
  weekEnd: Date;
  totalEntries: number;
  averageMood: number;
  dominantThemes: string[];
  keyInsights: string[];
  encouragement: string;
}