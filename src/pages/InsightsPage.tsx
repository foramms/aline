import React, { useState, useEffect } from 'react';
import { useJournal } from '../contexts/JournalContext';
import { generateWeeklyReflection, generateDetailedInsights } from '../utils/aiAnalysis';
import { 
  Lightbulb, 
  TrendingUp, 
  Heart, 
  Star,
  Calendar,
  BookOpen,
  Target,
  Smile,
  Trophy,
  Award,
  Zap,
  Flame,
  CheckCircle,
  Clock,
  Sparkles,
  Brain,
  Gift,
  Scale,
  Leaf,
  Crown
} from 'lucide-react';
import { format, subWeeks, isToday, isYesterday, startOfDay, differenceInDays } from 'date-fns';

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly';
  goal: number;
  current: number;
  completed: boolean;
  streak: number;
  icon: string;
  color: string;
  startDate: Date;
  endDate?: Date;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedDate?: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export default function InsightsPage() {
  const { entries } = useJournal();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);

  // Generate current week reflection
  const currentWeekReflection = generateWeeklyReflection(entries);
  
  // Generate last week reflection for comparison
  const lastWeekEntries = entries.filter(entry => {
    const weekStart = subWeeks(new Date(), 2);
    const weekEnd = subWeeks(new Date(), 1);
    return entry.date >= weekStart && entry.date <= weekEnd;
  });
  const lastWeekReflection = generateWeeklyReflection(lastWeekEntries);

  // Generate detailed insights
  const detailedInsights = generateDetailedInsights(entries);

  // Initialize challenges and achievements
  useEffect(() => {
    initializeChallengesAndAchievements();
    calculateStreaks();
  }, [entries]);

  const initializeChallengesAndAchievements = () => {
    // Initialize challenges
    const initialChallenges: Challenge[] = [
      {
        id: 'daily-streak',
        title: 'Daily Reflection',
        description: 'Write in your journal every day',
        type: 'daily',
        goal: 7,
        current: 0,
        completed: false,
        streak: 0,
        icon: 'Flame',
        color: 'from-orange-400 to-red-500',
        startDate: new Date()
      },
      {
        id: 'gratitude-week',
        title: 'Week of Gratitude',
        description: 'Write about something you\'re grateful for each day',
        type: 'daily',
        goal: 7,
        current: 0,
        completed: false,
        streak: 0,
        icon: 'Gift',
        color: 'from-pink-400 to-rose-500',
        startDate: new Date()
      },
      {
        id: 'emotional-depth',
        title: 'Emotional Explorer',
        description: 'Write entries with emotional depth (100+ words)',
        type: 'weekly',
        goal: 5,
        current: 0,
        completed: false,
        streak: 0,
        icon: 'Brain',
        color: 'from-purple-400 to-indigo-500',
        startDate: new Date()
      },
      {
        id: 'positive-mood',
        title: 'Positive Vibes',
        description: 'Maintain positive mood (4-5) for 5 consecutive days',
        type: 'daily',
        goal: 5,
        current: 0,
        completed: false,
        streak: 0,
        icon: 'Sparkles',
        color: 'from-yellow-400 to-orange-500',
        startDate: new Date()
      }
    ];

    // Initialize achievements
    const initialAchievements: Achievement[] = [
      {
        id: 'first-entry',
        title: 'First Steps',
        description: 'Write your first journal entry',
        icon: 'Leaf',
        unlocked: entries.length > 0,
        unlockedDate: entries.length > 0 ? entries[entries.length - 1].date : undefined,
        rarity: 'common'
      },
      {
        id: 'week-streak',
        title: 'Week Warrior',
        description: 'Write for 7 consecutive days',
        icon: 'Flame',
        unlocked: currentStreak >= 7,
        unlockedDate: currentStreak >= 7 ? new Date() : undefined,
        rarity: 'common'
      },
      {
        id: 'month-streak',
        title: 'Monthly Master',
        description: 'Write for 30 consecutive days',
        icon: 'Crown',
        unlocked: currentStreak >= 30,
        unlockedDate: currentStreak >= 30 ? new Date() : undefined,
        rarity: 'rare'
      },
      {
        id: 'emotional-depth',
        title: 'Deep Thinker',
        description: 'Write 10 entries with 150+ words',
        icon: 'Brain',
        unlocked: entries.filter(e => e.wordCount >= 150).length >= 10,
        unlockedDate: entries.filter(e => e.wordCount >= 150).length >= 10 ? new Date() : undefined,
        rarity: 'epic'
      },
      {
        id: 'gratitude-master',
        title: 'Gratitude Master',
        description: 'Write 20 gratitude-focused entries',
        icon: 'Gift',
        unlocked: entries.filter(e => e.content.toLowerCase().includes('grateful') || e.content.toLowerCase().includes('thankful')).length >= 20,
        unlockedDate: entries.filter(e => e.content.toLowerCase().includes('grateful') || e.content.toLowerCase().includes('thankful')).length >= 20 ? new Date() : undefined,
        rarity: 'epic'
      },
      {
        id: 'mood-balancer',
        title: 'Mood Balancer',
        description: 'Maintain balanced mood (3-4) for 2 weeks',
        icon: 'Scale',
        unlocked: false, // Complex calculation needed
        rarity: 'legendary'
      }
    ];

    setChallenges(initialChallenges);
    setAchievements(initialAchievements);
  };

  const calculateStreaks = () => {
    if (entries.length === 0) {
      setCurrentStreak(0);
      setLongestStreak(0);
      return;
    }

    // Calculate current streak
    let streak = 0;
    let currentDate = startOfDay(new Date());
    
    for (let i = 0; i < 365; i++) {
      const hasEntry = entries.some(entry => 
        startOfDay(entry.date).getTime() === currentDate.getTime()
      );
      
      if (hasEntry) {
        streak++;
        currentDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
      } else {
        break;
      }
    }

    setCurrentStreak(streak);

    // Calculate longest streak (simplified)
    let longest = 0;
    let tempStreak = 0;
    const sortedEntries = [...entries].sort((a, b) => a.date.getTime() - b.date.getTime());
    
    for (let i = 1; i < sortedEntries.length; i++) {
      const daysDiff = differenceInDays(sortedEntries[i].date, sortedEntries[i-1].date);
      if (daysDiff === 1) {
        tempStreak++;
        longest = Math.max(longest, tempStreak);
      } else {
        tempStreak = 0;
      }
    }

    setLongestStreak(longest);
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-700';
      case 'rare': return 'bg-blue-100 text-blue-700';
      case 'epic': return 'bg-purple-100 text-purple-700';
      case 'legendary': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'common': return '⭐';
      case 'rare': return '⭐⭐';
      case 'epic': return '⭐⭐⭐';
      case 'legendary': return '👑';
      default: return '⭐';
    }
  };

  const renderIcon = (iconName: string, className: string = "w-6 h-6") => {
    const iconMap: Record<string, React.ComponentType<any>> = {
      'Flame': Flame,
      'Gift': Gift,
      'Brain': Brain,
      'Sparkles': Sparkles,
      'Leaf': Leaf,
      'Crown': Crown,
      'Scale': Scale,
      'Trophy': Trophy,
      'Award': Award,
      'Star': Star,
      'Heart': Heart,
      'Target': Target,
      'BookOpen': BookOpen,
      'Calendar': Calendar,
      'Lightbulb': Lightbulb,
      'TrendingUp': TrendingUp,
      'Zap': Zap,
      'CheckCircle': CheckCircle,
      'Clock': Clock,
      'Smile': Smile
    };

    const IconComponent = iconMap[iconName];
    return IconComponent ? <IconComponent className={className} /> : <Star className={className} />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 via-white to-warm-50">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold w-full font-semibold bg-white text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-sage-400 py-2 rounded-md hover:from-primary-600 hover:to-sage-500 transition-colors">
            AI Insights & Reflections
          </h1>
          <p className="text-lg text-gray-600">
            Discover meaningful patterns in your journaling journey
          </p>
        </div>

        {/* Streak & Stats Overview */}
        <div className="card p-8 mb-8">
          <div className="flex items-center mb-6">
            <Flame className="w-6 h-6 text-orange-500 mr-3" />
            <h2 className="text-2xl font-semibold w-full font-semibold bg-white text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-sage-400 py-2 rounded-md hover:from-primary-600 hover:to-sage-500 transition-colors">Your Streaks & Stats</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2 flex items-center justify-center">
                <Flame className="w-8 h-8 mr-2" />
                {currentStreak}
              </div>
              <p className="text-sm text-gray-600">Current Streak</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2 flex items-center justify-center">
                <Trophy className="w-8 h-8 mr-2" />
                {longestStreak}
              </div>
              <p className="text-sm text-gray-600">Longest Streak</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2 flex items-center justify-center">
                <BookOpen className="w-8 h-8 mr-2" />
                {entries.length}
              </div>
              <p className="text-sm text-gray-600">Total Entries</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-600 mb-2 flex items-center justify-center">
                <Award className="w-8 h-8 mr-2" />
                {achievements.filter(a => a.unlocked).length}
              </div>
              <p className="text-sm text-gray-600">Achievements</p>
            </div>
          </div>

          {/* Motivation Message */}
          {currentStreak > 0 && (
            <div className="bg-gradient-to-r from-primary-50 to-sage-50 rounded-xl p-6 border-l-4 border-primary-400">
              <div className="flex items-center">
                <Zap className="w-6 h-6 text-primary-600 mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Keep the Fire Burning!</h3>
                  <p className="text-gray-700">
                    You're on a {currentStreak}-day streak! {currentStreak >= 7 ? 'Incredible consistency!' : 'Keep going!'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Active Challenges */}
        <div className="card p-8 mb-8">
          <div className="flex items-center mb-6">
            <Target className="w-6 h-6 text-primary-600 mr-3" />
            <h2 className="text-2xl font-semibold w-full font-semibold bg-white text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-sage-400 py-2 rounded-md hover:from-primary-600 hover:to-sage-500 transition-colors">Active Challenges</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {challenges.map((challenge) => (
              <div key={challenge.id} className="bg-gradient-to-r from-sage-50 to-primary-50 rounded-xl p-6 border-l-4 border-primary-400">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-sage-500 rounded-full flex items-center justify-center mr-3">
                    {renderIcon(challenge.icon, "w-4 h-4 text-white")}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{challenge.title}</h3>
                    <p className="text-sm text-gray-600">{challenge.description}</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Progress</span>
                    <span>{challenge.current}/{challenge.goal}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full bg-gradient-to-r ${challenge.color}`}
                      style={{ width: `${Math.min((challenge.current / challenge.goal) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {challenge.type === 'daily' ? 'Daily Challenge' : 'Weekly Challenge'}
                  </span>
                  {challenge.completed ? (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      <span className="text-sm font-medium">Completed!</span>
                    </div>
                  ) : (
                    <span className="text-xs text-gray-500">
                      {challenge.goal - challenge.current} more to go
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div className="card p-8 mb-8">
          <div className="flex items-center mb-6">
            <Award className="w-6 h-6 text-primary-600 mr-3" />
            <h2 className="text-2xl font-semibold w-full font-semibold bg-white text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-sage-400 py-2 rounded-md hover:from-primary-600 hover:to-sage-500 transition-colors">Achievements</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement) => (
              <div 
                key={achievement.id} 
                className={`rounded-xl p-6 border-2 transition-all duration-200 ${
                  achievement.unlocked 
                    ? 'bg-gradient-to-r from-sage-50 to-primary-50 border-primary-300 shadow-lg' 
                    : 'bg-gray-50 border-gray-200 opacity-60'
                }`}
              >
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-sage-500 rounded-full flex items-center justify-center mr-3">
                    {renderIcon(achievement.icon, "w-4 h-4 text-white")}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{achievement.title}</h3>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2 py-1 rounded-full ${getRarityColor(achievement.rarity)}`}>
                    {achievement.rarity}
                  </span>
                  <span className="text-2xl">{getRarityIcon(achievement.rarity)}</span>
                </div>

                {achievement.unlocked && achievement.unlockedDate && (
                  <div className="mt-3 flex items-center text-xs text-gray-500">
                    <Clock className="w-3 h-3 mr-1" />
                    Unlocked {format(achievement.unlockedDate, 'MMM d, yyyy')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Reflection */}
        <div className="card p-8 mb-8">
          <div className="flex items-center mb-6">
            <Calendar className="w-6 h-6 text-primary-600 mr-3" />
            <h2 className="text-2xl font-semibold w-full font-semibold bg-white text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-sage-400 py-2 rounded-md hover:from-primary-600 hover:to-sage-500 transition-colors">This Week's Reflection</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">
                {currentWeekReflection.totalEntries}
              </div>
              <p className="text-sm text-gray-600">Entries Written</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-sage-600 mb-2">
                {currentWeekReflection.averageMood.toFixed(1)}
              </div>
              <p className="text-sm text-gray-600">Average Mood</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-warm-600 mb-2">
                {currentWeekReflection.dominantThemes.length}
              </div>
              <p className="text-sm text-gray-600">Key Themes</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary-600 mb-2">
                {Math.round((currentWeekReflection.totalEntries / 7) * 100)}%
              </div>
              <p className="text-sm text-gray-600">Week Consistency</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-primary-50 to-sage-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
            <ul className="space-y-2">
              {currentWeekReflection.keyInsights.map((insight: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined, index: React.Key | null | undefined) => (
                <li key={index} className="text-gray-700 flex items-start">
                  <span className="text-primary-600 mr-2">•</span>
                  {insight}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Detailed Insights */}
        {detailedInsights.length > 0 && (
          <div className="card p-8 mb-8">
            <div className="flex items-center mb-6">
              <Lightbulb className="w-6 h-6 text-primary-600 mr-3" />
              <h2 className="text-2xl font-semibold w-full font-semibold bg-white text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-sage-400 py-2 rounded-md hover:from-primary-600 hover:to-sage-500 transition-colors">AI Insights</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {detailedInsights.map((insight) => (
                <div key={insight.id} className="bg-gradient-to-r from-sage-50 to-primary-50 rounded-xl p-6 border-l-4 border-primary-400">
                  <div className="flex items-center mb-3">
                    {insight.type === 'achievement' && <Star className="w-5 h-5 text-yellow-500 mr-2" />}
                    {insight.type === 'pattern' && <TrendingUp className="w-5 h-5 text-blue-500 mr-2" />}
                    {insight.type === 'suggestion' && <Target className="w-5 h-5 text-green-500 mr-2" />}
                    <h3 className="text-lg font-semibold text-gray-900">{insight.title}</h3>
                  </div>
                  <p className="text-gray-700 mb-3">{insight.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      {insight.date.toLocaleDateString()}
                    </span>
                    <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
                      {Math.round(insight.confidence * 100)}% confidence
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Comparison with Last Week */}
        {lastWeekEntries.length > 0 && (
          <div className="card p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Week-over-Week Growth</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">This Week</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Entries</span>
                    <span className="font-medium">{currentWeekReflection.totalEntries}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Average Mood</span>
                    <span className="font-medium">{currentWeekReflection.averageMood.toFixed(1)}/5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dominant Themes</span>
                    <span className="font-medium">{currentWeekReflection.dominantThemes.join(', ') || 'Various'}</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Last Week</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Entries</span>
                    <span className="font-medium">{lastWeekReflection.totalEntries}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Average Mood</span>
                    <span className="font-medium">{lastWeekReflection.averageMood.toFixed(1)}/5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dominant Themes</span>
                    <span className="font-medium">{lastWeekReflection.dominantThemes.join(', ') || 'Various'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Growth Indicators */}
            <div className="mt-8 p-6 bg-gradient-to-r from-sage-50 to-primary-50 rounded-xl">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Growth Indicators</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className={`text-2xl font-bold ${currentWeekReflection.totalEntries >= lastWeekReflection.totalEntries ? 'text-green-600' : 'text-orange-600'}`}>
                    {currentWeekReflection.totalEntries >= lastWeekReflection.totalEntries ? '↗' : '↘'}
                  </div>
                  <p className="text-sm text-gray-600">Consistency</p>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${currentWeekReflection.averageMood >= lastWeekReflection.averageMood ? 'text-green-600' : 'text-orange-600'}`}>
                    {currentWeekReflection.averageMood >= lastWeekReflection.averageMood ? '↗' : '↘'}
                  </div>
                  <p className="text-sm text-gray-600">Mood</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">📈</div>
                  <p className="text-sm text-gray-600">Self-Awareness</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Privacy Reminder */}
        <div className="mt-8 bg-sage-50 rounded-xl p-6 border border-sage-200">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 bg-sage-600 rounded-full flex items-center justify-center mr-3">
              <Lightbulb className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Privacy First</h3>
          </div>
          <p className="text-gray-700">
            All analysis is performed locally on your device. Your personal thoughts and insights never leave your computer, ensuring complete privacy and security.
          </p>
        </div>
      </div>
    </div>
  );
}