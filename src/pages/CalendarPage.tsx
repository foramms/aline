import React, { useState } from 'react';
import { useJournal } from '../contexts/JournalContext';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from 'date-fns';
import { ChevronLeft, ChevronRight, BookOpen, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

const moodColors = {
  1: 'bg-red-500',
  2: 'bg-orange-500', 
  3: 'bg-yellow-500',
  4: 'bg-green-500',
  5: 'bg-emerald-500',
};

export default function CalendarPage() {
  const { entries } = useJournal();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEntry, setSelectedEntry] = useState<any>(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getEntryForDate = (date: Date) => {
    return entries.find(entry => isSameDay(entry.date, date));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 via-white to-warm-50">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold w-full font-semibold bg-white text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-sage-400 py-2 rounded-md hover:from-primary-600 hover:to-sage-500 transition-colors">
            Journal Calendar
          </h1>
          <p className="text-lg text-gray-600">
            View your journaling journey through time
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-2">
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
          </div>

            {/* Monthly Summary */}
            <div className="card p-4 mt-4">
              <h3 className="text-lg font-semibold w-full font-semibold bg-white text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-sage-400 py-2 rounded-md hover:from-primary-600 hover:to-sage-500 transition-colors">
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
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Entries Written</span>
                      <span className="font-medium">{monthEntries.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Average Mood</span>
                      <span className="font-medium">{monthlyAvgMood > 0 ? monthlyAvgMood.toFixed(1) : 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Consistency</span>
                      <span className="font-medium">
                        {Math.round((monthEntries.length / calendarDays.length) * 100)}%
                      </span>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </div>
  );
}