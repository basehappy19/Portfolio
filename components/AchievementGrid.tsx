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
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3 border-b border-slate-200/80">
        {/* Left Segment */}
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            <span>
              {locale === 'th'
                ? `ผลงานทั้งหมด ${achievements.length} รายการ`
                : `${achievements.length} Projects`}
            </span>
          </div>
        </div>

        {/* Right Segmented Column Controls */}
        <div className="hidden md:flex items-center gap-1.5 p-1 rounded-xl bg-slate-200/60 border border-slate-300/50">
          <button
            onClick={() => setCols(2)}
            aria-label="View as 2 columns"
            className={`cursor-pointer px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 flex items-center gap-1.5 ${
              cols === 2
                ? 'bg-white text-slate-950 shadow-sm scale-102'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
            title={locale === 'th' ? 'มุมมองกว้าง (2 คอลัมน์)' : '2 Columns Layout'}
          >
            <Grid2X2 className="w-4 h-4 text-rose-600" />
            <span>{locale === 'th' ? 'มุมมองกว้าง' : '2 Cols'}</span>
          </button>

          <button
            onClick={() => setCols(3)}
            aria-label="View as 3 columns"
            className={`cursor-pointer px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all duration-200 flex items-center gap-1.5 ${
              cols === 3
                ? 'bg-white text-slate-950 shadow-sm scale-102'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
            title={locale === 'th' ? 'มุมมองมาตรฐาน (3 คอลัมน์)' : '3 Columns Layout'}
          >
            <Grid3X3 className="w-4 h-4 text-rose-600" />
            <span>{locale === 'th' ? 'มุมมองมาตรฐาน' : '3 Cols'}</span>
          </button>
        </div>
      </div>

      {/* Grid Layout */}
      <div
        className={`grid gap-6 sm:gap-7 transition-all duration-300 grid-cols-1 sm:grid-cols-2 ${
          cols === 2 ? 'lg:grid-cols-2' : 'lg:grid-cols-3'
        }`}
      >
        {achievements.map((achievement, idx) => (
          <AchievementCard
            key={idx}
            achievement={achievement}
            locale={locale}
            priorityImage={idx < 3}
          />
        ))}
      </div>
    </div>
  );
}