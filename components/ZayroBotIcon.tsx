
import React from 'react';

interface ZayroBotIconProps {
  className?: string;
  size?: number;
}

export const ZayroBotIcon: React.FC<ZayroBotIconProps> = ({ className = "", size = 48 }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      {/* Glow effect */}
      <div className="absolute inset-0 bg-spanish-gold/20 rounded-full animate-pulse-slow blur-md"></div>
      
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10 w-full h-full drop-shadow-xl">
        {/* Main Head Shape */}
        <rect x="15" y="20" width="70" height="60" rx="20" fill="#AA151B" stroke="white" strokeWidth="4" />
        
        {/* Face Screen */}
        <rect x="25" y="30" width="50" height="30" rx="10" fill="#1a1a1a" />
        
        {/* Eyes */}
        <circle cx="40" cy="45" r="4" fill="#F1BF00" className="animate-pulse">
           <animate attributeName="opacity" values="1;0.2;1" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx="60" cy="45" r="4" fill="#F1BF00" className="animate-pulse">
           <animate attributeName="opacity" values="1;0.2;1" dur="3s" repeatCount="indefinite" />
        </circle>

        {/* The 'Z' Logo */}
        <path d="M40 70H60L40 85H60" stroke="#F1BF00" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        
        {/* Antennas */}
        <line x1="50" y1="20" x2="50" y2="10" stroke="white" strokeWidth="4" strokeLinecap="round" />
        <circle cx="50" cy="8" r="4" fill="#F1BF00" />
      </svg>
    </div>
  );
};
