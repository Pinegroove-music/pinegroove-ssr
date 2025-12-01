import { create } from 'zustand';
import { MusicTrack } from '../types';

interface AppState {
  // Audio Player State
  currentTrack: MusicTrack | null;
  isPlaying: boolean;
  volume: number;
  progress: number; // 0 to 100
  playTrack: (track: MusicTrack) => void;
  togglePlay: () => void;
  setVolume: (vol: number) => void;
  setProgress: (progress: number) => void;
  
  // Theme State
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export const useStore = create<AppState>((set) => ({
  currentTrack: null,
  isPlaying: false,
  volume: 1,
  progress: 0,
  
  playTrack: (track) => set((state) => {
    // If same track, just toggle
    if (state.currentTrack?.id === track.id) {
      return { isPlaying: !state.isPlaying };
    }
    // New track: reset progress and play
    return { currentTrack: track, isPlaying: true, progress: 0 };
  }),

  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  
  setVolume: (vol) => set({ volume: vol }),
  setProgress: (progress) => set({ progress }),

  isDarkMode: false,
  toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
}));