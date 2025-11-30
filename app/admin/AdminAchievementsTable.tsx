'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import { Award, Eye, EyeOff, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import EditAchievement from './Button/EditAchievement';
import DeleteModal from './Modal/AchievementDelete';
import { Achievement } from '@/types/Achievements';

type Props = {
    achievements: Achievement[];
    achievementsBase: string;
};

export const AdminAchievementsTable = ({
    achievements,
    achievementsBase,
}: Props) => {
    const router = useRouter();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletingItem, setDeletingItem] = useState<{
        id: string;
        title: string;
    } | null>(null);
    const [isPending, startTransition] = useTransition();

    const openDeleteModal = (achievement: Achievement) => {
        setDeletingItem({
            id: achievement.id,
            title: achievement.title_th || achievement.title_en,
        });
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (!deletingItem) return;

        startTransition(async () => {
            try {
                await fetch(`/api/admin/achievements/${deletingItem.id}`, {
                    method: 'DELETE',
                });
                // refresh หน้าให้ข้อมูลหายไปจาก table
                router.refresh();
            } catch (e) {
                console.error(e);
            } finally {
                setIsDeleteModalOpen(false);
                setDeletingItem(null);
            }
        });
    };

    return (
        <>
            <div className="bg-white dark:bg-[#282c33] rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                    ผลงาน
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                    หมวดหมู่
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                    ลำดับ
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                    สถานะ
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                    วันที่สร้าง
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                    จัดการ
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {achievements.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                                    >
                                        ไม่พบข้อมูลผลงาน
                                    </td>
                                </tr>
                            ) : (
                                achievements.map((achievement) => (
                                    <tr
                                        key={achievement.id}
                                        className="hover:bg-gray-50 dark:hover:bg-gray-800"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {achievement.images.length > 0 ? (
                                                    <Image
                                                        src={`${achievementsBase}/${achievement.id}/${achievement.images[0].url}`}
                                                        alt={
                                                            achievement.images[0].altText_en ??
                                                            achievement.title_en ??
                                                            ''
                                                        }
                                                        width={64}
                                                        height={64}
                                                        className="w-16 h-16 object-cover rounded"
                                                    />
                                                ) : (
                                                    <div className="w-16 h-16 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded">
                                                        <Award className="w-8 h-8 text-red-300" />
                                                    </div>
                                                )}
                                                <div>
                                                    <div className="font-medium text-gray-900 dark:text-white">
                                                        {achievement.title_th}
                                                    </div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                        {achievement.title_en}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {achievement.categories[0] && (
                                                <span className="px-3 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                                                    {achievement.categories[0].category.name_th}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                                            {achievement.sortOrder}
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                className={`flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full ${achievement.status === 'PUBLIC'
                                                        ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
                                                    }`}
                                            >
                                                {achievement.status === 'PUBLIC' ? (
                                                    <Eye size={14} />
                                                ) : (
                                                    <EyeOff size={14} />
                                                )}
                                                {achievement.status === 'PUBLIC'
                                                    ? 'เผยแพร่'
                                                    : 'แบบร่าง'}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                            {achievement.createdAt.toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <EditAchievement achievement={achievement} />
                                                <button
                                                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg"
                                                    title="ลบ"
                                                    onClick={() => openDeleteModal(achievement)}
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setDeletingItem(null);
                }}
                onConfirm={confirmDelete}
                itemName={deletingItem?.title}
                isLoading={isPending}
            />
        </>
    );
};
