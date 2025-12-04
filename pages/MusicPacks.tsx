import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { Album } from '../types';
import { useStore } from '../store/useStore';
import { Link } from 'react-router-dom';
import { ShoppingCart, Disc, ArrowRight, AlertCircle, Tag } from 'lucide-react';
import { SEO } from '../components/SEO';

// Extend Album interface locally to include track count
interface AlbumWithCount extends Album {
    track_count?: number;
}

export const MusicPacks: React.FC = () => {
  const [albums, setAlbums] = useState<AlbumWithCount[]>([]);
  const { isDarkMode } = useStore();
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchAlbums = async () => {
      // Sorting by ID to be safe
      // We also fetch the count of tracks using Supabase count feature on foreign key relation
      const { data, error } = await supabase
        .from('album')
        .select('*, album_tracks(count)')
        .order('id', { ascending: false });

      if (error) {
        console.error('Error fetching albums:', error);
        setErrorMsg(error.message);
      }
      
      if (data) {
        // Map the data to extract the count properly
        const mappedData = data.map((item: any) => ({
            ...item,
            track_count: item.album_tracks?.[0]?.count || 0
        }));
        setAlbums(mappedData);
      }
      setLoading(false);
    };
    fetchAlbums();
  }, []);

  return (
    <div className="w-full max-w-[1920px] mx-auto px-6 lg:px-10 py-12 pb-32">
      <SEO title="Music Packs & Bundles" description="Get curated collections of high-quality music tracks at a discounted price. Perfect for game developers, video editors, and content creators." />
      <div className="flex items-center gap-3 mb-4">
        <Disc size={32} className="text-sky-500" />
        <h1 className="text-4xl font-black tracking-tight">Music Packs</h1>
      </div>
      
      <p className="max-w-2xl mb-12 opacity-70 text-lg">
        Curated collections of our best tracks. Get fully licensed albums for a fraction of the cost.
      </p>

      {loading ? (
         <div className="text-center py-20 opacity-50">Loading music packs...</div>
      ) : errorMsg ? (
         <div className="text-center py-20 text-red-500 flex flex-col items-center gap-2">
            <AlertCircle size={24} />
            <p>Error loading albums: {errorMsg}</p>
         </div>
      ) : albums.length === 0 ? (
         <div className="text-center py-20 opacity-50 flex flex-col items-center p-8 border border-dashed rounded-xl border-zinc-300 dark:border-zinc-700">
            <Disc size={48} className="mb-4 opacity-20" />
            <h3 className="text-xl font-bold mb-2">No music packs found</h3>
            <p className="max-w-md mx-auto text-sm">
                We couldn't find any albums in the database.
            </p>
         </div>
      ) : (
        /* Grid Layout: 1 col mobile, 2 tablet, 3 small desktop, 4 large screens */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {albums.map(album => (
                <div 
                    key={album.id} 
                    className={`
                        group rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 flex flex-col h-full
                        ${isDarkMode ? 'bg-zinc-900 border border-zinc-800' : 'bg-white border border-zinc-100 shadow-lg'}
                    `}
                >
                    {/* Square Cover Area */}
                    <Link to={`/music-packs/${album.id}`} className="w-full aspect-square relative overflow-hidden bg-zinc-200 dark:bg-zinc-800 block">
                        <img 
                            src={album.cover_url} 
                            alt={album.title} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                        <div className="absolute top-3 left-3">
                            <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest flex items-center gap-1">
                                <Tag size={10} className="text-sky-400" /> 
                                {album.track_count ? `${album.track_count} TRACKS` : 'ALBUM'}
                            </span>
                        </div>
                    </Link>

                    {/* Content Area */}
                    <div className="p-5 flex flex-col flex-1">
                        <div className="mb-4">
                            <h2 className="text-xl font-black mb-2 leading-tight group-hover:text-sky-500 transition-colors line-clamp-1">
                                <Link to={`/music-packs/${album.id}`}>{album.title}</Link>
                            </h2>
                            
                            {album.description && (
                                <p className="text-sm opacity-70 leading-relaxed line-clamp-2 min-h-[2.5rem]">
                                    {album.description}
                                </p>
                            )}
                        </div>

                        <div className="mt-auto pt-4 border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between">
                             <div className="text-2xl font-bold text-sky-600 dark:text-sky-400">
                                ${(album.price / 100).toFixed(2)}
                            </div>
                            
                            <div className="flex gap-2">
                                <Link 
                                    to={`/music-packs/${album.id}`}
                                    className={`p-2 rounded-full transition ${isDarkMode ? 'bg-zinc-800 hover:bg-zinc-700 text-white' : 'bg-gray-100 hover:bg-gray-200 text-black'}`}
                                    title="View Details"
                                >
                                    <ArrowRight size={20} />
                                </Link>
                                <a 
                                    href={album.gumroad_link || '#'} 
                                    className="p-2 rounded-full bg-sky-600 hover:bg-sky-500 text-white shadow-lg shadow-sky-500/30 transition hover:scale-105"
                                    title="Buy Now"
                                >
                                    <ShoppingCart size={20} />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      )}
    </div>
  );
};