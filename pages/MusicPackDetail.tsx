import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { Album, MusicTrack } from '../types';
import { useStore } from '../store/useStore';
import { ShoppingCart, Disc, Play, Pause, Check, ArrowLeft, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { WaveformVisualizer } from '../components/WaveformVisualizer';
import { SEO } from '../components/SEO';

export const MusicPackDetail: React.FC = () => {
  const { id } = useParams();
  const [album, setAlbum] = useState<Album | null>(null);
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const { isDarkMode, playTrack, currentTrack, isPlaying } = useStore();
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        setLoading(true);
        try {
            // 1. Fetch Album Details
            const { data: albumData, error: albumError } = await supabase
                .from('album')
                .select('*')
                .eq('id', id)
                .single();
            
            if (albumError) throw albumError;
            setAlbum(albumData);

            // 2. Fetch Junction Table (album_tracks)
            const { data: junctionData, error: junctionError } = await supabase
                .from('album_tracks')
                .select('track_id, track_order')
                .eq('album_id', id)
                .order('track_order', { ascending: true });

            if (junctionError) throw junctionError;

            if (junctionData && junctionData.length > 0) {
                // Extract track IDs
                const trackIds = junctionData.map(j => j.track_id);
                
                // 3. Fetch Actual Music Tracks
                const { data: tracksData, error: tracksError } = await supabase
                    .from('music_tracks')
                    .select('*')
                    .in('id', trackIds);

                if (tracksError) throw tracksError;

                // 4. Sort tracks based on the order in junction table
                if (tracksData) {
                    const sortedTracks = junctionData.map(j => 
                        tracksData.find(t => t.id === j.track_id)
                    ).filter(t => t !== undefined) as MusicTrack[];
                    
                    setTracks(sortedTracks);
                }
            } else {
                setTracks([]);
            }

        } catch (err: any) {
            console.error("Error loading music pack:", err);
            setErrorMsg(err.message || "Unknown error");
        } finally {
            setLoading(false);
        }
      };
      fetchData();
    }
  }, [id]);

  if (loading) return <div className="p-20 text-center opacity-50">Loading album...</div>;
  if (errorMsg) return (
      <div className="p-20 text-center text-red-500 flex flex-col items-center">
          <AlertTriangle size={32} className="mb-2"/>
          <div>Error: {errorMsg}</div>
          <Link to="/music-packs" className="mt-4 underline">Back to Packs</Link>
      </div>
  );
  if (!album) return <div className="p-20 text-center opacity-50">Album not found.</div>;

  const seoDescription = album.description 
    ? `Buy ${album.title} Music Pack. ${album.description.substring(0, 100)}...`
    : `Buy ${album.title}, a premium collection of royalty free music tracks by Francesco Biondi.`;

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 pb-32">
      <SEO title={album.title} description={seoDescription} image={album.cover_url} />

      <Link to="/music-packs" className="inline-flex items-center gap-2 opacity-60 hover:opacity-100 mb-8 transition-opacity">
        <ArrowLeft size={16} /> Back to Music Packs
      </Link>

      {/* Header */}
      <div className="flex flex-col lg:flex-row gap-12 mb-16 items-start">
         <div className="w-full lg:w-[400px] aspect-square rounded-3xl overflow-hidden shadow-2xl flex-shrink-0 relative bg-zinc-200 dark:bg-zinc-800">
            <img src={album.cover_url} alt={album.title} className="w-full h-full object-cover" />
            <div className="absolute top-4 right-4 bg-sky-500 text-white font-bold px-4 py-2 rounded-full shadow-lg text-lg">
                ${(album.price / 100).toFixed(2)}
            </div>
         </div>

         <div className="flex-1 pt-4">
            <div className="flex items-center gap-2 text-sky-500 font-bold uppercase tracking-widest text-sm mb-4">
                <Disc size={18} /> Premium Music Pack
            </div>
            <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight tracking-tight">{album.title}</h1>
            
            {album.description && (
                <div className="text-lg opacity-80 mb-8 leading-relaxed max-w-2xl whitespace-pre-line">
                    {album.description}
                </div>
            )}

            <div className="flex flex-wrap gap-4">
                <a 
                    href={album.gumroad_link || '#'} 
                    className="bg-sky-600 hover:bg-sky-500 text-white text-lg font-bold py-4 px-10 rounded-full shadow-lg hover:shadow-sky-500/30 transition-all flex items-center gap-3 transform hover:-translate-y-1"
                >
                    <ShoppingCart /> Buy Pack on Gumroad
                </a>
            </div>

            <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-8 text-sm opacity-70">
                <div className="flex items-center gap-2"><Check size={18} className="text-sky-500"/> One-time payment</div>
                <div className="flex items-center gap-2"><Check size={18} className="text-sky-500"/> 100% Royalty Free</div>
                <div className="flex items-center gap-2"><Check size={18} className="text-sky-500"/> WAV + MP3 Included</div>
                <div className="flex items-center gap-2"><Check size={18} className="text-sky-500"/> Commercial Use</div>
                <div className="flex items-center gap-2"><Check size={18} className="text-sky-500"/> YouTube Monetization</div>
                <div className="flex items-center gap-2"><Check size={18} className="text-sky-500"/> No Subscription</div>
            </div>
         </div>
      </div>

      {/* Track List */}
      <div className={`rounded-3xl p-6 md:p-10 ${isDarkMode ? 'bg-zinc-900/50' : 'bg-gray-50'}`}>
        <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
            <span>Included Tracks</span>
            <span className="px-3 py-1 bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300 rounded-full text-xs font-bold uppercase">{tracks.length} Tracks</span>
        </h3>
        
        {tracks.length === 0 ? (
            <div className="text-center opacity-50 py-10">No tracks linked to this album yet.</div>
        ) : (
            <div className="flex flex-col gap-2">
                {tracks.map((track, index) => {
                    const isCurrent = currentTrack?.id === track.id;
                    const active = isCurrent && isPlaying;
                    
                    return (
                        <div 
                            key={track.id}
                            className={`
                                flex items-center gap-4 p-3 rounded-xl transition-all
                                ${isDarkMode ? 'hover:bg-zinc-800' : 'bg-white border border-gray-100 hover:border-sky-200 hover:shadow-md'}
                                ${active ? 'ring-1 ring-sky-500 bg-sky-50 dark:bg-sky-900/20' : ''}
                            `}
                        >
                            {/* Track Order - Hidden on Mobile */}
                            <div className="hidden md:block w-8 text-center opacity-40 font-mono text-sm">{index + 1}</div>
                            
                            <div 
                                className="relative w-12 h-12 rounded-lg overflow-hidden cursor-pointer flex-shrink-0 group"
                                onClick={() => playTrack(track)}
                            >
                                <img src={track.cover_url} alt={track.title} className="w-full h-full object-cover" />
                                <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                    {active ? <Pause size={20} className="text-white"/> : <Play size={20} className="text-white ml-1"/>}
                                </div>
                            </div>

                            {/* Info Section - Fixed width on desktop to allow waveform to expand */}
                            <div className="flex-1 md:flex-none md:w-64 min-w-0 px-2">
                                <Link to={`/track/${track.id}`} className={`font-bold text-lg truncate block ${active ? 'text-sky-600 dark:text-sky-400' : 'hover:text-sky-500'}`}>{track.title}</Link>
                                <div className="flex items-center gap-2">
                                    <Link 
                                        to={`/library?search=${encodeURIComponent(track.artist_name)}`} 
                                        className="text-sm opacity-60 truncate hover:underline hover:text-sky-500 transition-colors"
                                    >
                                        {track.artist_name}
                                    </Link>
                                </div>
                            </div>

                            {/* Desktop Waveform */}
                            <div className="hidden md:flex flex-1 h-10 items-center px-4 opacity-80">
                                <WaveformVisualizer track={track} height="h-8" barCount={100} />
                            </div>

                            <div className="hidden md:flex gap-2">
                                {Array.isArray(track.genre) ? (
                                    track.genre.slice(0, 2).map((g) => (
                                        <span key={g} className="text-[10px] px-2 py-1 rounded-md bg-zinc-200 dark:bg-zinc-800 opacity-70 font-medium uppercase tracking-wide">{g}</span>
                                    ))
                                ) : track.genre ? (
                                    <span className="text-[10px] px-2 py-1 rounded-md bg-zinc-200 dark:bg-zinc-800 opacity-70 font-medium uppercase tracking-wide">{track.genre}</span>
                                ) : null}
                            </div>

                            {/* Duration - Hidden on Mobile */}
                            <div className="hidden md:block w-16 text-right font-mono text-sm opacity-50">
                                {track.duration ? `${Math.floor(track.duration / 60)}:${(track.duration % 60).toString().padStart(2, '0')}` : '-'}
                            </div>
                        </div>
                    )
                })}
            </div>
        )}
      </div>
    </div>
  );
};