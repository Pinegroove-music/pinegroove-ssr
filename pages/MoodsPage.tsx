import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { Link } from 'react-router-dom';
import { Smile, ArrowLeft, Tag, Calendar } from 'lucide-react';
import { supabase } from '../services/supabase';

export const MoodsPage: React.FC = () => {
  const { isDarkMode } = useStore();
  
  const defaultMoods = [
    'Inspiring', 'Happy', 'Dark', 'Emotional', 'Dramatic', 'Peaceful', 
    'Energetic', 'Corporate', 'Uplifting', 'Sad', 'Romantic', 'Aggressive',
    'Suspenseful', 'Funny', 'Quirky', 'Sexy', 'Confident', 'Motivational',
    'Calm', 'Relaxing', 'Dreamy', 'Ethereal', 'Mysterious', 'Tense'
  ];

  const [moods, setMoods] = useState<string[]>(defaultMoods.sort());
  
  // Elegant Blue/Purple Gradients
  const gradients = [
    'bg-gradient-to-br from-indigo-500 to-purple-600',
    'bg-gradient-to-br from-sky-500 to-indigo-600',
    'bg-gradient-to-br from-blue-600 to-violet-600',
    'bg-gradient-to-br from-violet-500 to-fuchsia-600',
    'bg-gradient-to-br from-sky-600 to-blue-700',
    'bg-gradient-to-br from-indigo-600 to-purple-700',
  ];

  useEffect(() => {
    const fetchMoods = async () => {
      // FIX: Changed 'moods' to 'mood' to match DB column
      const { data } = await supabase.from('music_tracks').select('mood');
      if (data) {
        const allMoods = (data as any[])
          .flatMap((track: any) => track.mood || [])
          .filter((m: any): m is string => typeof m === 'string' && m.length > 0);
        
        const uniqueMoods = Array.from(new Set([...defaultMoods, ...allMoods])).sort();
        if (uniqueMoods.length > 0) setMoods(uniqueMoods);
      }
    };
    fetchMoods();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 pb-32">
        {/* Navigation Header */}
        <div className="flex flex-wrap items-center gap-4 mb-8 text-sm font-medium">
            <Link to="/library" className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
                <ArrowLeft size={16} /> Back to Library
            </Link>
            <div className="h-4 w-px bg-current opacity-20 hidden sm:block"></div>
            <Link to="/categories/genres" className="flex items-center gap-2 text-sky-500 hover:text-sky-600 hover:underline">
                <Tag size={16} /> Browse by Genre
            </Link>
            <Link to="/categories/seasonal" className="flex items-center gap-2 text-sky-500 hover:text-sky-600 hover:underline">
                <Calendar size={16} /> Browse by Season
            </Link>
        </div>

        <h1 className="text-4xl font-black mb-4 flex items-center gap-3 tracking-tight">
            <Smile className="text-sky-500" size={36} /> ALL MOODS
        </h1>
        <p className="text-lg opacity-70 mb-12 max-w-2xl">
            Filter tracks by the emotion they convey. From inspiring corporate beats to dark cinematic drones.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {moods.map((mood, index) => {
                const gradient = gradients[index % gradients.length];
                return (
                    <Link
                        key={mood}
                        to={`/library?search=${encodeURIComponent(mood)}`}
                        className={`
                            ${gradient} text-white
                            h-24 flex items-center justify-center text-center px-4
                            rounded-xl font-bold text-sm md:text-base uppercase tracking-widest 
                            transition-all transform hover:-translate-y-1 hover:shadow-lg hover:brightness-110 shadow-md
                        `}
                    >
                        {mood}
                    </Link>
                )
            })}
        </div>
    </div>
  );
};