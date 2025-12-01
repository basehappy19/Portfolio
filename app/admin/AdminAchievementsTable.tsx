'use client';

import React, { useState, useTransition } from 'react';
import Image from 'next/image';
import { Award, Calendar, ExternalLink, Eye, EyeOff, ImagePlus, Link2, MapPin, Trash2 } from 'lucide-react';
import DeleteModal from './Modal/AchievementDelete';
import { Achievement } from '@/types/Achievements';
import EditAchievement from './Button/EditAchievement';

type Props = {
    achievements: Achievement[];
    achievementsBase: string;
};

export const AdminAchievementsTable = ({
    achievements,
    achievementsBase,
}: Props) => {
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleteAnimating, setIsDeleteAnimating] = useState(false);
    const [deletingItem, setDeletingItem] = useState<{ id: string; title: string } | null>(null);
    const [isPending, startTransition] = useTransition();

    const toggleRow = (id: string) => {
        const newExpanded = new Set(expandedRows);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedRows(newExpanded);
    };

    const openDeleteModal = (achievement: Achievement) => {
        setDeletingItem({
            id: achievement.id,
            title: achievement.title_th || achievement.title_en,
        });
        setIsDeleteAnimating(true);
        setIsDeleteModalOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeDeleteModal = () => {
        setIsDeleteAnimating(false);
        setTimeout(() => {
            setIsDeleteModalOpen(false);
            setDeletingItem(null);
            document.body.style.overflow = 'unset';
        }, 200);
    };

    const confirmDelete = () => {
        if (!deletingItem) return;
        startTransition(async () => {
            try {
                await fetch(`/api/admin/achievements/${deletingItem.id}`, {
                    method: 'DELETE',
                });
            } catch (e) {
                console.error(e);
            } finally {
                closeDeleteModal();
            }
        });
    };

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('th-TH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        }).format(date);
    };

    return (
        <>
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-linear-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-800 border-b-2 border-blue-200 dark:border-gray-700">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                    ผลงาน
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                    ระดับรางวัล
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                    หมวดหมู่
                                </th>
                                <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                    ลำดับ
                                </th>
                                <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                    สถานะ
                                </th>
                                <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                    ไฟล์แนบ
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                    จัดการ
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {achievements.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-16 text-center">
                                        <div className="flex flex-col items-center justify-center text-gray-400">
                                            <Award className="w-16 h-16 mb-4 opacity-50" />
                                            <p className="text-lg font-medium">ไม่พบข้อมูลผลงาน</p>
                                            <p className="text-sm mt-1">เริ่มต้นสร้างผลงานใหม่ของคุณ</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                achievements.map((achievement) => (
                                    <React.Fragment key={achievement.id}>
                                        <tr
                                            key={achievement.id}
                                            className="hover:bg-blue-50 dark:hover:bg-gray-800 transition-colors duration-150 cursor-pointer"
                                            onClick={() => toggleRow(achievement.id)}
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    {achievement.images.length > 0 ? (
                                                        <div className="relative w-20 h-20 shrink-0">
                                                            <Image
                                                                fill
                                                                src={`${achievementsBase}/${achievement.id}/${achievement.images[0].url}`}
                                                                alt={achievement.images[0].altText_th ?? achievement.title_th}
                                                                className="w-full h-full object-cover rounded-lg shadow-md ring-2 ring-blue-100 dark:ring-gray-700"
                                                            ></Image>
                                                            {achievement.images.length > 1 && (
                                                                <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
                                                                    +{achievement.images.length - 1}
                                                                </span>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div className="w-20 h-20 flex items-center justify-center bg-linear-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-lg shadow-md">
                                                            <Award className="w-10 h-10 text-gray-400" />
                                                        </div>
                                                    )}
                                                    <div className="min-w-0 flex-1">
                                                        <div className="font-semibold text-gray-900 dark:text-white text-base mb-1 truncate">
                                                            {achievement.title_th}
                                                        </div>
                                                        <div className="text-sm text-gray-500 dark:text-gray-400 truncate mb-1">
                                                            {achievement.title_en}
                                                        </div>
                                                        {achievement.location_th && (
                                                            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                                                <MapPin className="w-3 h-3" />
                                                                <span>{achievement.location_th}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {achievement.awardLevel_th ? (
                                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-linear-to-r from-yellow-100 to-amber-100 dark:from-yellow-900 dark:to-amber-900 text-yellow-800 dark:text-yellow-200 rounded-lg font-medium text-sm shadow-sm">
                                                        <Award className="w-4 h-4" />
                                                        <span>{achievement.awardLevel_th}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400 text-sm">-</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-1.5">
                                                    {achievement.categories.length > 0 ? (
                                                        achievement.categories.map((cat, idx) => (
                                                            <span
                                                                key={idx}
                                                                className="px-3 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full shadow-sm"
                                                            >
                                                                {cat.category.name_th}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="text-gray-400 text-sm">-</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className="inline-flex items-center justify-center w-10 h-10 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold rounded-lg">
                                                    {achievement.sortOrder}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <button
                                                    className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg shadow-sm transition-all ${achievement.status === 'PUBLIC'
                                                        ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800'
                                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                                        }`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        // Toggle status logic here
                                                    }}
                                                >
                                                    {achievement.status === 'PUBLIC' ? (
                                                        <Eye className="w-4 h-4" />
                                                    ) : (
                                                        <EyeOff className="w-4 h-4" />
                                                    )}
                                                    {achievement.status === 'PUBLIC' ? 'เผยแพร่' : 'แบบร่าง'}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex items-center justify-center gap-3">
                                                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                                                        <ImagePlus className="w-4 h-4" />
                                                        <span className="text-sm font-medium">{achievement.images.length}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                                                        <Link2 className="w-4 h-4" />
                                                        <span className="text-sm font-medium">{achievement.links.length}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <div onClick={(e) => e.stopPropagation()}>
                                                        <EditAchievement achievement={achievement} />
                                                    </div>
                                                    <button
                                                        className="cursor-pointer p-2.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors shadow-sm hover:shadow"
                                                        title="ลบ"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            openDeleteModal(achievement);
                                                        }}
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>

                                        {/* Expanded Row Details */}
                                        {expandedRows.has(achievement.id) && (
                                            <tr className="bg-gray-50 dark:bg-gray-800">
                                                <td colSpan={7} className="px-6 py-6">
                                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                        {/* Left Column */}
                                                        <div className="space-y-4">
                                                            {/* Description */}
                                                            <div className="bg-white dark:bg-gray-900 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                                                                <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                                                                    <div className="w-1 h-4 bg-blue-600 rounded"></div>
                                                                    คำอธิบาย
                                                                </h4>
                                                                <div className="space-y-2">
                                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                                        <span className="font-medium">TH:</span> {achievement.description_th || '-'}
                                                                    </p>
                                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                                        <span className="font-medium">EN:</span> {achievement.description_en || '-'}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            {/* Dates */}
                                                            <div className="bg-white dark:bg-gray-900 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                                                                <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                                                                    <div className="w-1 h-4 bg-green-600 rounded"></div>
                                                                    วันที่
                                                                </h4>
                                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                                    <div className="flex items-center gap-2">
                                                                        <Calendar className="w-4 h-4 text-green-600" />
                                                                        <div>
                                                                            <p className="text-xs text-gray-500">วันที่ได้รับ</p>
                                                                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                                                {achievement.receivedAt ? formatDate(achievement.receivedAt) : '-'}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-center gap-2">
                                                                        <Calendar className="w-4 h-4 text-blue-600" />
                                                                        <div>
                                                                            <p className="text-xs text-gray-500">วันที่สร้าง</p>
                                                                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                                                {formatDate(achievement.createdAt)}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-center gap-2">
                                                                        <Calendar className="w-4 h-4 text-purple-600" />
                                                                        <div>
                                                                            <p className="text-xs text-gray-500">อัปเดตล่าสุด</p>
                                                                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                                                {formatDate(achievement.updatedAt)}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Links */}
                                                            {achievement.links.length > 0 && (
                                                                <div className="bg-white dark:bg-gray-900 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                                                                    <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                                                                        <div className="w-1 h-4 bg-purple-600 rounded"></div>
                                                                        ลิงก์ที่เกี่ยวข้อง
                                                                    </h4>
                                                                    <div className="space-y-2">
                                                                        {achievement.links.map((link) => (
                                                                            <a
                                                                                key={link.id}
                                                                                href={link.url}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors group"
                                                                            >
                                                                                <ExternalLink className="w-4 h-4 text-purple-600 shrink-0" />
                                                                                <div className="flex-1 min-w-0">
                                                                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-purple-600 truncate">
                                                                                        {link.label_th}
                                                                                    </p>
                                                                                    <p className="text-xs text-gray-500 truncate">{link.url}</p>
                                                                                </div>
                                                                            </a>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Right Column - Images */}
                                                        {achievement.images.length > 0 && (
                                                            <div className="bg-white dark:bg-gray-900 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                                                                <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                                                                    <div className="w-1 h-4 bg-pink-600 rounded"></div>
                                                                    รูปภาพทั้งหมด ({achievement.images.length})
                                                                </h4>
                                                                <div className="grid grid-cols-2 gap-3">
                                                                    {achievement.images.map((image) => (
                                                                        <div key={image.id} className="group relative">
                                                                            <Image
                                                                                src={`${achievementsBase}/${achievement.id}/${image.url}`}
                                                                                alt={image.altText_th ?? achievement.title_th}
                                                                                fill
                                                                                className="w-full h-32 object-cover rounded-lg shadow-md group-hover:shadow-xl transition-shadow"
                                                                            ></Image>
                                                                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 rounded-lg transition-all flex items-end p-2">
                                                                                <p className="text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                                                                                    {image.altText_th || 'No description'}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <DeleteModal
                isOpen={isDeleteModalOpen}
                isAnimating={isDeleteAnimating}
                onClose={closeDeleteModal}
                onConfirm={confirmDelete}
                itemName={deletingItem?.title}
                isLoading={isPending}
            />

        </>
    );
};
