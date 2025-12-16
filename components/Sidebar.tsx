import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Library, Info, HelpCircle, ShieldAlert, Music, X, Sun, Moon, ChevronLeft, ChevronRight, TicketPercent, Copy, Check } from 'lucide-react';
import { useStore } from '../store/useStore';

export const Sidebar: React.FC<{ mobileOpen: boolean; setMobileOpen: (open: boolean) => void }> = ({ mobileOpen, setMobileOpen }) => {
  const { isDarkMode, toggleTheme } = useStore();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [copied, setCopied] = useState(false);

  const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Library', path: '/library', icon: Library },
    { label: 'Music Packs', path: '/music-packs', icon: Music },
    { label: 'About', path: '/about', icon: Info },
    { label: 'Content ID', path: '/content-id', icon: ShieldAlert },
    { label: 'FAQ', path: '/faq', icon: HelpCircle },
  ];

  const sidebarClasses = `
    fixed inset-y-0 left-0 z-40 transform transition-all duration-300 ease-in-out
    ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} 
    md:translate-x-0 md:static md:inset-0
    ${collapsed ? 'md:w-20' : 'md:w-64'} w-64
    ${isDarkMode ? 'bg-zinc-950 border-zinc-900 text-zinc-300' : 'bg-gray-100 border-gray-200 text-zinc-800'}
    border-r flex flex-col pb-24 shadow-md z-50
  `;

  // Helper to render progressive text
  const renderProgressiveText = (text: string, baseColor: string, startIndex: number) => {
    return text.split('').map((char, index) => (
      <span 
        key={index}
        className={`transition-colors duration-300 group-hover:text-sky-400 ${baseColor}`}
        style={{ transitionDelay: `${(startIndex + index) * 35}ms` }}
      >
        {char}
      </span>
    ));
  };

  const handleLogoClick = () => {
    setMobileOpen(false);
    const mainContainer = document.getElementById('main-content');
    if (mainContainer) {
        mainContainer.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText('LATL4Z9');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside className={sidebarClasses}>
        {/* Header - Left Aligned to match nav items (pl-3) */}
        <div className={`py-6 pl-3 pr-3 flex items-center relative h-20 ${collapsed ? 'justify-center pl-0 pr-0' : ''}`}>
          <Link 
            to="/" 
            onClick={handleLogoClick}
            className="flex items-center gap-1 group overflow-hidden"
          >
            {/* Custom Logo - Rotate on Hover */}
            <img 
                src="https://pub-2da555791ab446dd9afa8c2352f4f9ea.r2.dev/media/logo-pinegroove.svg?v=2" 
                alt="Pinegroove Logo" 
                className="w-12 h-12 object-contain transition-transform duration-500 group-hover:rotate-12 flex-shrink-0"
            />
            {!collapsed && (
                // Text - Progressive Illumination with Archivo Black Font
                <span className="font-archivo uppercase text-xl tracking-tight origin-left whitespace-nowrap flex">
                    {renderProgressiveText("PINE", "text-black dark:text-white", 0)}
                    {renderProgressiveText("GROOVE", "text-[#0288c4]", 4)}
                </span>
            )}
          </Link>
          <button onClick={() => setMobileOpen(false)} className="md:hidden absolute right-4">
            <X size={24} />
          </button>

          {/* Desktop Collapse Toggle */}
          <button 
                onClick={() => setCollapsed(!collapsed)}
                className={`hidden md:flex absolute -right-3 top-7 w-6 h-6 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-full items-center justify-center text-zinc-500 hover:text-sky-500 shadow-sm z-50`}
            >
                {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto overflow-x-hidden no-scrollbar">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`
                  flex items-center gap-3 px-3 py-3 rounded-lg transition-colors
                  ${isActive 
                    ? (isDarkMode ? 'bg-sky-900/20 text-sky-400' : 'bg-white text-sky-700 shadow-sm') 
                    : (isDarkMode ? 'hover:bg-zinc-900 text-zinc-400 hover:text-zinc-100' : 'hover:bg-gray-200/50')}
                  ${collapsed ? 'justify-center' : ''}
                `}
                title={collapsed ? item.label : ''}
              >
                <Icon size={22} className="flex-shrink-0" />
                {!collapsed && <span className="font-medium whitespace-nowrap">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* PROMO CODE CARD */}
        {!collapsed && (
            <div className="px-3 pb-4">
                <div className="p-4 rounded-xl bg-gradient-to-br from-red-600 to-rose-700 text-white shadow-lg relative overflow-hidden group border border-white/10 transition-all duration-300 hover:shadow-red-600/40 hover:-translate-y-1">
                    {/* Decorative Blur with Animation */}
                    <div className="absolute -top-10 -right-10 w-24 h-24 bg-white/20 rounded-full blur-2xl pointer-events-none transition-all duration-700 group-hover:scale-[2.5] group-hover:bg-white/10"></div>
                    
                    {/* Subtle shine on hover */}
                     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                    <div className="flex items-center gap-2 mb-1 relative z-10">
                        <TicketPercent size={18} className="text-white group-hover:rotate-12 transition-transform duration-300" />
                        <span className="font-bold text-xs tracking-wider uppercase text-red-100">Limited Offer</span>
                    </div>

                    <p className="text-xs text-white/90 mb-3 leading-relaxed relative z-10 font-medium">
                        Get <span className="font-bold text-white text-sm">50% OFF</span> all licenses until <span className="underline decoration-white/30 underline-offset-2">Jan 4, 2026</span>. use code:
                    </p>

                    <button
                        onClick={handleCopyCode}
                        className="w-full relative z-10 bg-black/20 hover:bg-black/30 border border-white/20 rounded-lg p-2 flex items-center justify-between transition-all active:scale-95 group/btn"
                        title="Click to copy code"
                    >
                        <span className="font-mono font-bold tracking-wider ml-1 text-sm group-hover/btn:text-white transition-colors">LATL4Z9</span>
                        <div className="flex items-center gap-1">
                            {copied ? (
                                <span className="text-[10px] font-bold bg-white text-red-600 px-1.5 py-0.5 rounded animate-in fade-in zoom-in">Copied!</span>
                            ) : (
                                <Copy size={16} className="text-white/80 group-hover/btn:text-white transition-transform group-hover/btn:scale-110" />
                            )}
                        </div>
                    </button>
                </div>
            </div>
        )}

        {/* Theme Toggle Button - Now at the bottom */}
        <div className={`p-4 border-t ${isDarkMode ? 'border-zinc-900' : 'border-zinc-300'}`}>
            <button 
                onClick={toggleTheme}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-zinc-900 text-zinc-400 hover:text-white' : 'hover:bg-gray-200/50 text-zinc-600 hover:text-black'} ${collapsed ? 'justify-center' : ''}`}
                title={collapsed ? (isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode') : ''}
            >
                {isDarkMode ? <Sun size={22} className="flex-shrink-0" /> : <Moon size={22} className="flex-shrink-0" />}
                {!collapsed && <span className="font-medium whitespace-nowrap">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>}
            </button>
        </div>
      </aside>
    </>
  );
};