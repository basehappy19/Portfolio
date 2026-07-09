'use client';

import { useState } from 'react';
import { Achievement as AchievementType } from '@/types/Achievements';
import AchievementCard from './AchievementCard';
import { Grid2X2, Grid3X3, Sparkles } from 'lucide-react';

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
      {/* Interactive Stats & View Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 p-4 rounded-2xl bg-linear-to-r from-slate-50/90 via-white/80 to-slate-50/90 border border-slate-200/80 shadow-xs backdrop-blur-sm">
        {/* Left Stats & Hint */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-2xs text-xs sm:text-sm font-bold text-slate-800">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
            </span>
            <span>
              {locale === 'th'
                ? `ผลงานทั้งหมด ${achievements.length} รายการ`
                : `${achievements.length} Projects`}
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-50/80 border border-rose-200/60 text-rose-700 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
            <span>
              {locale === 'th'
                ? 'คลิกที่ผลงานเพื่อดูรายละเอียด & รูปภาพ'
                : 'Click any card to explore full details'}
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