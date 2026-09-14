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
