import React from 'react';
import { useJournal } from '../contexts/JournalContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Calendar, Heart, Target } from 'lucide-react';
import { format, subDays } from 'date-fns';

const MOOD_COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#10b981'];

export default function DashboardPage() {
  const { entries, averageMood, getMoodTrends } = useJournal();

  const moodTrends = getMoodTrends();
  
  const calculateStreak = () => {
    if (entries.length === 0) return 0;
    
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      
      const hasEntry = entries.some(entry => {
        const entryDate = new Date(entry.date);
        entryDate.setHours(0, 0, 0, 0);
        return entryDate.getTime() === checkDate.getTime();
      });
      
      if (hasEntry) {
        if (i === 0 || streak > 0) streak++;
      } else if (i === 0) {
        break;
      } else if (streak === 0) {
        break;
      }
    }
    
    return streak;
  };

  const currentStreak = calculateStreak();

  // Theme analysis
  const themeAnalysis = entries.reduce((acc, entry) => {
    entry.themes.forEach(theme => {
      if (!acc[theme]) {
        acc[theme] = { count: 0, totalMood: 0 };
      }
      acc[theme].count++;
      acc[theme].totalMood += entry.mood;
    });
    return acc;
  }, {} as Record<string, { count: number; totalMood: number }>);

  const topThemes = Object.entries(themeAnalysis)
    .map(([theme, data]) => ({
      name: theme,
      count: data.count,
      averageMood: data.totalMood / data.count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  // Mood distribution
  const moodDistribution = [1, 2, 3, 4, 5].map(moodValue => ({
    mood: `Mood ${moodValue}`,
    count: entries.filter(entry => entry.mood === moodValue).length,
    fill: MOOD_COLORS[moodValue - 1],
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 via-white to-warm-50">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-2">
            Your Wellness Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Discover patterns and insights from your journaling journey
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Calendar className="h-8 w-8 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Current Streak</p>
                <p className="text-2xl font-bold text-gray-900">{currentStreak} days</p>
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Heart className="h-8 w-8 text-sage-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Average Mood</p>
                <p className="text-2xl font-bold text-gray-900">{averageMood.toFixed(1)}/5</p>
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-warm-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Entries</p>
                <p className="text-2xl font-bold text-gray-900">{entries.length}</p>
              </div>
            </div>
          </div>
          
          <div className="card p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Target className="h-8 w-8 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">This Month</p>
                <p className="text-2xl font-bold text-gray-900">
                  {entries.filter(entry => {
                    const entryMonth = entry.date.getMonth();
                    const currentMonth = new Date().getMonth();
                    return entryMonth === currentMonth;
                  }).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Mood Trends Chart */}
          <div className="card p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Mood Trends</h3>
            {moodTrends.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={moodTrends}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }}
                    tickFormatter={(value) => new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  />
                  <YAxis domain={[1, 5]} tick={{ fontSize: 12 }} />
                  <Tooltip 
                    labelFormatter={(value) => `Date: ${new Date(value).toLocaleDateString()}`}
                    formatter={(value: number) => [`${value}/5`, 'Mood']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="mood" 
                    stroke="#4F80AA" 
                    strokeWidth={3}
                    dot={{ fill: '#4F80AA', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#4F80AA' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-12">
                <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500">Start journaling to see your mood trends</p>
              </div>
            )}
          </div>

          {/* Mood Distribution */}
          <div className="card p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Mood Distribution</h3>
            {entries.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={moodDistribution.filter(item => item.count > 0)}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, count }) => `${count} entries`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {moodDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [`${value} entries`, 'Count']} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-12">
                <Heart className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500">Your mood distribution will appear here</p>
              </div>
            )}
          </div>

          {/* Top Themes */}
          <div className="card p-8 lg:col-span-2">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Frequent Themes</h3>
            {topThemes.length > 0 ? (
              <div className="space-y-4">
                {topThemes.map((theme, index) => (
                  <div key={theme.name} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-sage-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 capitalize">{theme.name}</h4>
                        <p className="text-sm text-gray-600">{theme.count} mentions</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-gray-900">
                        {theme.averageMood.toFixed(1)}/5
                      </div>
                      <p className="text-xs text-gray-500">Avg mood</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Target className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-500">Your recurring themes will be identified here</p>
              </div>
            )}
          </div>
        </div>
        
      </div>
    </div>
  );
}