import React, { useState, useEffect } from 'react';
import { Music, Play, Pause, SkipForward, Volume2 } from 'lucide-react';

interface Song {
  id: string;
  title: string;
  artist: string;
  album: string;
  previewUrl: string;
  imageUrl: string;
}

interface MusicWidgetProps {
  mood: number;
  isVisible: boolean;
}

const moodToGenres: Record<number, string[]> = {
  1: ['ambient', 'classical', 'instrumental', 'lo-fi'], // Sad/Depressed
  2: ['indie', 'folk', 'acoustic', 'chill'], // Down
  3: ['pop', 'alternative', 'indie-pop', 'soft-rock'], // Neutral
  4: ['upbeat', 'pop', 'dance', 'happy'], // Good
  5: ['energetic', 'dance', 'pop', 'rock'], // Great
};

const moodToDescriptions: Record<number, string> = {
  1: 'Gentle, calming tunes to help you process',
  2: 'Soothing melodies to lift your spirits',
  3: 'Balanced music to accompany your thoughts',
  4: 'Upbeat tracks to match your positive energy',
  5: 'Energetic beats to celebrate your mood!',
};

export default function MusicWidget({ mood, isVisible }: MusicWidgetProps) {
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Mock song data - in a real app, this would come from a music API
  const mockSongs: Song[] = [
    {
      id: '1',
      title: 'Peaceful Mind',
      artist: 'Ambient Collective',
      album: 'Calm Waters',
      previewUrl: '#',
      imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=150&h=150&fit=crop&crop=center',
    },
    {
      id: '2',
      title: 'Gentle Rain',
      artist: 'Nature Sounds',
      album: 'Meditation',
      previewUrl: '#',
      imageUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=150&h=150&fit=crop&crop=center',
    },
    {
      id: '3',
      title: 'Morning Light',
      artist: 'Indie Folk',
      album: 'New Beginnings',
      previewUrl: '#',
      imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=150&h=150&fit=crop&crop=center',
    },
    {
      id: '4',
      title: 'Happy Vibes',
      artist: 'Pop Collective',
      album: 'Good Times',
      previewUrl: '#',
      imageUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=150&h=150&fit=crop&crop=center',
    },
    {
      id: '5',
      title: 'Celebration',
      artist: 'Dance Crew',
      album: 'Party Time',
      previewUrl: '#',
      imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=150&h=150&fit=crop&crop=center',
    },
  ];

  useEffect(() => {
    if (isVisible && mood) {
      // Simulate API call to get mood-based recommendations
      setIsLoading(true);
      setTimeout(() => {
        const songIndex = Math.min(mood - 1, mockSongs.length - 1);
        setCurrentSong(mockSongs[songIndex]);
        setIsLoading(false);
      }, 1000);
    }
  }, [mood, isVisible]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    // In a real app, this would control actual audio playback
  };

  const handleNextSong = () => {
    // Simulate getting next recommendation
    const songIndex = Math.floor(Math.random() * mockSongs.length);
    setCurrentSong(mockSongs[songIndex]);
  };

  if (!isVisible) return null;

  return (
    <div className="card p-6">
      <div className="flex items-center mb-4">
        <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-sage-500 rounded-full flex items-center justify-center mr-3">
          <Music className="w-4 h-4 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Mood Music</h3>
          <p className="text-sm text-gray-600">{moodToDescriptions[mood]}</p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          <span className="ml-3 text-gray-600">Finding your perfect tune...</span>
        </div>
      ) : currentSong ? (
        <div className="space-y-4">
          {/* Song Display */}
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200">
              <img 
                src={currentSong.imageUrl} 
                alt={currentSong.album}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 truncate">{currentSong.title}</h4>
              <p className="text-sm text-gray-600">{currentSong.artist}</p>
              <p className="text-xs text-gray-500">{currentSong.album}</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={handlePlayPause}
              className="w-12 h-12 bg-gradient-to-r from-primary-500 to-sage-500 rounded-full flex items-center justify-center text-white hover:from-primary-600 hover:to-sage-600 transition-all duration-200 transform hover:scale-105"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
            </button>
            <button
              onClick={handleNextSong}
              className="p-2 text-gray-600 hover:text-primary-600 transition-colors"
            >
              <SkipForward className="w-5 h-5" />
            </button>
          </div>

          {/* Mood-based genres */}
          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-2">Suggested genres:</p>
            <div className="flex flex-wrap gap-2">
              {moodToGenres[mood]?.map((genre) => (
                <span
                  key={genre}
                  className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full"
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {/* Note about music integration */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          💡 In a full implementation, this would integrate with Spotify, Apple Music, or similar APIs
        </p>
      </div>
    </div>
  );
}
