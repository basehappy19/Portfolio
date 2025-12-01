"use client";

import Image from "next/image";
import { Calendar, MapPin, Award, ExternalLink, X, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Achievement } from "@/types/Achievements";

interface AchievementCardProps {
    achievement: Achievement;
    locale: string;
}

const AchievementCard = ({ achievement, locale }: AchievementCardProps) => {
    const [imageError, setImageError] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    const mainImage = achievement.images[0];

    const tField = (
        th: string | null | undefined,
        en: string | null | undefined,
        locale: string
    ) => {
        return locale === "th" ? th ?? "" : en ?? "";
    };

    const title = tField(achievement.title_th, achievement.title_en, locale);
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
                day: "numeric"
            }
        );
        return formatter.format(d);
    };

    const openModal = () => {
        setIsAnimating(true);
        setIsModalOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setIsAnimating(false);
        setTimeout(() => {
            setIsModalOpen(false);
            document.body.style.overflow = 'unset';
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
    const ACHIEVEMENTS_BASE =
        process.env.NEXT_PUBLIC_ACHIEVEMENTS_PUBLIC_BASE ?? "/achievements";
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
                            src={`${ACHIEVEMENTS_BASE}/${achievement.id}/${mainImage.url}`}
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

                    {/* Category Badges */}
                    {achievement.categories.length > 0 && (
                        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                            {achievement.categories.slice(0, 2).map((c) => (
                                <span
                                    key={c.category.id}
                                    className="px-3 py-1.5 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md text-xs font-semibold text-gray-700 dark:text-gray-200 rounded-lg shadow-lg border border-white/20"
                                >
                                    {tField(c.category.name_th, c.category.name_en, locale)}
                                </span>
                            ))}
                            {achievement.categories.length > 2 && (
                                <span className="px-3 py-1.5 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md text-xs font-semibold text-gray-500 dark:text-gray-400 rounded-lg shadow-lg border border-white/20">
                                    +{achievement.categories.length - 2}
                                </span>
                            )}
                        </div>
                    )}

                    {/* Award Level Badge */}
                    {awardLevel && (
                        <div className="absolute top-4 right-4">
                            <div className="px-4 py-1.5 bg-linear-to-r from-amber-400 to-orange-500 text-white text-xs font-bold rounded-lg shadow-lg border border-white/20">
                                {awardLevel}
                            </div>
                        </div>
                    )}
                </div>

                {/* Content Section */}
                <div className="p-6">
                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                        {title}
                    </h3>

                    {/* Description */}
                    {description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 leading-relaxed">
                            {description}
                        </p>
                    )}

                    {/* Location */}
                    {location && (
                        <div className="flex items-center gap-2 mb-5">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700">
                                <MapPin className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                                {location}
                            </span>
                        </div>
                    )}

                    {/* Call to Action */}
                    <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-red-600 dark:text-red-400 group-hover:text-red-700 dark:group-hover:text-red-300 transition-colors">
                                {locale === "th" ? "ดูรายละเอียด" : "View Details"}
                            </span>
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 transition-colors">
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

                {/* Bottom Accent Line */}
                <div className="h-1 bg-linear-to-r from-red-500 via-red-600 to-red-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 cursor-pointer backdrop-blur-sm"
                    onClick={closeModal}
                    style={{
                        animation: isAnimating ? 'modalFadeIn 0.2s ease-out' : 'modalFadeOut 0.2s ease-in'
                    }}
                >
                    <div
                        className="cursor-default relative w-full max-w-5xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            animation: isAnimating ? 'modalSlideIn 0.3s ease-out' : 'modalSlideOut 0.2s ease-in'
                        }}
                    >
                        {/* Close Button */}
                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 z-10 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all"
                        >
                            <X className="w-5 h-5 text-gray-700" />
                        </button>

                        <div className="overflow-y-auto max-h-[90vh]">
                            {/* Image Gallery */}
                            {achievement.images.length > 0 && (
                                <div className="relative">
                                    {/* Main Image */}
                                    <div className="relative h-96 bg-linear-to-br from-orange-50 to-red-50">
                                        <Image
                                            src={`${ACHIEVEMENTS_BASE}/${achievement.id}/${achievement.images[0].url}`}
                                            alt={tField(
                                                achievement.images[currentImageIndex].altText_th,
                                                achievement.images[currentImageIndex].altText_en,
                                                locale
                                            ) || title}
                                            fill
                                            className="object-contain transition-opacity duration-300"
                                            key={currentImageIndex}
                                        />

                                        {/* Navigation Buttons */}
                                        {achievement.images.length > 1 && (
                                            <>
                                                <button
                                                    onClick={prevImage}
                                                    className="cursor-pointer absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all"
                                                >
                                                    <ChevronLeft className="w-6 h-6 text-gray-700" />
                                                </button>
                                                <button
                                                    onClick={nextImage}
                                                    className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all"
                                                >
                                                    <ChevronRight className="w-6 h-6 text-gray-700" />
                                                </button>

                                                {/* Image Counter */}
                                                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/70 text-white text-sm rounded-full">
                                                    {currentImageIndex + 1} / {achievement.images.length}
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {/* Image Thumbnails Preview */}
                                    {achievement.images.length > 1 && (
                                        <div className="py-4 px-8 bg-gray-50 border-t border-gray-200">
                                            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                                                {achievement.images.map((image, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => setCurrentImageIndex(index)}
                                                        className={`cursor-pointer relative shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${currentImageIndex === index
                                                            ? 'border-red-500 ring-2 ring-red-200 scale-105'
                                                            : 'border-gray-300 hover:border-red-300 hover:scale-105'
                                                            }`}
                                                    >
                                                        <Image
                                                            src={`${ACHIEVEMENTS_BASE}/${achievement.id}/${image.url}`}
                                                            alt={tField(image.altText_th, image.altText_en, locale) || `Image ${index + 1}`}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                        {currentImageIndex === index && (
                                                            <div className="absolute inset-0 bg-red-500/20" />
                                                        )}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Content */}
                            <div className="p-8">
                                {/* Badges */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {awardLevel && (
                                        <span className="px-3 py-1 bg-linear-to-r from-yellow-400 to-orange-400 text-white text-sm font-bold rounded-full">
                                            {awardLevel}
                                        </span>
                                    )}
                                    {achievement.categories.map((c) => (
                                        <span
                                            key={c.category.id}
                                            className="px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full"
                                        >
                                            {tField(c.category.name_th, c.category.name_en, locale)}
                                        </span>
                                    ))}
                                </div>

                                {/* Title */}
                                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                    {title}
                                </h2>

                                {/* Description */}
                                {description && (
                                    <div className="mb-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                            {locale === "th" ? "รายละเอียด" : "Description"}
                                        </h3>
                                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                                            {description}
                                        </p>
                                    </div>
                                )}

                                {/* Meta Info */}
                                <div className="flex flex-wrap gap-4 mb-6 text-gray-600">
                                    {achievement.receivedAt && (
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-5 h-5 text-red-500" />
                                            <span>{formatDate(achievement.receivedAt, locale)}</span>
                                        </div>
                                    )}
                                    {location && (
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-5 h-5 text-red-500" />
                                            <span>{location}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Links */}
                                {achievement.links.length > 0 && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                                            {locale === "th" ? "ลิงก์ที่เกี่ยวข้อง" : "Related Links"}
                                        </h3>
                                        <div className="flex flex-wrap gap-3">
                                            {achievement.links.map((link, index) => (
                                                <a
                                                    key={index}
                                                    href={link.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors shadow-md hover:shadow-lg"
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
                    </div>
                </div>
            )}
        </>
    );
};

export default AchievementCard;