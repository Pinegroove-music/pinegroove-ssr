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
import { Menu, Search } from 'lucide-react';
import { SEO } from './components/SEO';

const Layout: React.FC = () => {
  const { isDarkMode } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Ref for the scrollable main container
  const mainContentRef = useRef<HTMLDivElement>(null);

  // Scroll logic
  useEffect(() => {
    const handleScroll = () => {
      if (mainContentRef.current) {
        // Check if scrolled more than 50px
        setIsScrolled(mainContentRef.current.scrollTop > 50);
      }
    };

    const mainContainer = mainContentRef.current;
    if (mainContainer) {
      mainContainer.addEventListener('scroll', handleScroll);
    }

    // Scroll to top on route change
    if (mainContainer) {
        mainContainer.scrollTo(0, 0);
        setIsScrolled(false); // Reset scroll state
    }

    return () => {
      if (mainContainer) {
        mainContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, [location.pathname]);

  const handleGlobalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (globalSearch.trim()) {
      navigate(`/library?search=${encodeURIComponent(globalSearch)}`);
    }
  };

  // Determine pages configuration
  const isHomePage = location.pathname === '/';
  const isCategoryPage = location.pathname.startsWith('/categories/');
  const isContentIdPage = location.pathname === '/content-id';
  const isAboutPage = location.pathname === '/about';
  const isFaqPage = location.pathname === '/faq';
  
  // Pages where search bar content (the input itself) should be hidden
  const hideSearchBarContent = isCategoryPage || isContentIdPage || isAboutPage || isFaqPage;
  
  // Pages where the header CONTAINER is hidden completely to gain space at top
  // On Desktop: Hide completely. On Mobile: We might need it for the menu button.
  const shouldHideHeaderFrame = isContentIdPage || isCategoryPage || isAboutPage || isFaqPage;

  // Header Style Logic
  // 1. If shouldHideHeaderFrame -> Hidden/Transparent (Desktop) or Transparent (Mobile)
  // 2. If Home Page -> Absolute & Transparent initially, then Standard on scroll
  // 3. Else -> Standard Fixed/Sticky
  
  let headerClasses = `p-4 flex items-center gap-4 transition-all duration-500 z-30 `;
  
  if (shouldHideHeaderFrame) {
      headerClasses += 'md:hidden border-transparent absolute w-full bg-transparent pointer-events-none ';
  } else if (isHomePage) {
      if (isScrolled) {
          // Stronger glass effect: 50% opacity + xl blur
          headerClasses += `sticky top-0 border-b ${isDarkMode ? 'bg-zinc-950/50 border-zinc-800' : 'bg-white/50 border-zinc-100'} backdrop-blur-xl shadow-sm `;
      } else {
          headerClasses += 'absolute top-0 w-full bg-transparent border-transparent ';
      }
  } else {
      // Standard pages (Library, etc)
      headerClasses += `sticky top-0 border-b ${isDarkMode ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-zinc-100'} `;
  }

  // Hide footer on Library page
  const showFooter = location.pathname !== '/library';

  return (
    <div className={`min-h-screen flex transition-colors duration-300 ${isDarkMode ? 'dark bg-zinc-950 text-zinc-100' : 'bg-white text-zinc-900'}`}>
      
      {/* GLOBAL DEFAULT SEO */}
      <SEO 
        title="Royalty Free Music Library" 
        description="Pinegroove offers a catalog of high-quality, royalty-free stock music perfect for videos, YouTube, social media, TV, and web projects. Find your perfect soundtrack here." 
      />

      {/* Sidebar */}
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* Top Header */}
        <header className={headerClasses}>
           <button 
                onClick={() => setMobileOpen(true)} 
                className={`md:hidden p-2 flex-shrink-0 rounded-md pointer-events-auto ${isHomePage && !isScrolled ? 'bg-black/20 text-white backdrop-blur-sm' : ''}`}
            >
              <Menu size={24} />
           </button>
           
           {/* Global Search Bar */}
           {!hideSearchBarContent && (
             <form 
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
                  className={`
                    w-full pl-10 pr-4 py-2.5 rounded-full text-sm outline-none border transition shadow-sm
                    ${isDarkMode 
                      ? 'bg-zinc-900/80 border-zinc-800 focus:border-sky-500 placeholder-zinc-500 text-white' 
                      : 'bg-zinc-100/80 border-zinc-200 focus:border-sky-400 placeholder-zinc-400 text-black'}
                  `}
                />
             </form>
           )}
        </header>

        {/* Scrollable Page Content */}
        <main ref={mainContentRef} className="flex-1 overflow-y-auto scroll-smooth relative">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/library" element={<Library />} />
            <Route path="/categories/genres" element={<GenresPage />} />
            <Route path="/categories/moods" element={<MoodsPage />} />
            <Route path="/categories/seasonal" element={<SeasonalPage />} />
            <Route path="/categories/instruments" element={<InstrumentsPage />} />
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

        {/* Cookie Consent Banner */}
        <CookieConsent />

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