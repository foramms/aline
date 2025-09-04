import React from 'react';
import { useJournal } from '../contexts/JournalContext';
import { generateWeeklyReflection } from '../utils/aiAnalysis';
import { 
  Lightbulb, 
  TrendingUp, 
  Heart, 
  Star,
  Calendar,
  BookOpen,
  Target,
  Smile
} from 'lucide-react';
import { format, subWeeks } from 'date-fns';

export default function InsightsPage() {
  const { entries } = useJournal();

  // Generate current week reflection
  const currentWeekReflection = generateWeeklyReflection(entries);
  
  // Generate last week reflection for comparison
  const lastWeekEntries = entries.filter(entry => {
    const weekStart = subWeeks(new Date(), 2);
    const weekEnd = subWeeks(new Date(), 1);
    return entry.date >= weekStart && entry.date <= weekEnd;
  });
  const lastWeekReflection = generateWeeklyReflection(lastWeekEntries);


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
            
            {/* <div className="mt-6 p-4 bg-white/60 rounded-lg">
              <p className="text-gray-800 italic journal-text">
                "{currentWeekReflection.encouragement}"
              </p>
            </div> */}
          </div>
        </div>


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