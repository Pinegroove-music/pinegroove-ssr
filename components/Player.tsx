import React, { useRef, useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { Play, Pause, ShoppingCart, Volume2, VolumeX, Volume1 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { WaveformVisualizer } from './WaveformVisualizer';

const formatTime = (time: number) => {
  if (!Number.isFinite(time) || isNaN(time)) return '0:00';
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export const Player: React.FC = () => {
  const { currentTrack, isPlaying, togglePlay, isDarkMode, setProgress, volume, setVolume, seekTime, setSeekTime } = useStore();
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      if (isPlaying) {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.catch(e => {
                console.log("Playback prevented or interrupted:", e);
            });
        }
      } else {
        audio.pause();
      }
    }
  }, [isPlaying, currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
        audioRef.current.volume = volume;
    }
  }, [volume]);

  // Handle Remote Seek Requests
  useEffect(() => {
      if (seekTime !== null && audioRef.current && audioRef.current.duration) {
          const newTime = (seekTime / 100) * audioRef.current.duration;
          if (Number.isFinite(newTime)) {
              audioRef.current.currentTime = newTime;
              setCurrentTime(newTime);
          }
          setSeekTime(null);
      }
  }, [seekTime, setSeekTime]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      if (audio.duration && Number.isFinite(audio.duration)) {
        setCurrentTime(audio.currentTime);
        setDuration(audio.duration);

        if (seekTime === null) {
            const p = (audio.currentTime / audio.duration) * 100;
            setProgress(p);
        }
      }
    };

    const handleEnded = () => {
        useStore.getState().togglePlay();
        setProgress(0);
        setCurrentTime(0);
    };

    audio.addEventListener('loadedmetadata', updateProgress);
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.removeEventListener('loadedmetadata', updateProgress);
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [setProgress, currentTrack, seekTime]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setProgress(val);
    
    if (audioRef.current && audioRef.current.duration) {
      const seekTime = (val / 100) * audioRef.current.duration;
      if (Number.isFinite(seekTime)) {
          audioRef.current.currentTime = seekTime;
          setCurrentTime(seekTime);
      }
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };

  const toggleMute = () => {
    setVolume(volume > 0 ? 0 : 1);
  };

  if (!currentTrack) return null;

  const VolumeIcon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;
  const remainingTime = duration - currentTime;

  return (
    <div className={`
      fixed bottom-0 left-0 right-0 z-50 h-20 border-t px-4
      ${isDarkMode ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-white border-zinc-200 text-zinc-900'}
      shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] flex items-center gap-4 transition-colors duration-300
    `}>
      <audio 
        ref={audioRef} 
        src={currentTrack.mp3_url} 
        preload="metadata"
        crossOrigin="anonymous"
      />

      {/* 1. Track Info (Left) */}
      <div className="flex items-center gap-3 w-48 md:w-64 flex-shrink-0">
        <img 
          src={currentTrack.cover_url} 
          alt={currentTrack.title} 
          className="w-12 h-12 object-cover rounded shadow-sm hidden sm:block"
        />
        <div className="overflow-hidden min-w-0">
          <Link to={`/track/${currentTrack.id}`} className="font-bold text-sm truncate block hover:text-sky-500 transition-colors">
            {currentTrack.title}
          </Link>
          <Link to={`/library?search=${encodeURIComponent(currentTrack.artist_name)}`} className="text-xs opacity-70 truncate block hover:underline">
            {currentTrack.artist_name}
          </Link>
        </div>
      </div>

      {/* 2. Main Controls: Play + Waveform + Timers (Center) */}
      <div className="flex-1 flex items-center gap-4 min-w-0 justify-center">
          <button 
            onClick={togglePlay}
            className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition hover:scale-105 shadow-sm ${isDarkMode ? 'bg-white text-black' : 'bg-black text-white'}`}
          >
            {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-1"/>}
          </button>

          <div className="flex-1 flex items-center gap-3">
              <span className="text-xs font-mono opacity-50 min-w-[35px] text-right">
                  {formatTime(currentTime)}
              </span>

              {/* Interactive Waveform */}
              <div className="relative flex-1 h-12 flex items-center group">
                    <div className="absolute inset-0 z-0 flex items-center">
                        <WaveformVisualizer 
                            track={currentTrack} 
                            height="h-full" 
                            interactive={true} 
                            enableAnalysis={true} // Explicitly enable real analysis
                        />
                    </div>
                    
                    {/* Invisible Overlay for Seek */}
                    <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        step="0.1"
                        defaultValue={0} 
                        onChange={handleSeek}
                        onMouseDown={() => setIsDragging(true)}
                        onMouseUp={() => setIsDragging(false)}
                        onTouchStart={() => setIsDragging(true)}
                        onTouchEnd={() => setIsDragging(false)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                        title="Seek"
                    />
              </div>

              <span className="text-xs font-mono opacity-50 min-w-[40px]">
                  -{formatTime(remainingTime)}
              </span>
          </div>
      </div>

      {/* 3. Volume & License (Right) */}
      <div className="flex items-center gap-4 flex-shrink-0">
        <div className="flex items-center gap-2 group relative">
            <button onClick={toggleMute} className="opacity-60 hover:opacity-100 transition p-2">
                <VolumeIcon size={20} />
            </button>
            <div className="w-0 overflow-hidden group-hover:w-20 transition-all duration-300 ease-in-out">
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="w-20 h-1 bg-zinc-300 rounded-lg appearance-none cursor-pointer accent-sky-500 block"
                />
            </div>
        </div>

        {currentTrack.gumroad_link && (
            <a 
                href={currentTrack.gumroad_link}
                className="hidden md:flex items-center gap-2 bg-sky-600 hover:bg-sky-500 text-white px-4 py-2 rounded-full text-xs font-bold transition shadow-sm hover:scale-105"
            >
                <ShoppingCart size={14} />
                <span>Buy License</span>
            </a>
        )}
      </div>
    </div>
  );
};