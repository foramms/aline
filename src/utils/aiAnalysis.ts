import { JournalEntry, WeeklyReflection } from '../types/journal';

const THEMES = [
  'work stress', 'relationships', 'personal growth', 'health', 'creativity',
  'family', 'career', 'anxiety', 'gratitude', 'goals', 'self-care',
  'productivity', 'emotions', 'mindfulness', 'challenges', 'achievements',
  'learning', 'finances', 'hobbies', 'social life', 'future planning'
];

const DYNAMIC_TEMPLATES = [
  "Yesterday you mentioned '{{topic}}'. How did it make you feel today?",
  "You've been reflecting on '{{theme}}' a lot. What new insight did you gain?",
  "Thinking about your recent mood of '{{mood}}', what small step could improve your day?",
  "What was your most meaningful moment related to '{{theme}}' today?",
  "How can you continue nurturing your '{{theme}}' experience from previous entries?",
];

const STATIC_PROMPTS = {
  general: [
    "What's one thing that brought you joy today, no matter how small?",
    "Describe a moment from today when you felt most like yourself.",
    "What's on your mind right now? Let it flow onto the page.",
    "If today had a color, what would it be and why?",
    "What are you grateful for in this moment?",
  ],
  stressed: [
    "What's creating stress in your life right now? Let's explore it together.",
    "Describe three deep breaths. How do you feel after each one?",
    "What's one small thing you can do right now to care for yourself?",
  ],
  positive: [
    "What's fueling this positive energy you're feeling?",
    "How can you carry this feeling into tomorrow?",
    "Who or what deserves credit for contributing to your good mood?",
  ],
  reflective: [
    "What patterns do you notice in your thoughts lately?",
    "What would your past self think about where you are now?",
    "What's a belief about yourself that might be worth questioning?",
  ]
};

function fillTemplate(template: string, context: { topic?: string; theme?: string; mood?: string }) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => context[key as keyof typeof context] || '');
}

//sentiment analysis
export function analyzeEntry(content: string) {
  const words = content.toLowerCase().split(/\s+/);
  
  const positiveWords = ['happy', 'joy', 'grateful', 'excited', 'love', 'amazing', 'wonderful', 'great', 'good', 'peaceful', 'calm', 'proud', 'accomplished', 'successful', 'optimistic'];
  const negativeWords = ['sad', 'angry', 'frustrated', 'stressed', 'worried', 'anxious', 'tired', 'overwhelmed', 'disappointed', 'difficult', 'hard', 'problem', 'issue', 'struggle'];

  const positiveCount = words.filter(word => positiveWords.includes(word)).length;
  const negativeCount = words.filter(word => negativeWords.includes(word)).length;

  let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral';
  if (positiveCount > negativeCount + 1) sentiment = 'positive';
  else if (negativeCount > positiveCount + 1) sentiment = 'negative';

  const detectedThemes = THEMES.filter(theme => {
    const themeWords = theme.split(' ');
    return themeWords.some(word => content.toLowerCase().includes(word));
  });

  return {
    sentiment,
    themes: detectedThemes.slice(0, 3),
  };
}

// Dynamic prompt generator
export function generateAIPrompt(recentEntries: JournalEntry[]): string {
  if (recentEntries.length === 0) {
    return STATIC_PROMPTS.general[Math.floor(Math.random() * STATIC_PROMPTS.general.length)];
  }

  // Analyze last few entries
  const lastEntriesContent = recentEntries.slice(0,5).map(e => e.content.toLowerCase());
  const allRecentContent = lastEntriesContent.join(' ');
  const detectedTheme = THEMES.find(theme => lastEntriesContent.some(c => c.includes(theme))) || 'your day';
  const averageMood = recentEntries.reduce((sum, e) => sum + e.mood, 0) / recentEntries.length;
  const moodText = averageMood > 4 ? 'positive' : averageMood < 2.5 ? 'challenging' : 'balanced';

  const dynamicPrompts: string[] = [];

  if (allRecentContent.includes('stressed') || allRecentContent.includes('overwhelmed') || allRecentContent.includes('anxious')) {
    dynamicPrompts.push(
      "I noticed you've been feeling stressed. How did you find moments of calm today?",
      "What small thing helped you feel grounded today?"
    );
  }

  if (allRecentContent.includes('work') && (allRecentContent.includes('stress') || allRecentContent.includes('hard'))) {
    dynamicPrompts.push(
      "Work has been challenging. How did you protect your energy today?",
      "What small win or positive moment did you experience today?"
    );
  }

  if (allRecentContent.includes('relationship') || allRecentContent.includes('conflict')) {
    dynamicPrompts.push(
      "Relationships can be complex. How are you feeling about your connections today?",
      "What did you learn about yourself through recent interactions?"
    );
  }

  if (allRecentContent.includes('happy') || allRecentContent.includes('joy') || allRecentContent.includes('grateful')) {
    dynamicPrompts.push(
      "It's wonderful that you felt positive! How can you nurture this energy?",
      "What can you do to carry this positive momentum forward?"
    );
  }

  // If dynamic prompts exist, pick one randomly
  if (dynamicPrompts.length > 0) {
    return dynamicPrompts[Math.floor(Math.random() * dynamicPrompts.length)];
  }

  // Otherwise, use template-based prompts
  const template = DYNAMIC_TEMPLATES[Math.floor(Math.random() * DYNAMIC_TEMPLATES.length)];
  return fillTemplate(template, { topic: detectedTheme, theme: detectedTheme, mood: moodText });
}

// Weekly reflection
export function generateWeeklyReflection(entries: JournalEntry[]): WeeklyReflection {
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - 7);

  const weekEntries = entries.filter(entry => entry.date >= weekStart && entry.date <= now);
  const averageMood = weekEntries.length > 0
    ? weekEntries.reduce((sum, entry) => sum + entry.mood, 0) / weekEntries.length
    : 3;

  const allThemes = weekEntries.flatMap(entry => entry.themes);
  const themeCount = allThemes.reduce((acc, theme) => {
    acc[theme] = (acc[theme] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const dominantThemes = Object.entries(themeCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 3)
    .map(([theme]) => theme);

  const insights = [
    `You wrote ${weekEntries.length} entries this week.`,
    averageMood > 3.5 ? "Your overall mood has been positive." : averageMood < 2.5 ? "This week has been emotionally challenging." : "Your mood has been balanced.",
    dominantThemes.length > 0 ? `You reflected often on ${dominantThemes.join(', ')}.` : "You explored a variety of topics."
  ];

  const encouragement = averageMood > 3.5
    ? "Keep nurturing the positive energy you've cultivated."
    : "Remember that difficult emotions are temporary and valid parts of your journey.";

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
