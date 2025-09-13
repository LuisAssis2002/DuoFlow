
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
  const strokeWidth = 50;
  const flamePath = "M514.025,1012.395c-32.019,0-62.303-6.131-90.014-18.224c-25.072-10.941-48.149-26.791-68.588-47.108   c-34.981-34.772-61.978-82.7-76.019-134.954c-10.302-38.341-11.697-80.119-4.035-120.817c7.646-40.612,23.995-78.519,47.28-109.62   c1.921-2.567,5.379-3.433,8.284-2.075c2.904,1.357,4.457,4.566,3.72,7.687c-6.974,29.529-5.526,58.726,4.077,82.212   c10.623,25.981,32.313,45.144,55.259,48.819c24.433,3.915,50.158-11.223,58.571-34.459c8.659-23.936,0.269-50.973-7.847-77.12   c-1.891-6.092-3.846-12.391-5.552-18.549c-14.574-52.57-11.019-111.402,10.012-165.659   c21.071-54.362,57.428-98.311,102.373-123.751c2.803-1.587,6.337-0.979,8.447,1.457c2.11,2.434,2.213,6.018,0.244,8.568   c-16.362,21.199-24.733,61.461-6.547,103.625c8.457,19.615,23.275,44.935,69.056,84.02c5.463,4.662,11.104,9.352,16.56,13.888   c22.907,19.047,46.595,38.742,65.681,63.287c27.289,35.1,45.541,81.588,52.784,134.439c6.619,48.3,3.369,97.927-9.15,139.741   c-14.482,48.368-42.005,88.918-79.592,117.267C627.391,996.472,575.24,1012.395,514.025,1012.395z M317,615.148   c-13.379,23.822-23.037,50.539-28.329,78.647c-7.289,38.714-5.973,78.412,3.805,114.801   c13.431,49.986,39.175,95.752,72.489,128.867c40.984,40.74,91.135,61.396,149.06,61.396c58.208,0,107.616-15.005,146.853-44.599   c35.269-26.601,61.126-64.757,74.775-110.344l6.483,1.941l-6.483-1.941c22.431-74.91,15.429-188.956-41.353-261.989   c-18.184-23.385-41.297-42.603-63.649-61.187c-5.488-4.563-11.163-9.282-16.692-14.001c-26.876-22.944-56.528-51.455-72.698-88.955   c-8.118-18.823-12.095-40.218-11.195-60.245c0.519-11.557,2.607-22.465,6.163-32.417c-32.108,24.594-58.079,60.097-74.436,102.294   c-19.984,51.559-23.39,107.37-9.588,157.152c1.65,5.959,3.574,12.157,5.435,18.152c8.777,28.282,17.854,57.526,7.647,85.738   c-5.254,14.512-15.801,26.885-29.699,34.842c-13.537,7.752-29.069,10.726-43.74,8.376c-27.931-4.474-53.085-26.339-65.646-57.062   C318.98,656.956,315.881,636.52,317,615.148z";

  return (
    <div className="relative" style={{ width: '4rem', height: '4rem', transform: 'translateY(2px)' }}>
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

      <svg width="100%" height="100%" viewBox="250 0 550 1024" preserveAspectRatio="xMidYMid meet">
        <defs>
          <clipPath id="flameClip">
            <path
                d={flamePath}
                stroke="black" /* A cor aqui não importa, apenas a espessura */
                strokeWidth={strokeWidth}
                fill="black" 
                strokeLinecap="round" 
                strokeLinejoin="round"
            />
          </clipPath>
        </defs>
        
        {/* Contorno da Chama (invisível, só pra manter o espaço) */}
        <path 
            d={flamePath}
            stroke="transparent" 
            strokeWidth={strokeWidth} 
            fill="none" 
        />
        
        {/* Preenchimento com Animação de Onda */}
        <g clipPath="url(#flameClip)">
          {/* Base do líquido */}
          <rect 
            width="1024" 
            height="1024" 
            fill={flameColor}
            y={1024 - (fillPercentage / 100 * 1024)}
            style={{transition: 'y 0.8s ease-out, fill 1s ease-in-out'}}
          />
          
          {/* A Onda Animada */}
          <g transform={`translate(0, ${1024 - (fillPercentage / 100 * 1024)})`} style={{ transition: 'transform 0.8s ease-out' }}>
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
