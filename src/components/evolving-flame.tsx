'use client';
import React from 'react';
import { Sparkle, FlameStage1, FlameStage2, FlameStage3 } from './harmony-icons';

interface EvolvingFlameProps {
  days: number;
}

export function EvolvingFlame({ days }: EvolvingFlameProps) {
  const getFlameComponent = () => {
    if (days >= 60) {
      return <FlameStage3 />;
    }
    if (days >= 30) {
      return <FlameStage2 />;
    }
    if (days > 0) {
      return <FlameStage1 />;
    }
    return <Sparkle />;
  };

  return (
    <div className="relative flex items-center justify-center" style={{ width: '4rem', height: '4rem' }}>
       <div className="transition-opacity duration-500">
         {getFlameComponent()}
       </div>
    </div>
  );
}
