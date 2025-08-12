'use client';

import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export function Logo({ className = '', size = 'md', showText = true }: LogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Beautiful Lotus Logo SVG */}
      <div className={`${sizeClasses[size]} flex-shrink-0`}>
        <svg
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Outer lotus petals - Purple/Lavender */}
          <path
            d="M20 65C15 55 15 45 25 40C35 35 45 40 50 50C55 40 65 35 75 40C85 45 85 55 80 65C75 70 65 70 50 65C35 70 25 70 20 65Z"
            fill="#B8A9FF"
            opacity="0.8"
          />
          
          {/* Middle lotus petals - Teal/Blue */}
          <path
            d="M30 60C25 52 28 45 35 42C42 39 48 42 50 48C52 42 58 39 65 42C72 45 75 52 70 60C68 63 62 63 50 60C38 63 32 63 30 60Z"
            fill="#7DD3FC"
            opacity="0.9"
          />
          
          {/* Inner lotus petals - Green/Teal */}
          <path
            d="M35 58C32 52 34 47 40 45C46 43 49 45 50 48C51 45 54 43 60 45C66 47 68 52 65 58C63 60 58 60 50 58C42 60 37 60 35 58Z"
            fill="#6EE7B7"
            opacity="0.9"
          />
          
          {/* Top center petal - Orange */}
          <path
            d="M45 45C42 38 45 32 50 30C55 32 58 38 55 45C53 48 47 48 45 45Z"
            fill="#FFA07A"
            opacity="0.9"
          />
          
          {/* Chat bubble center with heart */}
          <circle
            cx="50"
            cy="50"
            r="12"
            fill="#FF7F7F"
            opacity="0.9"
          />
          
          {/* White chat bubble outline */}
          <circle
            cx="50"
            cy="50"
            r="10"
            fill="white"
            opacity="0.95"
          />
          
          {/* Heart with sparkle inside chat bubble */}
          <path
            d="M50 45C48 43 45 43 45 46C45 49 50 54 50 54C50 54 55 49 55 46C55 43 52 43 50 45Z"
            fill="#FF7F7F"
          />
          
          {/* Sparkle/Star in heart */}
          <path
            d="M50 47L49 49L47 49L49 50L49 52L50 50L51 52L51 50L53 49L51 49L50 47Z"
            fill="white"
            opacity="0.8"
          />
          
          {/* Chat bubble tail */}
          <path
            d="M45 58C43 60 41 62 45 60C47 59 46 58 45 58Z"
            fill="white"
            opacity="0.9"
          />
        </svg>
      </div>
      
      {/* Text */}
      {showText && (
        <div className="flex flex-col">
          <span className={`font-bold ${textSizeClasses[size]} leading-none`}>
            <span style={{ color: 'var(--primary)' }}>Arambh</span>
            <span style={{ color: 'var(--accent)' }}>GPT</span>
          </span>
          <span className="text-xs text-gray-500 leading-none">
            Mental Health AI
          </span>
        </div>
      )}
    </div>
  );
}