'use client';

import { useState } from 'react';
import { Achievement as AchievementType } from '@/types/Achievements';
import AchievementCard from './AchievementCard';
import { Grid2X2, Grid3X3 } from 'lucide-react';

interface AchievementGridProps {
  achievements: AchievementType[];
  locale: string;
}

export default function AchievementGrid({
  achievements,
  locale,
}: AchievementGridProps) {
  const [cols, setCols] = useState<2 | 3>(3);

  return (
    <div className="w-full">
      {/* Column Switcher Controls */}
      <div className="hidden md:flex justify-end mb-6 gap-2">
        <button
          onClick={() => setCols(2)}
          aria-label="View as 2 columns"
          className={`cursor-pointer px-3 py-1.5 rounded-md border text-xs font-semibold transition flex items-center gap-1.5 ${
            cols === 2
              ? 'bg-rose-500 text-white border-rose-500 shadow-2xs'
              : 'bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:border-rose-400'
          }`}
          title="2 Columns Layout"
        >
          <Grid2X2 className="w-4 h-4" />
          <span>2 Cols</span>
        </button>

        <button
          onClick={() => setCols(3)}
          aria-label="View as 3 columns"
          className={`cursor-pointer px-3 py-1.5 rounded-md border text-xs font-semibold transition flex items-center gap-1.5 ${
            cols === 3
              ? 'bg-rose-500 text-white border-rose-500 shadow-2xs'
              : 'bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:border-rose-400'
          }`}
          title="3 Columns Layout"
        >
          <Grid3X3 className="w-4 h-4" />
          <span>3 Cols</span>
        </button>
      </div>

      {/* Grid Layout: 1 col on mobile portrait, 2 cols on mobile landscape/tablet, selected cols on desktop */}
      <div
        className={`grid gap-6 grid-cols-1 sm:grid-cols-2 ${
          cols === 2 ? 'lg:grid-cols-2' : 'lg:grid-cols-3'
        }`}
      >
        {achievements.map((achievement, idx) => (
          <AchievementCard
            key={idx}
            achievement={achievement}
            locale={locale}
          />
        ))}
      </div>
    </div>
  );
}