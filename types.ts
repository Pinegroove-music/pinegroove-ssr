export interface MusicTrack {
  id: number;
  created_at: string;
  title: string;
  artist_name: string;
  mp3_url: string;
  cover_url: string;
  description: string | null;
  gumroad_link: string | null;
  bpm: number | null;
  iswc: string | null;
  isrc: string | null;
  genre: string[] | null; // stored as jsonb
  mood: string[] | null; // RENAMED from 'moods' to 'mood' to match DB
  tags: string[] | null; // stored as jsonb
  credits: Record<string, any> | null; // stored as jsonb
  season: string | null;
  duration: number | null;
  year: number | null;
  lyrics: string | null;
  media_theme: string[] | null; // stored as jsonb
}

export interface Client {
  id: number;
  created_at: string;
  name: string;
  logo_url: string;
}

export interface Album {
  id: number;
  created_at?: string;
  title: string;
  cover_url: string;
  description: string | null;
  price: number;
  gumroad_link: string | null;
}

export interface MediaTheme {
  id: number;
  created_at: string;
  title: string;
  media_theme_pic: string;
}

export interface FilterState {
  genres: string[];
  moods: string[];
  seasons: string[];
  mediaThemes: string[];
  bpmRange: 'slow' | 'medium' | 'fast' | null;
  searchQuery: string;
}