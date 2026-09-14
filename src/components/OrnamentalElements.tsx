import React from 'react';

interface DividerProps {
  color?: string;
  className?: string;
}

export const OrnamentalDivider: React.FC<DividerProps> = ({ 
  color = '#C9962C', 
  className = '' 
}) => {
  return (
    <div className={`flex justify-center my-6 ${className}`}>
      <svg viewBox="0 0 140 46" className="w-[140px] h-[46px]" fill="none">
        <path d="M10 23 H50" stroke={color} strokeWidth="1" />
        <path d="M90 23 H130" stroke={color} strokeWidth="1" />
        <path 
          d="M70 23c0-8 6-14 6-14s6 6 6 14-6 14-6 14-6 14-6 14-6-6-6-14z" 
          fill={color} 
          opacity="0.85" 
        />
        <circle cx="60" cy="23" r="2.5" fill={color} />
        <circle cx="80" cy="23" r="2.5" fill={color} />
      </svg>
    </div>
  );
};

interface CornerMotifProps {
  color?: string;
  className?: string;
}

export const CornerMotif: React.FC<CornerMotifProps> = ({ 
  color = '#E7C878',
  className = ''
}) => {
  return (
    <svg viewBox="0 0 70 70" fill="none" className={`w-[70px] h-[70px] opacity-60 ${className}`}>
      <path d="M4 4 C 4 30, 30 4, 4 4" stroke={color} strokeWidth="1" />
      <path d="M4 4 Q 20 4 20 20" stroke={color} strokeWidth="1" />
      <circle cx="4" cy="4" r="3" fill={color} />
    </svg>
  );
};

interface RoyalTitleCrestProps {
  color?: string;
  accentColor?: string;
  className?: string;
  size?: number;
}

export const RoyalTitleCrest: React.FC<RoyalTitleCrestProps> = ({
  color = '#C9962C',
  accentColor = '#E7C878',
  className = '',
  size = 54
}) => {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <svg 
        width={size} 
        height={size * 0.75} 
        viewBox="0 0 80 60" 
        fill="none" 
        className="drop-shadow-sm transition-transform duration-300 hover:scale-105"
      >
        {/* Central Crown */}
        <path 
          d="M20 44 L25 24 L34 33 L40 18 L46 33 L55 24 L60 44 Z" 
          fill={color} 
          stroke={accentColor} 
          strokeWidth="1.5" 
          strokeLinejoin="round" 
        />
        {/* Crown Base */}
        <rect x="20" y="44" width="40" height="4" rx="2" fill={accentColor} />
        {/* Crown Jewels */}
        <circle cx="25" cy="22" r="2.5" fill="#FFFFFF" />
        <circle cx="40" cy="16" r="3" fill="#FFFFFF" />
        <circle cx="55" cy="22" r="2.5" fill="#FFFFFF" />
        <circle cx="32" cy="46" r="1.2" fill={color} />
        <circle cx="40" cy="46" r="1.5" fill={color} />
        <circle cx="48" cy="46" r="1.2" fill={color} />

        {/* Left Laurel Flourish */}
        <path 
          d="M17 40 C 10 36, 6 28, 10 20 C 11 26, 16 30, 20 32" 
          stroke={accentColor} 
          strokeWidth="1.2" 
          strokeLinecap="round" 
          fill="none" 
        />
        <circle cx="9" cy="19" r="1.5" fill={color} />

        {/* Right Laurel Flourish */}
        <path 
          d="M63 40 C 70 36, 74 28, 70 20 C 69 26, 64 30, 60 32" 
          stroke={accentColor} 
          strokeWidth="1.2" 
          strokeLinecap="round" 
          fill="none" 
        />
        <circle cx="71" cy="19" r="1.5" fill={color} />

        {/* Subtle Starburst Top */}
        <path 
          d="M40 8 L40 12 M37 10 L43 10" 
          stroke={accentColor} 
          strokeWidth="1.2" 
          strokeLinecap="round" 
        />
      </svg>
    </div>
  );
};
