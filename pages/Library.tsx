import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { MusicTrack } from '../types';
import { useStore } from '../store/useStore';
import { Play, Pause, ShoppingCart, Filter, ChevronDown, ChevronRight, ArrowRight, X, Mic2, ChevronLeft } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { WaveformVisualizer } from '../components/WaveformVisualizer';

export const Library: React.FC = () => {
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const { isDarkMode } = useStore();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  // Filters State
  const initialSearch = searchParams.get('search') || '';
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [selectedSeasons, setSelectedSeasons] = useState<string[]>([]);
  const [bpmRange, setBpmRange] = useState<'slow' | 'medium' | 'fast' | null>(null);

  useEffect(() => {
      const term = searchParams.get('search') || '';
      if (term !== searchTerm) {
        setSearchTerm(term);
      }
  }, [searchParams]);

  // Main Filter Categories
  const genres = ['Cinematic', 'Corporate', 'Ambient', 'Rock', 'Pop', 'Electronic', 'Acoustic', 'Folk', 'Hip Hop', 'Jazz'];
  const moods = ['Inspiring', 'Happy', 'Dark', 'Emotional', 'Dramatic', 'Peaceful', 'Energetic', 'Corporate', 'Uplifting', 'Sad'];
  const seasons = ['Spring', 'Summer', 'Autumn', 'Winter', 'Christmas', 'Halloween'];
  
  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
    fetchTracks();
  }, [selectedGenres, selectedMoods, selectedSeasons, bpmRange, searchTerm]);

  const fetchTracks = async () => {
    setLoading(true);
    
    // 1. Fetch raw data (Limit increased to allow client-side pagination over a larger set)
    const { data, error } = await supabase.from('music_tracks').select('*').limit(1000);
    
    if (error) {
        console.error("Error fetching tracks:", error);
        setTracks([]);
    } else if (data) {
        let filteredData = data as MusicTrack[];

        // 2. Apply Filters in Memory
        
        // Search Term
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filteredData = filteredData.filter(track => {
                const check = (val: any) => val && String(val).toLowerCase().includes(term);
                const checkJson = (val: any) => val && JSON.stringify(val).toLowerCase().includes(term);

                return (
                    check(track.title) || 
                    check(track.artist_name) ||
                    checkJson(track.credits) ||
                    checkJson(track.tags) ||
                    checkJson(track.genre) ||
                    checkJson(track.mood) 
                );
            });
        }

        // Genre Filter
        if (selectedGenres.length > 0) {
            filteredData = filteredData.filter(track => {
                const trackGenres = Array.isArray(track.genre) ? track.genre : [];
                return trackGenres.some(g => selectedGenres.includes(g));
            });
        }

        // Mood Filter
        if (selectedMoods.length > 0) {
            filteredData = filteredData.filter(track => {
                const trackMoods = Array.isArray(track.mood) ? track.mood : [];
                return trackMoods.some(m => selectedMoods.includes(m));
            });
        }

        // Seasonal Filter
        if (selectedSeasons.length > 0) {
            filteredData = filteredData.filter(track => {
                if (Array.isArray(track.season)) {
                    return track.season.some(s => selectedSeasons.includes(s));
                }
                return track.season && selectedSeasons.includes(track.season);
            });
        }

        // BPM Filter
        if (bpmRange) {
            filteredData = filteredData.filter(track => {
                if (!track.bpm) return false;
                if (bpmRange === 'slow') return track.bpm <= 70;
                if (bpmRange === 'medium') return track.bpm >= 71 && track.bpm <= 120;
                if (bpmRange === 'fast') return track.bpm > 120;
                return true;
            });
        }

        setTracks(filteredData);
    }
    setLoading(false);
  };

  const toggleFilter = (list: string[], setList: (l: string[]) => void, item: string) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const clearAllFilters = () => {
      setSearchTerm('');
      setSelectedGenres([]);
      setSelectedMoods([]);
      setSelectedSeasons([]);
      setBpmRange(null);
      setSearchParams({}); // Clear URL params
  };

  // Pagination Calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTracks = tracks.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(tracks.length / itemsPerPage);

  const paginate = (pageNumber: number) => {
      setCurrentPage(pageNumber);
      // Scroll the main content container to top, not the window
      const mainContainer = document.querySelector('main');
      if (mainContainer) {
          mainContainer.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
      }
  };

  const hasActiveFilters = searchTerm || selectedGenres.length > 0 || selectedMoods.length > 0 || selectedSeasons.length > 0 || bpmRange;

  return (
    <div className="flex flex-col lg:flex-row h-full min-h-screen">
      
      {/* Mobile Filter Toggle */}
      <button 
        className="lg:hidden m-4 p-3 bg-sky-600 text-white rounded-lg flex items-center justify-center gap-2"
        onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
      >
        <Filter size={20}/> Filters
      </button>

      {/* Sidebar Filters */}
      <div className={`
        lg:w-72 flex-shrink-0 p-6 border-r overflow-y-auto h-auto lg:h-[calc(100vh-6rem)] sticky top-0 no-scrollbar
        ${mobileFiltersOpen ? 'block' : 'hidden lg:block'}
        ${isDarkMode ? 'border-zinc-800 bg-zinc-900/50' : 'border-zinc-100 bg-white'}
      `}>
        
        <CollapsibleFilterSection 
            title="Genres" 
            items={genres} 
            selected={selectedGenres} 
            onChange={(i) => toggleFilter(selectedGenres, setSelectedGenres, i)} 
            linkTo="/categories/genres"
            isDark={isDarkMode}
        />
        
        <CollapsibleFilterSection 
            title="Moods" 
            items={moods} 
            selected={selectedMoods} 
            onChange={(i) => toggleFilter(selectedMoods, setSelectedMoods, i)} 
            linkTo="/categories/moods"
            isDark={isDarkMode}
        />
        
        <CollapsibleFilterSection 
            title="Tempo" 
            isDark={isDarkMode}
        >
             <div className="space-y-1 pb-4">
                {['slow', 'medium', 'fast'].map(range => (
                    <label key={range} className="flex items-center gap-2 cursor-pointer text-sm opacity-80 hover:opacity-100 py-1">
                        <input 
                            type="radio" 
                            name="bpm" 
                            checked={bpmRange === range} 
                            onClick={() => setBpmRange(bpmRange === range ? null : range as any)}
                            onChange={() => {}}
                            className="accent-sky-500"
                        />
                        <span className="capitalize">{range}</span>
                    </label>
                ))}
            </div>
        </CollapsibleFilterSection>

        <CollapsibleFilterSection 
            title="Seasonal Themes" 
            items={seasons} 
            selected={selectedSeasons} 
            onChange={(i) => toggleFilter(selectedSeasons, setSelectedSeasons, i)} 
            linkTo="/categories/seasonal"
            isDark={isDarkMode}
        />

        {/* Active Filters Section */}
        {hasActiveFilters && (
            <div className={`mt-8 pt-6 border-t animate-in fade-in slide-in-from-top-2 duration-300 ${isDarkMode ? 'border-zinc-800' : 'border-zinc-100'}`}>
                <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-xs uppercase opacity-50 tracking-wider">Active Filters</h4>
                    <button 
                        onClick={clearAllFilters}
                        className="text-xs text-red-500 hover:text-red-600 font-medium hover:underline flex items-center gap-1"
                    >
                        <X size={12} /> Clear All
                    </button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                    {/* Search Term Badge */}
                    {searchTerm && (
                        <ActiveFilterBadge label={`"${searchTerm}"`} onRemove={() => { setSearchTerm(''); setSearchParams({}); }} isDark={isDarkMode} />
                    )}
                    
                    {/* BPM Badge */}
                    {bpmRange && (
                        <ActiveFilterBadge label={`BPM: ${bpmRange}`} onRemove={() => setBpmRange(null)} isDark={isDarkMode} />
                    )}

                    {/* Genre Badges */}
                    {selectedGenres.map(g => (
                        <ActiveFilterBadge key={g} label={g} onRemove={() => toggleFilter(selectedGenres, setSelectedGenres, g)} isDark={isDarkMode} />
                    ))}

                    {/* Mood Badges */}
                    {selectedMoods.map(m => (
                        <ActiveFilterBadge key={m} label={m} onRemove={() => toggleFilter(selectedMoods, setSelectedMoods, m)} isDark={isDarkMode} />
                    ))}

                    {/* Season Badges */}
                    {selectedSeasons.map(s => (
                        <ActiveFilterBadge key={s} label={s} onRemove={() => toggleFilter(selectedSeasons, setSelectedSeasons, s)} isDark={isDarkMode} />
                    ))}
                </div>
            </div>
        )}
      </div>

      {/* Track List */}
      <div className="flex-1 p-4 lg:p-8 pb-32">
        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            Library 
            {tracks.length > 0 && <span className="text-sm font-normal opacity-50 bg-gray-100 dark:bg-zinc-800 px-3 py-1 rounded-full">{tracks.length} Tracks</span>}
        </h2>
        
        {loading ? (
          <div className="text-center py-20 opacity-50">Loading tracks...</div>
        ) : tracks.length === 0 ? (
          <div className="text-center py-20 opacity-50">
            {hasActiveFilters ? "No tracks found matching your filters." : "No tracks available."}
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-3 min-h-[50vh]">
                {currentTracks.map(track => (
                <TrackItem key={track.id} track={track} />
                ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="mt-12 flex justify-center items-center gap-2">
                    <button 
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-zinc-800 disabled:opacity-30' : 'hover:bg-gray-100 disabled:opacity-30'}`}
                    >
                        <ChevronLeft size={20} />
                    </button>
                    
                    <div className="flex items-center gap-1">
                        {/* Simple Page Numbers */}
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                            // Logic to show ranges around current page could go here, keeping it simple for now
                            let pageNum = i + 1;
                            if (totalPages > 5 && currentPage > 3) {
                                pageNum = currentPage - 2 + i;
                                if (pageNum > totalPages) return null;
                            }
                            
                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => paginate(pageNum)}
                                    className={`
                                        w-8 h-8 rounded-lg text-sm font-medium transition-all
                                        ${currentPage === pageNum 
                                            ? 'bg-sky-600 text-white shadow-md' 
                                            : (isDarkMode ? 'hover:bg-zinc-800 text-zinc-400' : 'hover:bg-gray-100 text-zinc-600')}
                                    `}
                                >
                                    {pageNum}
                                </button>
                            )
                        })}
                        {totalPages > 5 && currentPage < totalPages - 2 && (
                            <span className="opacity-50 px-1">...</span>
                        )}
                    </div>

                    <button 
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-zinc-800 disabled:opacity-30' : 'hover:bg-gray-100 disabled:opacity-30'}`}
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// Helper Component for Active Filters
const ActiveFilterBadge: React.FC<{ label: string, onRemove: () => void, isDark: boolean }> = ({ label, onRemove, isDark }) => (
    <span className={`
        inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-colors
        ${isDark ? 'bg-sky-900/30 text-sky-200 border border-sky-800' : 'bg-sky-100 text-sky-800 border border-sky-200'}
    `}>
        {label}
        <button onClick={onRemove} className="hover:opacity-60 p-0.5">
            <X size={10} />
        </button>
    </span>
);

// Collapsible Filter Component (unchanged)
const CollapsibleFilterSection: React.FC<{ 
    title: string, 
    items?: string[], 
    selected?: string[], 
    onChange?: (item: string) => void, 
    linkTo?: string,
    isDark: boolean,
    children?: React.ReactNode
}> = ({ title, items, selected, onChange, linkTo, isDark, children }) => {
    const [isOpen, setIsOpen] = useState(false); 

    return (
        <div className={`mb-4 border-b ${isDark ? 'border-zinc-800' : 'border-zinc-100'} last:border-0 pb-4`}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full py-2 font-bold text-xs uppercase opacity-70 hover:opacity-100 tracking-wider"
            >
                {title}
                {isOpen ? <ChevronDown size={14}/> : <ChevronRight size={14}/>}
            </button>
            
            {isOpen && (
                <div className="mt-2 animate-in fade-in slide-in-from-top-1 duration-200">
                    {children ? children : (
                        <div className="space-y-1">
                            {items?.slice(0, 8).map(item => (
                                <label key={item} className="flex items-center gap-2 cursor-pointer text-sm opacity-80 hover:opacity-100 transition-opacity py-1">
                                    <input 
                                        type="checkbox" 
                                        checked={selected?.includes(item)} 
                                        onChange={() => onChange && onChange(item)}
                                        className="rounded border-gray-300 text-sky-600 focus:ring-sky-500 accent-sky-500"
                                    />
                                    {item}
                                </label>
                            ))}
                            {linkTo && (
                                <Link 
                                    to={linkTo} 
                                    className="inline-flex items-center gap-1 text-xs text-sky-500 hover:text-sky-600 font-medium mt-3 ml-6"
                                >
                                    View all {title} <ArrowRight size={10} />
                                </Link>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

const TrackItem: React.FC<{ track: MusicTrack }> = ({ track }) => {
    const { playTrack, currentTrack, isPlaying, isDarkMode } = useStore();
    const isCurrent = currentTrack?.id === track.id;
    const active = isCurrent && isPlaying;

    return (
        <div className={`
            flex items-center gap-4 p-3 rounded-xl transition-all duration-200
            ${isDarkMode ? 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800' : 'bg-white border-zinc-200 shadow-sm hover:shadow-md border'}
            ${active ? 'ring-1 ring-sky-500/50' : ''}
        `}>
            {/* Cover & Play Btn */}
            <div 
                className="relative group w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden cursor-pointer"
                onClick={() => playTrack(track)}
            >
                <img src={track.cover_url} alt={track.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className={`absolute inset-0 bg-sky-900/40 flex items-center justify-center transition-all duration-300 ${active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                    {active ? <Pause className="text-white" size={20} /> : <Play className="text-white ml-1" size={20} />}
                </div>
            </div>

            {/* Info - Flexible on mobile to push cart, Fixed on Desktop to allow waveform */}
            <div className="flex-1 md:flex-none md:w-60 min-w-0">
                <Link to={`/track/${track.id}`} className="font-bold text-base hover:text-sky-500 transition-colors block truncate">{track.title}</Link>
                <div className="flex items-center gap-2">
                    <Link to={`/library?search=${encodeURIComponent(track.artist_name)}`} className="text-xs opacity-70 hover:underline">{track.artist_name}</Link>
                    {track.lyrics && (
                        <span title="Has Lyrics">
                            <Mic2 size={12} className="text-sky-500 opacity-80" />
                        </span>
                    )}
                </div>
                <div className="flex flex-wrap gap-2 mt-1">
                    {track.genre?.slice(0, 1).map(g => (
                        <span key={g} className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded-sm bg-sky-100 text-sky-800 dark:bg-sky-900/50 dark:text-sky-300">{g}</span>
                    ))}
                </div>
            </div>

            {/* Waveform Visualization - Takes remaining space */}
            <div className="hidden md:flex flex-1 h-12 items-center px-2">
                <WaveformVisualizer track={track} height="h-10" barCount={150} />
            </div>

            {/* Meta & Action */}
            <div className="flex items-center gap-4">
                <div className="text-right text-xs opacity-60 font-mono hidden lg:block w-16">
                    <div>{track.duration ? `${Math.floor(track.duration / 60)}:${(track.duration % 60).toString().padStart(2, '0')}` : '0:00'}</div>
                    {track.bpm && <div>{track.bpm} BPM</div>}
                </div>
                
                <a 
                    href={track.gumroad_link || '#'} 
                    className="bg-sky-500 hover:bg-sky-600 text-white p-2 rounded-full shadow-lg hover:shadow-xl transition-all flex-shrink-0"
                    title="Buy License"
                >
                    <ShoppingCart size={18} />
                </a>
            </div>
        </div>
    )
}