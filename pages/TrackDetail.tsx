import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { MusicTrack, Album } from '../types';
import { useStore } from '../store/useStore';
import { Play, Pause, ShoppingCart, Clock, Music2, Calendar, FileText, Package, ArrowRight, Sparkles, ChevronDown, ChevronUp, Mic2 } from 'lucide-react';
import { WaveformVisualizer } from '../components/WaveformVisualizer';
import { SEO } from '../components/SEO';

export const TrackDetail: React.FC = () => {
  const { id } = useParams();
  const [track, setTrack] = useState<MusicTrack | null>(null);
  const [relatedAlbum, setRelatedAlbum] = useState<Album | null>(null);
  const [recommendations, setRecommendations] = useState<MusicTrack[]>([]);
  const { playTrack, currentTrack, isPlaying, isDarkMode } = useStore();
  const [showLyrics, setShowLyrics] = useState(false);

  useEffect(() => {
    if (id) {
      window.scrollTo(0, 0); // Ensure page starts at top when navigating between recommended tracks
      setShowLyrics(false); // Reset lyrics state on track change
      
      // 1. Fetch Track Details
      supabase.from('music_tracks').select('*').eq('id', id).single()
        .then(({ data: trackData }) => {
          if (trackData) {
            setTrack(trackData);

            // 2. Check if track belongs to an Album (Music Pack)
            supabase
                .from('album_tracks')
                .select('album(*)')
                .eq('track_id', trackData.id)
                .maybeSingle()
                .then(({ data: albumData }) => {
                    if (albumData && albumData.album) {
                        setRelatedAlbum(albumData.album as unknown as Album);
                    } else {
                        setRelatedAlbum(null);
                    }
                });

            // 3. Fetch Recommendations (Similar Tracks)
            // Priority: Overlapping Genres -> Overlapping Moods -> Any
            supabase.from('music_tracks').select('*').neq('id', trackData.id).limit(50)
                .then(({ data: allOtherTracks }) => {
                    if (allOtherTracks) {
                        let scored = allOtherTracks.map(t => {
                            let score = 0;
                            // Overlap Genres
                            if (trackData.genre && t.genre) {
                                const intersection = trackData.genre.filter((g:string) => t.genre.includes(g));
                                score += intersection.length * 2;
                            }
                            // Overlap Moods (using 'mood' column)
                            if (trackData.mood && t.mood) {
                                const intersection = trackData.mood.filter((m:string) => t.mood.includes(m));
                                score += intersection.length;
                            }
                            return { track: t, score };
                        });
                        
                        // Sort by score
                        scored.sort((a, b) => b.score - a.score);
                        
                        // Take top 4
                        setRecommendations(scored.slice(0, 4).map(s => s.track));
                    }
                });
          }
        });
    }
  }, [id]);

  if (!track) return <div className="p-20 text-center opacity-50">Loading track details...</div>;

  const active = currentTrack?.id === track.id && isPlaying;

  // Helper to highlight description
  const formatDescription = (desc: string | null) => {
    if (!desc) return null;
    return desc.split('\n').map((line, i) => (
      <p key={i} className="mb-2">{line}</p>
    ));
  };

  // Robust SEO Description Generator
  const getSeoDescription = () => {
    // 1. Get raw description
    let desc = track.description || "";
    
    // 2. Sanitize: Replace newlines with spaces and remove multiple spaces
    desc = desc.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim();

    // 3. Fallback if empty
    if (!desc) {
        return `Download ${track.title} by ${track.artist_name}. High-quality royalty-free music suitable for video editing, podcasts, and commercial projects.`;
    }

    // 4. Truncate strictly to 100 characters as requested
    if (desc.length > 100) {
        return desc.substring(0, 100).trim() + "...";
    }
    
    return desc;
  };

  const seoTitle = `${track.title} by ${track.artist_name}`;
  const seoDescription = getSeoDescription();

  return (
    <div className="max-w-5xl mx-auto px-4 py-12 pb-32">
        <SEO title={seoTitle} description={seoDescription} image={track.cover_url} />

        <div className="flex flex-col md:flex-row gap-8 lg:gap-12 mb-12 items-start">
            
            {/* Cover - Fixed aspect square */}
            <div className="w-full max-w-md md:w-80 lg:w-96 flex-shrink-0 aspect-square rounded-2xl overflow-hidden shadow-2xl relative group mx-auto md:mx-0">
                <img src={track.cover_url} alt={track.title} className="w-full h-full object-cover" />
                <button 
                    onClick={() => playTrack(track)}
                    className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                >
                    <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/50">
                        {active ? <Pause size={40} className="text-white"/> : <Play size={40} className="text-white ml-2"/>}
                    </div>
                </button>
            </div>

            {/* Info Header */}
            <div className="flex-1 flex flex-col justify-center w-full">
                <div className="flex items-center gap-4 mb-2 opacity-70 text-sm font-bold uppercase tracking-wider">
                    <span className="bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-300 px-2 py-1 rounded">{track.genre?.[0]}</span>
                    {track.bpm && <span className="flex items-center gap-1"><Music2 size={14}/> {track.bpm} BPM</span>}
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-2 tracking-tight">{track.title}</h1>
                
                {/* Clickable Artist Name */}
                <h2 className="text-2xl mb-6 font-medium">
                    <Link 
                        to={`/library?search=${encodeURIComponent(track.artist_name)}`} 
                        className="text-sky-600 dark:text-sky-400 hover:text-sky-500 hover:underline transition-colors opacity-90"
                    >
                        {track.artist_name}
                    </Link>
                </h2>

                {/* Big Visualizer with Play Button */}
                <div className="h-32 w-full bg-zinc-50 dark:bg-zinc-900 rounded-xl mb-8 px-6 flex items-center gap-6 shadow-inner border border-zinc-200 dark:border-zinc-800">
                    {/* Embedded Play Button */}
                    <button 
                        onClick={() => playTrack(track)}
                        className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition hover:scale-105 shadow-md ${isDarkMode ? 'bg-white text-black' : 'bg-black text-white'}`}
                    >
                        {active ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" className="ml-1"/>}
                    </button>

                    {/* Waveform takes remaining space */}
                    <div className="flex-1 h-full flex items-center">
                        <WaveformVisualizer 
                            track={track} 
                            height="h-20" 
                            barCount={200} 
                            enableAnalysis={true} 
                            interactive={true}
                        />
                    </div>
                </div>

                <div className="flex flex-wrap gap-4">
                    <a 
                        href={track.gumroad_link || '#'}
                        className="flex-1 bg-sky-600 hover:bg-sky-500 text-white text-lg font-bold py-4 px-8 rounded-full shadow-lg hover:shadow-sky-500/30 transition-all flex items-center justify-center gap-2"
                    >
                        <ShoppingCart /> Buy License
                    </a>
                </div>
            </div>
        </div>

        <div className="grid md:grid-cols-3 gap-12 mb-20">
            {/* Main Content Column */}
            <div className="md:col-span-2">
                <h3 className="text-xl font-bold mb-4 border-b pb-2 border-sky-500/30 inline-block">About this track</h3>
                <div className="prose dark:prose-invert opacity-90 leading-relaxed mb-8">
                    {formatDescription(track.description)}
                </div>

                {/* License Box (Redesigned) */}
                <div className="bg-sky-50 dark:bg-sky-900/20 p-8 rounded-2xl border border-sky-100 dark:border-sky-800 mb-8 relative overflow-hidden group">
                    {/* Background Icon - Gumroad */}
                    <img
                        src="https://pub-2da555791ab446dd9afa8c2352f4f9ea.r2.dev/media/gumroad-icon.svg"
                        alt="Gumroad"
                        className="absolute -right-8 -bottom-8 w-48 h-48 opacity-20 transform -rotate-12 pointer-events-none group-hover:scale-110 transition-transform duration-500"
                    />

                    <div className="relative z-10">
                        <h4 className="font-bold text-xl mb-3">License this track</h4>
                        <p className="opacity-80 mb-6 max-w-lg">Do you like this music? Get the official license to use it in your video projects, podcasts, or commercial works. Secure transaction via Gumroad.</p>
                        <a 
                            href={track.gumroad_link || '#'} 
                            className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-500 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-all transform hover:-translate-y-0.5"
                        >
                            Go to purchase options <ArrowRight size={18} />
                        </a>
                    </div>
                </div>

                {/* Lyrics Section (Conditional) */}
                {track.lyrics && (
                    <div className={`mb-8 rounded-xl border transition-all overflow-hidden ${isDarkMode ? 'bg-zinc-900/50 border-zinc-800' : 'bg-gray-50 border-gray-200'}`}>
                        <button 
                            onClick={() => setShowLyrics(!showLyrics)}
                            className="w-full flex items-center justify-between p-5 font-bold text-left hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                        >
                            <span className="flex items-center gap-2 text-sky-600 dark:text-sky-400">
                                <Mic2 size={20} /> Song Lyrics
                            </span>
                            {showLyrics ? <ChevronUp size={20} className="opacity-50"/> : <ChevronDown size={20} className="opacity-50"/>}
                        </button>
                        
                        {showLyrics && (
                            <div className="p-6 pt-0 border-t border-dashed border-gray-200 dark:border-zinc-800 mt-2">
                                <div className="italic text-lg leading-relaxed opacity-80 whitespace-pre-line font-serif pt-4">
                                    {track.lyrics}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Promo Card */}
                {relatedAlbum && (
                    <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-700 text-white shadow-xl relative overflow-hidden group flex flex-col sm:flex-row items-center gap-6">
                        <div className="relative z-10 flex-1 text-center sm:text-left">
                            <div className="flex items-center justify-center sm:justify-start gap-2 mb-2 opacity-90">
                                <Package size={18} />
                                <span className="text-xs font-bold uppercase tracking-wider">Music Pack</span>
                            </div>
                            <h4 className="font-bold text-xl mb-2">This track is included in the {relatedAlbum.title}</h4>
                            <p className="opacity-90 text-sm mb-5 leading-relaxed">
                                Get this track plus many others and save money by purchasing the complete bundle.
                            </p>
                            
                            <Link 
                                to={`/music-packs/${relatedAlbum.id}`}
                                className="inline-flex items-center gap-2 bg-white text-indigo-700 font-bold px-6 py-3 rounded-full hover:bg-indigo-50 transition-colors shadow-sm"
                            >
                                View Music Pack <ArrowRight size={16} />
                            </Link>
                        </div>
                        
                        {/* Pack Cover Preview */}
                        <div className="relative z-10 flex-shrink-0">
                            <img 
                                src={relatedAlbum.cover_url} 
                                alt={relatedAlbum.title} 
                                className="w-32 h-32 rounded-lg object-cover shadow-lg rotate-3 group-hover:rotate-0 transition-transform duration-500 border-2 border-white/20" 
                            />
                        </div>

                        {/* Decorative background element */}
                        <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
                    </div>
                )}
            </div>

            {/* Sidebar (Details only now) */}
            <div className="space-y-6">
                <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-zinc-900' : 'bg-gray-50'}`}>
                    <h3 className="text-lg font-bold mb-6">Track Details</h3>
                    
                    <div className="space-y-4 text-sm">
                        <DetailRow label="Duration" value={track.duration ? `${Math.floor(track.duration / 60)}:${(track.duration % 60).toString().padStart(2, '0')}` : '-'} icon={<Clock size={16}/>} />
                        <DetailRow label="BPM" value={track.bpm} icon={<Music2 size={16}/>} />
                        <DetailRow label="Released" value={track.year} icon={<Calendar size={16}/>} />
                        <DetailRow label="ISRC" value={track.isrc} icon={<FileText size={16}/>} />
                        <DetailRow label="ISWC" value={track.iswc} icon={<FileText size={16}/>} />
                        
                        {/* Credits Section */}
                        {track.credits && Array.isArray(track.credits) && track.credits.length > 0 && (
                            <div className="pt-4 mt-4 border-t border-gray-200 dark:border-zinc-700">
                                <h4 className="font-bold mb-3 text-sm uppercase tracking-wider opacity-80">Credits</h4>
                                <div className="space-y-2">
                                    {track.credits.map((credit: any, i: number) => (
                                        <div key={i} className="text-sm">
                                            {/* Clickable Credit Name */}
                                            <Link 
                                                to={`/library?search=${encodeURIComponent(credit.name)}`}
                                                className="font-semibold opacity-90 hover:text-sky-500 hover:underline transition-colors"
                                            >
                                                {credit.name}
                                            </Link>
                                            <span className="opacity-50 mx-1">—</span>
                                            <span className="opacity-70">{credit.role}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Tags Section (NEW) */}
                        {track.tags && Array.isArray(track.tags) && track.tags.length > 0 && (
                            <div className="pt-4 mt-4 border-t border-gray-200 dark:border-zinc-700">
                                <h4 className="font-bold mb-3 text-sm uppercase tracking-wider opacity-80">Tags</h4>
                                <div className="flex flex-wrap gap-2">
                                    {track.tags.map((tag: string, i: number) => (
                                        <Link 
                                            key={i}
                                            to={`/library?search=${encodeURIComponent(tag)}`}
                                            className="text-xs bg-zinc-100 dark:bg-zinc-800 hover:bg-sky-100 dark:hover:bg-sky-900/30 text-zinc-600 dark:text-zinc-400 hover:text-sky-600 dark:hover:text-sky-300 px-2.5 py-1 rounded-md transition-colors"
                                        >
                                            #{tag}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>

        {/* You Might Also Like Section */}
        {recommendations.length > 0 && (
            <div className="pt-12 border-t border-gray-200 dark:border-zinc-800">
                <h3 className="text-2xl font-bold mb-8 flex items-center gap-2">
                    <Sparkles className="text-sky-500" size={24}/> You Might Also Like
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {recommendations.map(rec => {
                        const isRecPlaying = currentTrack?.id === rec.id && isPlaying;
                        return (
                            <div key={rec.id} className="group">
                                <div 
                                    className="relative aspect-square rounded-xl overflow-hidden mb-3 cursor-pointer shadow-md group-hover:shadow-xl transition-all"
                                    onClick={() => playTrack(rec)}
                                >
                                    <img 
                                        src={rec.cover_url} 
                                        alt={rec.title} 
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                                    />
                                    <div className={`absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity ${isRecPlaying ? 'opacity-100' : ''}`}>
                                        {isRecPlaying ? <Pause className="text-white" size={32} /> : <Play className="text-white pl-1" size={32} />}
                                    </div>
                                </div>
                                
                                <Link to={`/track/${rec.id}`} className="block font-bold truncate hover:text-sky-500 transition-colors">
                                    {rec.title}
                                </Link>
                                <div className="text-sm opacity-60 truncate">{rec.artist_name}</div>
                            </div>
                        )
                    })}
                </div>
            </div>
        )}
    </div>
  );
};

const DetailRow: React.FC<{ label: string, value: any, icon: React.ReactNode }> = ({ label, value, icon }) => (
    <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 opacity-60">
            {icon} <span>{label}</span>
        </div>
        <div className="font-mono font-medium">{value || 'N/A'}</div>
    </div>
);