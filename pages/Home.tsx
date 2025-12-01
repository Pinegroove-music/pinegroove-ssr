import React, { useEffect, useState } from 'react';
import { MusicTrack, Client, Album, MediaTheme } from '../types';
import { supabase } from '../services/supabase';
import { useStore } from '../store/useStore';
import { Search, Play, ShoppingCart, Pause, ArrowRight, Sparkles, FileCheck, ShieldCheck, Lock, Disc, Mail, Clapperboard } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { WaveformVisualizer } from '../components/WaveformVisualizer';

export const Home: React.FC = () => {
  const [discoverTracks, setDiscoverTracks] = useState<MusicTrack[]>([]);
  const [trendingTracks, setTrendingTracks] = useState<MusicTrack[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [featuredPack, setFeaturedPack] = useState<Album | null>(null);
  const [mediaThemes, setMediaThemes] = useState<MediaTheme[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { isDarkMode, playTrack, currentTrack, isPlaying } = useStore();
  const navigate = useNavigate();

  const popularGenres = [
    'Cinematic', 'Corporate', 'Ambient', 'Rock', 'Pop', 'Electronic',
    'Acoustic', 'Folk', 'Hip Hop', 'Jazz', 'Classical', 'Funk'
  ];

  // Elegant Blue/Purple Gradients matching GenresPage
  const gradients = [
    'bg-gradient-to-br from-sky-500 to-blue-600',
    'bg-gradient-to-br from-blue-500 to-indigo-600',
    'bg-gradient-to-br from-indigo-500 to-violet-600',
    'bg-gradient-to-br from-violet-500 to-purple-600',
    'bg-gradient-to-br from-sky-600 to-indigo-700',
    'bg-gradient-to-br from-blue-600 to-violet-700',
  ];

  // Helper to determine seasonal keywords based on current month
  const getCurrentSeasonalKeywords = () => {
    const month = new Date().getMonth(); // 0 = Jan, 11 = Dec
    
    switch (month) {
        case 9: // October
            return ['Halloween', 'Autumn', 'Spooky', 'Dark'];
        case 10: // November
        case 11: // December
            return ['Christmas', 'Holiday', 'Winter', 'Xmas', 'Jingle'];
        case 0: // January
            return ['Winter', 'Ramadan', "Valentine's Day", 'New Year'];
        case 1: // February
        case 2: // March
            return ["Valentine's Day", 'Holi', "St. Patrick's Day", 'Spring'];
        case 3: // April
        case 4: // May
            return ['Spring', 'Cinco de Mayo', 'Memorial Day'];
        case 5: // June
        case 6: // July
        case 7: // August
            return ['Summer', 'Party', 'Beach', 'Sunny'];
        default: // September (Fallback)
            return ['Autumn'];
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      // 1. Fetch random tracks for discover (randomized on client)
      // Fetching a larger pool to enable client-side random sorting and filtering
      const { data: allTracks } = await supabase.from('music_tracks').select('*').limit(200);
      
      if (allTracks) {
        // --- DISCOVER SECTION ---
        const shuffled = [...allTracks].sort(() => 0.5 - Math.random());
        setDiscoverTracks(shuffled.slice(0, 12));

        // --- TRENDING / SEASONAL SECTION ---
        const seasonKeywords = getCurrentSeasonalKeywords();
        const keywordsLower = seasonKeywords.map(k => k.toLowerCase());

        // Robust Filtering: Check Season Col, Tags (Array), Title, and Moods
        const seasonalMatches = allTracks.filter(track => {
            // Check 'season' column - Handle String or Array safely
            if (track.season) {
                if (typeof track.season === 'string') {
                    if (keywordsLower.includes(track.season.toLowerCase())) return true;
                } else if (Array.isArray(track.season)) {
                    // Check if any element in the array matches keywords
                    if (track.season.some((s: any) => typeof s === 'string' && keywordsLower.includes(s.toLowerCase()))) return true;
                }
            }
            
            // Check 'tags' array
            if (track.tags && Array.isArray(track.tags)) {
                if (track.tags.some(tag => keywordsLower.some(k => tag.toLowerCase().includes(k)))) return true;
            }

            // Check title
            if (keywordsLower.some(k => track.title.toLowerCase().includes(k))) return true;

            // Check 'mood' array
            if (track.mood && Array.isArray(track.mood)) {
                if (track.mood.some(m => keywordsLower.includes(m.toLowerCase()))) return true;
            }

            return false;
        });

        let finalTrending = seasonalMatches;

        // If not enough seasonal tracks, fill with random tracks from the remaining pool
        if (finalTrending.length < 10) {
            const usedIds = new Set(finalTrending.map(t => t.id));
            const remaining = allTracks.filter(t => !usedIds.has(t.id));
            // Shuffle remaining to keep trending interesting
            const shuffledRemaining = remaining.sort(() => 0.5 - Math.random());
            
            finalTrending = [...finalTrending, ...shuffledRemaining.slice(0, 10 - finalTrending.length)];
        } else {
            // If too many seasonal, shuffle and take 10
            finalTrending = finalTrending.sort(() => 0.5 - Math.random()).slice(0, 10);
        }

        setTrendingTracks(finalTrending);
      }

      // 3. Fetch clients
      const { data: clientData } = await supabase.from('clients').select('*');
      if (clientData) setClients(clientData);

      // 4. Fetch random featured pack
      const { data: packs } = await supabase.from('album').select('*').limit(20);
      if (packs && packs.length > 0) {
        const randomPack = packs[Math.floor(Math.random() * packs.length)];
        setFeaturedPack(randomPack);
      }

      // 5. Fetch Media Themes (Randomize)
      // Fetch all themes first, then shuffle and slice client-side
      const { data: themes } = await supabase.from('media_theme').select('*');
      if (themes && themes.length > 0) {
        const shuffledThemes = [...themes].sort(() => 0.5 - Math.random());
        setMediaThemes(shuffledThemes.slice(0, 4));
      }
    };

    fetchData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/library?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="space-y-16 pb-20">
      
      {/* Hero / Search */}
      <div className="relative py-28 px-4 text-center overflow-hidden">
         {/* Background Image */}
         <div className="absolute inset-0 z-0">
            <img 
                src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2070&auto=format&fit=crop" 
                alt="Home Studio Background" 
                className="w-full h-full object-cover"
            />
            {/* Overlay for readability */}
            <div className="absolute inset-0 bg-black/60 transition-colors duration-500"></div>
         </div>

         <div className="relative z-10 max-w-4xl mx-auto text-white">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight drop-shadow-md leading-tight">
                Find the perfect sound for your story.
            </h1>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto font-medium drop-shadow-sm">
                High-quality stock music by composer Francesco Biondi.
            </p>
            
            <form onSubmit={handleSearch} className="max-w-xl mx-auto relative text-zinc-900">
              <input 
                type="text" 
                placeholder="Search genre, mood, or instrument..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-4 pl-12 rounded-full shadow-2xl outline-none border border-transparent bg-white/95 focus:bg-white focus:ring-4 focus:ring-sky-500/30 transition-all backdrop-blur-sm"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 opacity-40 text-black" size={20} />
            </form>
            
            <div className="mt-4">
                <Link 
                    to="/library" 
                    className="inline-flex items-center gap-2 text-sky-200 hover:text-white transition-colors font-medium text-sm group"
                >
                    Explore Full Catalog 
                    <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform"/>
                </Link>
            </div>
         </div>
      </div>

      {/* Discover Section */}
      <section className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <span className="text-sky-500">✦</span> Discover New Music
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {discoverTracks.map(track => {
              const active = currentTrack?.id === track.id && isPlaying;
              return (
                <div key={track.id} className="group flex flex-col text-center">
                    {/* Cover Image & Play Button */}
                    <div 
                        className="relative aspect-square rounded-xl overflow-hidden cursor-pointer shadow-md mb-3" 
                        onClick={() => playTrack(track)}
                    >
                        <img 
                            src={track.cover_url} 
                            alt={track.title} 
                            className="w-full h-full object-cover transition duration-500 group-hover:scale-110" 
                        />
                        <div className={`absolute inset-0 bg-black/30 flex items-center justify-center transition-opacity ${active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                            {active ? <Pause size={32} className="text-white fill-white" /> : <Play size={32} className="text-white fill-white" />}
                        </div>
                    </div>
                    
                    {/* Track Info & Link */}
                    <Link 
                        to={`/track/${track.id}`} 
                        className="font-bold text-sm truncate block hover:text-sky-500 transition-colors"
                        title={track.title}
                    >
                        {track.title}
                    </Link>
                    <Link 
                        to={`/library?search=${encodeURIComponent(track.artist_name)}`} 
                        className="text-xs opacity-70 truncate block hover:underline transition-colors"
                        title={track.artist_name}
                    >
                        {track.artist_name}
                    </Link>
                </div>
            )
          })}
        </div>
        
        <div className="mt-8 flex justify-end">
            <Link 
                to="/library" 
                className={`
                    inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5
                    ${isDarkMode 
                        ? 'bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700' 
                        : 'bg-white hover:bg-sky-50 text-sky-600 border border-sky-100'}
                `}
            >
                Explore Full Catalog <ArrowRight size={16} />
            </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: <Sparkles size={28} />,
              title: "Premium Quality",
              desc: "Meticulously composed tracks featuring real instruments and high-end production."
            },
            {
              icon: <FileCheck size={28} />,
              title: "Simple Licensing",
              desc: "Pay once, use forever. No recurring fees, no hidden costs. Simple royalty-free licenses."
            },
            {
              icon: <ShieldCheck size={28} />,
              title: "Content ID Safe",
              desc: "100% safe for YouTube. Fast Content ID clearance for every license purchased."
            },
            {
              icon: <Lock size={28} />,
              title: "Secure Transactions",
              desc: "Powered by Gumroad for 100% secure payments and instant automated delivery."
            }
          ].map((feature, idx) => (
             <div key={idx} className={`p-6 rounded-2xl border text-center flex flex-col items-center transition hover:shadow-lg hover:-translate-y-1 transform duration-300 ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-sky-50 border-sky-200 shadow-sm'}`}>
                <div className={`mb-4 text-sky-500 p-4 rounded-full ${isDarkMode ? 'bg-sky-900/20' : 'bg-white'}`}>
                    {feature.icon}
                </div>
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm opacity-70 leading-relaxed">{feature.desc}</p>
             </div>
          ))}
        </div>
      </section>

      {/* Browse By Genre Section */}
      <section className="container mx-auto px-4 text-center">
        <h2 className="text-2xl font-bold mb-6 flex items-center justify-start gap-2">
          <span className="text-sky-500">✦</span> Browse By Genre
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {popularGenres.map((genre, index) => {
            const gradient = gradients[index % gradients.length];
            return (
              <Link
                key={genre}
                to={`/library?search=${encodeURIComponent(genre)}`}
                className={`
                  ${gradient} text-white
                  h-16 flex items-center justify-center text-center px-2
                  rounded-xl font-bold text-xs md:text-sm uppercase tracking-wider 
                  transition-all transform hover:-translate-y-1 hover:shadow-lg hover:brightness-110 shadow-md
                `}
              >
                {genre}
              </Link>
            )
          })}
        </div>
        
        <Link 
            to="/categories/genres"
            className={`
                inline-flex items-center gap-2 mt-10 px-8 py-3 rounded-full font-bold text-sm transition-all transform hover:-translate-y-0.5 hover:shadow-md
                ${isDarkMode ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300' : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-600'}
            `}
        >
            View All Genres <ArrowRight size={16} />
        </Link>
      </section>

      {/* Featured Music Pack Section (Ambient Blur Effect) */}
      {featuredPack && (
        <section className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Disc className="text-sky-500" size={24}/> Featured Music Pack
            </h2>
            
            <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl group">
                {/* 1. Ambient Background Layer */}
                <div className="absolute inset-0 z-0">
                    <img 
                        src={featuredPack.cover_url} 
                        alt="" 
                        className="w-full h-full object-cover blur-[80px] scale-125 opacity-70 dark:opacity-50 brightness-75 transition-transform duration-[20s] ease-in-out group-hover:scale-150"
                        aria-hidden="true"
                    />
                    {/* Gradient Overlay for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent" />
                </div>

                {/* 2. Content Layer */}
                <div className="relative z-10 p-8 md:p-14 flex flex-col md:flex-row items-center gap-10 md:gap-16">
                    {/* Sharp Cover Image */}
                    <img 
                        src={featuredPack.cover_url} 
                        alt={featuredPack.title} 
                        className="w-64 h-64 md:w-80 md:h-80 object-cover rounded-xl shadow-2xl rotate-3 group-hover:rotate-0 transition-all duration-500 border border-white/10"
                    />

                    {/* Text & Actions */}
                    <div className="text-center md:text-left text-white flex-1">
                        <div className="inline-block px-3 py-1 rounded-full border border-white/30 bg-white/10 backdrop-blur-md text-xs font-bold uppercase tracking-widest mb-4">
                            Premium Collection
                        </div>
                        <h3 className="text-3xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tight drop-shadow-lg leading-tight">
                            {featuredPack.title}
                        </h3>
                        
                        {/* Description */}
                        {featuredPack.description && (
                            <p className="text-lg opacity-80 mb-8 max-w-2xl mx-auto md:mx-0 font-medium leading-relaxed drop-shadow-sm line-clamp-3">
                                {featuredPack.description}
                            </p>
                        )}
                        
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                            <Link 
                                to={`/music-packs/${featuredPack.id}`} 
                                className="bg-white text-black hover:bg-gray-100 px-8 py-3.5 rounded-full font-bold transition-all transform hover:-translate-y-1 shadow-lg hover:shadow-xl flex items-center gap-2"
                            >
                                <Disc size={20}/> View Pack
                            </Link>
                            <Link 
                                to="/music-packs" 
                                className="px-8 py-3.5 rounded-full font-bold border border-white/30 hover:bg-white/10 backdrop-blur-sm transition-colors flex items-center gap-2"
                            >
                                View All Packs <ArrowRight size={18}/>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
      )}

      {/* Media Themes Section (New - Randomized) */}
      {mediaThemes.length > 0 && (
        <section className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Clapperboard className="text-sky-500" size={24}/> Browse by Media Theme
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {mediaThemes.map(theme => (
                    <Link 
                        key={theme.id}
                        to={`/library?search=${encodeURIComponent(theme.title)}`}
                        className="group relative h-48 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all hover:-translate-y-1"
                    >
                        <img 
                            src={theme.media_theme_pic} 
                            alt={theme.title} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                        <div className="absolute bottom-0 left-0 p-6 w-full">
                            <h3 className="text-white font-bold text-xl drop-shadow-md">{theme.title}</h3>
                            <span className="text-white/80 text-xs font-medium uppercase tracking-wider mt-1 inline-flex items-center gap-1 group-hover:text-sky-300 transition-colors">
                                Explore <ArrowRight size={12}/>
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
      )}

      {/* Trending Section */}
      <section className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">Trending Now</h2>
        {/* Changed layout to 2 columns (grid-cols-1 lg:grid-cols-2) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {trendingTracks.map((track) => {
             const isCurrent = currentTrack?.id === track.id;
             return (
              <div 
                key={track.id} 
                className={`
                  flex items-center gap-4 p-3 rounded-lg border transition hover:shadow-md
                  ${isDarkMode ? 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800' : 'bg-white border-zinc-100 hover:bg-sky-50'}
                  ${isCurrent && isPlaying ? 'border-sky-500' : ''}
                `}
              >
                {/* Cover & Play */}
                <div 
                    className="relative w-12 h-12 flex-shrink-0 cursor-pointer rounded overflow-hidden"
                    onClick={() => playTrack(track)}
                >
                    <img src={track.cover_url} alt={track.title} className="w-full h-full object-cover" />
                    <div className={`absolute inset-0 bg-black/30 flex items-center justify-center ${isCurrent && isPlaying ? 'opacity-100' : 'opacity-0 hover:opacity-100'}`}>
                        {isCurrent && isPlaying ? <div className="w-3 h-3 bg-sky-400 rounded-full animate-pulse"/> : <Play size={20} className="text-white fill-white"/>}
                    </div>
                </div>

                {/* Info Fixed Width */}
                <div className="w-32 sm:w-48 lg:w-40 xl:w-64 min-w-0">
                  <Link to={`/track/${track.id}`} className="font-bold truncate block hover:text-sky-500">{track.title}</Link>
                  <div className="flex items-center gap-2 text-xs opacity-70">
                    <span className="truncate">{track.artist_name}</span>
                    {track.genre && track.genre.length > 0 && (
                        <>
                            <span className="hidden sm:inline">•</span>
                            <span className="hidden sm:inline bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-300 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wide">{track.genre[0]}</span>
                        </>
                    )}
                  </div>
                </div>

                {/* Waveform - Takes remaining space */}
                <div className="hidden sm:flex flex-1 h-full items-center px-4">
                    <WaveformVisualizer track={track} height="h-8" barCount={80} />
                </div>

                {/* Duration */}
                <div className="text-sm font-mono opacity-60 w-12 text-right">
                    {track.duration ? `${Math.floor(track.duration / 60)}:${(track.duration % 60).toString().padStart(2, '0')}` : '-'}
                </div>

                <a 
                  href={track.gumroad_link || '#'} 
                  className={`p-2 rounded-full transition flex-shrink-0 ${isDarkMode ? 'bg-zinc-800 hover:bg-sky-600' : 'bg-gray-100 hover:bg-sky-500 hover:text-white'}`}
                >
                  <ShoppingCart size={18} />
                </a>
              </div>
            );
          })}
        </div>
      </section>

      {/* Gumroad Subscribe Section */}
      <section className="container mx-auto px-4 py-8">
        <div className={`relative overflow-hidden rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 border ${isDarkMode ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-xl'}`}>

            {/* Background Icon */}
            <div className="absolute -right-16 -bottom-16 pointer-events-none">
                <img
                    src="https://pub-2da555791ab446dd9afa8c2352f4f9ea.r2.dev/media/gumroad-icon.svg"
                    alt="Gumroad"
                    className="w-64 h-64 opacity-10 transform rotate-12"
                />
            </div>

            <div className="relative z-10 max-w-xl text-center md:text-left">
                <h2 className="text-2xl font-bold mb-3 flex items-center justify-center md:justify-start gap-2">
                    <Mail className="text-sky-500"/> Subscribe for Updates
                </h2>
                <p className={`text-lg leading-relaxed ${isDarkMode ? 'text-zinc-400' : 'text-zinc-600'}`}>
                    We partner with <strong>Gumroad</strong> to ensure 100% secure licensing transactions and instant file delivery. Subscribe to get notified about new releases.
                </p>
            </div>

            <form action="https://gumroad.com/follow_from_embed_form" method="post" className="relative z-10 flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <input type="hidden" name="seller_id" value="7452302198752"/>
                <input
                    id="gumroad-follow-form-embed-input"
                    type="email"
                    placeholder="Your email address"
                    name="email"
                    className={`px-5 py-3.5 rounded-xl outline-none border-2 transition-all w-full sm:w-72 ${isDarkMode ? 'bg-black border-zinc-700 focus:border-sky-500 text-white' : 'bg-gray-50 border-gray-200 focus:border-sky-500 text-black'}`}
                />
                <button type="submit" className="bg-sky-600 hover:bg-sky-500 text-white px-8 py-3.5 rounded-xl font-bold transition shadow-md hover:shadow-lg whitespace-nowrap">
                    Follow on Gumroad
                </button>
            </form>
        </div>
      </section>

      {/* Clients Carousel */}
      <section className="container mx-auto px-4 py-10 overflow-hidden">
        <h3 className="text-center text-sm uppercase tracking-widest opacity-50 mb-8 font-bold">Trusted By</h3>
        <div className="flex justify-center flex-wrap gap-8 md:gap-16 items-center grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all duration-500">
          {clients.length > 0 ? clients.map(client => (
            <img key={client.id} src={client.logo_url} alt={client.name} className="h-12 w-auto object-contain" />
          )) : (
            // Fallback if no clients in DB yet
            [1,2,3,4,5].map(i => <div key={i} className="h-8 w-32 bg-current rounded animate-pulse opacity-20"></div>)
          )}
        </div>
      </section>

    </div>
  );
};