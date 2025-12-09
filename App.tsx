import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Player } from './components/Player';
import { Footer } from './components/Footer';
import { CookieConsent } from './components/CookieConsent';
import { Home } from './pages/Home';
import { Library } from './pages/Library';
import { TrackDetail } from './pages/TrackDetail';
import { MusicPacks } from './pages/MusicPacks';
import { MusicPackDetail } from './pages/MusicPackDetail';
import { About } from './pages/About';
import { Faq } from './pages/Faq';
import { ContentId } from './pages/ContentId';
import { GenresPage } from './pages/GenresPage';
import { MoodsPage } from './pages/MoodsPage';
import { SeasonalPage } from './pages/SeasonalPage';
import { InstrumentsPage } from './pages/InstrumentsPage';
import { useStore } from './store/useStore';
import { Menu, Search, Music, User, X } from 'lucide-react';
import { SEO } from './components/SEO';
import { supabase } from './services/supabase';
import { createSlug } from './utils/slugUtils';

const Layout: React.FC = () => {
  const { isDarkMode } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  
  // Suggestion State
  const [suggestions, setSuggestions] = useState<{type: 'track' | 'artist', text: string, id?: number}[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Refs
  const mainContentRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLFormElement>(null);
  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Scroll logic
  useEffect(() => {
    const handleScroll = () => {
      if (mainContentRef.current) {
        setIsScrolled(mainContentRef.current.scrollTop > 50);
      }
    };

    const mainContainer = mainContentRef.current;
    if (mainContainer) {
      mainContainer.addEventListener('scroll', handleScroll);
    }

    if (mainContainer) {
        mainContainer.scrollTo(0, 0);
        setIsScrolled(false);
    }

    return () => {
      if (mainContainer) {
        mainContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, [location.pathname]);

  // Click Outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
            setShowSuggestions(false);
        }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch Suggestions Logic
  useEffect(() => {
      if (debounceTimeoutRef.current) {
          clearTimeout(debounceTimeoutRef.current);
      }

      if (globalSearch.length < 2) {
          setSuggestions([]);
          setShowSuggestions(false);
          return;
      }

      debounceTimeoutRef.current = setTimeout(async () => {
          const query = globalSearch.trim();
          
          // Parallel fetch for Titles and Artists
          const [titlesRes, artistsRes] = await Promise.all([
             supabase.from('music_tracks').select('id, title').ilike('title', `%${query}%`).limit(4),
             supabase.from('music_tracks').select('artist_name').ilike('artist_name', `%${query}%`).limit(2)
          ]);

          const newSuggestions: {type: 'track' | 'artist', text: string, id?: number}[] = [];
          const uniqueKeys = new Set<string>();

          // Add Titles
          if (titlesRes.data) {
              titlesRes.data.forEach(t => {
                  if (!uniqueKeys.has(t.title)) {
                      uniqueKeys.add(t.title);
                      newSuggestions.push({ type: 'track', text: t.title, id: t.id });
                  }
              });
          }

          // Add Artists
          if (artistsRes.data) {
              artistsRes.data.forEach(a => {
                  if (!uniqueKeys.has(a.artist_name)) {
                      uniqueKeys.add(a.artist_name);
                      newSuggestions.push({ type: 'artist', text: a.artist_name });
                  }
              });
          }

          setSuggestions(newSuggestions);
          setShowSuggestions(newSuggestions.length > 0);

      }, 300); // 300ms delay

      return () => {
          if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current);
      };
  }, [globalSearch]);

  const handleGlobalSearch = (e: React.FormEvent, overrideQuery?: string) => {
    e.preventDefault();
    const queryToUse = overrideQuery || globalSearch;
    
    if (queryToUse.trim()) {
      setShowSuggestions(false);
      navigate(`/library?search=${encodeURIComponent(queryToUse)}`);
      setGlobalSearch(queryToUse);
    }
  };

  const handleSuggestionClick = (item: {type: 'track' | 'artist', text: string, id?: number}) => {
      if (item.type === 'track' && item.id) {
          // If clicking a specific track suggestion, go directly to track page with slug
          navigate(`/track/${createSlug(item.id, item.text)}`);
          setGlobalSearch('');
          setShowSuggestions(false);
      } else {
          // Otherwise search library
          setGlobalSearch(item.text);
          handleGlobalSearch({ preventDefault: () => {} } as React.FormEvent, item.text);
      }
  };

  // Determine pages configuration
  const isHomePage = location.pathname === '/';
  const isCategoryPage = location.pathname.startsWith('/categories/');
  const isContentIdPage = location.pathname === '/content-id';
  const isAboutPage = location.pathname === '/about';
  const isFaqPage = location.pathname === '/faq';
  
  const hideSearchBarContent = isCategoryPage || isContentIdPage || isAboutPage || isFaqPage;
  const shouldHideHeaderFrame = isContentIdPage || isCategoryPage || isAboutPage || isFaqPage;

  let headerClasses = `p-4 flex items-center gap-4 transition-all duration-500 z-30 `;
  
  if (shouldHideHeaderFrame) {
      headerClasses += 'md:hidden border-transparent absolute w-full bg-transparent pointer-events-none ';
  } else if (isHomePage) {
      if (isScrolled) {
          headerClasses += `sticky top-0 border-b ${isDarkMode ? 'bg-zinc-950/50 border-zinc-800' : 'bg-white/50 border-zinc-100'} backdrop-blur-xl shadow-sm `;
      } else {
          headerClasses += 'absolute top-0 w-full bg-transparent border-transparent ';
      }
  } else {
      headerClasses += `sticky top-0 border-b ${isDarkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-zinc-100'} `;
  }

  const showFooter = location.pathname !== '/library';

  return (
    <div className={`min-h-screen flex transition-colors duration-300 ${isDarkMode ? 'dark bg-zinc-950 text-zinc-100' : 'bg-white text-zinc-900'}`}>
      
      <SEO 
        title="Royalty Free Music Library" 
        description="Pinegroove offers a catalog of high-quality, royalty-free stock music perfect for videos, YouTube, social media, TV, and web projects. Find your perfect soundtrack here." 
      />

      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        <header className={headerClasses}>
           <button 
                onClick={() => setMobileOpen(true)} 
                className={`md:hidden p-2 flex-shrink-0 rounded-md pointer-events-auto ${isHomePage && !isScrolled ? 'bg-black/20 text-white backdrop-blur-sm' : ''}`}
            >
              <Menu size={24} />
           </button>
           
           {!hideSearchBarContent && (
             <form 
                ref={searchContainerRef}
                onSubmit={handleGlobalSearch} 
                className={`
                    flex-1 max-w-5xl mx-auto relative w-full transition-all duration-500
                    ${isHomePage && !isScrolled ? 'opacity-0 translate-y-[-20px] pointer-events-none' : 'opacity-100 translate-y-0'}
                `}
             >
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 opacity-40" size={18} />
                <input 
                  type="text" 
                  placeholder="Search tracks, tags, artists, moods..." 
                  value={globalSearch}
                  onChange={(e) => setGlobalSearch(e.target.value)}
                  onFocus={() => { if(suggestions.length > 0) setShowSuggestions(true); }}
                  className={`
                    w-full pl-10 pr-10 py-2.5 rounded-full text-sm outline-none border transition shadow-sm
                    ${isDarkMode 
                      ? 'bg-zinc-900/80 border-zinc-800 focus:border-sky-500 placeholder-zinc-500 text-white' 
                      : 'bg-zinc-100/80 border-zinc-200 focus:border-sky-400 placeholder-zinc-400 text-black'}
                  `}
                />
                
                {/* Clear Button */}
                {globalSearch && (
                    <button 
                        type="button"
                        onClick={() => { setGlobalSearch(''); setSuggestions([]); setShowSuggestions(false); }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 opacity-40 hover:opacity-100"
                    >
                        <X size={16} />
                    </button>
                )}

                {/* Suggestions Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                    <div className={`
                        absolute top-full left-0 right-0 mt-2 rounded-xl border shadow-xl overflow-hidden z-50
                        ${isDarkMode ? 'bg-zinc-900 border-zinc-700' : 'bg-white border-zinc-200'}
                    `}>
                        <ul>
                            {suggestions.map((item, index) => (
                                <li key={index}>
                                    <button
                                        type="button"
                                        onClick={() => handleSuggestionClick(item)}
                                        className={`
                                            w-full text-left px-4 py-3 flex items-center gap-3 text-sm transition-colors
                                            ${isDarkMode ? 'hover:bg-zinc-800 text-zinc-300 hover:text-white' : 'hover:bg-sky-50 text-zinc-700 hover:text-sky-700'}
                                        `}
                                    >
                                        <span className={`opacity-50 ${isDarkMode ? 'text-zinc-500' : 'text-zinc-400'}`}>
                                            {item.type === 'track' ? <Music size={14} /> : <User size={14} />}
                                        </span>
                                        <span className="font-medium truncate">{item.text}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
             </form>
           )}
        </header>

        <main 
            id="main-content"
            ref={mainContentRef} 
            className="flex-1 overflow-y-auto scroll-smooth relative"
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/library" element={<Library />} />
            <Route path="/categories/genres" element={<GenresPage />} />
            <Route path="/categories/moods" element={<MoodsPage />} />
            <Route path="/categories/seasonal" element={<SeasonalPage />} />
            <Route path="/categories/instruments" element={<InstrumentsPage />} />
            {/* Updated Routes to use :slug */}
            <Route path="/track/:slug" element={<TrackDetail />} />
            <Route path="/music-packs" element={<MusicPacks />} />
            <Route path="/music-packs/:slug" element={<MusicPackDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/content-id" element={<ContentId />} />
          </Routes>
          
          {showFooter && <Footer />}
        </main>

        <CookieConsent />
        <Player />
        
      </div>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Layout />
    </Router>
  );
};

export default App;