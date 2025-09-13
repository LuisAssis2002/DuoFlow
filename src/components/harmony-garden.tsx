'use client';
import React from 'react';
import { Seed, Sprout, Sapling, Flower } from './harmony-icons';

interface HarmonyGardenProps {
  days: number;
}

export function HarmonyGarden({ days }: HarmonyGardenProps) {
  const getPlantComponent = () => {
    if (days >= 60) {
      return <Flower />;
    }
    if (days >= 30) {
      return <Sapling />;
    }
    if (days > 0) {
      return <Sprout />;
    }
    return <Seed />;
  };

  return (
    <div className="relative flex items-center justify-center" style={{ width: '4rem', height: '4rem' }}>
        <div className="transition-opacity duration-500">
            {getPlantComponent()}
        </div>
    </div>
  );
}
