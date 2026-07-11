"use client";

import Image from "next/image";
import {
    Calendar,
    MapPin,
    Award,
    ExternalLink,
    X,
    ChevronLeft,
    ChevronRight,
    Download,
    Trophy,
    Edit2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { Achievement } from "@/types/Achievements";
import { downloadImage } from "@/lib/download";
import { useSessionContext } from "@/app/contexts/SessionContext";

interface AchievementCardProps {
    achievement: Achievement;
    locale: string;
    priorityImage?: boolean;
}

const AchievementCard = ({ achievement, locale, priorityImage }: AchievementCardProps) => {
    const router = useRouter();
    const [isDownloading, setIsDownloading] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [mounted, setMounted] = useState(false);
    const { session, loading } = useSessionContext();

    useEffect(() => {
        setMounted(true);
    }, []);

    const [lightbox, setLightbox] = useState<{
        achievementId: string;
        index: number;
    } | null>(null);
    const [isImagesAnimating, setIsImagesAnimating] = useState(false);

    const mainImage = achievement.images[0];

    const tField = (
        th: string | null | undefined,
        en: string | null | undefined,
        locale: string
    ) => {
        return locale === "th" ? th ?? "" : en ?? "";
    };

    const title = tField(achievement.title_th, achievement.title_en, locale);
    const given_by = tField(achievement.given_by_th, achievement.given_by_en, locale);
    const description = tField(achievement.description_th, achievement.description_en, locale);
    const awardLevel = tField(achievement.awardLevel_th, achievement.awardLevel_en, locale);
    const location = tField(achievement.location_th, achievement.location_en, locale);

    const formatDate = (date: Date | string | null, locale: string) => {
        if (!date) return "";
        const d = new Date(date);
        const formatter = new Intl.DateTimeFormat(
            locale === "th" ? "th-TH-u-ca-buddhist" : "en-US",
            {
                year: "numeric",
                month: "long",
                day: "numeric",
            }
        );
        return formatter.format(d);
    };

    const openModal = () => {
        setIsAnimating(true);
        setIsModalOpen(true);
        document.body.style.overflow = "hidden";
    };

    const closeModal = () => {
        setIsAnimating(false);
        setTimeout(() => {
            setIsModalOpen(false);
            document.body.style.overflow = "unset";
        }, 200);
    };

    const nextImage = () => {
        setCurrentImageIndex((prev) =>
            prev === achievement.images.length - 1 ? 0 : prev + 1
        );
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) =>
            prev === 0 ? achievement.images.length - 1 : prev - 1
        );
    };

    const activeImages = achievement?.images ?? [];
    const currentIndex = lightbox?.index ?? 0;
    const selectedImage =
        lightbox && activeImages.length > 0 && currentIndex >= 0
            ? activeImages[currentIndex]
            : null;

    const openLightbox = (achievementId: string, index: number) => {
        setIsImagesAnimating(true);
        setLightbox({ achievementId, index });
        document.body.style.overflow = "hidden";
    };

    const closeLightbox = () => {
        setIsImagesAnimating(false);
        setTimeout(() => {
            setLightbox(null);
            if (!isModalOpen) {
                document.body.style.overflow = "unset";
            } else {
                document.body.style.overflow = "hidden";
            }
        }, 180);
    };

    const goToNext = () => {
        if (!lightbox || activeImages.length === 0) return;
        const nextIndex = (lightbox.index + 1) % activeImages.length;
        setLightbox({ ...lightbox, index: nextIndex });
    };

    const goToPrev = () => {
        if (!lightbox || activeImages.length === 0) return;
        const prevIndex = (lightbox.index - 1 + activeImages.length) % activeImages.length;
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

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            if (!isModalOpen) {
                document.body.style.overflow = 'unset';
            } else {
                document.body.style.overflow = 'hidden';
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lightbox, activeImages.length, isModalOpen]);

    return (
        <>
            {/* Card with Dynamic Interactive Hover Flair */}
            <div
                onClick={openModal}
                className="cursor-pointer group relative bg-white rounded-2xl shadow-2xs hover:shadow-xl hover:shadow-rose-500/10 transition-all duration-300 overflow-hidden border border-slate-200/90 hover:border-rose-400/80 flex flex-col h-full hover:-translate-y-1.5"
            >
                {/* Image Section */}
                <div className="relative h-56 bg-slate-100 overflow-hidden shrink-0">
                    {mainImage && !imageError ? (
                        <Image
                            src={mainImage.url}
                            alt={tField(mainImage.altText_th, mainImage.altText_en, locale) || title}
                            fill
                            priority={priorityImage}
                            loading={priorityImage ? "eager" : "lazy"}
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <Award className="w-16 h-16 text-slate-300 group-hover:scale-110 transition-transform duration-300" />
                        </div>
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-linear-to-t from-slate-950/40 via-transparent to-transparent pointer-events-none group-hover:from-slate-950/60 transition-colors duration-300" />
                </div>

                {/* Content Section */}
                <div className="p-6 flex flex-col flex-1">
                    {/* Prestigious Inline Award Level Box (Never blocks photo) */}
                    {awardLevel && (
                        <div className="mb-3.5 p-3.5 rounded-xl bg-linear-to-r from-amber-50 via-orange-50/70 to-amber-50 border border-amber-200/80 flex items-start gap-2.5 text-amber-950 shadow-2xs">
                            <Trophy className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                            <div className="text-xs sm:text-sm font-bold leading-snug">
                                {awardLevel}
                            </div>
                        </div>
                    )}

                    <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mb-3 line-clamp-2 group-hover:text-rose-600 transition-colors duration-200 leading-snug">
                        {title}
                    </h3>

                    {given_by && (
                        <div className="mb-4">
                            <div className="flex items-center gap-1.5 mb-1">
                                <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wide">
                                    {locale === "th" ? "มอบโดย" : "Awarded By"}
                                </span>
                            </div>
                            <p className="text-xs sm:text-sm font-semibold text-slate-700 line-clamp-2">
                                {given_by}
                            </p>
                        </div>
                    )}

                    {description && (
                        <p className="text-xs sm:text-sm text-slate-600 mb-4 line-clamp-3 leading-relaxed">
                            {description.replace(/<[^>]+>/g, ' ')}
                        </p>
                    )}

                    {/* Location Badge (If present) - Dedicated full width row so it never wraps "สถานที่:" or cramps text */}
                    {location && (
                        <div className="mt-auto mb-3 flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200/70 dark:border-zinc-700/60 text-slate-700 dark:text-slate-300 text-xs shadow-2xs" title={location}>
                            <MapPin className="w-3.5 h-3.5 shrink-0 text-rose-500" />
                            <span className="font-bold text-slate-500 dark:text-slate-400 shrink-0 whitespace-nowrap">{locale === "th" ? "สถานที่:" : "Loc:"}</span>
                            <span className="truncate font-semibold text-slate-800 dark:text-slate-200">{location}</span>
                        </div>
                    )}

                    <div className={`${!location ? 'mt-auto ' : ''}pt-3.5 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-end`}>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600 group-hover:text-rose-700 transition-colors">
                            <span className="whitespace-nowrap">{locale === "th" ? "ดูรายละเอียด" : "View Details"}</span>
                            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-rose-50 group-hover:bg-rose-100 transition-colors shrink-0">
                                <ChevronRight className="w-3.5 h-3.5 text-rose-600 group-hover:translate-x-0.5 transition-transform" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="h-1.5 bg-linear-to-r from-rose-500 via-pink-500 to-amber-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </div>

            {/* Slide-Over Detail Drawer (Side Panel - Super comfortable to read, no cramped popup box) */}
            {mounted && isModalOpen && createPortal(
                <div
                    className="fixed inset-0 z-[9999] flex justify-end cursor-pointer backdrop-blur-xs bg-slate-900/50"
                    onClick={closeModal}
                    style={{
                        animation: isAnimating ? "modalFadeIn 0.25s ease-out" : "modalFadeOut 0.2s ease-in",
                    }}
                >
                    <div
                        className="cursor-default relative w-full sm:w-[620px] md:w-[700px] lg:w-[760px] h-full bg-white shadow-2xl flex flex-col overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            animation: isAnimating ? "drawerSlideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)" : "drawerSlideOutRight 0.2s ease-in",
                        }}
                    >
                        {/* Sticky Top Header */}
                        <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-slate-200/80 flex items-center justify-between shrink-0 shadow-2xs">
                            <div className="flex items-center gap-2.5">
                                <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse" />
                                <span className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-wider">
                                    {locale === "th" ? "รายละเอียดผลงาน" : "Project Details"}
                                </span>
                            </div>
                            <div className="flex items-center gap-2.5">
                                {session && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            router.push(`/admin?edit=${achievement.id}`);
                                        }}
                                        className="cursor-pointer px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center gap-1.5 shadow-sm transition"
                                        title={locale === "th" ? "แก้ไขผลงานในหน้า Admin" : "Edit in Admin"}
                                    >
                                        <Edit2 className="w-4 h-4" />
                                        <span>{locale === "th" ? "แก้ไข" : "Edit"}</span>
                                    </button>
                                )}
                                <button
                                    onClick={closeModal}
                                    className="cursor-pointer px-4 py-1.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-700 font-bold text-xs sm:text-sm rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs border border-slate-200/80"
                                >
                                    <span>{locale === "th" ? "ปิดหน้าต่าง" : "Close"}</span>
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Spacious Scrollable Drawer Body */}
                        <div className="overflow-y-auto flex-1 p-6 sm:p-8 md:p-10 space-y-8 scrollbar-thin scrollbar-thumb-slate-200">
                            {/* Main High-Res Photo Gallery */}
                            {achievement.images.length > 0 && (
                                <div className="space-y-3">
                                    <div className="relative h-64 sm:h-80 md:h-[380px] w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-sm group">
                                        <Image
                                            src={achievement.images[currentImageIndex].url}
                                            alt={
                                                tField(
                                                    achievement.images[currentImageIndex].altText_th,
                                                    achievement.images[currentImageIndex].altText_en,
                                                    locale
                                                ) || title
                                            }
                                            fill
                                            sizes="(max-width: 1024px) 100vw, 760px"
                                            className="cursor-pointer object-contain p-4 sm:p-6 select-none transition-transform duration-300 group-hover:scale-[1.01]"
                                            onClick={() => openLightbox(achievement.id, currentImageIndex)}
                                        />

                                        {/* Click to expand overlay hint */}
                                        <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                            <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />
                                            <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/70 backdrop-blur-sm text-white text-xs font-semibold">
                                                <span>{locale === "th" ? "🔍 คลิกเพื่อดูภาพเต็ม" : "🔍 Click full screen"}</span>
                                            </div>
                                        </div>

                                        {/* Navigation Arrows */}
                                        {achievement.images.length > 1 && (
                                            <>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        prevImage();
                                                    }}
                                                    className="cursor-pointer absolute left-3 top-1/2 -translate-y-1/2 p-2.5 bg-white/90 hover:bg-white text-slate-800 rounded-xl transition shadow-md"
                                                    title="ก่อนหน้า"
                                                >
                                                    <ChevronLeft className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        nextImage();
                                                    }}
                                                    className="cursor-pointer absolute right-3 top-1/2 -translate-y-1/2 p-2.5 bg-white/90 hover:bg-white text-slate-800 rounded-xl transition shadow-md"
                                                    title="ถัดไป"
                                                >
                                                    <ChevronRight className="w-5 h-5" />
                                                </button>
                                                <div className="absolute top-3 right-3 px-3 py-1 bg-slate-900/80 backdrop-blur-xs text-white text-xs font-bold rounded-lg shadow-sm">
                                                    {currentImageIndex + 1} / {achievement.images.length}
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {/* Thumbnails row */}
                                    {achievement.images.length > 1 && (
                                        <div className="flex gap-2.5 overflow-x-auto pb-2">
                                            {achievement.images.map((image, index) => (
                                                <button
                                                    key={image.id}
                                                    type="button"
                                                    onClick={() => setCurrentImageIndex(index)}
                                                    className={`relative shrink-0 overflow-hidden rounded-xl border-2 transition cursor-pointer w-16 h-16 sm:w-20 sm:h-20 ${
                                                        currentImageIndex === index
                                                            ? "border-rose-600 scale-105 shadow-md ring-2 ring-rose-200"
                                                            : "border-slate-200 opacity-60 hover:opacity-100"
                                                    }`}
                                                >
                                                    <Image
                                                        src={image.url}
                                                        alt={`Image ${index + 1}`}
                                                        fill
                                                        sizes="80px"
                                                        className="object-cover"
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Full Award Banner inside drawer */}
                            {awardLevel && (
                                <div className="p-5 rounded-2xl bg-linear-to-r from-amber-50 via-orange-50 to-amber-50 border-2 border-amber-300/80 flex items-start gap-3.5 text-amber-950 shadow-sm">
                                    <div className="p-2.5 rounded-xl bg-amber-500 text-white shrink-0 shadow-md">
                                        <Trophy className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
                                            {locale === "th" ? "ระดับรางวัลที่ได้รับ" : "Award Distinction"}
                                        </p>
                                        <p className="text-base sm:text-lg font-extrabold leading-snug">
                                            {awardLevel}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Categories */}
                            {achievement.categories.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {achievement.categories.map((c) => (
                                        <span
                                            key={c.category.id}
                                            className="px-3.5 py-1.5 bg-slate-100 border border-slate-200/80 text-slate-700 text-xs sm:text-sm font-bold rounded-lg shadow-2xs"
                                        >
                                            {tField(c.category.name_th, c.category.name_en, locale)}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Title & Key Meta */}
                            <div>
                                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight mb-5">
                                    {title}
                                </h2>

                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                                    {achievement.receivedAt && (
                                        <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-50/90 border border-slate-200/80 shadow-xs hover:bg-slate-100/60 transition">
                                            <div className="p-2.5 rounded-xl bg-rose-100/80 text-rose-600 shrink-0 mt-0.5 shadow-2xs">
                                                <Calendar className="w-4 h-4" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1">
                                                    {locale === "th" ? "วันที่ได้รับ" : "Date"}
                                                </span>
                                                <span className="block text-sm font-bold text-slate-800 wrap-break-word">
                                                    {formatDate(achievement.receivedAt, locale)}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                    {location && (
                                        <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-50/90 border border-slate-200/80 shadow-xs hover:bg-slate-100/60 transition">
                                            <div className="p-2.5 rounded-xl bg-rose-100/80 text-rose-600 shrink-0 mt-0.5 shadow-2xs">
                                                <MapPin className="w-4 h-4" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1">
                                                    {locale === "th" ? "สถานที่จัดงาน" : "Location"}
                                                </span>
                                                <span className="block text-sm font-bold text-slate-800 wrap-break-word">
                                                    {location}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                    {given_by && (
                                        <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-slate-50/90 border border-slate-200/80 shadow-xs hover:bg-slate-100/60 transition sm:col-span-2 lg:col-span-1">
                                            <div className="p-2.5 rounded-xl bg-rose-100/80 text-rose-600 shrink-0 mt-0.5 shadow-2xs">
                                                <Award className="w-4 h-4" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-1">
                                                    {locale === "th" ? "มอบโดย" : "Awarded By"}
                                                </span>
                                                <span className="block text-sm font-bold text-slate-800 wrap-break-word">
                                                    {given_by}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Full Article Description */}
                            {description && (
                                <div className="space-y-3 pt-2">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                        {locale === "th" ? "รายละเอียดโครงการ" : "Project Description"}
                                    </h4>
                                    <div
                                        className="text-slate-700 text-sm sm:text-base leading-relaxed space-y-4 font-normal [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [&_h2]:text-xl [&_h2]:font-bold [&_h3]:text-lg [&_h3]:font-semibold [&_a]:text-rose-600 [&_a]:underline"
                                        dangerouslySetInnerHTML={{ __html: description }}
                                    />
                                </div>
                            )}

                            {/* External Links */}
                            {achievement.links.length > 0 && (
                                <div className="pt-6 border-t border-slate-200 space-y-3">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                        {locale === "th" ? "ลิงก์ที่เกี่ยวข้อง" : "External References"}
                                    </h4>
                                    <div className="flex flex-wrap gap-2.5">
                                        {achievement.links.map((link, index) => (
                                            <a
                                                key={index}
                                                href={link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-rose-600 text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-sm"
                                            >
                                                <span>{tField(link.label_th, link.label_en, locale)}</span>
                                                <ExternalLink className="w-4 h-4" />
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Bottom Admin Quick Action Bar when logged in */}
                            {session && (
                                <div className="mt-8 pt-5 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 bg-linear-to-r from-rose-50/90 via-rose-50 to-rose-50/90 p-5 rounded-2xl border border-rose-200/70 shadow-2xs text-center sm:text-left">
                                    <div className="flex items-center justify-center sm:justify-start gap-2.5">
                                        <div className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-pulse shrink-0" />
                                        <span className="text-xs sm:text-sm font-extrabold text-rose-950">
                                            {locale === "th" ? "คุณอยู่ในระบบผู้ดูแล" : "Logged in as Admin"}
                                        </span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            router.push(`/admin?edit=${achievement.id}`);
                                        }}
                                        className="cursor-pointer w-full sm:w-auto justify-center px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs sm:text-sm rounded-xl flex items-center gap-2 shadow-sm transition hover:scale-[1.01] active:scale-[0.99]"
                                    >
                                        <Edit2 className="w-4 h-4 shrink-0" />
                                        <span>{locale === "th" ? "แก้ไขผลงานนี้" : "Edit Achievement"}</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Lightbox (Full Image) - Rendered via Portal */}
            {mounted && selectedImage && createPortal(
                <div
                    className="fixed inset-0 z-[10000] flex items-center justify-center backdrop-blur-md bg-black/80"
                    onClick={closeLightbox}
                    style={{
                        animation: isImagesAnimating ? "modalFadeIn 0.2s ease-out" : "modalFadeOut 0.2s ease-in",
                    }}
                >
                    {/* Close Button */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            closeLightbox();
                                    }}
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
                                        alt={
                                            tField(selectedImage.altText_th, selectedImage.altText_en, locale) ||
                                            tField(achievement.title_th, achievement.title_en, locale)
                                        }
                                        className="object-contain rounded-lg shadow-2xl"
                                        sizes="90vw"
                                    />

                                    {/* Image Info Bar */}
                                    <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent p-6 rounded-b-lg">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1">
                                                <p className="text-white font-semibold text-lg mb-1">
                                                    {tField(selectedImage.altText_th, selectedImage.altText_en, locale) ||
                                                        (locale === "th" ? "ไม่มีคำอธิบาย" : "No description")}
                                                </p>
                                                <p className="text-white/70 text-sm">
                                                    {locale === "th"
                                                        ? `รูปที่ ${currentIndex + 1} จาก ${activeImages.length}`
                                                        : `Image ${currentIndex + 1} of ${activeImages.length}`}
                                                </p>
                                            </div>

                                            <button
                                                type="button"
                                                disabled={isDownloading || !session}
                                                onClick={async (e) => {
                                                    e.stopPropagation();

                                                    if (!session) {
                                                        alert(locale === "th" ? "กรุณาเข้าสู่ระบบก่อนดาวน์โหลด" : "Please login to download");
                                                        return;
                                                    }

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
${!session
                                                        ? "bg-white/10 text-white/40 cursor-not-allowed"
                                                        : isDownloading
                                                            ? "bg-white/10 text-white/60 cursor-not-allowed"
                                                            : "bg-white/20 hover:bg-white/30 text-white cursor-pointer"
                                                    }
`}
                                            >
                                                <Download className={`w-4 h-4 ${isDownloading ? "animate-pulse" : ""}`} />

                                                {!session
                                                    ? (locale === "th" ? "เข้าสู่ระบบเพื่อดาวน์โหลด" : "Login to download")
                                                    : isDownloading
                                                        ? (locale === "th" ? "กำลังดาวน์โหลด..." : "Downloading...")
                                                        : (locale === "th" ? "ดาวน์โหลด" : "Download")}
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
                                                        setLightbox({ achievementId: achievement.id, index });
                                                    }}
                                                    className={`cursor-pointer relative shrink-0 w-16 h-16 rounded-lg overflow-hidden transition-all duration-200 ${index === currentIndex
                                                        ? "ring-4 ring-white scale-110"
                                                        : "ring-2 ring-white/30 hover:ring-white/60 opacity-60 hover:opacity-100"
                                                        }`}
                                                >
                                                    <Image
                                                        fill
                                                        src={image.url}
                                                        alt={
                                                            tField(image.altText_th, image.altText_en, locale) ||
                                                            `Image ${index + 1}`
                                                        }
                                                        className="object-cover"
                                                        sizes="64px"
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                </div>,
                document.body
            )}
        </>
    );
};

export default AchievementCard;
