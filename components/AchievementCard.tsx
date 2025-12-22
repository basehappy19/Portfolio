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
} from "lucide-react";
import { useEffect, useState } from "react";
import { Achievement } from "@/types/Achievements";
import { downloadImage } from "@/lib/download";

interface AchievementCardProps {
    achievement: Achievement;
    locale: string;
}

const AchievementCard = ({ achievement, locale }: AchievementCardProps) => {
    const [isDownloading, setIsDownloading] = useState(false);
    const [imageError, setImageError] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

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
            // ถ้า modal ยังเปิดอยู่ ให้คง hidden ไม่งั้นคืน scroll
            document.body.style.overflow = isModalOpen ? "hidden" : "unset";
        }, 200);
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
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lightbox, activeImages.length]);

    return (
        <>
            {/* Card */}
            <div
                onClick={openModal}
                className="cursor-pointer group bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600"
            >
                {/* Image Section */}
                <div className="relative h-56 bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 overflow-hidden">
                    {mainImage && !imageError ? (
                        <Image
                            src={mainImage.url}
                            alt={tField(mainImage.altText_th, mainImage.altText_en, locale) || title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <Award className="w-20 h-20 text-gray-300 dark:text-gray-600" />
                        </div>
                    )}

                    {/* linear Overlay for Better Text Readability */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent" />

                    {/* Award Level Badge */}
                    {awardLevel && (
                        <div className="absolute top-4 left-4">
                            <div className="px-4 py-1.5 bg-amber-600 text-white text-xs font-bold rounded-md shadow-lg border border-white/20">
                                {awardLevel}
                            </div>
                        </div>
                    )}
                </div>

                {/* Content Section */}
                <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                        {title}
                    </h3>

                    {given_by && (
                        <div className="mb-4">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wide">
                                    {locale === "th" ? "มอบโดย" : "Awarded By"}
                                </span>
                            </div>
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 line-clamp-2">
                                {given_by}
                            </p>
                        </div>
                    )}

                    {description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 leading-relaxed">
                            {description.replace(/<[^>]+>/g, ' ')}
                        </p>
                    )}

                    {location && (
                        <div className="flex items-center gap-2 mb-5">
                            <div className="flex items-center justify-center w-4 h-4 rounded-full bg-gray-100 dark:bg-gray-700">
                                <MapPin className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                                {location}
                            </span>
                        </div>
                    )}

                    <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-red-600 dark:text-red-400 group-hover:text-red-700 dark:group-hover:text-red-300 transition-colors">
                                {locale === "th" ? "ดูรายละเอียด" : "View Details"}
                            </span>
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-50 dark:bg-red-900/20 group-hover:bg-red-100 dark:group-hover:bg-red-900/40 transition-colors">
                                <svg
                                    className="w-4 h-4 text-red-600 dark:text-red-400 group-hover:translate-x-0.5 transition-transform"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="h-1 bg-linear-to-r from-red-500 via-red-600 to-red-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center cursor-pointer backdrop-blur-md bg-black/40 md:p-4"
                    onClick={closeModal}
                    style={{
                        animation: isAnimating ? "modalFadeIn 0.2s ease-out" : "modalFadeOut 0.2s ease-in",
                    }}
                >
                    <div
                        className="cursor-default relative w-full h-full md:w-full md:max-w-4xl md:h-auto md:max-h-[95vh] bg-white dark:bg-gray-900 md:rounded-3xl shadow-2xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            animation: isAnimating ? "modalSlideIn 0.3s ease-out" : "modalSlideOut 0.2s ease-in",
                        }}
                    >
                        {/* Close Button */}
                        <button
                            onClick={closeModal}
                            className="cursor-pointer absolute top-4 right-4 z-20 p-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                        </button>

                        <div className="overflow-y-auto max-h-[90vh] scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
                            {/* Image Gallery */}
                            {achievement.images.length > 0 && (
                                <div className="relative bg-gray-50 dark:bg-gray-800">
                                    {/* Main Image */}
                                    <div className="relative h-[400px] group">
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
                                            className="cursor-pointer object-contain p-8 select-none transition-transform duration-300 group-hover:scale-[1.01]"
                                            key={currentImageIndex}
                                            onClick={() => openLightbox(achievement.id, currentImageIndex)}
                                        />

                                        <div
                                            className="
      pointer-events-none absolute inset-0
      opacity-0 group-hover:opacity-100
      transition-opacity duration-200
    "
                                        >
                                            {/* gradient ช่วยให้อ่านตัวหนังสือได้ */}
                                            <div className="absolute inset-0 bg-linear-to-t from-black/40 via-black/10 to-transparent" />

                                            {/* badge */}
                                            <div className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-2 rounded-lg bg-black/60 backdrop-blur-sm">
                                                {/* ใช้ SVG แว่นขยาย (ไม่ต้อง import เพิ่ม) */}
                                                <svg
                                                    className="w-4 h-4 text-white"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                >
                                                    <circle cx="11" cy="11" r="8" />
                                                    <path d="M21 21l-4.3-4.3" />
                                                </svg>

                                                <span className="text-white text-sm font-medium">
                                                    {locale === "th" ? "คลิกเพื่อดูภาพเต็ม" : "Click to view full size"}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Navigation Buttons */}
                                        {achievement.images.length > 1 && (
                                            <>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        prevImage();
                                                    }}
                                                    className="cursor-pointer absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition"
                                                >
                                                    <ChevronLeft className="w-5 h-5" />
                                                </button>

                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        nextImage();
                                                    }}
                                                    className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition"
                                                >
                                                    <ChevronRight className="w-5 h-5" />
                                                </button>

                                                <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-black/70 text-white text-sm rounded-lg">
                                                    {currentImageIndex + 1} / {achievement.images.length}
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {tField(
                                        achievement.images[currentImageIndex].altText_th,
                                        achievement.images[currentImageIndex].altText_en,
                                        locale
                                    ) && (
                                            <div className="px-6 py-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                                                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                                    {tField(
                                                        achievement.images[currentImageIndex].altText_th,
                                                        achievement.images[currentImageIndex].altText_en,
                                                        locale
                                                    )}
                                                </p>
                                            </div>
                                        )}

                                    {/* Thumbnails */}
                                    {achievement.images.length > 1 && (
                                        <div className="px-6 py-4">
                                            <div className="flex gap-2 overflow-x-auto">
                                                {achievement.images.map((image, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setCurrentImageIndex(index);
                                                        }}
                                                        className={`cursor-pointer relative shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition
                              ${currentImageIndex === index
                                                                ? "border-gray-900 dark:border-gray-100"
                                                                : "border-gray-200 dark:border-gray-700 opacity-60 hover:opacity-100"
                                                            }`}
                                                    >
                                                        <Image
                                                            src={image.url}
                                                            alt={tField(image.altText_th, image.altText_en, locale) || `Image ${index + 1}`}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Content */}
                            <div className="p-8">
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {awardLevel && (
                                        <span className="px-4 py-2 bg-amber-600 text-white text-sm font-bold rounded-md shadow-lg">
                                            {awardLevel}
                                        </span>
                                    )}
                                    {achievement.categories.map((c) => (
                                        <span
                                            key={c.category.id}
                                            className="flex items-center justify-center px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm rounded-md"
                                        >
                                            {tField(c.category.name_th, c.category.name_en, locale)}
                                        </span>
                                    ))}
                                </div>

                                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                                    {title}
                                </h2>

                                <div className="space-y-3 mb-6 text-gray-600 dark:text-gray-400">
                                    {achievement.receivedAt && (
                                        <div className="flex items-center gap-3">
                                            <Calendar className="w-5 h-5" />
                                            <span>{formatDate(achievement.receivedAt, locale)}</span>
                                        </div>
                                    )}
                                    {location && (
                                        <div className="flex items-center gap-3">
                                            <MapPin className="w-5 h-5" />
                                            <span>{location}</span>
                                        </div>
                                    )}
                                    {given_by && (
                                        <div className="flex items-center gap-3">
                                            <Award className="w-5 h-5" />
                                            <span>{given_by}</span>
                                        </div>
                                    )}
                                </div>

                                {description && (
                                    <div className="mb-6">
                                        <div
                                            className="
                text-gray-700 dark:text-gray-300 leading-relaxed
                prose prose-sm sm:prose-base dark:prose-invert max-w-none
                
                {/* จัดการ List (Bullet points & Numbers) */}
                [&_ul]:list-disc [&_ul]:pl-5 
                [&_ol]:list-decimal [&_ol]:pl-5
                
                {/* จัดการหัวข้อ (Headings) */}
                [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:mt-6 [&_h2]:mb-3
                [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-2
                
                {/* จัดการ Link */}
                [&_a]:text-sky-600 [&_a]:underline hover:[&_a]:text-sky-700
                
                {/* จัดการ Paragraph */}
                [&_p]:mb-3
            "
                                            dangerouslySetInnerHTML={{ __html: description }}
                                        />
                                    </div>
                                )}

                                {achievement.links.length > 0 && (
                                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                        <div className="flex flex-wrap gap-2">
                                            {achievement.links.map((link, index) => (
                                                <a
                                                    key={index}
                                                    href={link.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 dark:bg-gray-100 hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-gray-900 text-sm font-medium rounded-lg transition-colors"
                                                >
                                                    <span>{tField(link.label_th, link.label_en, locale)}</span>
                                                    <ExternalLink className="w-4 h-4" />
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Lightbox (Full Image) */}
                        {selectedImage && (
                            <div
                                className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-md bg-black/40"
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
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default AchievementCard;
