import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Youtube, Facebook, Instagram, Clapperboard, Mail, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  const { isDarkMode } = useStore();

  const menuLinks = [
    { label: 'Home', path: '/' },
    { label: 'Library', path: '/library' },
    { label: 'Music Packs', path: '/music-packs' },
    { label: 'About', path: '/about' },
    { label: 'Content ID', path: '/content-id' },
    { label: 'FAQ', path: '/faq' },
  ];

  const browseLinks = [
    { label: 'Browse Genres', path: '/categories/genres' },
    { label: 'Browse Moods', path: '/categories/moods' },
    { label: 'Seasonal Themes', path: '/categories/seasonal' },
  ];

  return (
    <footer className={`
        w-full pt-16 pb-32 px-6 border-t mt-auto
        ${isDarkMode ? 'bg-zinc-900 border-zinc-800 text-zinc-300' : 'bg-sky-50 border-sky-100 text-zinc-600'}
    `}>
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        
        {/* Column 1: Brand */}
        <div className="space-y-4">
            <Link to="/" className="flex items-center gap-1 group w-fit">
                <span className="uppercase font-bold text-xl tracking-tight">
                    <span className="text-black dark:text-white">PINE</span>
                    <span className="text-[#0288c4]">GROOVE</span>
                </span>
            </Link>
            <p className="text-sm opacity-80 leading-relaxed max-w-xs">
                Premium stock music library. High-quality tracks for your video projects, podcasts, and media.
            </p>
        </div>

        {/* Column 2: Navigation */}
        <div>
            <h4 className={`font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-black'}`}>Menu</h4>
            <ul className="space-y-3 text-sm">
                {menuLinks.map((link) => (
                    <li key={link.path}>
                        <Link to={link.path} className="hover:text-sky-500 transition-colors">
                            {link.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>

        {/* Column 3: Browse */}
        <div>
            <h4 className={`font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-black'}`}>Discover</h4>
            <ul className="space-y-3 text-sm">
                {browseLinks.map((link) => (
                    <li key={link.path}>
                        <Link to={link.path} className="hover:text-sky-500 transition-colors">
                            {link.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </div>

        {/* Column 4: Connect */}
        <div>
            <h4 className={`font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-black'}`}>Connect</h4>
            
            <div className="flex gap-4 mb-8">
                <SocialLink href="https://www.instagram.com/pinegroovemusic/#" icon={<Instagram size={20}/>} label="Instagram" />
                <SocialLink href="https://www.youtube.com/channel/UCZKEnVJQ5Hs1Y3HSvoDihkQ" icon={<Youtube size={20}/>} label="YouTube" />
                <SocialLink href="https://www.facebook.com/pinegroovemusic/" icon={<Facebook size={20}/>} label="Facebook" />
                <SocialLink href="https://www.imdb.com/it/name/nm10556240" icon={<Clapperboard size={20}/>} label="IMDb" />
            </div>

            <div className="space-y-3 text-sm">
                <a href="mailto:info@pinegroove.net" className="flex items-center gap-2 hover:text-sky-500 transition-colors">
                    <Mail size={16} /> info@pinegroove.net
                </a>
                <div className="flex items-center gap-2 opacity-70">
                    <MapPin size={16} /> Rome, Italy
                </div>
            </div>
        </div>
      </div>

      <div className={`container mx-auto mt-16 pt-8 border-t text-center text-xs opacity-50 ${isDarkMode ? 'border-zinc-800' : 'border-zinc-300'}`}>
        &copy; {new Date().getFullYear()} Francesco Biondi / Pinegroove. All rights reserved.
      </div>
    </footer>
  );
};

const SocialLink: React.FC<{ href: string; icon: React.ReactNode; label: string }> = ({ href, icon, label }) => (
    <a 
        href={href} 
        target="_blank" 
        rel="noopener noreferrer"
        className="w-10 h-10 rounded-full flex items-center justify-center bg-white dark:bg-zinc-800 shadow-sm hover:bg-sky-500 hover:text-white dark:hover:bg-sky-500 transition-all text-zinc-600 dark:text-zinc-400"
        title={label}
    >
        {icon}
    </a>
);