'use client';

import React, { useEffect, useState, useTransition } from 'react';
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
    X,
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
import { downloadImage } from '@/lib/download';
import { useAchievementModal } from '@/app/contexts/AchievementModalContext';

const AchievementExpandedDetails = ({
    achievement,
    formatDate,
    openLightbox,
}: {
    achievement: Achievement;
    formatDate: (date: Date) => string;
    openLightbox: (achievementId: string, index: number) => void;
}) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-left">
            {/* Left Column: Description, Given By, Dates, Links */}
            <div className="space-y-4">
                {/* Description */}
                <div className="bg-white dark:bg-zinc-900/90 rounded-xl p-4 sm:p-5 shadow-2xs border border-gray-200/80 dark:border-zinc-800">
                    <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-3.5 flex items-center gap-2">
                        <div className="w-1 h-4 bg-rose-500 rounded-full" />
                        <span>คำอธิบายผลงาน</span>
                    </h4>
                    <div className="space-y-4">
                        <div>
                            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 block">
                                ภาษาไทย:
                            </span>
                            {achievement.description_th ? (
                                <div
                                    className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 prose prose-sm dark:prose-invert max-w-none [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_h2]:text-base [&_h2]:font-bold [&_h2]:mt-2 [&_h3]:text-sm [&_h3]:font-semibold [&_p]:mb-1 leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: achievement.description_th }}
                                />
                            ) : (
                                <span className="text-xs text-gray-400 italic">- ไม่มีข้อมูลภาษาไทย -</span>
                            )}
                        </div>

                        <div className="border-t border-gray-100 dark:border-zinc-800" />

                        <div>
                            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 block">
                                ภาษาอังกฤษ:
                            </span>
                            {achievement.description_en ? (
                                <div
                                    className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 prose prose-sm dark:prose-invert max-w-none [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_h2]:text-base [&_h2]:font-bold [&_h2]:mt-2 [&_h3]:text-sm [&_h3]:font-semibold [&_p]:mb-1 leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: achievement.description_en }}
                                />
                            ) : (
                                <span className="text-xs text-gray-400 italic">- ไม่มีข้อมูลภาษาอังกฤษ -</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Given By */}
                {(achievement.given_by_th || achievement.given_by_en) && (
                    <div className="bg-white dark:bg-zinc-900/90 rounded-xl p-4 sm:p-5 shadow-2xs border border-gray-200/80 dark:border-zinc-800">
                        <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-3.5 flex items-center gap-2">
                            <div className="w-1 h-4 bg-amber-500 rounded-full" />
                            <span>ผู้มอบรางวัล / องค์กร</span>
                        </h4>
                        <div className="space-y-2 text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                            <p className="wrap-break-word whitespace-pre-wrap">
                                <strong className="text-gray-800 dark:text-gray-200">TH:</strong> {achievement.given_by_th || "-"}
                            </p>
                            <p className="wrap-break-word whitespace-pre-wrap">
                                <strong className="text-gray-800 dark:text-gray-200">EN:</strong> {achievement.given_by_en || "-"}
                            </p>
                        </div>
                    </div>
                )}

                {/* Dates */}
                <div className="bg-white dark:bg-zinc-900/90 rounded-xl p-4 sm:p-5 shadow-2xs border border-gray-200/80 dark:border-zinc-800">
                    <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-3.5 flex items-center gap-2">
                        <div className="w-1 h-4 bg-emerald-500 rounded-full" />
                        <span>วันที่และเวลา</span>
                    </h4>
                    <div className="grid grid-cols-1 xs:grid-cols-3 gap-3">
                        <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-gray-50 dark:bg-zinc-800/50">
                            <Calendar className="w-4 h-4 text-emerald-500 shrink-0" />
                            <div className="min-w-0">
                                <p className="text-[10px] sm:text-xs text-gray-400 font-medium">วันที่ได้รับ</p>
                                <p className="text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-200 wrap-break-word">
                                    {achievement.receivedAt ? formatDate(achievement.receivedAt) : "-"}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-gray-50 dark:bg-zinc-800/50">
                            <Calendar className="w-4 h-4 text-blue-500 shrink-0" />
                            <div className="min-w-0">
                                <p className="text-[10px] sm:text-xs text-gray-400 font-medium">วันที่สร้าง</p>
                                <p className="text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-200 wrap-break-word">
                                    {formatDate(achievement.createdAt)}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-gray-50 dark:bg-zinc-800/50">
                            <Calendar className="w-4 h-4 text-violet-500 shrink-0" />
                            <div className="min-w-0">
                                <p className="text-[10px] sm:text-xs text-gray-400 font-medium">อัปเดตล่าสุด</p>
                                <p className="text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-200 wrap-break-word">
                                    {formatDate(achievement.updatedAt)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* External Links */}
                {achievement.links.length > 0 && (
                    <div className="bg-white dark:bg-zinc-900/90 rounded-xl p-4 sm:p-5 shadow-2xs border border-gray-200/80 dark:border-zinc-800">
                        <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-3.5 flex items-center gap-2">
                            <div className="w-1 h-4 bg-purple-500 rounded-full" />
                            <span>ลิงก์ที่เกี่ยวข้อง</span>
                        </h4>
                        <div className="space-y-2">
                            {achievement.links.map((link) => (
                                <a
                                    key={link.id}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2.5 p-2.5 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-xl transition-all border border-gray-100 dark:border-zinc-800 group"
                                >
                                    <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/40 flex items-center justify-center text-purple-600 dark:text-purple-400 shrink-0">
                                        <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-gray-200 group-hover:text-purple-600 dark:group-hover:text-purple-400 line-clamp-1">
                                            {link.label_th || link.label_en || link.url}
                                        </p>
                                        <p className="text-[11px] text-gray-400 break-all line-clamp-1">
                                            {link.url}
                                        </p>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Right Column: Gallery Grid */}
            <div>
                {achievement.images.length > 0 ? (
                    <div className="bg-white dark:bg-zinc-900/90 rounded-xl p-4 sm:p-6 shadow-2xs border border-gray-200/80 dark:border-zinc-800">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                                <div className="w-1 h-4 bg-pink-500 rounded-full" />
                                <span>รูปภาพทั้งหมด</span>
                            </h4>
                            <span className="px-2.5 py-0.5 bg-pink-50 dark:bg-pink-950/50 text-pink-600 dark:text-pink-400 border border-pink-200/60 dark:border-pink-800/60 rounded-full text-xs font-bold">
                                {achievement.images.length} รูป
                            </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {achievement.images.map((image, index) => (
                                <div
                                    key={image.id}
                                    className="group relative aspect-square cursor-pointer overflow-hidden rounded-xl bg-gray-100 dark:bg-zinc-800 border border-gray-200/50 dark:border-zinc-700 shadow-2xs"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        openLightbox(achievement.id, index);
                                    }}
                                >
                                    <Image
                                        fill
                                        src={image.url}
                                        alt={image.altText_th ?? achievement.title_th}
                                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                                        sizes="(min-width: 1024px) 25vw, 50vw"
                                    />

                                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-between p-2.5">
                                        <div className="flex justify-end">
                                            <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                                {index + 1}/{achievement.images.length}
                                            </span>
                                        </div>
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="bg-white/20 backdrop-blur-md rounded-full p-2.5 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                                                <ZoomIn className="w-5 h-5 text-white" />
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-white text-[11px] font-medium line-clamp-1">
                                                {image.altText_th || "ไม่มีคำอธิบาย"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="bg-white dark:bg-zinc-900/90 rounded-xl p-8 shadow-2xs border border-gray-200/80 dark:border-zinc-800 flex flex-col items-center justify-center text-center text-gray-400">
                        <ImagePlus className="w-12 h-12 mb-2 opacity-30" />
                        <p className="text-sm font-medium">ยังไม่มีรูปภาพในผลงานนี้</p>
                        <p className="text-xs mt-0.5 text-gray-400">คุณสามารถเพิ่มรูปภาพได้ผ่านปุ่มแก้ไขผลงาน</p>
                    </div>
                )}
            </div>
        </div>
    );
};

type Props = {
    achievements: Achievement[];
};


export const AdminAchievementsTable = ({ achievements }: Props) => {
    const { open } = useAchievementModal();
    const [isDownloading, setIsDownloading] = useState(false);
    const [localAchievements, setLocalAchievements] = useState(achievements);
    const [isPending, startTransition] = useTransition();
    const [workingId, setWorkingId] = useState<string | null>(null);
    const router = useRouter();

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
    const [sortInputValues, setSortInputValues] = useState<Record<string, string>>({});

    const minSortOrder = Math.min(...localAchievements.map(a => a.sortOrder));
    const maxSortOrder = Math.max(...localAchievements.map(a => a.sortOrder));

    // keep local copy in sync when the server sends a new list (adjust state during render)
    const [prevAchievements, setPrevAchievements] = useState(achievements);
    if (achievements !== prevAchievements) {
        setPrevAchievements(achievements);
        setLocalAchievements(achievements);
    }

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const params = new URLSearchParams(window.location.search);
        const editId = params.get('edit');
        if (editId && localAchievements.length > 0) {
            const target = localAchievements.find(a => a.id === editId);
            if (target) {
                open(target);
                const newUrl = window.location.pathname;
                window.history.replaceState({}, '', newUrl);
            }
        }
    }, [localAchievements, open]);

    const [prevLocal, setPrevLocal] = useState<typeof localAchievements | null>(null);
    if (localAchievements !== prevLocal) {
        setPrevLocal(localAchievements);
        setSortInputValues(
            localAchievements.reduce((acc, a) => {
                acc[a.id] = String(a.sortOrder);
                return acc;
            }, {} as Record<string, string>)
        );
    }

    const handleSetSortOrder = (id: string, targetSortOrder: number) => {
        if (localAchievements.length <= 1) return;

        const sorted = [...localAchievements].sort(
            (a, b) => b.sortOrder - a.sortOrder
        );

        const currentIndex = sorted.findIndex(a => a.id === id);
        if (currentIndex === -1) return;

        const maxOrder = sorted.length;
        const clamped = Math.max(1, Math.min(maxOrder, Math.round(targetSortOrder)));

        const currentOrder = sorted[currentIndex].sortOrder;
        if (clamped === currentOrder) {
            setSortInputValues(prev => ({
                ...prev,
                [id]: String(currentOrder),
            }));
            return;
        }

        const targetIndex = maxOrder - clamped;

        const newList = [...sorted];
        const [moved] = newList.splice(currentIndex, 1);
        newList.splice(targetIndex, 0, moved);

        const reindexed = newList.map((a, index) => ({
            ...a,
            sortOrder: maxOrder - index,
        }));

        setLocalAchievements(reindexed);
        setWorkingId(id);

        startTransition(async () => {
            try {
                await changeAchievementSortOrder(id, clamped);
                toast.success("เปลี่ยนลำดับเรียบร้อยแล้ว");
                router.refresh();
            } catch (error) {
                console.error("Change sortOrder error:", error);
                toast.error("ไม่สามารถเปลี่ยนลำดับได้ กรุณาลองใหม่อีกครั้ง");
                setLocalAchievements(achievements);
            } finally {
                setWorkingId(null);
            }
        });
    };


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
    ) => {
        if (localAchievements.length <= 1) return;

        const sorted = [...localAchievements].sort(
            (a, b) => b.sortOrder - a.sortOrder
        );

        const currentIndex = sorted.findIndex(a => a.id === id);
        if (currentIndex === -1) return;

        const targetIndex =
            direction === 'up' ? currentIndex - 1 : currentIndex + 1;

        if (targetIndex < 0 || targetIndex >= sorted.length) return;

        const newList = [...sorted];
        const [moved] = newList.splice(currentIndex, 1);
        newList.splice(targetIndex, 0, moved);

        const maxOrder = newList.length;
        let newSortOrderForClicked = moved.sortOrder;

        const reindexed = newList.map((a, index) => {
            const sortOrder = maxOrder - index;
            if (a.id === id) {
                newSortOrderForClicked = sortOrder;
            }
            return {
                ...a,
                sortOrder,
            };
        });

        setLocalAchievements(reindexed);
        setWorkingId(id);

        startTransition(async () => {
            try {
                await changeAchievementSortOrder(id, newSortOrderForClicked);
                toast.success('เปลี่ยนลำดับเรียบร้อยแล้ว');
                router.refresh();
            } catch (error) {
                console.error('Change sortOrder error:', error);
                toast.error('ไม่สามารถเปลี่ยนลำดับได้ กรุณาลองใหม่อีกครั้ง');
                setLocalAchievements(achievements);
            } finally {
                setWorkingId(null);
            }
        });
    };


    const handleToggleStatus = (id: string, currentStatus: 'PUBLIC' | 'DRAFT') => {
        const nextStatus = currentStatus === 'PUBLIC' ? 'DRAFT' : 'PUBLIC';

        setLocalAchievements(prev =>
            prev.map(a =>
                a.id === id ? { ...a, status: nextStatus } : a
            )
        );
        setWorkingId(id);

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
                setLocalAchievements(achievements);
            } finally {
                setWorkingId(null);
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

    const activeAchievement =
        achievements.find((a) => a.id === lightbox?.achievementId) ?? null;

    const activeImages = activeAchievement?.images ?? [];
    const currentIndex = lightbox?.index ?? 0;
    const selectedImage =
        activeImages.length > 0 && currentIndex >= 0
            ? activeImages[currentIndex]
            : null;

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

    useEffect(() => {
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
            {/* Desktop / Large Screen Table Layout (hidden on screens smaller than xl) */}
            <div className="hidden xl:block bg-white dark:bg-zinc-900 rounded-2xl shadow-2xs overflow-hidden border border-gray-200/80 dark:border-zinc-800 transition-all">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50/80 dark:bg-zinc-800/60 border-b border-gray-200/80 dark:border-zinc-800">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                    ผลงาน
                                </th>
                                <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                    จัดการ
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
                                <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                                    สื่อ / รายละเอียด
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200/80 dark:divide-zinc-800/80">
                            {localAchievements.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center justify-center text-gray-400">
                                            <Award className="w-16 h-16 mb-4 opacity-40" />
                                            <p className="text-base font-semibold text-gray-600 dark:text-gray-300">ไม่พบข้อมูลผลงานในระบบ</p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                เริ่มต้นสร้างหรือเพิ่มผลงานใหม่ของคุณได้จากปุ่มด้านบน
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                localAchievements.map((achievement) => (
                                    <React.Fragment key={achievement.id}>
                                        <tr
                                            className="hover:bg-rose-50/30 dark:hover:bg-zinc-800/50 transition-colors duration-150 cursor-pointer group"
                                            onClick={() => toggleRow(achievement.id)}
                                        >
                                            <td className="px-6 py-4 align-top">
                                                <div className="flex items-start gap-4">
                                                    {achievement.images.length > 0 ? (
                                                        <div
                                                            className="relative w-20 h-20 shrink-0 rounded-xl overflow-hidden shadow-2xs border border-gray-200/60 dark:border-zinc-700 group-hover:ring-2 group-hover:ring-rose-500/30 transition-all cursor-pointer"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                openLightbox(achievement.id, 0);
                                                            }}
                                                        >
                                                            <Image
                                                                fill
                                                                src={achievement.images[0].url}
                                                                alt={achievement.images[0].altText_th ?? achievement.title_th}
                                                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                                sizes="80px"
                                                            />
                                                            {achievement.images.length > 1 && (
                                                                <span className="absolute bottom-1 right-1 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold rounded-md px-1.5 py-0.5 shadow-sm">
                                                                    +{achievement.images.length - 1}
                                                                </span>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <div className="w-20 h-20 flex items-center justify-center bg-gray-100 dark:bg-zinc-800 rounded-xl shadow-2xs border border-gray-200/60 dark:border-zinc-700 shrink-0 text-gray-400">
                                                            <Award className="w-8 h-8 opacity-50" />
                                                        </div>
                                                    )}

                                                    <div className="min-w-0 flex-1 max-w-[340px]">
                                                        <div className="font-bold text-gray-900 dark:text-white text-sm md:text-base mb-1 line-clamp-2 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                                                            {achievement.title_th}
                                                        </div>
                                                        <div className="text-xs text-gray-500 dark:text-zinc-400 mb-1 line-clamp-1">
                                                            {achievement.title_en}
                                                        </div>
                                                        {achievement.location_th && (
                                                            <div className="flex items-center gap-1 text-[11px] text-gray-400 dark:text-zinc-500 line-clamp-1">
                                                                <MapPin className="w-3 h-3 shrink-0 text-rose-500" />
                                                                <span>{achievement.location_th}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 align-middle">
                                                <div className="flex items-center justify-center gap-2">
                                                    <div onClick={(e) => e.stopPropagation()}>
                                                        <EditAchievement achievement={achievement} />
                                                    </div>
                                                    <button
                                                        className="inline-flex items-center justify-center p-2 rounded-lg bg-gray-100 hover:bg-red-50 dark:bg-zinc-800 dark:hover:bg-red-950/40 text-gray-700 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400 transition cursor-pointer shadow-2xs shrink-0"
                                                        title="ลบผลงาน"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            openDeleteModal(achievement);
                                                        }}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 align-middle">
                                                {achievement.awardLevel_th ? (
                                                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-linear-to-r from-amber-500/15 to-yellow-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30 rounded-lg font-semibold text-xs shadow-2xs">
                                                        <span>{achievement.awardLevel_th}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400 text-xs italic">- ไม่ระบุ -</span>
                                                )}
                                            </td>

                                            <td className="px-6 py-4 align-middle">
                                                <div className="flex flex-wrap gap-1.5 max-w-[220px]">
                                                    {achievement.categories.length > 0 ? (
                                                        achievement.categories.map((cat, idx) => (
                                                            <span
                                                                key={idx}
                                                                className="px-2.5 py-0.5 text-[11px] font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/60 rounded-full shadow-2xs"
                                                            >
                                                                {cat.category.name_th}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="text-gray-400 text-xs italic">- ไม่ระบุ -</span>
                                                    )}
                                                </div>
                                            </td>

                                            <td
                                                className="px-6 py-4 text-center align-middle"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                <div className={`inline-flex items-center gap-1 bg-gray-100 dark:bg-zinc-800 rounded-xl p-1 shadow-2xs border border-gray-200/60 dark:border-zinc-700 ${workingId === achievement.id ? 'opacity-60 cursor-wait' : ''}`}>
                                                    <button
                                                        className="p-1 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed transition"
                                                        title="เลื่อนขึ้น"
                                                        disabled={
                                                            localAchievements.length <= 1 ||
                                                            achievement.sortOrder === maxSortOrder ||
                                                            workingId === achievement.id
                                                        }
                                                        onClick={() => handleChangeSortOrder(achievement.id, 'up')}
                                                    >
                                                        <ChevronUp className="w-3.5 h-3.5" />
                                                    </button>

                                                    <input
                                                        type="number"
                                                        className="w-11 h-7 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white font-bold text-xs rounded-lg text-center border border-gray-200/60 dark:border-zinc-700 focus:outline-none focus:ring-2 focus:ring-rose-500/30 disabled:opacity-60 disabled:cursor-not-allowed shadow-2xs"
                                                        value={sortInputValues[achievement.id] ?? achievement.sortOrder}
                                                        disabled={workingId === achievement.id}
                                                        onClick={(e) => e.stopPropagation()}
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            setSortInputValues(prev => ({
                                                                ...prev,
                                                                [achievement.id]: value,
                                                            }));
                                                        }}
                                                        onKeyDown={(e) => {
                                                            if (e.key === "Enter") {
                                                                e.preventDefault();
                                                                const raw = sortInputValues[achievement.id] ?? "";
                                                                const num = Number(raw);

                                                                if (!Number.isFinite(num)) {
                                                                    const real = localAchievements.find(a => a.id === achievement.id)?.sortOrder ?? achievement.sortOrder;
                                                                    setSortInputValues(prev => ({
                                                                        ...prev,
                                                                        [achievement.id]: String(real),
                                                                    }));
                                                                    return;
                                                                }

                                                                handleSetSortOrder(achievement.id, num);
                                                            }
                                                        }}
                                                    />

                                                    <button
                                                        className="p-1 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed transition"
                                                        title="เลื่อนลง"
                                                        disabled={
                                                            localAchievements.length <= 1 ||
                                                            achievement.sortOrder === minSortOrder ||
                                                            workingId === achievement.id
                                                        }
                                                        onClick={() => handleChangeSortOrder(achievement.id, 'down')}
                                                    >
                                                        <ChevronDown className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </td>

                                            <td className="px-6 py-4 text-center align-middle">
                                                <button
                                                    className={`cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl shadow-2xs transition-all border ${
                                                        achievement.status === 'PUBLIC'
                                                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-800/60 hover:bg-emerald-100'
                                                            : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400 border-gray-200/60 dark:border-zinc-700 hover:bg-gray-200'
                                                    } ${workingId === achievement.id ? 'opacity-60 cursor-wait' : ''}`}
                                                    disabled={workingId === achievement.id}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleToggleStatus(achievement.id, achievement.status);
                                                    }}
                                                >
                                                    {achievement.status === 'PUBLIC' ? (
                                                        <Eye className="w-3.5 h-3.5" />
                                                    ) : (
                                                        <EyeOff className="w-3.5 h-3.5" />
                                                    )}
                                                    <span>{achievement.status === 'PUBLIC' ? 'เผยแพร่' : 'แบบร่าง'}</span>
                                                </button>
                                            </td>

                                            <td className="px-6 py-4 text-right align-middle">
                                                <div className="flex items-center justify-end gap-3">
                                                    <div className="flex items-center gap-1 text-gray-500 dark:text-zinc-400 text-xs font-semibold">
                                                        <ImagePlus className="w-4 h-4 text-rose-500" />
                                                        <span>{achievement.images.length}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-gray-500 dark:text-zinc-400 text-xs font-semibold">
                                                        <Link2 className="w-4 h-4 text-purple-500" />
                                                        <span>{achievement.links.length}</span>
                                                    </div>
                                                    <span className={`p-1 rounded-lg text-gray-400 transition-transform duration-200 ${expandedRows.has(achievement.id) ? 'rotate-180 bg-gray-100 dark:bg-zinc-800 text-rose-500' : ''}`}>
                                                        <ChevronDown className="w-4 h-4" />
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>

                                        {expandedRows.has(achievement.id) && (
                                            <tr className="bg-gray-50/70 dark:bg-zinc-800/40 border-t border-b border-gray-200/80 dark:border-zinc-800">
                                                <td colSpan={7} className="px-6 py-6 animate-fadeIn">
                                                    <AchievementExpandedDetails
                                                        achievement={achievement}
                                                        formatDate={formatDate}
                                                        openLightbox={openLightbox}
                                                    />
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

            {/* Mobile / Tablet Card Grid Layout (block on screens smaller than xl) */}
            <div className="block xl:hidden space-y-4">
                {localAchievements.length === 0 ? (
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-12 text-center border border-gray-200/80 dark:border-zinc-800 shadow-2xs">
                        <Award className="w-16 h-16 mx-auto mb-3 text-gray-400 opacity-40" />
                        <p className="text-base font-semibold text-gray-700 dark:text-gray-200">ไม่พบข้อมูลผลงานในระบบ</p>
                        <p className="text-xs text-gray-400 mt-1">เริ่มต้นสร้างหรือเพิ่มผลงานใหม่ของคุณได้จากปุ่มด้านบน</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {localAchievements.map((achievement) => (
                            <div
                                key={achievement.id}
                                className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-200/80 dark:border-zinc-800 shadow-2xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
                            >
                                {/* Card Header Image / Banner */}
                                <div>
                                    {achievement.images.length > 0 ? (
                                        <div
                                            className="relative h-44 sm:h-48 w-full bg-gray-100 dark:bg-zinc-800 cursor-pointer overflow-hidden group"
                                            onClick={() => openLightbox(achievement.id, 0)}
                                        >
                                            <Image
                                                fill
                                                src={achievement.images[0].url}
                                                alt={achievement.images[0].altText_th ?? achievement.title_th}
                                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                sizes="(min-width: 768px) 50vw, 100vw"
                                            />
                                            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-black/30"></div>

                                            {/* Top Overlay Badges */}
                                            <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-full backdrop-blur-md shadow-sm ${
                                                    achievement.status === 'PUBLIC'
                                                        ? 'bg-emerald-500/90 text-white'
                                                        : 'bg-black/60 text-gray-200'
                                                }`}>
                                                    {achievement.status === 'PUBLIC' ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                                                    <span>{achievement.status === 'PUBLIC' ? 'เผยแพร่แล้ว' : 'แบบร่าง'}</span>
                                                </span>

                                                <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-full bg-black/60 backdrop-blur-md text-white shadow-sm">
                                                    <ImagePlus className="w-3 h-3 text-rose-400" />
                                                    <span>{achievement.images.length} รูป</span>
                                                </span>
                                            </div>

                                            {/* Bottom Overlay Title (mobile preview) */}
                                            <div className="absolute bottom-2 left-3 right-3 text-white">
                                                <p className="text-xs text-rose-300 font-medium line-clamp-1">
                                                    {achievement.awardLevel_th || "พอร์ตฟอลิโอผลงาน"}
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="relative h-28 sm:h-32 w-full bg-linear-to-br from-zinc-800 to-zinc-900 flex items-center justify-between p-4 text-white">
                                            <div className="flex items-center gap-2">
                                                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                                                    <Award className="w-5 h-5 text-rose-400" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-zinc-400 font-medium">ไม่มีรูปภาพ</p>
                                                    <p className="text-sm font-bold text-white line-clamp-1">{achievement.awardLevel_th || "ผลงานทั่วไป"}</p>
                                                </div>
                                            </div>

                                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold rounded-full backdrop-blur-md shadow-sm ${
                                                achievement.status === 'PUBLIC'
                                                    ? 'bg-emerald-500/90 text-white'
                                                    : 'bg-zinc-700 text-gray-300'
                                            }`}>
                                                {achievement.status === 'PUBLIC' ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                                                <span>{achievement.status === 'PUBLIC' ? 'เผยแพร่' : 'แบบร่าง'}</span>
                                            </span>
                                        </div>
                                    )}

                                    {/* Card Content Body */}
                                    <div className="p-4 sm:p-5 space-y-3">
                                        <div>
                                            <h3 className="font-extrabold text-gray-900 dark:text-white text-base sm:text-lg leading-snug line-clamp-2">
                                                {achievement.title_th}
                                            </h3>
                                            <p className="text-xs text-gray-500 dark:text-zinc-400 mt-0.5 line-clamp-1 font-medium">
                                                {achievement.title_en}
                                            </p>
                                        </div>

                                        {/* Meta row */}
                                        <div className="flex flex-wrap items-center gap-y-1.5 gap-x-3 text-xs text-gray-500 dark:text-zinc-400">
                                            {achievement.location_th && (
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                                                    <span className="line-clamp-1">{achievement.location_th}</span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-1">
                                                <Calendar className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                                <span>{achievement.receivedAt ? formatDate(achievement.receivedAt) : formatDate(achievement.createdAt)}</span>
                                            </div>
                                            {achievement.links.length > 0 && (
                                                <div className="flex items-center gap-1 text-purple-600 dark:text-purple-400 font-semibold">
                                                    <Link2 className="w-3.5 h-3.5 shrink-0" />
                                                    <span>{achievement.links.length} ลิงก์</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Categories pills */}
                                        <div className="flex flex-wrap gap-1.5 pt-1">
                                            {achievement.categories.length > 0 ? (
                                                achievement.categories.map((cat, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="px-2.5 py-0.5 text-[11px] font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/60 rounded-full shadow-2xs"
                                                    >
                                                        {cat.category.name_th}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-gray-400 text-xs italic">- ไม่ระบุหมวดหมู่ -</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Card Interactive Footer */}
                                <div className="p-3.5 sm:p-4 bg-gray-50/80 dark:bg-zinc-800/40 border-t border-gray-200/60 dark:border-zinc-800 space-y-3">
                                    {/* Sort order & Status switch */}
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 dark:text-zinc-400">
                                            <span>ลำดับ:</span>
                                            <div className={`inline-flex items-center gap-1 bg-white dark:bg-zinc-900 rounded-xl p-0.5 border border-gray-200 dark:border-zinc-700 shadow-2xs ${workingId === achievement.id ? 'opacity-60' : ''}`}>
                                                <button
                                                    className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 disabled:opacity-30 transition"
                                                    disabled={localAchievements.length <= 1 || achievement.sortOrder === maxSortOrder || workingId === achievement.id}
                                                    onClick={() => handleChangeSortOrder(achievement.id, 'up')}
                                                >
                                                    <ChevronUp className="w-3.5 h-3.5" />
                                                </button>
                                                <input
                                                    type="number"
                                                    className="w-10 h-6 bg-transparent text-gray-900 dark:text-white font-bold text-xs text-center focus:outline-none"
                                                    value={sortInputValues[achievement.id] ?? achievement.sortOrder}
                                                    disabled={workingId === achievement.id}
                                                    onChange={(e) => setSortInputValues(prev => ({ ...prev, [achievement.id]: e.target.value }))}
                                                    onKeyDown={(e) => {
                                                        if (e.key === "Enter") {
                                                            e.preventDefault();
                                                            const num = Number(sortInputValues[achievement.id]);
                                                            if (Number.isFinite(num)) handleSetSortOrder(achievement.id, num);
                                                        }
                                                    }}
                                                />
                                                <button
                                                    className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 disabled:opacity-30 transition"
                                                    disabled={localAchievements.length <= 1 || achievement.sortOrder === minSortOrder || workingId === achievement.id}
                                                    onClick={() => handleChangeSortOrder(achievement.id, 'down')}
                                                >
                                                    <ChevronDown className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>

                                        <button
                                            className={`cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all border ${
                                                achievement.status === 'PUBLIC'
                                                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-800/60'
                                                    : 'bg-white dark:bg-zinc-900 text-gray-600 dark:text-gray-400 border-gray-200/60 dark:border-zinc-700'
                                            } ${workingId === achievement.id ? 'opacity-60 cursor-wait' : ''}`}
                                            disabled={workingId === achievement.id}
                                            onClick={() => handleToggleStatus(achievement.id, achievement.status)}
                                        >
                                            {achievement.status === 'PUBLIC' ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                                            <span>{achievement.status === 'PUBLIC' ? 'เผยแพร่' : 'แบบร่าง'}</span>
                                        </button>
                                    </div>

                                    {/* Action Buttons Row */}
                                    <div className="flex items-center gap-2 pt-1">
                                        <button
                                            onClick={() => toggleRow(achievement.id)}
                                            className={`flex-1 px-3 py-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer border ${
                                                expandedRows.has(achievement.id)
                                                    ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200/60 dark:border-rose-800/60'
                                                    : 'bg-white dark:bg-zinc-900 text-gray-700 dark:text-gray-300 border-gray-200/80 dark:border-zinc-700 hover:bg-gray-50'
                                            }`}
                                        >
                                            <span>{expandedRows.has(achievement.id) ? 'ซ่อนรายละเอียด' : 'ดูรายละเอียด'}</span>
                                            <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${expandedRows.has(achievement.id) ? 'rotate-180' : ''}`} />
                                        </button>

                                        <div className="shrink-0 flex items-center gap-1">
                                            <EditAchievement achievement={achievement} />
                                            <button
                                                className="inline-flex items-center justify-center p-2 rounded-lg bg-gray-100 hover:bg-red-50 dark:bg-zinc-800 dark:hover:bg-red-950/40 text-gray-700 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400 transition cursor-pointer shadow-2xs shrink-0"
                                                title="ลบผลงาน"
                                                onClick={() => openDeleteModal(achievement)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Expanded Panel on Mobile Card */}
                                    {expandedRows.has(achievement.id) && (
                                        <div className="pt-4 border-t border-gray-200/80 dark:border-zinc-800 animate-fadeIn">
                                            <AchievementExpandedDetails
                                                achievement={achievement}
                                                formatDate={formatDate}
                                                openLightbox={openLightbox}
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
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
                                    <button
                                        type="button"
                                        disabled={isDownloading}
                                        onClick={async (e) => {
                                            e.stopPropagation();

                                            if (isDownloading) return;

                                            setIsDownloading(true);

                                            try {
                                                await downloadImage(
                                                    selectedImage.url,
                                                    `img-${crypto.randomUUID().slice(0, 12)}.jpg`
                                                );
                                            } finally {
                                                setTimeout(() => {
                                                    setIsDownloading(false);
                                                }, 800);
                                            }
                                        }}
                                        className={`
                                        flex items-center gap-2 px-4 py-2 rounded-lg font-medium
                                        backdrop-blur-sm transition-all duration-200
                                        ${isDownloading
                                                ? "bg-white/10 text-white/60 cursor-not-allowed"
                                                : "bg-white/20 hover:bg-white/30 text-white cursor-pointer"
                                            }
                                      `}
                                    >
                                        <Download
                                            className={`w-4 h-4 ${isDownloading ? "animate-pulse" : ""}`}
                                        />
                                        {isDownloading
                                            ? "กำลังดาวน์โหลด..."
                                            : "ดาวน์โหลด"}
                                    </button>

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
