import React, { useState, useEffect, useRef } from 'react';
import { HashRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Player } from './components/Player';
import { Footer } from './components/Footer';
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
import { useStore } from './store/useStore';
import { Menu, Search } from 'lucide-react';

const Layout: React.FC = () => {
  const { isDarkMode } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  
  // Ref for the scrollable main container
  const mainContentRef = useRef<HTMLDivElement>(null);

  // Scroll to top whenever the path changes
  useEffect(() => {
    if (mainContentRef.current) {
      mainContentRef.current.scrollTo(0, 0);
    }
  }, [location.pathname]);

  const handleGlobalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (globalSearch.trim()) {
      navigate(`/library?search=${encodeURIComponent(globalSearch)}`);
    }
  };

  // Hide search bar on specific category pages
  const hideSearchBar = location.pathname.startsWith('/categories/');
  
  // Hide footer on Library page
  const showFooter = location.pathname !== '/library';

  return (
    <div className={`min-h-screen flex transition-colors duration-300 ${isDarkMode ? 'dark bg-zinc-950 text-zinc-100' : 'bg-white text-zinc-900'}`}>
      
      {/* Sidebar */}
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* Top Header: Mobile Menu + Global Search */}
        <header className={`p-4 flex items-center gap-4 border-b min-h-[73px] ${isDarkMode ? 'border-zinc-800 bg-zinc-950' : 'border-zinc-100 bg-white'}`}>
           <button onClick={() => setMobileOpen(true)} className="md:hidden p-2 flex-shrink-0">
              <Menu size={24} />
           </button>
           
           {/* Global Search Bar - Hidden on category pages */}
           {!hideSearchBar && (
             <form onSubmit={handleGlobalSearch} className="flex-1 max-w-5xl mx-auto relative w-full animate-in fade-in duration-300">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 opacity-40" size={18} />
                <input 
                  type="text" 
                  placeholder="Search tracks, tags, artists, moods..." 
                  value={globalSearch}
                  onChange={(e) => setGlobalSearch(e.target.value)}
                  className={`
                    w-full pl-10 pr-4 py-2.5 rounded-full text-sm outline-none border transition
                    ${isDarkMode 
                      ? 'bg-zinc-900 border-zinc-800 focus:border-sky-500 placeholder-zinc-500 text-white' 
                      : 'bg-zinc-100 border-zinc-200 focus:border-sky-400 placeholder-zinc-400 text-black'}
                  `}
                />
             </form>
           )}
        </header>

        {/* Scrollable Page Content */}
        <main ref={mainContentRef} className="flex-1 overflow-y-auto scroll-smooth">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/library" element={<Library />} />
            <Route path="/categories/genres" element={<GenresPage />} />
            <Route path="/categories/moods" element={<MoodsPage />} />
            <Route path="/categories/seasonal" element={<SeasonalPage />} />
            <Route path="/track/:id" element={<TrackDetail />} />
            <Route path="/music-packs" element={<MusicPacks />} />
            <Route path="/music-packs/:id" element={<MusicPackDetail />} />
            <Route path="/about" element={<About />} />
            <Route path="/faq" element={<Faq />} />
            <Route path="/content-id" element={<ContentId />} />
          </Routes>
          
          {/* Footer Component - Conditionally rendered */}
          {showFooter && <Footer />}
        </main>

        {/* Persistent Player */}
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