'use client';

import { Plus } from "lucide-react";
import { useAchievementModal } from "@/app/contexts/AchievementModalContext";

export default function AddAchievement() {
    const { open } = useAchievementModal();

    return (
        <button
            onClick={() => open()}
            className="cursor-pointer px-6 py-3 bg-white text-red-600 rounded-lg flex items-center justify-center gap-2 font-medium"
        >
            <Plus size={20} />
            เพิ่มผลงานใหม่
        </button>
    );
}
