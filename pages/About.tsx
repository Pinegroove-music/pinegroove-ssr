import React from 'react';
import { Mail, Globe, Instagram, Facebook, Youtube } from 'lucide-react';
import { useStore } from '../store/useStore';

export const About: React.FC = () => {
  const { isDarkMode } = useStore();

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 pb-32">
      <h1 className="text-4xl font-bold mb-8 text-center">Behind Pinegroove</h1>
      
      <div className={`p-8 rounded-2xl shadow-xl mb-12 ${isDarkMode ? 'bg-zinc-900' : 'bg-white'}`}>
        <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
            <div className="w-32 h-32 rounded-full bg-sky-200 overflow-hidden flex-shrink-0">
               {/* Placeholder for bio image */}
               <img src="https://picsum.photos/200/200" alt="Francesco Biondi" className="w-full h-full object-cover" />
            </div>
            <div>
                <h2 className="text-2xl font-bold mb-2">Francesco Biondi</h2>
                <h3 className="text-sky-500 font-medium">Composer & Producer</h3>
            </div>
        </div>

        <div className="prose dark:prose-invert max-w-none leading-relaxed opacity-90">
            <p className="mb-4">
                Francesco Biondi is a Rome based composer and music producer whose works have been featured in important media projects including commercials, films, video games, mobile apps and live performances. He has an insatiable curiosity for the whole musical universe, with the ability to engage in a wide range of styles and genres.
            </p>
            <p className="mb-4">
                Born nearby Bologna, Italy, starting with private piano studies in the early 90's and continuing with self-taught approach on composition, he soon developed a passion for music-production technologies, working passionately for a real and contemporary sound, capable of recreating the might of a whole symphonic orchestra or the refinement of the most original ensambles.
            </p>
            <p>
                His talent has been repeatedly recognized by some of the most important web media agencies: Envato Elite Author on Audiojungle.net, Contributor of the Month on iStock.com and GettyImages.com, Featured Artist on 123RF.com.
            </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 text-center">
        <div className={`p-6 rounded-xl border ${isDarkMode ? 'border-zinc-800' : 'border-zinc-200'}`}>
            <h3 className="font-bold mb-4 flex items-center justify-center gap-2"><Mail size={18}/> Contact</h3>
            <a href="mailto:info@pinegroove.net" className="text-sky-500 hover:underline">info@pinegroove.net</a>
        </div>
        
        <div className={`p-6 rounded-xl border ${isDarkMode ? 'border-zinc-800' : 'border-zinc-200'}`}>
            <h3 className="font-bold mb-4 flex items-center justify-center gap-2"><Globe size={18}/> Portfolio</h3>
            <a href="https://www.francescobiondimusic.com" target="_blank" rel="noreferrer" className="text-sky-500 hover:underline">www.francescobiondimusic.com</a>
        </div>
      </div>

      <div className="flex justify-center gap-6 mt-12">
        <SocialIcon icon={<Youtube size={24} />} href="#" />
        <SocialIcon icon={<Facebook size={24} />} href="#" />
        <SocialIcon icon={<Instagram size={24} />} href="#" />
      </div>
    </div>
  );
};

const SocialIcon = ({ icon, href }: { icon: React.ReactNode, href: string }) => (
    <a href={href} className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center hover:bg-sky-500 hover:text-white transition-colors">
        {icon}
    </a>
)
