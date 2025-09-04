import React, { useState, useEffect } from 'react';
import { useJournal } from '../contexts/JournalContext';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, addDays, differenceInDays, startOfDay } from 'date-fns';
import { 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  Plus, 
  Bell, 
  Clock, 
  Target, 
  TrendingUp, 
  Calendar as CalendarIcon,
  CheckCircle,
  AlertCircle,
  Zap,
  Flame,
  Settings,
  Star,
  Brain,
  Sparkles,
  Heart
} from 'lucide-react';
import { Link } from 'react-router-dom';

const moodColors = {
  1: 'bg-red-500',
  2: 'bg-orange-500', 
  3: 'bg-yellow-500',
  4: 'bg-green-500',
  5: 'bg-emerald-500',
};

interface Reminder {
  id: string;
  title: string;
  description: string;
  time: string;
  days: string[];
  enabled: boolean;
  type: 'daily' | 'weekly' | 'custom';
}

interface HabitInsight {
  id: string;
  title: string;
  description: string;
  type: 'positive' | 'warning' | 'suggestion';
  icon: string;
  color: string;
}

export default function CalendarPage() {
  const { entries } = useJournal();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEntry, setSelectedEntry] = useState<any>(null);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [habitInsights, setHabitInsights] = useState<HabitInsight[]>([]);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [optimalTime, setOptimalTime] = useState<string>('');

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Initialize reminders and insights
  useEffect(() => {
    initializeReminders();
    generateHabitInsights();
    calculateStreak();
    findOptimalTime();
  }, [entries]);

  const initializeReminders = () => {
    const defaultReminders: Reminder[] = [
      {
        id: '1',
        title: 'Morning Reflection',
        description: 'Start your day with intention',
        time: '08:00',
        days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        enabled: true,
        type: 'daily'
      },
      {
        id: '2',
        title: 'Evening Check-in',
        description: 'Process your day before sleep',
        time: '21:00',
        days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        enabled: true,
        type: 'daily'
      },
      {
        id: '3',
        title: 'Weekly Review',
        description: 'Reflect on your week',
        time: '18:00',
        days: ['Sun'],
        enabled: true,
        type: 'weekly'
      }
    ];
    setReminders(defaultReminders);
  };

  const generateHabitInsights = () => {
    const insights: HabitInsight[] = [];
    
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

    // Generate insights based on patterns
    if (streak >= 7) {
      insights.push({
        id: 'streak-7',
        title: 'Amazing Consistency!',
        description: `You've maintained a ${streak}-day streak. You're building a powerful habit!`,
        type: 'positive',
        icon: 'Flame',
        color: 'text-orange-500'
      });
    } else if (streak >= 3) {
      insights.push({
        id: 'streak-3',
        title: 'Building Momentum',
        description: `You're on a ${streak}-day streak. Keep going to build a lasting habit!`,
        type: 'positive',
        icon: 'Zap',
        color: 'text-yellow-500'
      });
    } else if (streak === 0 && entries.length > 0) {
      insights.push({
        id: 'break-streak',
        title: 'Time to Restart',
        description: 'You haven\'t written today. Consider writing now to maintain your habit.',
        type: 'warning',
        icon: 'AlertCircle',
        color: 'text-orange-500'
      });
    }

    // Analyze writing patterns
    const recentEntries = entries.slice(0, 10);
    const avgWordCount = recentEntries.reduce((sum, entry) => sum + entry.wordCount, 0) / recentEntries.length;
    
    if (avgWordCount > 150) {
      insights.push({
        id: 'deep-reflection',
        title: 'Deep Reflection',
        description: 'Your entries show thoughtful reflection. This depth leads to better insights.',
        type: 'positive',
        icon: 'Brain',
        color: 'text-purple-500'
      });
    }

    // Analyze mood patterns
    const recentMoods = recentEntries.map(entry => entry.mood);
    const avgMood = recentMoods.reduce((sum, mood) => sum + mood, 0) / recentMoods.length;
    
    if (avgMood >= 4) {
      insights.push({
        id: 'positive-mood',
        title: 'Positive Energy',
        description: 'You\'ve been in a positive mood lately. Consider what\'s contributing to this.',
        type: 'positive',
        icon: 'Sparkles',
        color: 'text-green-500'
      });
    } else if (avgMood <= 2) {
      insights.push({
        id: 'low-mood',
        title: 'Supporting Yourself',
        description: 'You\'ve been experiencing lower moods. Remember to be gentle with yourself.',
        type: 'suggestion',
        icon: 'Heart',
        color: 'text-blue-500'
      });
    }

    setHabitInsights(insights);
  };

  const calculateStreak = () => {
    if (entries.length === 0) {
      setCurrentStreak(0);
      return;
    }

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
  };

  const findOptimalTime = () => {
    // Analyze when user writes most frequently
    const entryTimes = entries.map(entry => entry.date.getHours());
    const timeCounts: Record<number, number> = {};
    
    entryTimes.forEach(hour => {
      timeCounts[hour] = (timeCounts[hour] || 0) + 1;
    });

    const mostFrequentHour = Object.entries(timeCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || '9';
    
    setOptimalTime(`${mostFrequentHour}:00`);
  };

  const getEntryForDate = (date: Date) => {
    return entries.find(entry => isSameDay(entry.date, date));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const toggleReminder = (id: string) => {
    setReminders(prev => prev.map(reminder => 
      reminder.id === id ? { ...reminder, enabled: !reminder.enabled } : reminder
    ));
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'positive': return 'bg-green-50 border-green-200';
      case 'warning': return 'bg-orange-50 border-orange-200';
      case 'suggestion': return 'bg-blue-50 border-blue-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const renderIcon = (iconName: string, className: string = "w-5 h-5") => {
    const iconMap: Record<string, React.ComponentType<any>> = {
      'Flame': Flame,
      'Zap': Zap,
      'Brain': Brain,
      'Sparkles': Sparkles,
      'Heart': Heart,
      'AlertCircle': AlertCircle,
      'Star': Star,
      'Target': Target,
      'TrendingUp': TrendingUp,
      'Bell': Bell,
      'Clock': Clock,
      'Settings': Settings,
      'CheckCircle': CheckCircle,
      'BookOpen': BookOpen,
      'Plus': Plus,
      'ChevronLeft': ChevronLeft,
      'ChevronRight': ChevronRight,
      'Calendar': CalendarIcon
    };

    const IconComponent = iconMap[iconName];
    return IconComponent ? <IconComponent className={className} /> : <Star className={className} />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 via-white to-warm-50">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold w-full font-semibold gradient-text">
            Journal Calendar
          </h1>
          <p className="text-lg text-gray-600">
            View your journaling journey through time
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-3">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {format(currentDate, 'MMMM yyyy')}
                </h2>
                <div className="flex space-x-2">
                  <button
                    onClick={prevMonth}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <button
                    onClick={nextMonth}
                    className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="p-3 text-center text-sm font-medium text-gray-500">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map(day => {
                  const entry = getEntryForDate(day);
                  const isCurrentDay = isToday(day);
                  
                  return (
                    <button
                      key={day.toString()}
                      onClick={() => entry && setSelectedEntry(entry)}
                      className={`relative p-3 text-center text-sm font-medium transition-all duration-200 rounded-lg ${
                        isCurrentDay
                          ? 'bg-primary-100 text-primary-900 ring-2 ring-primary-500'
                          : entry
                          ? 'hover:bg-gray-100 cursor-pointer'
                          : 'text-gray-400 hover:bg-gray-50'
                      }`}
                    >
                      <span className="relative z-10">{format(day, 'd')}</span>
                      {entry && (
                        <>
                          <div className={`absolute inset-0 ${moodColors[entry.mood as keyof typeof moodColors]} rounded-lg opacity-20`}></div>
                          <div className="absolute top-1 right-1 w-2 h-2 bg-primary-600 rounded-full"></div>
                        </>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="mt-6 flex items-center justify-center space-x-6 text-xs text-gray-600">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-primary-600 rounded-full"></div>
                  <span>Has Entry</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span>Mood:</span>
                  {Object.entries(moodColors).map(([mood, color]) => (
                    <div key={mood} className={`w-3 h-3 ${color} rounded-full`}></div>
                  ))}
                </div>
              </div>
            </div>

            {/* Monthly Summary */}
            <div className="card p-6 mt-6">
              <h3 className="text-lg font-semibold w-full font-semibold gradient-text mb-4">
                {format(currentDate, 'MMMM')} Summary
              </h3>
              
              {(() => {
                const monthEntries = entries.filter(entry => 
                  entry.date.getMonth() === currentDate.getMonth() &&
                  entry.date.getFullYear() === currentDate.getFullYear()
                );
                
                const monthlyAvgMood = monthEntries.length > 0 
                  ? monthEntries.reduce((sum, entry) => sum + entry.mood, 0) / monthEntries.length 
                  : 0;

                return (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary-600">{monthEntries.length}</div>
                      <div className="text-sm text-gray-600">Entries</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-sage-600">
                        {monthlyAvgMood > 0 ? monthlyAvgMood.toFixed(1) : 'N/A'}
                      </div>
                      <div className="text-sm text-gray-600">Avg Mood</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-warm-600">
                        {Math.round((monthEntries.length / calendarDays.length) * 100)}%
                      </div>
                      <div className="text-sm text-gray-600">Consistency</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{currentStreak}</div>
                      <div className="text-sm text-gray-600">Current Streak</div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Smart Reminders & Habit Insights Sidebar */}
          <div className="space-y-6">
            {/* Current Streak */}
            <div className="card p-6">
              <div className="flex items-center mb-4">
                <Flame className="w-6 h-6 text-orange-500 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Current Streak</h3>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-500 mb-2">{currentStreak}</div>
                <p className="text-sm text-gray-600">days</p>
                {currentStreak > 0 && (
                  <div className="mt-3 p-3 bg-orange-50 rounded-lg">
                    <p className="text-sm text-orange-700">
                      {currentStreak >= 7 ? '🔥 Amazing consistency!' : 'Keep the fire burning!'}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Smart Reminders */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Bell className="w-6 h-6 text-primary-600 mr-3" />
                  <h3 className="text-lg font-semibold text-gray-900">Smart Reminders</h3>
                </div>
                <button
                  onClick={() => setShowReminderModal(true)}
                  className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-3">
                {reminders.map((reminder) => (
                  <div key={reminder.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={reminder.enabled}
                        onChange={() => toggleReminder(reminder.id)}
                        className="mr-3"
                      />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{reminder.title}</div>
                        <div className="text-xs text-gray-600">{reminder.time}</div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {reminder.days.join(', ')}
                    </div>
                  </div>
                ))}
              </div>

              {/* Optimal Time Suggestion */}
              <div className="mt-4 p-3 bg-primary-50 rounded-lg">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 text-primary-600 mr-2" />
                  <div>
                    <div className="text-sm font-medium text-primary-900">Optimal Time</div>
                    <div className="text-xs text-primary-700">You write best around {optimalTime}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Habit Insights */}
            <div className="card p-6">
              <div className="flex items-center mb-4">
                <TrendingUp className="w-6 h-6 text-primary-600 mr-3" />
                <h3 className="text-lg font-semibold text-gray-900">Habit Insights</h3>
              </div>
              
              <div className="space-y-3">
                {habitInsights.map((insight) => (
                  <div key={insight.id} className={`p-3 rounded-lg border ${getInsightColor(insight.type)}`}>
                    <div className="flex items-start">
                      <div className={`w-6 h-6 ${insight.color} mr-2 flex items-center justify-center`}>
                        {renderIcon(insight.icon, "w-4 h-4")}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{insight.title}</div>
                        <div className="text-xs text-gray-600 mt-1">{insight.description}</div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {habitInsights.length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    <Star className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">Start journaling to see insights</p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                <Link
                  to="/journal"
                  className="flex items-center justify-center w-full p-3 bg-gradient-to-r from-primary-500 to-sage-500 text-white rounded-lg hover:from-primary-600 hover:to-sage-600 transition-all duration-200 transform hover:scale-105"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Write Today's Entry
                </Link>
                
                <button className="flex items-center justify-center w-full p-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                  <Target className="w-4 h-4 mr-2" />
                  Set Reminder
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}