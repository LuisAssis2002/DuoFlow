
'use client';
import React from 'react';
import { cn } from '@/lib/utils';

interface LiquidFlameProps {
  days: number;
}

export function LiquidFlame({ days }: LiquidFlameProps) {
  // A cor ainda muda baseada nos dias reais.
  const getFlameColor = () => {
    if (days >= 60) return 'hsl(48, 97%, 59%)'; // Dourado Final (primary)
    if (days >= 30) return 'hsl(35, 90%, 55%)'; // Transição para Dourado
    return 'hsl(18, 80%, 50%)'; // Vermelho/Laranja inicial (accent)
  };
  const flameColor = getFlameColor();
  
  // O preenchimento da máscara agora é controlado pela altura do `days`.
  // Chega a 100% (transform Y 0%) com 60 dias.
  const fillLevel = Math.min(days / 60, 1);
  const transformY = 105 - (105 * fillLevel);

  return (
    <div className="relative w-full h-full">
      <svg
        className="w-full h-full"
        viewBox="260 140 500 872" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <clipPath id="flame-clip-path">
            {/* Este é o contorno da chama que serve de janela */}
            <path d="M514.025,1012.395c-32.019,0-62.303-6.131-90.014-18.224c-25.072-10.941-48.149-26.791-68.588-47.108   c-34.981-34.772-61.978-82.7-76.019-134.954c-10.302-38.341-11.697-80.119-4.035-120.817c7.646-40.612,23.995-78.519,47.28-109.62   c1.921-2.567,5.379-3.433,8.284-2.075c2.904,1.357,4.457,4.566,3.72,7.687c-6.974,29.529-5.526,58.726,4.077,82.212   c10.623,25.981,32.313,45.144,55.259,48.819c24.433,3.915,50.158-11.223,58.571-34.459c8.659-23.936,0.269-50.973-7.847-77.12   c-1.891-6.092-3.846-12.391-5.552-18.549c-14.574-52.57-11.019-111.402,10.012-165.659   c21.071-54.362,57.428-98.311,102.373-123.751c2.803-1.587,6.337-0.979,8.447,1.457c2.11,2.434,2.213,6.018,0.244,8.568   c-16.362,21.199-24.733,61.461-6.547,103.625c8.457,19.615,23.275,44.935,69.056,84.02c5.463,4.662,11.104,9.352,16.56,13.888   c22.907,19.047,46.595,38.742,65.681,63.287c27.289,35.1,45.541,81.588,52.784,134.439c6.619,48.3,3.369,97.927-9.15,139.741   c-14.482,48.368-42.005,88.918-79.592,117.267C627.391,996.472,575.24,1012.395,514.025,1012.395z" />
          </clipPath>
          <mask id="flame-liquid-mask">
             {/* Esta é a forma ondulada do líquido */}
            <path 
                fill="white"
                d="M 260,140 C 435,200 685,80 810,140 V 1012 H 260 Z"
                style={{
                    transform: `translateY(${transformY}%)`,
                    transition: 'transform 0.3s ease-out' // Transição suave
                }}
            />
          </mask>
        </defs>

        {/* Fundo/Contorno da Chama */}
        <path
          fill="transparent"
          stroke="hsl(var(--muted-foreground))"
          strokeWidth="18"
          d="M514.025,1012.395c-32.019,0-62.303-6.131-90.014-18.224c-25.072-10.941-48.149-26.791-68.588-47.108   c-34.981-34.772-61.978-82.7-76.019-134.954c-10.302-38.341-11.697-80.119-4.035-120.817c7.646-40.612,23.995-78.519,47.28-109.62   c1.921-2.567,5.379-3.433,8.284-2.075c2.904,1.357,4.457,4.566,3.72,7.687c-6.974,29.529-5.526,58.726,4.077,82.212   c10.623,25.981,32.313,45.144,55.259,48.819c24.433,3.915,50.158-11.223,58.571-34.459c8.659-23.936,0.269-50.973-7.847-77.12   c-1.891-6.092-3.846-12.391-5.552-18.549c-14.574-52.57-11.019-111.402,10.012-165.659   c21.071-54.362,57.428-98.311,102.373-123.751c2.803-1.587,6.337-0.979,8.447,1.457c2.11,2.434,2.213,6.018,0.244,8.568   c-16.362,21.199-24.733,61.461-6.547,103.625c8.457,19.615,23.275,44.935,69.056,84.02c5.463,4.662,11.104,9.352,16.56,13.888   c22.907,19.047,46.595,38.742,65.681,63.287c27.289,35.1,45.541,81.588,52.784,134.439c6.619,48.3,3.369,97.927-9.15,139.741   c-14.482,48.368-42.005,88.918-79.592,117.267C627.391,996.472,575.24,1012.395,514.025,1012.395z"
        />

        {/* Preenchimento Líquido */}
        <g clipPath="url(#flame-clip-path)" mask="url(#flame-liquid-mask)">
          <rect x="260" y="140" width="550" height="872" style={{ fill: flameColor, transition: 'fill 1s ease-in-out' }} />
        </g>
      </svg>
    </div>
  );
}
