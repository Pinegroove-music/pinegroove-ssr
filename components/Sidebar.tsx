import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Library, Info, HelpCircle, ShieldAlert, Music, X, Sun, Moon } from 'lucide-react';
import { useStore } from '../store/useStore';

export const Sidebar: React.FC<{ mobileOpen: boolean; setMobileOpen: (open: boolean) => void }> = ({ mobileOpen, setMobileOpen }) => {
  const { isDarkMode, toggleTheme } = useStore();
  const location = useLocation();

  const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Libreria', path: '/library', icon: Library },
    { label: 'Music Packs', path: '/music-packs', icon: Music },
    { label: 'About', path: '/about', icon: Info },
    { label: 'Content ID', path: '/content-id', icon: ShieldAlert },
    { label: 'FAQ', path: '/faq', icon: HelpCircle },
  ];

  const sidebarClasses = `
    fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out
    ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} 
    md:translate-x-0 md:static md:inset-0
    ${isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-800'}
    border-r flex flex-col
  `;

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
        <div className="p-6 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-3 font-bold text-2xl tracking-tight">
            {/* Custom Logo in Circle - Maximized Logo Size */}
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm ${isDarkMode ? 'bg-sky-500' : 'bg-sky-600'}`}>
                <img 
                    src="https://pub-2da555791ab446dd9afa8c2352f4f9ea.r2.dev/media/logo-pinegroove.svg?v=3" 
                    alt="Pinegroove Logo" 
                    className="w-8 h-8 object-contain"
                />
            </div>
            <span>Pinegroove</span>
          </Link>
          <button onClick={() => setMobileOpen(false)} className="md:hidden">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                  ${isActive 
                    ? (isDarkMode ? 'bg-sky-900/30 text-sky-400' : 'bg-sky-100 text-sky-700') 
                    : (isDarkMode ? 'hover:bg-zinc-800' : 'hover:bg-zinc-100')}
                `}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Theme Toggle Button */}
        <div className={`p-4 border-t ${isDarkMode ? 'border-zinc-800' : 'border-zinc-200'}`}>
            <button 
                onClick={toggleTheme}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-zinc-800 text-zinc-400 hover:text-white' : 'hover:bg-zinc-100 text-zinc-600 hover:text-black'}`}
            >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                <span className="font-medium">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
        </div>

        <div className="p-4 text-xs opacity-60 text-center">
          &copy; {new Date().getFullYear()} Pinegroove
        </div>
      </aside>
    </>
  );
};