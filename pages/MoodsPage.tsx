import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { Link } from 'react-router-dom';
import { Tag, ArrowLeft, Smile, Calendar } from 'lucide-react';
import { supabase } from '../services/supabase';
import { SEO } from '../components/SEO';

export const GenresPage: React.FC = () => {
  const { isDarkMode } = useStore();
  
  const defaultGenres = [
    'Cinematic', 'Corporate', 'Ambient', 'Rock', 'Pop', 'Electronic', 
    'Acoustic', 'Folk', 'Hip Hop', 'Jazz', 'Classical', 'Funk', 
    'Soul', 'Reggae', 'World', 'Lo-Fi', 'Orchestral', 'Trailer',
    'Indie', 'Alternative', 'Country', 'Blues', 'Latin', 'Metal'
  ];

  const [genres, setGenres] = useState<string[]>(defaultGenres.sort());
  
  // Elegant Blue/Purple Gradients
  const gradients = [
    'bg-gradient-to-br from-sky-500 to-blue-600',
    'bg-gradient-to-br from-blue-500 to-indigo-600',
    'bg-gradient-to-br from-indigo-500 to-violet-600',
    'bg-gradient-to-br from-violet-500 to-purple-600',
    'bg-gradient-to-br from-sky-600 to-indigo-700',
    'bg-gradient-to-br from-blue-600 to-violet-700',
  ];

  useEffect(() => {
    const fetchGenres = async () => {
      const { data } = await supabase.from('music_tracks').select('genre');

      if (data) {
        const allGenres = (data as any[])
          .flatMap((track: any) => track.genre || [])
          .filter((g: any): g is string => typeof g === 'string' && g.length > 0);
        
        const uniqueGenres = Array.from(new Set([...defaultGenres, ...allGenres])).sort();
        if (uniqueGenres.length > 0) setGenres(uniqueGenres);
      }
    };
    fetchGenres();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 pb-32">
        <SEO title="Browse Music by Genre" description="Explore our catalog by musical genre. Cinematic, Corporate, Rock, Pop, and more." />
        {/* Navigation Header */}
        <div className="flex flex-wrap items-center gap-4 mb-8 text-sm font-medium">
            <Link to="/library" className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
                <ArrowLeft size={16} /> Back to Library
            </Link>
            <div className="h-4 w-px bg-current opacity-20 hidden sm:block"></div>
            <Link to="/categories/moods" className="flex items-center gap-2 text-sky-500 hover:text-sky-600 hover:underline">
                <Smile size={16} /> Browse by Mood
            </Link>
            <Link to="/categories/seasonal" className="flex items-center gap-2 text-sky-500 hover:text-sky-600 hover:underline">
                <Calendar size={16} /> Browse by Season
            </Link>
        </div>
        
        <h1 className="text-4xl font-black mb-4 flex items-center gap-3 tracking-tight">
            <Tag className="text-sky-500" size={36} /> ALL GENRES
        </h1>
        <p className="text-lg opacity-70 mb-12 max-w-2xl">
            Browse our complete catalog by musical genre. Find the perfect style for your project.
        </p>

        {/* Grid Layout for Homogeneous Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {genres.map((genre, index) => {
                const gradient = gradients[index % gradients.length];
                return (
                <Link
                    key={genre}
                    to={`/library?search=${encodeURIComponent(genre)}`}
                    className={`
                        ${gradient} text-white
                        h-24 flex items-center justify-center text-center px-4
                        rounded-xl font-bold text-sm md:text-base uppercase tracking-widest 
                        transition-all transform hover:-translate-y-1 hover:shadow-lg hover:brightness-110 shadow-md
                    `}
                >
                    {genre}
                </Link>
                )
            })}
        </div>
    </div>
  );
};