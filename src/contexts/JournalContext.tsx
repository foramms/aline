import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { JournalEntry, MoodTrend, Theme, Insight, WeeklyReflection } from '../types/journal';
import { generateAIPrompt, analyzeEntry, generateWeeklyReflection } from '../utils/aiAnalysis';

interface JournalState {
  entries: JournalEntry[];
  currentStreak: number;
  totalEntries: number;
  averageMood: number;
  themes: Theme[];
  insights: Insight[];
  weeklyReflections: WeeklyReflection[];
  lastPrompt: string;
}

interface JournalContextType extends JournalState {
  addEntry: (entry: Omit<JournalEntry, 'id'>) => void;
  updateEntry: (id: string, updates: Partial<JournalEntry>) => void;
  deleteEntry: (id: string) => void;
  getNewPrompt: () => string;
  getMoodTrends: () => MoodTrend[];
}

const initialState: JournalState = {
  entries: [],
  currentStreak: 0,
  totalEntries: 0,
  averageMood: 3,
  themes: [],
  insights: [],
  weeklyReflections: [],
  lastPrompt: '',
};

type JournalAction = 
  | { type: 'ADD_ENTRY'; payload: JournalEntry }
  | { type: 'UPDATE_ENTRY'; payload: { id: string; updates: Partial<JournalEntry> } }
  | { type: 'DELETE_ENTRY'; payload: string }
  | { type: 'SET_PROMPT'; payload: string }
  | { type: 'LOAD_STATE'; payload: JournalState };

function journalReducer(state: JournalState, action: JournalAction): JournalState {
  switch (action.type) {
    case 'ADD_ENTRY':
      const newEntries = [action.payload, ...state.entries];
      return {
        ...state,
        entries: newEntries,
        totalEntries: newEntries.length,
        averageMood: newEntries.reduce((sum, entry) => sum + entry.mood, 0) / newEntries.length,
      };
    case 'UPDATE_ENTRY':
      return {
        ...state,
        entries: state.entries.map(entry => 
          entry.id === action.payload.id 
            ? { ...entry, ...action.payload.updates }
            : entry
        )
      };
    case 'DELETE_ENTRY':
      return {
        ...state,
        entries: state.entries.filter(entry => entry.id !== action.payload)
      };
    case 'SET_PROMPT':
      return {
        ...state,
        lastPrompt: action.payload
      };
    case 'LOAD_STATE':
      return action.payload;
    default:
      return state;
  }
}

const JournalContext = createContext<JournalContextType | undefined>(undefined);

export function JournalProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(journalReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('journal-state');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        // Convert date strings back to Date objects
        parsedState.entries = parsedState.entries.map((entry: any) => ({
          ...entry,
          date: new Date(entry.date)
        }));
        dispatch({ type: 'LOAD_STATE', payload: parsedState });
      } catch (error) {
        console.error('Error loading journal state:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('journal-state', JSON.stringify(state));
  }, [state]);

  const addEntry = (entryData: Omit<JournalEntry, 'id'>) => {
    const newEntry: JournalEntry = {
      ...entryData,
      id: Date.now().toString(),
      date: new Date(),
    };

    // Enhanced analysis with more detailed insights
    const analysis = analyzeEntry(newEntry.content);
    newEntry.themes = analysis.themes;
    newEntry.sentiment = analysis.sentiment;

    dispatch({ type: 'ADD_ENTRY', payload: newEntry });
  };

  const updateEntry = (id: string, updates: Partial<JournalEntry>) => {
    dispatch({ type: 'UPDATE_ENTRY', payload: { id, updates } });
  };

  const deleteEntry = (id: string) => {
    dispatch({ type: 'DELETE_ENTRY', payload: id });
  };

  const getNewPrompt = () => {
    const prompt = generateAIPrompt(state.entries);
    dispatch({ type: 'SET_PROMPT', payload: prompt });
    return prompt;
  };

  const getMoodTrends = (): MoodTrend[] => {
    return state.entries
      .slice(0, 30) // Last 30 entries
      .map(entry => ({
        date: entry.date.toLocaleDateString(),
        mood: entry.mood,
        sentiment: entry.sentiment,
      }))
      .reverse();
  };

  const value: JournalContextType = {
    ...state,
    addEntry,
    updateEntry,
    deleteEntry,
    getNewPrompt,
    getMoodTrends,
  };

  return (
    <JournalContext.Provider value={value}>
      {children}
    </JournalContext.Provider>
  );
}

export function useJournal() {
  const context = useContext(JournalContext);
  if (!context) {
    throw new Error('useJournal must be used within a JournalProvider');
  }
  return context;
}