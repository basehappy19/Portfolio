"use client";

import { useState } from "react";
import { Achievement as AchievementType } from "@/types/Achievements";
import AchievementCard from "./AchievementCard";

interface AchievementGridProps {
    achievements: AchievementType[];
    locale: string;
}

export default function AchievementGrid({ achievements, locale }: AchievementGridProps) {
    const [cols, setCols] = useState<2 | 3>(3);

    return (
        <div className="w-full">
            <div className="hidden md:flex justify-center mb-6 gap-2">
                <button
                    onClick={() => setCols(2)}
                    className={`
            p-2 rounded-lg border transition-all flex items-center gap-2
            ${cols === 2
                            ? "bg-gray-200 border-gray-400 dark:bg-white/20 dark:border-white/30"
                            : "bg-transparent border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5"}
          `}
                    title="2 Columns"
                >
                    {/* Icon 2 Columns */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
                        <rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" />
                    </svg>
                    <span className="text-sm font-medium">2 Cols</span>
                </button>

                <button
                    onClick={() => setCols(3)}
                    className={`
            p-2 rounded-lg border transition-all flex items-center gap-2
            ${cols === 3
                            ? "bg-gray-200 border-gray-400 dark:bg-white/20 dark:border-white/30"
                            : "bg-transparent border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5"}
          `}
                    title="3 Columns"
                >
                    {/* Icon 3 Columns */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <path d="M9 3v18" /><path d="M15 3v18" /><path d="M3 9h18" /><path d="M3 15h18" />
                    </svg>
                    <span className="text-sm font-medium">3 Cols</span>
                </button>
            </div>

            <div className={`
        grid gap-6 
        grid-cols-1 
        ${cols === 2 ? "md:grid-cols-2" : "md:grid-cols-3"}
      `}>
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