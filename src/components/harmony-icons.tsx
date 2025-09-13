
'use client';
import React from 'react';

export const FlameIcon = () => (
    <svg width="100%" height="100%" viewBox="0 0 100 100">
        <path d="M50 0 C-10 40, 10 90, 50 100 C90 90, 110 40, 50 0 Z" fill="hsl(var(--accent))" />
    </svg>
);


// --- Evolving Flame Icons ---

export const Sparkle = () => (
  <svg width="50%" height="50%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-300">
    <path d="M12 2 L14.5 9.5 L22 12 L14.5 14.5 L12 22 L9.5 14.5 L2 12 L9.5 9.5 Z" />
     <style jsx>{`
      path {
        animation: pulse-sparkle 1.5s infinite;
      }
      @keyframes pulse-sparkle {
        0%, 100% { opacity: 0.7; transform: scale(0.9); }
        50% { opacity: 1; transform: scale(1.1); }
      }
    `}</style>
  </svg>
);

export const FlameStage1 = () => (
  <svg width="75%" height="75%" viewBox="0 0 24 24" fill="none" stroke="hsl(var(--accent))" strokeWidth="1.5">
    <path d="M12 2c0 2-2 3-2 5s2 3 2 5-2 3-2 5-2 3-2 5h4c0-2 2-3 2-5s-2-3-2-5 2-3 2-5 2-3 2-5z" fill="hsl(var(--accent))">
      <animate attributeName="d" values="M12 2c0 2-2 3-2 5s2 3 2 5-2 3-2 5-2 3-2 5h4c0-2 2-3 2-5s-2-3-2-5 2-3 2-5 2-3 2-5z;M12 2c0 2 2 3 2 5s-2 3-2 5 2 3 2 5 2 3 2 5h-4c0-2-2-3-2-5s2-3 2-5-2-3-2-5-2-3-2-5z;M12 2c0 2-2 3-2 5s2 3 2 5-2 3-2 5-2 3-2 5h4c0-2 2-3 2-5s-2-3-2-5 2-3 2-5 2-3 2-5z;" dur="2s" repeatCount="indefinite" />
    </path>
  </svg>
);

export const FlameStage2 = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="hsl(var(--accent))" stroke="hsl(var(--primary))" strokeWidth="1">
    <path d="M12 2c-4 4-4 8 0 12 4-4 4-8 0-12zm0 12c-4 4-4 8 0 12 4-4 4-8 0-12z" transform="translate(0, -2)">
        <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="10s" repeatCount="indefinite" />
         <animate attributeName="d" values="M12 2c-4 4-4 8 0 12 4-4 4-8 0-12zm0 12c-4 4-4 8 0 12 4-4 4-8 0-12z;M12 2c-3 5-5 7 0 12 5-5 3-7 0-12zm0 12c-3 5-5 7 0 12 5-5 3-7 0-12z;M12 2c-4 4-4 8 0 12 4-4 4-8 0-12zm0 12c-4 4-4 8 0 12 4-4 4-8 0-12z" dur="1.5s" repeatCount="indefinite" />
    </path>
  </svg>
);


export const FlameStage3 = () => (
    <svg width="100%" height="100%" viewBox="-2 -2 28 28" fill="url(#grad)" stroke="hsl(var(--primary))" strokeWidth="0.5">
        <defs>
            <radialGradient id="grad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                <stop offset="0%" style={{stopColor: 'white', stopOpacity: 1}} />
                <stop offset="60%" style={{stopColor: 'hsl(var(--primary))', stopOpacity: 1}} />
                <stop offset="100%" style={{stopColor: 'hsl(var(--accent))', stopOpacity: 1}} />
            </radialGradient>
        </defs>
        <path d="M12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M12,20c-4.41,0-8-3.59-8-8s3.59-8,8-8 s8,3.59,8,8S16.41,20,12,20z">
            <animateTransform attributeName="transform" type="scale" values="1; 1.05; 1" dur="2s" repeatCount="indefinite" />
        </path>
        <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zm0 8c-1.65 0-3-1.35-3-3s1.35-3 3-3 3 1.35 3 3-1.35 3-3 3z">
             <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="4s" repeatCount="indefinite" />
        </path>
    </svg>
);


// --- Harmony Garden Icons ---

export const Seed = () => (
  <svg width="50%" height="50%" viewBox="0 0 24 24" fill="SaddleBrown">
    <circle cx="12" cy="12" r="4" />
  </svg>
);

export const Sprout = () => (
  <svg width="60%" height="60%" viewBox="0 0 24 24" fill="none" stroke="LimeGreen" strokeWidth="2">
    <path d="M12 20v-8" />
    <path d="M12 12c-2 0-4-1-4-3s2-3 4-3 4 1 4 3-2 3-4 3z" fill="LimeGreen" />
    <style jsx>{`
        path:first-child {
            animation: grow-stem 2s ease-out;
        }
        @keyframes grow-stem {
            from { transform: scaleY(0); transform-origin: bottom; }
            to { transform: scaleY(1); transform-origin: bottom; }
        }
    `}</style>
  </svg>
);

export const Sapling = () => (
  <svg width="80%" height="80%" viewBox="0 0 24 24" fill="none" stroke="ForestGreen" strokeWidth="1.5">
    <path d="M12 22V8" />
    <path d="M12 8c-3 0-5-2-5-4s2-4 5-4 5 2 5 4-2 4-5 4z" fill="ForestGreen" />
    <path d="M7 14c0-2 2-4 5-4s5 2 5 4" />
  </svg>
);

export const Flower = () => (
  <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="MediumVioletRed" strokeWidth="1.5">
    <path d="M12 22V10" stroke="ForestGreen" />
    <path d="M12 10a4 4 0 00-4-4c-2.21 0-4 1.79-4 4s1.79 4 4 4a4 4 0 004-4z" fill="HotPink" />
    <path d="M12 10a4 4 0 014-4c2.21 0 4 1.79 4 4s-1.79 4-4 4a4 4 0 01-4-4z" fill="HotPink" />
    <path d="M10 12a4 4 0 00-4 4c0 2.21 1.79 4 4 4s4-1.79 4-4a4 4 0 00-4-4z" fill="HotPink" />
    <path d="M14 12a4 4 0 014 4c0 2.21-1.79 4-4 4s-4-1.79-4-4a4 4 0 014-4z" fill="HotPink" />
    <circle cx="12" cy="12" r="2" fill="Gold" />
     <style jsx>{`
        path, circle {
            animation: bloom 1s ease-out;
            transform-origin: center;
        }
        @keyframes bloom {
            from { transform: scale(0); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }
    `}</style>
  </svg>
);
