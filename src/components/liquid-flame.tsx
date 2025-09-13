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

      <svg width="100%" height="100%" viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet">
        <defs>
          <clipPath id="flameClip">
            {/* Silhueta da chama do Lucide Icons */}
            <path d="M14.5 19.5c.3-.2.5-.5.8-.8s.5-.6.8-.9c.4-.4.7-.8.9-1.2s.4-.8.6-1.2c.2-.5.3-.9.4-1.4.1-.5.2-1 .2-1.5s-.1-1-.2-1.5c-.1-.5-.3-1-.5-1.5s-.4-.9-.7-1.4c-.3-.4-.7-.8-1-1.2-1.2-1.2-2.4-2.4-3.2-4.2-.3-.6-.5-1.2-.5-1.8 0-.6.2-1.2.5-1.8.3-.6.7-1.2 1.2-1.8.5-.6 1.1-1.2 1.8-1.8.2-.2.3-.3.4-.4" />
            <path d="M9.5 19.5c-.3-.2-.5-.5-.8-.8s-.5-.6-.8-.9c-.4-.4-.7-.8-.9-1.2s-.4-.8-.6-1.2c-.2-.5-.3-.9-.4-1.4-.1-.5-.2-1-.2-1.5s.1-1 .2-1.5c.1-.5.3-1 .5-1.5s.4-.9.7-1.4c.3-.4.7-.8 1-1.2 1.2-1.2 2.4-2.4 3.2-4.2.3-.6.5-1.2.5-1.8 0-.6-.2-1.2-.5-1.8-.3-.6-.7-1.2-1.2-1.8-.5-.6-1.1-1.2-1.8-1.8-.2-.2-.3-.3-.4-.4" />
          </clipPath>
        </defs>
        
        {/* Contorno da Chama */}
        <g stroke="hsl(var(--border))" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.5 19.5c.3-.2.5-.5.8-.8s.5-.6.8-.9c.4-.4.7-.8.9-1.2s.4-.8.6-1.2c.2-.5.3-.9.4-1.4.1-.5.2-1 .2-1.5s-.1-1-.2-1.5c-.1-.5-.3-1-.5-1.5s-.4-.9-.7-1.4c-.3-.4-.7-.8-1-1.2-1.2-1.2-2.4-2.4-3.2-4.2-.3-.6-.5-1.2-.5-1.8 0-.6.2-1.2.5-1.8.3-.6.7-1.2 1.2-1.8.5-.6 1.1-1.2 1.8-1.8.2-.2.3-.3.4-.4" />
            <path d="M9.5 19.5c-.3-.2-.5-.5-.8-.8s-.5-.6-.8-.9c-.4-.4-.7-.8-.9-1.2s-.4-.8-.6-1.2c-.2-.5-.3-.9-.4-1.4-.1-.5-.2-1-.2-1.5s.1-1 .2-1.5c.1-.5.3-1 .5-1.5s.4-.9.7-1.4c.3-.4.7-.8 1-1.2 1.2-1.2 2.4-2.4 3.2-4.2.3-.6.5-1.2.5-1.8 0-.6-.2-1.2-.5-1.8-.3-.6-.7-1.2-1.2-1.8-.5-.6-1.1-1.2-1.8-1.8-.2-.2-.3-.3-.4-.4" />
        </g>
        
        {/* Preenchimento com Animação de Onda */}
        <g clipPath="url(#flameClip)">
          {/* Base do líquido */}
          <rect 
            width="24" 
            height="24" 
            fill={flameColor}
            y={24 - (fillPercentage / 100 * 24)}
            style={{transition: 'y 0.8s ease-out, fill 1s ease-in-out'}}
          />
          
          {/* A Onda Animada */}
          <g transform={`translate(0, ${24 - (fillPercentage / 100 * 24)})`} style={{ transition: 'transform 0.8s ease-out' }}>
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
