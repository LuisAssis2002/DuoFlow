
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
    if (days >= 60) return 'hsl(48, 97%, 59%)'; // Dourado Final (primary)
    if (days >= 30) return 'hsl(35, 90%, 55%)'; // Transição para Dourado
    return 'hsl(18, 80%, 50%)'; // Vermelho/Laranja inicial (accent)
  };
  
  const flameColor = getFlameColor();
  const flamePath = "M15.5 8.5c0-4.42-3.58-8-8-8s-8 3.58-8 8c0 2.45 1.1 4.67 2.87 6.13 1.76 1.46 3.87 3.28 3.87 5.37 0 1.93 1.57 3.5 3.5 3.5s3.5-1.57 3.5-3.5c0-2.09 2.11-3.91 3.87-5.37C14.4 13.17 15.5 10.95 15.5 8.5z";
  
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

      <svg width="100%" height="100%" viewBox="-2 -2 28 28" preserveAspectRatio="xMidYMid meet">
        <defs>
          <clipPath id="flameClip">
            <path
                d={flamePath}
            />
          </clipPath>
        </defs>
        
        {/* Contorno da Chama (fundo) */}
        <path 
            d={flamePath}
            stroke="hsl(var(--muted-foreground))"
            strokeWidth="1.5" 
            fill="transparent" 
            strokeLinecap="round" 
            strokeLinejoin="round"
        />
        
        {/* Preenchimento com Animação de Onda */}
        <g clipPath="url(#flameClip)">
          {/* Base do líquido */}
          <rect 
            width="24" 
            height="24" 
            fill={flameColor}
            x={-2}
            y={24 - (fillPercentage / 100 * 26)}
            style={{transition: 'y 0.8s ease-out, fill 1s ease-in-out'}}
          />
          
          {/* A Onda Animada */}
          <g transform={`translate(0, ${24 - (fillPercentage / 100 * 26)})`} style={{ transition: 'transform 0.8s ease-out' }}>
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
