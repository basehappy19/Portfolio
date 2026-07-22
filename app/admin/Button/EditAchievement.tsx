'use client'
import { useAchievementModal } from '@/app/contexts/AchievementModalContext';
import { Achievement } from '@/types/Achievements';
import { Edit2 } from 'lucide-react';

const EditAchievement = ({ achievement }: { achievement: Achievement }) => {
    const { open } = useAchievementModal();

    return (
        <button
            onClick={(e) => {
                e.stopPropagation();
                open(achievement);
            }}
            className="inline-flex items-center justify-center p-2 rounded-lg bg-gray-100 hover:bg-rose-50 dark:bg-zinc-800 dark:hover:bg-rose-950/40 text-gray-700 hover:text-rose-600 dark:text-gray-300 dark:hover:text-rose-400 transition cursor-pointer shadow-2xs shrink-0"
            title="แก้ไขผลงาน"
        >
            <Edit2 size={16} />
        </button>

    );
};

export default EditAchievement;
