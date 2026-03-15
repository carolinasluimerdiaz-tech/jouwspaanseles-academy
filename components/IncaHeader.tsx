
import React from 'react';
import { Zap, Heart, Flame, Star } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  xp?: number;
  streak?: number;
  hearts?: number;
}

export const ModernHeader: React.FC<HeaderProps> = ({ title, subtitle, xp = 1250, streak = 5, hearts = 5 }) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-spanish-red to-red-800 text-white p-6 md:p-8 rounded-b-[3rem] shadow-2xl border-b-8 border-spanish-gold/20">
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h1 className="text-3xl md:text-5xl font-brand font-black tracking-tighter uppercase drop-shadow-lg">
            {title}
          </h1>
          {subtitle && <p className="text-white/80 font-bold mt-1 drop-shadow-sm italic text-xs uppercase tracking-widest">{subtitle}</p>}
        </div>

        <div className="flex items-center gap-3 md:gap-6 bg-black/20 backdrop-blur-xl p-3 md:p-4 rounded-[2rem] border border-white/10 shadow-inner">
          <div className="flex items-center gap-2 px-3 border-r border-white/10">
            <Zap className="text-spanish-gold animate-pulse" size={20} />
            <span className="font-brand font-black text-sm">{xp} <span className="text-[10px] opacity-50">XP</span></span>
          </div>
          <div className="flex items-center gap-2 px-3 border-r border-white/10">
            <Flame className="text-orange-500" size={20} />
            <span className="font-brand font-black text-sm">{streak} <span className="text-[10px] opacity-50">DAYS</span></span>
          </div>
          <div className="flex items-center gap-2 px-3">
            <Heart className="text-red-500 fill-red-500" size={20} />
            <span className="font-brand font-black text-sm">{hearts}</span>
          </div>
        </div>
      </div>
      
      {/* Abstract Sun Ornaments */}
      <div className="absolute -bottom-10 -right-10 w-64 h-64 opacity-10 animate-spin-slow">
         <svg viewBox="0 0 100 100" fill="currentColor">
            <circle cx="50" cy="50" r="45" stroke="white" strokeWidth="1" fill="none" />
            {[...Array(24)].map((_, i) => (
              <line 
                key={i} 
                x1="50" y1="50" 
                x2={50 + 45 * Math.cos(i * 15 * Math.PI / 180)} 
                y2={50 + 45 * Math.sin(i * 15 * Math.PI / 180)} 
                stroke="white" 
                strokeWidth="0.5" 
              />
            ))}
         </svg>
      </div>
    </div>
  );
};