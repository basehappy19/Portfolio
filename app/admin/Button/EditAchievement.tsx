'use client'
import { useAchievementModal } from '@/app/contexts/AchievementModalContext';
import { Achievement } from '@/types/Achievements';
import { Edit2 } from 'lucide-react';

const EditAchievement = ({ achievement }: { achievement: Achievement }) => {
    const { open } = useAchievementModal();

    return (
        <button
            onClick={() => open(achievement)}
            className="cursor-pointer p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg"
            title="แก้ไข"
        >
            <Edit2 size={18} />
        </button>
    );
};

export default EditAchievement;
