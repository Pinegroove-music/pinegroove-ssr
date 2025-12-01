import React, { useEffect, useState } from 'react';
import { MusicTrack, Client } from '../types';
import { supabase } from '../services/supabase';
import { useStore } from '../store/useStore';
import { Search, Play, ShoppingCart, Pause, ArrowRight, Sparkles, FileCheck, ShieldCheck, Lock } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { WaveformVisualizer } from '../components/WaveformVisualizer';

export const Home: React.FC = () => {
  const [discoverTracks, setDiscoverTracks] = useState<MusicTrack[]>([]);
  const [trendingTracks, setTrendingTracks] = useState<MusicTrack[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { isDarkMode, playTrack, currentTrack, isPlaying } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      // Fetch random tracks for discover (simulated random via shuffle)
      const { data: allTracks } = await supabase.from('music_tracks').select('*').limit(50);
      if (allTracks) {
        const shuffled = [...allTracks].sort(() => 0.5 - Math.random());
        setDiscoverTracks(shuffled.slice(0, 12));
      }

      // Fetch trending (just limit 10 for now)
      const { data: trending } = await supabase.from('music_tracks').select('*').limit(10);
      if (trending) setTrendingTracks(trending);

      // Fetch clients
      const { data: clientData } = await supabase.from('clients').select('*');
      if (clientData) setClients(clientData);
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
                High-Quality Royalty-Free Music for Videos and Media
            </h1>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto font-medium drop-shadow-sm">
                Premium stock music for your films, videos, and commercial projects.
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
          <span className="text-sky-500">✦</span> Discover
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

      {/* Trending Section */}
      <section className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">Trending Now</h2>
        <div className="space-y-2">
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
                <div className="w-48 md:w-64 min-w-0">
                  <Link to={`/track/${track.id}`} className="font-bold truncate block hover:text-sky-500">{track.title}</Link>
                  <div className="flex items-center gap-2 text-xs opacity-70">
                    <span className="truncate">{track.artist_name}</span>
                    {track.genre && track.genre.length > 0 && (
                        <>
                            <span>•</span>
                            <span className="bg-sky-100 text-sky-800 dark:bg-sky-900 dark:text-sky-300 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wide">{track.genre[0]}</span>
                        </>
                    )}
                  </div>
                </div>

                {/* Waveform - Takes remaining space - Increased barCount for finer look */}
                <div className="hidden md:flex flex-1 h-full items-center px-4">
                    <WaveformVisualizer track={track} height="h-8" barCount={100} />
                </div>

                {/* Duration */}
                <div className="text-sm font-mono opacity-60 w-12 text-right">
                    {track.duration ? `${Math.floor(track.duration / 60)}:${(track.duration % 60).toString().padStart(2, '0')}` : '-'}
                </div>

                <a 
                  href={track.gumroad_link || '#'} 
                  className={`p-2 rounded-full transition ${isDarkMode ? 'bg-zinc-800 hover:bg-sky-600' : 'bg-gray-100 hover:bg-sky-500 hover:text-white'}`}
                >
                  <ShoppingCart size={18} />
                </a>
              </div>
            );
          })}
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
