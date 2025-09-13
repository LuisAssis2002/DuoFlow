'use client';
import React from 'react';

interface LiquidFlameProps {
  days: number;
}

export function LiquidFlame({ days }: LiquidFlameProps) {
  // O preenchimento sobe até 90% para a onda ficar visível.
  // Atinge o máximo em 60 dias para a cor dourada final.
  const fillPercentage = Math.min((days / 60) * 90, 90);

  const getFlameColor = () => {
    if (days >= 60) return 'hsl(48, 97%, 59%)'; // Dourado Final
    if (days >= 30) return 'hsl(38, 95%, 60%)'; // Laranja Dourado
    return 'hsl(25, 90%, 55%)'; // Laranja avermelhado inicial
  };
  
  const flameColor = getFlameColor();

  return (
    <div className="relative" style={{ width: '4rem', height: '4rem' }}>
      <style jsx>{`
        .wave {
          animation: wave 5s cubic-bezier(0.36, 0.45, 0.63, 0.53) infinite;
        }
        @keyframes wave {
          0% {
            transform: translateX(0);
          }
          50% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }
      `}</style>

      <svg width="100%" height="100%" viewBox="0 0 100 100">
        <defs>
          <clipPath id="flameClip">
            {/* Silhueta da chama original */}
            <path d="M50 0 C-10 40, 10 90, 50 100 C90 90, 110 40, 50 0 Z" />
          </clipPath>
        </defs>
        
        {/* Contorno da Chama */}
        <path 
          d="M50 0 C-10 40, 10 90, 50 100 C90 90, 110 40, 50 0 Z" 
          fill="none" 
          stroke="hsl(var(--border))" 
          strokeWidth="2" 
        />

        {/* Preenchimento com Animação de Onda */}
        <g clipPath="url(#flameClip)">
          {/* Base do líquido */}
          <rect 
            width="100" 
            height="100" 
            fill={flameColor}
            y={100 - fillPercentage}
            style={{transition: 'y 0.8s ease-out, fill 1s ease-in-out'}}
          />
          
          {/* A Onda Animada */}
          <g transform={`translate(0, ${100 - fillPercentage})`} style={{ transition: 'transform 0.8s ease-out' }}>
            <svg
              viewBox="0 0 800 50"
              width="200%"
              x="-50%"
              y="-10"
              preserveAspectRatio="none"
              className="wave"
            >
              <path
                d="M-1600,30c360,0,500-30,800-30s440,30,800,30s500-30,800-30s440,30,800,30V60H-1600V30Z"
                fill={flameColor}
                style={{transition: 'fill 1s ease-in-out'}}
              />
            </svg>
          </g>
        </g>
      </svg>
    </div>
  );
}
