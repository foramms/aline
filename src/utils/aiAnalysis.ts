import { JournalEntry, WeeklyReflection, Insight } from '../types/journal';

// Enhanced theme detection with subcategories
const THEME_CATEGORIES = {
  emotions: {
    positive: ['joy', 'happiness', 'excitement', 'gratitude', 'love', 'peace', 'calm', 'content', 'proud', 'accomplished'],
    negative: ['sadness', 'anger', 'frustration', 'anxiety', 'stress', 'worry', 'fear', 'disappointment', 'loneliness', 'overwhelmed'],
    mixed: ['confused', 'uncertain', 'conflicted', 'torn', 'ambivalent']
  },
  relationships: {
    family: ['family', 'parent', 'child', 'sibling', 'marriage', 'partner', 'spouse'],
    friends: ['friend', 'friendship', 'social', 'connection', 'community'],
    work: ['colleague', 'boss', 'team', 'workplace', 'professional'],
    romantic: ['dating', 'romance', 'intimacy', 'relationship']
  },
  life_areas: {
    work: ['work', 'job', 'career', 'project', 'meeting', 'deadline', 'promotion', 'workplace'],
    health: ['health', 'exercise', 'diet', 'sleep', 'wellness', 'fitness', 'medical', 'doctor'],
    personal: ['growth', 'learning', 'development', 'goal', 'achievement', 'skill', 'hobby'],
    financial: ['money', 'finance', 'budget', 'expense', 'saving', 'investment', 'financial']
  },
  activities: {
    creative: ['art', 'music', 'writing', 'painting', 'drawing', 'creative', 'inspiration'],
    physical: ['exercise', 'workout', 'running', 'walking', 'sports', 'activity'],
    social: ['party', 'gathering', 'event', 'celebration', 'meeting', 'social'],
    relaxation: ['rest', 'relax', 'meditation', 'mindfulness', 'quiet', 'peace']
  }
};

// Enhanced sentiment analysis with emotional intensity
const EMOTION_WORDS = {
  joy: { words: ['joy', 'happy', 'excited', 'thrilled', 'elated', 'ecstatic'], intensity: 3 },
  gratitude: { words: ['grateful', 'thankful', 'blessed', 'appreciate', 'fortunate'], intensity: 2 },
  love: { words: ['love', 'adore', 'cherish', 'treasure', 'heart'], intensity: 3 },
  peace: { words: ['peaceful', 'calm', 'serene', 'tranquil', 'content'], intensity: 2 },
  pride: { words: ['proud', 'accomplished', 'achieved', 'successful', 'victory'], intensity: 2 },
  sadness: { words: ['sad', 'depressed', 'melancholy', 'sorrow', 'grief'], intensity: 3 },
  anger: { words: ['angry', 'furious', 'irritated', 'annoyed', 'frustrated'], intensity: 3 },
  anxiety: { words: ['anxious', 'worried', 'nervous', 'stressed', 'tense'], intensity: 3 },
  fear: { words: ['afraid', 'scared', 'terrified', 'fearful', 'panic'], intensity: 3 },
  disappointment: { words: ['disappointed', 'let down', 'discouraged', 'defeated'], intensity: 2 },
  confusion: { words: ['confused', 'uncertain', 'unsure', 'doubtful', 'questioning'], intensity: 2 },
  hope: { words: ['hopeful', 'optimistic', 'positive', 'looking forward'], intensity: 2 }
};

// Enhanced prompt templates with more personalization
const PERSONALIZED_PROMPTS = {
  mood_based: {
    high_positive: [
      "Your energy is radiating positivity! What's fueling this wonderful momentum?",
      "You're in such a great space right now. How can you share this energy with others?",
      "This positive energy is contagious! What would you tell someone who's struggling?"
    ],
    positive: [
      "You seem to be in a good place. What small thing made you smile today?",
      "Your positive energy is showing. How can you nurture this feeling?",
      "What's contributing to your good mood? Let's explore what's working."
    ],
    neutral: [
      "You're in a balanced state. What's on your mind that you'd like to explore?",
      "Sometimes neutral moments are perfect for reflection. What's calling your attention?",
      "In this calm space, what would you like to understand better about yourself?"
    ],
    negative: [
      "I sense you're going through something difficult. What do you need most right now?",
      "It's okay to not be okay. What would feel supportive to you today?",
      "You're showing strength by being honest about your feelings. What's weighing on your heart?"
    ],
    very_negative: [
      "I'm here with you in this difficult time. What would help you feel even slightly better?",
      "Your feelings are valid and important. What do you wish someone understood about what you're going through?",
      "You don't have to face this alone. What small act of self-care could you offer yourself?"
    ]
  },
  theme_based: {
    work: [
      "Work has been on your mind. What's the most challenging aspect right now?",
      "How are you balancing work demands with your personal needs?",
      "What would make your work experience more fulfilling?"
    ],
    relationships: [
      "Relationships are complex. What interaction today left you thinking?",
      "How are your connections supporting or challenging you right now?",
      "What do you need from the important people in your life?"
    ],
    health: [
      "Your well-being matters. How are you taking care of yourself today?",
      "What's your body trying to tell you right now?",
      "How can you honor your physical and mental health today?"
    ],
    growth: [
      "You're evolving and growing. What new insight about yourself emerged today?",
      "What challenge are you facing that's helping you grow?",
      "How have you changed in ways that surprise you?"
    ]
  },
  pattern_based: {
    stress_pattern: [
      "I notice stress has been a recurring theme. What's one small thing you can control today?",
      "You've been dealing with a lot. How can you give yourself permission to rest?",
      "What would help you feel more grounded in this stressful time?"
    ],
    gratitude_pattern: [
      "Your gratitude practice is beautiful. What's one thing you're thankful for that you haven't mentioned yet?",
      "You find joy in the little things. What small moment today brought you peace?",
      "Your appreciation for life is inspiring. How can you share this energy?"
    ],
    growth_pattern: [
      "You're showing such growth. What would your past self be proud of today?",
      "Your self-awareness is deepening. What new understanding did you gain?",
      "You're becoming more of who you want to be. What's driving this transformation?"
    ]
  }
};

// Enhanced sentiment analysis with emotional granularity
export function analyzeEntry(content: string) {
  const words = content.toLowerCase().split(/\s+/);
  const text = content.toLowerCase();
  
  // Analyze emotional intensity and variety
  const emotions = Object.entries(EMOTION_WORDS).map(([emotion, data]) => {
    const count = data.words.filter(word => text.includes(word)).length;
    return { emotion, count, intensity: data.intensity, totalScore: count * data.intensity };
  }).filter(e => e.count > 0);

  // Calculate overall sentiment with intensity
  const positiveEmotions = emotions.filter(e => ['joy', 'gratitude', 'love', 'peace', 'pride', 'hope'].includes(e.emotion));
  const negativeEmotions = emotions.filter(e => ['sadness', 'anger', 'anxiety', 'fear', 'disappointment'].includes(e.emotion));
  
  const positiveScore = positiveEmotions.reduce((sum, e) => sum + e.totalScore, 0);
  const negativeScore = negativeEmotions.reduce((sum, e) => sum + e.totalScore, 0);
  
  let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral';
  let intensity = 1;
  
  if (positiveScore > negativeScore + 2) {
    sentiment = 'positive';
    intensity = Math.min(positiveScore / 3, 3);
  } else if (negativeScore > positiveScore + 2) {
    sentiment = 'negative';
    intensity = Math.min(negativeScore / 3, 3);
  }

  // Enhanced theme detection
  const detectedThemes: string[] = [];
  Object.entries(THEME_CATEGORIES).forEach(([category, subcategories]) => {
    Object.entries(subcategories).forEach(([subcategory, keywords]) => {
      if (keywords.some(keyword => text.includes(keyword))) {
        detectedThemes.push(`${category}_${subcategory}`);
      }
    });
  });

  // Detect writing patterns
  const patterns = {
    hasQuestions: text.includes('?'),
    hasExclamations: text.includes('!'),
    hasNegations: /\b(not|no|never|can't|won't|don't|isn't|aren't)\b/.test(text),
    hasTimeReferences: /\b(today|yesterday|tomorrow|morning|evening|night|week|month|year)\b/.test(text),
    hasPersonalPronouns: /\b(i|me|my|myself|we|us|our)\b/.test(text),
    wordCount: words.length,
    avgWordLength: words.reduce((sum, word) => sum + word.length, 0) / words.length
  };

  return {
    sentiment,
    intensity,
    themes: detectedThemes.slice(0, 5),
    emotions: emotions.slice(0, 3).map(e => e.emotion),
    patterns,
    emotionalComplexity: emotions.length,
    dominantEmotion: emotions.length > 0 ? emotions[0].emotion : null
  };
}

// Enhanced prompt generation with deep personalization
export function generateAIPrompt(recentEntries: JournalEntry[]): string {
  if (recentEntries.length === 0) {
    return PERSONALIZED_PROMPTS.mood_based.neutral[Math.floor(Math.random() * PERSONALIZED_PROMPTS.mood_based.neutral.length)];
  }

  // Analyze recent patterns
  const recentAnalysis = recentEntries.slice(0, 7).map(entry => analyzeEntry(entry.content));
  const averageMood = recentEntries.reduce((sum, e) => sum + e.mood, 0) / recentEntries.length;
  const averageSentiment = recentAnalysis.reduce((sum, a) => sum + (a.sentiment === 'positive' ? 1 : a.sentiment === 'negative' ? -1 : 0), 0) / recentAnalysis.length;
  
  // Detect recurring themes
  const allThemes = recentAnalysis.flatMap(a => a.themes);
  const themeFrequency: Record<string, number> = {};
  allThemes.forEach(theme => {
    themeFrequency[theme] = (themeFrequency[theme] || 0) + 1;
  });
  
  const dominantTheme = Object.entries(themeFrequency)
    .sort(([,a], [,b]) => b - a)[0]?.[0] || 'general';

  // Detect emotional patterns
  const emotionalPatterns = recentAnalysis.map(a => a.sentiment);
  const stressPattern = emotionalPatterns.filter(s => s === 'negative').length > emotionalPatterns.length * 0.6;
  const gratitudePattern = recentAnalysis.some(a => a.emotions.includes('gratitude'));
  const growthPattern = recentAnalysis.some(a => a.themes.some(t => t.includes('personal') || t.includes('growth')));

  // Generate personalized prompt
  let promptCategory = 'mood_based';
  let promptSubcategory = 'neutral';

  // Mood-based prompts
  if (averageMood >= 4.5) {
    promptSubcategory = 'high_positive';
  } else if (averageMood >= 3.5) {
    promptSubcategory = 'positive';
  } else if (averageMood <= 2) {
    promptSubcategory = averageMood <= 1.5 ? 'very_negative' : 'negative';
  }

  // Pattern-based prompts (override mood if strong pattern detected)
  if (stressPattern) {
    promptCategory = 'pattern_based';
    promptSubcategory = 'stress_pattern';
  } else if (gratitudePattern) {
    promptCategory = 'pattern_based';
    promptSubcategory = 'gratitude_pattern';
  } else if (growthPattern) {
    promptCategory = 'pattern_based';
    promptSubcategory = 'growth_pattern';
  }

  // Theme-based prompts (if no strong patterns, use dominant theme)
  if (promptCategory === 'mood_based' && dominantTheme !== 'general') {
    const themeMap: Record<string, string> = {
      'life_areas_work': 'work',
      'relationships_family': 'relationships',
      'relationships_friends': 'relationships',
      'life_areas_health': 'health',
      'life_areas_personal': 'growth'
    };
    
    const mappedTheme = themeMap[dominantTheme];
    if (mappedTheme) {
      promptCategory = 'theme_based';
      promptSubcategory = mappedTheme;
    }
  }

  const prompts = (PERSONALIZED_PROMPTS as any)[promptCategory][promptSubcategory];
  return prompts[Math.floor(Math.random() * prompts.length)];
}

// Enhanced weekly reflection with detailed insights
export function generateWeeklyReflection(entries: JournalEntry[]): WeeklyReflection {
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - 7);

  const weekEntries = entries.filter(entry => entry.date >= weekStart && entry.date <= now);
  
  if (weekEntries.length === 0) {
    return {
      weekStart,
      weekEnd: now,
      totalEntries: 0,
      averageMood: 3,
      dominantThemes: [],
      keyInsights: ["Start your journaling journey to unlock personalized insights."],
      encouragement: "Every entry is a step toward greater self-awareness.",
    };
  }

  // Enhanced analysis
  const entriesAnalysis = weekEntries.map(entry => ({
    ...entry,
    analysis: analyzeEntry(entry.content)
  }));

  const averageMood = weekEntries.reduce((sum, entry) => sum + entry.mood, 0) / weekEntries.length;
  
  // Theme analysis
  const allThemes = entriesAnalysis.flatMap(entry => entry.analysis.themes);
  const themeCount = allThemes.reduce((acc, theme) => {
    acc[theme] = (acc[theme] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const dominantThemes = Object.entries(themeCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([theme]) => theme);

  // Emotional analysis
  const allEmotions = entriesAnalysis.flatMap(entry => entry.analysis.emotions);
  const emotionCount = allEmotions.reduce((acc, emotion) => {
    acc[emotion] = (acc[emotion] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const dominantEmotions = Object.entries(emotionCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([emotion]) => emotion);

  // Pattern analysis
  const hasQuestions = entriesAnalysis.some(entry => entry.analysis.patterns.hasQuestions);
  const hasExclamations = entriesAnalysis.some(entry => entry.analysis.patterns.hasExclamations);
  const avgWordCount = entriesAnalysis.reduce((sum, entry) => sum + entry.analysis.patterns.wordCount, 0) / entriesAnalysis.length;
  const emotionalComplexity = entriesAnalysis.reduce((sum, entry) => sum + entry.analysis.emotionalComplexity, 0) / entriesAnalysis.length;

  // Generate detailed insights
  const insights: string[] = [];

  // Entry consistency
  if (weekEntries.length >= 5) {
    insights.push(`You've maintained excellent journaling consistency with ${weekEntries.length} entries this week.`);
  } else if (weekEntries.length >= 3) {
    insights.push(`You're building a steady journaling habit with ${weekEntries.length} entries this week.`);
  } else {
    insights.push(`You've started your journaling journey with ${weekEntries.length} entries this week.`);
  }

  // Mood insights
  if (averageMood >= 4) {
    insights.push("Your overall mood has been consistently positive this week.");
  } else if (averageMood <= 2) {
    insights.push("This week has been emotionally challenging, and your feelings are valid.");
  } else {
    insights.push("Your mood has been balanced, showing emotional resilience.");
  }

  // Theme insights
  if (dominantThemes.length > 0) {
    const themeDescriptions: Record<string, string> = {
      'emotions_positive': 'You\'ve been experiencing positive emotions',
      'emotions_negative': 'You\'ve been processing difficult emotions',
      'relationships_family': 'Family relationships have been on your mind',
      'relationships_friends': 'Friendships and social connections have been important',
      'life_areas_work': 'Work and career have been prominent in your thoughts',
      'life_areas_health': 'Health and wellness have been a focus',
      'life_areas_personal': 'Personal growth and development have been key themes',
      'activities_creative': 'Creative expression has been meaningful to you'
    };
    
    const primaryTheme = dominantThemes[0];
    const description = themeDescriptions[primaryTheme] || `You've been reflecting on ${primaryTheme.replace('_', ' ')}`;
    insights.push(description);
  }

  // Emotional complexity
  if (emotionalComplexity >= 3) {
    insights.push("You're showing emotional depth and self-awareness in your reflections.");
  }

  // Writing patterns
  if (hasQuestions) {
    insights.push("You're asking thoughtful questions, showing curiosity about yourself.");
  }
  
  if (avgWordCount > 100) {
    insights.push("You're engaging in deep reflection with detailed entries.");
  }

  // Emotional insights
  if (dominantEmotions.length > 0) {
    const emotionDescriptions: Record<string, string> = {
      'joy': 'Joy and happiness have been present',
      'gratitude': 'You\'ve been practicing gratitude',
      'anxiety': 'Anxiety has been a challenge you\'re working through',
      'hope': 'Hope and optimism have been guiding you'
    };
    
    const primaryEmotion = dominantEmotions[0];
    const description = emotionDescriptions[primaryEmotion] || `You've been experiencing ${primaryEmotion}`;
    insights.push(description);
  }

  // Personalized encouragement
  let encouragement = "";
  if (averageMood >= 4) {
    encouragement = "Your positive energy is inspiring. Keep nurturing the practices that bring you joy.";
  } else if (averageMood <= 2) {
    encouragement = "Remember that difficult emotions are temporary and valid. You're showing strength by acknowledging them.";
  } else if (weekEntries.length >= 5) {
    encouragement = "Your consistent journaling practice is building self-awareness and emotional intelligence.";
  } else {
    encouragement = "Every entry is a step toward greater self-understanding. You're doing important work.";
  }

  return {
    weekStart,
    weekEnd: now,
    totalEntries: weekEntries.length,
    averageMood,
    dominantThemes,
    keyInsights: insights,
    encouragement,
  };
}

// Generate detailed insights for the insights page
export function generateDetailedInsights(entries: JournalEntry[]): Insight[] {
  if (entries.length === 0) return [];

  const insights: Insight[] = [];
  const recentEntries = entries.slice(0, 30); // Last 30 entries
  const entriesAnalysis = recentEntries.map(entry => ({
    ...entry,
    analysis: analyzeEntry(entry.content)
  }));

  // Mood trend analysis
  const moodTrend = recentEntries.map(entry => entry.mood);
  const moodVariance = Math.sqrt(moodTrend.reduce((sum, mood) => sum + Math.pow(mood - 3, 2), 0) / moodTrend.length);
  
  if (moodVariance > 1.5) {
    insights.push({
      id: `mood-${Date.now()}`,
      type: 'pattern',
      title: 'Emotional Variability',
      description: `Your mood has been quite variable (variance: ${moodVariance.toFixed(1)}). This suggests you're experiencing a range of emotions, which is normal and healthy. Consider what factors contribute to your mood swings.`,
      confidence: 0.85,
      date: new Date()
    });
  }

  // Writing consistency
  const entryDates = recentEntries.map(entry => entry.date);
  const gaps = [];
  for (let i = 1; i < entryDates.length; i++) {
    const gap = (entryDates[i-1].getTime() - entryDates[i].getTime()) / (1000 * 60 * 60 * 24);
    gaps.push(gap);
  }
  
  const avgGap = gaps.reduce((sum, gap) => sum + gap, 0) / gaps.length;
  if (avgGap > 3) {
    insights.push({
      id: `consistency-${Date.now()}`,
      type: 'suggestion',
      title: 'Journaling Consistency',
      description: `You typically write every ${avgGap.toFixed(1)} days. Consider setting a daily reminder to build a more consistent practice. Even short entries can be valuable.`,
      confidence: 0.8,
      date: new Date()
    });
  }

  // Theme patterns
  const allThemes = entriesAnalysis.flatMap(entry => entry.analysis.themes);
  const themeFrequency: Record<string, number> = {};
  allThemes.forEach(theme => {
    themeFrequency[theme] = (themeFrequency[theme] || 0) + 1;
  });

  const recurringThemes = Object.entries(themeFrequency)
    .filter(([, count]) => count >= 3)
    .sort(([,a], [,b]) => b - a);

  if (recurringThemes.length > 0) {
    const [theme, count] = recurringThemes[0];
    insights.push({
      id: `theme-${Date.now()}`,
      type: 'pattern',
      title: 'Recurring Theme',
      description: `"${theme.replace('_', ' ')}" appears in ${count} of your recent entries. This might be an area of your life that needs attention or reflection.`,
      confidence: 0.9,
      date: new Date()
    });
  }

  // Emotional complexity
  const emotionalComplexity = entriesAnalysis.reduce((sum, entry) => sum + entry.analysis.emotionalComplexity, 0) / entriesAnalysis.length;
  
  if (emotionalComplexity >= 3) {
    insights.push({
      id: `complexity-${Date.now()}`,
      type: 'achievement',
      title: 'Emotional Depth',
      description: `You're showing remarkable emotional complexity in your writing, with an average of ${emotionalComplexity.toFixed(1)} distinct emotions per entry. This indicates strong self-awareness.`,
      confidence: 0.95,
      date: new Date()
    });
  }

  // Writing depth
  const avgWordCount = entriesAnalysis.reduce((sum, entry) => sum + entry.analysis.patterns.wordCount, 0) / entriesAnalysis.length;
  
  if (avgWordCount > 150) {
    insights.push({
      id: `depth-${Date.now()}`,
      type: 'achievement',
      title: 'Deep Reflection',
      description: `Your entries average ${Math.round(avgWordCount)} words, showing you engage in thorough self-reflection. This depth of writing often leads to greater insights.`,
      confidence: 0.85,
      date: new Date()
    });
  }

  return insights;
}

// Music API utilities
export interface MusicRecommendation {
  mood: number;
  genres: string[];
  description: string;
  songs: Array<{
    title: string;
    artist: string;
    genre: string;
  }>;
}

export async function getMusicRecommendations(mood: number): Promise<MusicRecommendation> {
  try {
    const response = await fetch(`http://localhost:5000/api/music/recommendations?mood=${mood}`);
    if (!response.ok) {
      throw new Error('Failed to fetch music recommendations');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching music recommendations:', error);
    // Fallback to default recommendations
    return {
      mood,
      genres: ['pop', 'alternative'],
      description: 'Music to accompany your thoughts',
      songs: [
        { title: 'Default Song', artist: 'Default Artist', genre: 'pop' }
      ]
    };
  }
}
