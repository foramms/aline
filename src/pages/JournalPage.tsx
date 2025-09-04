import React, { useState, useEffect } from 'react';
import { useJournal } from '../contexts/JournalContext';
import { Lightbulb, Save, Smile, Meh, Frown, BookOpen } from 'lucide-react';

const moodEmojis = [
  { value: 1, emoji: '😢', label: '1', color: 'text-red-500' },
  { value: 2, emoji: '😔', label: '2', color: 'text-orange-500' },
  { value: 3, emoji: '😐', label: '3', color: 'text-yellow-500' },
  { value: 4, emoji: '😊', label: '4', color: 'text-green-500' },
  { value: 5, emoji: '😁', label: '5', color: 'text-emerald-500' },
];

export default function JournalPage() {
  const { addEntry, getNewPrompt } = useJournal();
  const [content, setContent] = useState('');
  const [mood, setMood] = useState(3);
  // Initialize currentPrompt directly instead of using useEffect
  const [currentPrompt, setCurrentPrompt] = useState(() => getNewPrompt());
  const [wordCount, setWordCount] = useState(0);
  const [isWriting, setIsWriting] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);

  // Remove the problematic useEffect that was causing rapid re-renders

  useEffect(() => {
    const words = content.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
    
    if (content.length > 0 && !startTime) {
      setStartTime(new Date());
      setIsWriting(true);
    }
  }, [content, startTime]);

  const handleSave = () => {
    if (content.trim()) {
      const timeSpent = startTime ? Math.round((Date.now() - startTime.getTime()) / 60000) : 1;
      
      addEntry({
        content: content.trim(),
        mood,
        tags: [],
        themes: [],
        sentiment: 'neutral',
        wordCount,
        timeSpent,
        prompt: currentPrompt,
        date: new Date(),
      });

      // Reset form
      setContent('');
      setMood(3);
      setWordCount(0);
      setStartTime(null);
      setIsWriting(false);
      setCurrentPrompt(getNewPrompt());
    }
  };

  // Handler for getting a new prompt manually
  const handleNewPrompt = () => {
    setCurrentPrompt(getNewPrompt());
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-50 via-white to-warm-50">
      <div className="mx-auto max-w-4xl px-6 py-8 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold sm:text-4xl mb-4 bg-white text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-sage-400 py-2 rounded-md hover:from-primary-600 hover:to-sage-500 transition-colors">
            Today's Journal
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Take a moment to connect with yourself. Your thoughts are safe here.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* AI Prompt Card */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-8">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-sage-500 rounded-full flex items-center justify-center mr-3">
                  <Lightbulb className="w-4 h-4 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Today's Prompt</h3>
              </div>
              <p className="text-gray-700 mb-6 journal-text italic">
                "{currentPrompt}"
              </p>
              <button
                onClick={handleNewPrompt}
                className="text-sm w-full font-semibold bg-white text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-sage-400 py-2 rounded-md hover:from-primary-600 hover:to-sage-500 transition-colors"
              >
                Get another prompt →
              </button>

              {/* Writing Stats */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-semibold text-gray-900 mb-4">Writing Session</h4>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Words:</span>
                    <span className="font-medium text-gray-900">{wordCount}</span>
                  </div>
                  {isWriting && startTime && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Time:</span>
                      <span className="font-medium text-gray-900">
                        {Math.round((Date.now() - startTime.getTime()) / 60000)} min
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Writing Area */}
          <div className="lg:col-span-2">
            <div className="card p-8">
              {/* Mood Selector */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">How are you feeling?</h3>
                <div className="flex justify-center space-x-4">
                  {moodEmojis.map((moodOption) => (
                    <button
                      key={moodOption.value}
                      onClick={() => setMood(moodOption.value)}
                      className={`p-3 rounded-xl transition-all duration-200 transform hover:scale-110 ${
                        mood === moodOption.value
                          ? 'bg-primary-100 ring-2 ring-primary-500 scale-110'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <div className="text-2xl mb-1">{moodOption.emoji}</div>
                      <div className={`text-xs font-medium ${moodOption.color}`}>
                        {moodOption.label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Writing Area */}
              <div className="relative">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Dear Journal ... Remember there is no right or wrong way to write"
                  className="textarea-field min-h-[400px] text-base leading-relaxed"
                  autoFocus
                />
                <div className="absolute bottom-4 right-4 flex items-center space-x-4">
                  <span className="text-xs text-gray-500">
                    {wordCount} words
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center mt-8">
                <div className="text-sm text-gray-500">
                  {content.length > 0 ? (
                    <span className="text-primary-600 font-medium">Keep going! ✨</span>
                  ) : (
                    "Your thoughts are completely private and secure."
                  )}
                </div>
                <button
                  onClick={handleSave}
                  disabled={!content.trim()}
                >
                  <span className="text-teal-500  border border-green-600 px-4 py-2 rounded-md font-semibold hover:text-green-800 hover:border-green-800 transition-colors">Save Entry</span>
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}