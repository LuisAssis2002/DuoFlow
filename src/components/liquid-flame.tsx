
'use client';
import React from 'react';
import { cn } from '@/lib/utils';

interface LiquidFlameProps {
  days: number;
}

export function LiquidFlame({ days }: LiquidFlameProps) {
  const [isAnimating, setIsAnimating] = React.useState(false);
  
  // A cor ainda muda baseada nos dias reais.
  const getFlameColor = () => {
    if (days >= 60) return 'hsl(48, 97%, 59%)'; // Dourado Final (primary)
    if (days >= 30) return 'hsl(35, 90%, 55%)'; // Transição para Dourado
    return 'hsl(18, 80%, 50%)'; // Vermelho/Laranja inicial (accent)
  };
  const flameColor = getFlameColor();
  
  // Este useEffect reinicia a animação sempre que 'days' (simulados) muda.
  React.useEffect(() => {
    setIsAnimating(false);
    
    // Força o navegador a recalcular estilos antes de re-adicionar a classe.
    const timer = setTimeout(() => {
      setIsAnimating(true);
    }, 10); // Um pequeno delay garante o reinício da animação.

    return () => clearTimeout(timer);
  }, [days]);

  // O preenchimento da máscara de animação agora é controlado pela altura do `days`.
  // Chega a 100% (transform Y 0%) com 60 dias.
  const fillLevel = Math.min(days / 60, 1);
  const transformY = 105 - (105 * fillLevel);

  return (
    <div className="relative" style={{ width: '4rem', height: '4rem' }}>
      <style jsx>{`
        @keyframes liquid-fill-animation {
            0% {
                transform: translateY(${105 - (105 * Math.max(0, fillLevel - 0.1))}%) translateX(0) rotate(0deg);
            }
            30% {
                transform: translateY(${transformY * 0.7}%) translateX(-15px) rotate(-5deg);
            }
            60% {
                transform: translateY(${transformY * 0.4}%) translateX(15px) rotate(5deg);
            }
            90% {
                transform: translateY(${transformY * 0.1}%) translateX(-5px) rotate(-2deg);
            }
            100% {
                transform: translateY(${transformY}%) translateX(0) rotate(0deg);
            }
        }
        
        .animate-fill #fill-mask {
            /* A duração agora é baseada no quão cheio está, para ser mais rápido quando já está alto */
            animation: liquid-fill-animation ${2 + (1 - fillLevel) * 1.5}s ease-in-out forwards;
        }

        /* Cor de fundo para o contorno */
        .flame-background {
            fill: transparent;
            stroke: hsl(var(--muted-foreground));
            stroke-width: 18;
        }
      `}</style>

      <svg
        className={cn("w-full h-full", isAnimating && "animate-fill")}
        viewBox="260 140 500 872" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <clipPath id="flame-clip-path">
            {/* Este é o contorno da chama que serve de janela */}
            <path d="M514.025,1012.395c-32.019,0-62.303-6.131-90.014-18.224c-25.072-10.941-48.149-26.791-68.588-47.108   c-34.981-34.772-61.978-82.7-76.019-134.954c-10.302-38.341-11.697-80.119-4.035-120.817c7.646-40.612,23.995-78.519,47.28-109.62   c1.921-2.567,5.379-3.433,8.284-2.075c2.904,1.357,4.457,4.566,3.72,7.687c-6.974,29.529-5.526,58.726,4.077,82.212   c10.623,25.981,32.313,45.144,55.259,48.819c24.433,3.915,50.158-11.223,58.571-34.459c8.659-23.936,0.269-50.973-7.847-77.12   c-1.891-6.092-3.846-12.391-5.552-18.549c-14.574-52.57-11.019-111.402,10.012-165.659   c21.071-54.362,57.428-98.311,102.373-123.751c2.803-1.587,6.337-0.979,8.447,1.457c2.11,2.434,2.213,6.018,0.244,8.568   c-16.362,21.199-24.733,61.461-6.547,103.625c8.457,19.615,23.275,44.935,69.056,84.02c5.463,4.662,11.104,9.352,16.56,13.888   c22.907,19.047,46.595,38.742,65.681,63.287c27.289,35.1,45.541,81.588,52.784,134.439c6.619,48.3,3.369,97.927-9.15,139.741   c-14.482,48.368-42.005,88.918-79.592,117.267C627.391,996.472,575.24,1012.395,514.025,1012.395z" />
          </clipPath>
          <clipPath id="flame-fill-mask">
            {/* Esta é a máscara que se move para simular o líquido */}
            <path id="fill-mask" d="M 260,140 C 435,200 685,80 810,140 V 1012 H 260 Z" />
          </clipPath>
        </defs>

        {/* Fundo/Contorno da Chama */}
        <path
          className="flame-background"
          d="M514.025,1012.395c-32.019,0-62.303-6.131-90.014-18.224c-25.072-10.941-48.149-26.791-68.588-47.108   c-34.981-34.772-61.978-82.7-76.019-134.954c-10.302-38.341-11.697-80.119-4.035-120.817c7.646-40.612,23.995-78.519,47.28-109.62   c1.921-2.567,5.379-3.433,8.284-2.075c2.904,1.357,4.457,4.566,3.72,7.687c-6.974,29.529-5.526,58.726,4.077,82.212   c10.623,25.981,32.313,45.144,55.259,48.819c24.433,3.915,50.158-11.223,58.571-34.459c8.659-23.936,0.269-50.973-7.847-77.12   c-1.891-6.092-3.846-12.391-5.552-18.549c-14.574-52.57-11.019-111.402,10.012-165.659   c21.071-54.362,57.428-98.311,102.373-123.751c2.803-1.587,6.337-0.979,8.447,1.457c2.11,2.434,2.213,6.018,0.244,8.568   c-16.362,21.199-24.733,61.461-6.547,103.625c8.457,19.615,23.275,44.935,69.056,84.02c5.463,4.662,11.104,9.352,16.56,13.888   c22.907,19.047,46.595,38.742,65.681,63.287c27.289,35.1,45.541,81.588,52.784,134.439c6.619,48.3,3.369,97.927-9.15,139.741   c-14.482,48.368-42.005,88.918-79.592,117.267C627.391,996.472,575.24,1012.395,514.025,1012.395z"
        />

        {/* Preenchimento Líquido */}
        <g clipPath="url(#flame-clip-path)">
          <g clipPath="url(#flame-fill-mask)">
            <rect x="260" y="140" width="550" height="872" style={{ fill: flameColor, transition: 'fill 1s ease-in-out' }} />
          </g>
        </g>
      </svg>
    </div>
  );
}

    

    