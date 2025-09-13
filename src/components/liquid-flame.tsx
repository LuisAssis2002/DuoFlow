'use client';
import React from 'react';
import { FlameIcon } from './harmony-icons';

interface LiquidFlameProps {
  days: number;
}

export function LiquidFlame({ days }: LiquidFlameProps) {
  const fillPercentage = Math.min((days / 30) * 100, 100); 

  const flameColor = () => {
    if (days > 30) return 'hsl(48, 97%, 59%)'; // Gold
    if (days > 15) return 'hsl(35, 90%, 60%)'; // Orange
    return 'hsl(20, 85%, 55%)'; // Red-Orange
  };

  return (
    <div className="relative" style={{ width: '4rem', height: '4rem' }}>
      <style jsx>{`
        .liquid-wave {
          animation: wave 3s cubic-bezier(0.36, 0.45, 0.63, 0.53) infinite;
          transform: translate3d(0, 0, 0);
        }
        @keyframes wave {
          0% { margin-left: 0; }
          100% { margin-left: -1600px; }
        }
      `}</style>
      <svg width="100%" height="100%" viewBox="0 0 100 100">
        <defs>
          <clipPath id="flameClip">
            <path d="M50 0 C-10 40, 10 90, 50 100 C90 90, 110 40, 50 0 Z" />
          </clipPath>
          <pattern id="liquid" patternUnits="userSpaceOnUse" width="100" height="100">
            <rect width="100" height="100" fill={flameColor()} />
          </pattern>
        </defs>
        
        {/* Flame Outline */}
        <path d="M50 0 C-10 40, 10 90, 50 100 C90 90, 110 40, 50 0 Z" fill="none" stroke="hsl(var(--muted))" strokeWidth="2" />

        {/* Liquid Fill */}
        <g clipPath="url(#flameClip)">
          <rect 
            width="100" 
            height="100" 
            fill={flameColor()}
            y={100 - fillPercentage}
            style={{transition: 'y 0.5s ease-out, fill 0.5s ease-out'}}
          />
          {/* Animated Wave on top */}
          <rect 
            className="liquid-wave"
            width="1700" 
            height="110" 
            fill="url(#liquid)"
            x="0"
            y={95 - fillPercentage}
            style={{
                transition: 'y 0.5s ease-out',
                background: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' stroke='%23333' stroke-width='4' stroke-dasharray='6%2c 14' stroke-dashoffset='0' stroke-linecap='square'/%3e%3c/svg%3e")`
            }}
          />
           <path
            d="M -400 95 C -350 85, -250 105, -200 95 S -150 85, -100 95 S -50 105, 0 95 S 50 85, 100 95 S 150 105, 200 95 S 250 85, 300 95 S 350 105, 400 95 V 100 H -400 Z"
            fill={flameColor()}
            transform={`translate(0, ${-fillPercentage})`}
            className="liquid-wave"
            style={{transition: 'transform 0.5s ease-out, fill 0.5s ease-out'}}
          />
        </g>
      </svg>
    </div>
  );
}
