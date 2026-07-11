'use client';

import { Plus } from "lucide-react";
import { useAchievementModal } from "@/app/contexts/AchievementModalContext";

export default function AddAchievement() {
    const { open } = useAchievementModal();

    return (
        <button
            onClick={() => open()}
            className="group cursor-pointer inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 bg-linear-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white rounded-xl font-semibold shadow-lg shadow-rose-500/25 hover:shadow-rose-500/40 hover:-translate-y-0.5 transition-all duration-200 text-xs sm:text-sm shrink-0"
        >
            <Plus size={18} className="group-hover:rotate-90 transition-transform duration-200" />
            <span>เพิ่มผลงานใหม่</span>
        </button>

    );
}
