'use client';

import React, { useState, useTransition } from 'react';
import Image from 'next/image';
import {
    Award,
    Calendar,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ChevronUp,
    Download,
    ExternalLink,
    Eye,
    EyeOff,
    ImagePlus,
    Link2,
    MapPin,
    Trash2,
    ZoomIn,
    X, // ✅ เพิ่มเข้ามาเพื่อใช้ในปุ่มปิด lightbox
} from 'lucide-react';
import DeleteModal from './Modal/AchievementDelete';
import { Achievement } from '@/types/Achievements';
import EditAchievement from './Button/EditAchievement';
import { useRouter } from 'next/navigation';
import {
    changeAchievementSortOrder,
    deleteAchievement,
    toggleAchievementStatus,
} from './services/achievements';
import toast from 'react-hot-toast';

type Props = {
    achievements: Achievement[];
};

export const AdminAchievementsTable = ({ achievements }: Props) => {
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleteAnimating, setIsDeleteAnimating] = useState(false);
    const [deletingItem, setDeletingItem] = useState<{
        id: string;
        title: string;
    } | null>(null);

    const [lightbox, setLightbox] = useState<{
        achievementId: string;
        index: number;
    } | null>(null);
    const [isImagesAnimating, setIsImagesAnimating] = useState(false);

    const sortOrders = achievements.map((a) => a.sortOrder);
    const minSortOrder = Math.min(...sortOrders);
    const maxSortOrder = Math.max(...sortOrders);

    const [isPending, startTransition] = useTransition();
    const router = useRouter();

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
                await deleteAchievement(deletingItem.id);

                toast.success(`ลบผลงาน "${deletingItem.title}" เรียบร้อยแล้ว`);
                router.refresh();
            } catch (error) {
                console.error('Delete error:', error);
                toast.error('ไม่สามารถลบผลงานได้ กรุณาลองใหม่อีกครั้ง');
            } finally {
                closeDeleteModal();
            }
        });
    };

    const handleChangeSortOrder = (
        id: string,
        direction: 'up' | 'down',
        currentSortOrder: number
    ) => {
        const newSortOrder =
            direction === 'up' ? currentSortOrder + 1 : currentSortOrder - 1;

        if (newSortOrder < 1) {
            toast.error('ลำดับต้องมากกว่า 0');
            return;
        }

        startTransition(async () => {
            try {
                await changeAchievementSortOrder(id, newSortOrder);
                toast.success('เปลี่ยนลำดับเรียบร้อยแล้ว');
                router.refresh();
            } catch (error) {
                console.error('Change sortOrder error:', error);
                toast.error('ไม่สามารถเปลี่ยนลำดับได้ กรุณาลองใหม่อีกครั้ง');
            }
        });
    };

    const handleToggleStatus = (id: string, currentStatus: 'PUBLIC' | 'DRAFT') => {
        startTransition(async () => {
            try {
                const data = await toggleAchievementStatus(id, currentStatus);

                toast.success(
                    data.status === 'PUBLIC'
                        ? 'เผยแพร่ผลงานแล้ว'
                        : 'บันทึกเป็นแบบร่างแล้ว'
                );
                router.refresh();
            } catch {
                toast.error('เปลี่ยนสถานะไม่สำเร็จ');
            }
        });
    };

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('th-TH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        }).format(date);
    };

    // ==========================
    //   IMAGE / LIGHTBOX LOGIC
    // ==========================

    const activeAchievement =
        achievements.find((a) => a.id === lightbox?.achievementId) ?? null;

    const activeImages = activeAchievement?.images ?? [];
    const currentIndex = lightbox?.index ?? 0;
    const selectedImage =
        activeImages.length > 0 && currentIndex >= 0
            ? activeImages[currentIndex]
            : null;

    // เปิด lightbox พร้อมจำว่าเป็นผลงานไหน รูป index ไหน
    const openLightbox = (achievementId: string, index: number) => {
        setIsImagesAnimating(true);
        setLightbox({ achievementId, index });
    };

    const closeLightbox = () => {
        setIsImagesAnimating(false);
        setTimeout(() => {
            setLightbox(null);
            document.body.style.overflow = 'unset';
        }, 200);
    };

    const goToNext = () => {
        if (!lightbox || activeImages.length === 0) return;
        const nextIndex = (lightbox.index + 1) % activeImages.length;
        setLightbox({ ...lightbox, index: nextIndex });
    };

    const goToPrev = () => {
        if (!lightbox || activeImages.length === 0) return;
        const prevIndex =
            (lightbox.index - 1 + activeImages.length) % activeImages.length;
        setLightbox({ ...lightbox, index: prevIndex });
    };

    // ✅ keyboard navigation (ESC, ←, →)
    React.useEffect(() => {
        if (!lightbox) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') goToNext();
            if (e.key === 'ArrowLeft') goToPrev();
        };

        document.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lightbox, activeImages.length]);

    return (
        <>
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-linear-to-r from-red-50 to-rose-50 dark:from-gray-800 dark:to-gray-800 border-b-2 border-red-200 dark:border-gray-700">
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
                                            <p className="text-sm mt-1">
                                                เริ่มต้นสร้างผลงานใหม่ของคุณ
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                achievements.map((achievement) => (
                                    <React.Fragment key={achievement.id}>
                                        <tr
                                            className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-150 cursor-pointer"
                                            onClick={() => toggleRow(achievement.id)}
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    {achievement.images.length > 0 ? (
                                                        <div className="relative w-20 h-20 shrink-0">
                                                            <Image
                                                                fill
                                                                src={achievement.images[0].url}
                                                                alt={
                                                                    achievement.images[0].altText_th ??
                                                                    achievement.title_th
                                                                }
                                                                className="object-cover rounded-lg shadow-md ring-2 ring-red-100 dark:ring-gray-700"
                                                                sizes="80px"
                                                            />
                                                            {achievement.images.length > 1 && (
                                                                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
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
                                                                className="px-3 py-1 text-xs font-medium bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-full shadow-sm"
                                                            >
                                                                {cat.category.name_th}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="text-gray-400 text-sm">-</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td
                                                className="px-6 py-4 text-center"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <div className="inline-flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg px-2 py-1 shadow-sm">
                                                    <button
                                                        className="dark:text-white cursor-pointer p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
                                                        title="เลื่อนขึ้น"
                                                        disabled={
                                                            achievements.length <= 1 ||
                                                            achievement.sortOrder === maxSortOrder
                                                        }
                                                        onClick={() =>
                                                            handleChangeSortOrder(
                                                                achievement.id,
                                                                'up',
                                                                achievement.sortOrder
                                                            )
                                                        }
                                                    >
                                                        <ChevronUp className="w-4 h-4" />
                                                    </button>

                                                    <span className="inline-flex items-center justify-center w-10 h-8 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded">
                                                        {achievement.sortOrder}
                                                    </span>

                                                    <button
                                                        className="dark:text-white cursor-pointer p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
                                                        title="เลื่อนลง"
                                                        disabled={
                                                            achievements.length <= 1 ||
                                                            achievement.sortOrder === minSortOrder
                                                        }
                                                        onClick={() =>
                                                            handleChangeSortOrder(
                                                                achievement.id,
                                                                'down',
                                                                achievement.sortOrder
                                                            )
                                                        }
                                                    >
                                                        <ChevronDown className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <button
                                                    className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg shadow-sm transition-all ${achievement.status === 'PUBLIC'
                                                        ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800'
                                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                                        }`}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleToggleStatus(achievement.id, achievement.status);
                                                    }}
                                                >
                                                    {achievement.status === 'PUBLIC' ? (
                                                        <Eye className="w-4 h-4" />
                                                    ) : (
                                                        <EyeOff className="w-4 h-4" />
                                                    )}
                                                    {achievement.status === 'PUBLIC'
                                                        ? 'เผยแพร่'
                                                        : 'แบบร่าง'}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex items-center justify-center gap-3">
                                                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                                                        <ImagePlus className="w-4 h-4" />
                                                        <span className="text-sm font-medium">
                                                            {achievement.images.length}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                                                        <Link2 className="w-4 h-4" />
                                                        <span className="text-sm font-medium">
                                                            {achievement.links.length}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center justify-end gap-2">
                                                    <div onClick={(e) => e.stopPropagation()}>
                                                        <EditAchievement achievement={achievement} />
                                                    </div>
                                                    <button
                                                        className="dark:bg-[#282c33] cursor-pointer p-2.5 text-red-600 hover:bg-white dark:hover:bg-red-900 rounded-lg transition-colors shadow-sm hover:shadow"
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
                                            <tr className="bg-white dark:bg-gray-800">
                                                <td colSpan={7} className="px-6 py-6">
                                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                                        {/* Left Column */}
                                                        <div className="space-y-4">
                                                            {/* Description */}
                                                            <div className="bg-white dark:bg-gray-900 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                                                                <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                                                                    <div className="w-1 h-4 bg-blue-600 rounded" />
                                                                    คำอธิบาย
                                                                </h4>
                                                                <div className="space-y-2">
                                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                                        <span className="font-medium">TH:</span>{' '}
                                                                        {achievement.description_th || '-'}
                                                                    </p>
                                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                                        <span className="font-medium">EN:</span>{' '}
                                                                        {achievement.description_en || '-'}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            {/* Given By */}
                                                            {(achievement.given_by_th ||
                                                                achievement.given_by_en) && (
                                                                    <div className="bg-white dark:bg-gray-900 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                                                                        <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                                                                            <div className="w-1 h-4 bg-yellow-600 rounded" />
                                                                            ผู้มอบรางวัล
                                                                        </h4>
                                                                        <div className="space-y-2">
                                                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                                                <span className="font-medium">TH:</span>{' '}
                                                                                {achievement.given_by_th || '-'}
                                                                            </p>
                                                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                                                <span className="font-medium">EN:</span>{' '}
                                                                                {achievement.given_by_en || '-'}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                )}

                                                            {/* Dates */}
                                                            <div className="bg-white dark:bg-gray-900 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                                                                <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
                                                                    <div className="w-1 h-4 bg-green-600 rounded" />
                                                                    วันที่
                                                                </h4>
                                                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                                    <div className="flex items-center gap-2">
                                                                        <Calendar className="w-4 h-4 text-green-600" />
                                                                        <div>
                                                                            <p className="text-xs text-gray-500">
                                                                                วันที่ได้รับ
                                                                            </p>
                                                                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                                                {achievement.receivedAt
                                                                                    ? formatDate(achievement.receivedAt)
                                                                                    : '-'}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-center gap-2">
                                                                        <Calendar className="w-4 h-4 text-blue-600" />
                                                                        <div>
                                                                            <p className="text-xs text-gray-500">
                                                                                วันที่สร้าง
                                                                            </p>
                                                                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                                                {formatDate(achievement.createdAt)}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex items-center gap-2">
                                                                        <Calendar className="w-4 h-4 text-purple-600" />
                                                                        <div>
                                                                            <p className="text-xs text-gray-500">
                                                                                อัปเดตล่าสุด
                                                                            </p>
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
                                                                        <div className="w-1 h-4 bg-purple-600 rounded" />
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
                                                                                    <p className="text-xs text-gray-500 truncate">
                                                                                        {link.url}
                                                                                    </p>
                                                                                </div>
                                                                            </a>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Gallery Grid */}
                                                        {achievement.images.length > 0 && (
                                                            <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700">
                                                                <div className="flex items-center justify-between mb-6">
                                                                    <h4 className="text-lg font-bold text-gray-700 dark:text-gray-300 flex items-center gap-3">
                                                                        รูปภาพทั้งหมด
                                                                        <span className="ml-2 px-3 py-1 bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-300 rounded-full text-sm font-semibold">
                                                                            {achievement.images.length}
                                                                        </span>
                                                                    </h4>
                                                                </div>

                                                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                                                    {achievement.images.map((image, index) => (
                                                                        <div
                                                                            key={image.id}
                                                                            className="group relative aspect-square cursor-pointer overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-700"
                                                                            onClick={() =>
                                                                                openLightbox(achievement.id, index)
                                                                            }
                                                                        >
                                                                            <Image
                                                                                fill
                                                                                src={image.url}
                                                                                alt={
                                                                                    image.altText_th ??
                                                                                    achievement.title_th
                                                                                }
                                                                                className="object-cover transition-all duration-300 group-hover:scale-110"
                                                                                sizes="(min-width: 1024px) 25vw, 50vw"
                                                                            />

                                                                            {/* Overlay */}
                                                                            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                                                <div className="absolute inset-0 flex items-center justify-center">
                                                                                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                                                                                        <ZoomIn className="w-6 h-6 text-white" />
                                                                                    </div>
                                                                                </div>
                                                                                <div className="absolute bottom-0 left-0 right-0 p-3">
                                                                                    <p className="text-white text-sm font-medium line-clamp-2">
                                                                                        {image.altText_th || 'ไม่มีคำอธิบาย'}
                                                                                    </p>
                                                                                </div>
                                                                            </div>

                                                                            {/* Image Counter Badge */}
                                                                            <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-full">
                                                                                {index + 1}/{achievement.images.length}
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

            {activeAchievement && selectedImage && (
                <>
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/40"
                        onClick={closeLightbox}
                        style={{
                            animation: isImagesAnimating ? 'modalFadeIn 0.2s ease-out' : 'modalFadeOut 0.2s ease-in'
                        }}

                    >
                        {/* Close Button */}
                        <button
                            onClick={closeLightbox}
                            className="cursor-pointer absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-200 group z-50"
                            title="ปิด (ESC)"
                        >
                            <X className="w-6 h-6 text-white group-hover:rotate-90 transition-transform duration-300" />
                        </button>

                        {/* Previous Button */}
                        {activeImages.length > 1 && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    goToPrev();
                                }}
                                className="cursor-pointer absolute left-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-200 group z-50"
                                title="ก่อนหน้า (←)"
                            >
                                <ChevronLeft className="w-6 h-6 text-white group-hover:-translate-x-1 transition-transform duration-200" />
                            </button>
                        )}

                        {/* Next Button */}
                        {activeImages.length > 1 && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    goToNext();
                                }}
                                className="cursor-pointer absolute right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-all duration-200 group z-50"
                                title="ถัดไป (→)"
                            >
                                <ChevronRight className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform duration-200" />
                            </button>
                        )}

                        {/* Image Container */}
                        <div
                            className="relative max-w-7xl w-full mx-4 h-[80vh]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Image
                                fill
                                src={selectedImage.url}
                                alt={selectedImage.altText_th ?? activeAchievement.title_th}
                                className="object-contain rounded-lg shadow-2xl"
                                sizes="90vw"
                            />

                            {/* Image Info Bar */}
                            <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent p-6 rounded-b-lg">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <p className="text-white font-semibold text-lg mb-1">
                                            {selectedImage.altText_th || 'ไม่มีคำอธิบาย'}
                                        </p>
                                        <p className="text-white/70 text-sm">
                                            รูปที่ {currentIndex + 1} จาก {activeImages.length}
                                        </p>
                                    </div>
                                    <a
                                        href={selectedImage.url}
                                        download
                                        onClick={(e) => e.stopPropagation()}
                                        className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg transition-all duration-200 text-white font-medium"
                                    >
                                        <Download className="w-4 h-4" />
                                        ดาวน์โหลด
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Thumbnail Strip */}
                        {activeImages.length > 1 && (
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 max-w-4xl w-full px-4">
                                <div className="flex gap-2 justify-center overflow-x-auto pb-2 scrollbar-hide">
                                    {activeImages.map((image, index) => (
                                        <button
                                            key={image.id}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setLightbox({
                                                    achievementId: activeAchievement.id,
                                                    index,
                                                });
                                            }}
                                            className={`cursor-pointer relative shrink-0 w-16 h-16 rounded-lg overflow-hidden transition-all duration-200 ${index === currentIndex
                                                ? 'ring-4 ring-white scale-110'
                                                : 'ring-2 ring-white/30 hover:ring-white/60 opacity-60 hover:opacity-100'
                                                }`}
                                        >
                                            <Image
                                                fill
                                                src={image.url}
                                                alt={image.altText_th ?? activeAchievement.title_th}
                                                className="object-cover"
                                                sizes="64px"
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}

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
