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

                    {/* Given By */}
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

                    {/* Description */}
                    {description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 leading-relaxed">
                            {description}
                        </p>
                    )}

                    {/* Location */}
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

                    {/* Call to Action */}
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

                {/* Bottom Accent Line */}
                <div className="h-1 bg-linear-to-r from-red-500 via-red-600 to-red-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 cursor-pointer backdrop-blur-md bg-black/40"
                    onClick={closeModal}
                    style={{
                        animation: isAnimating ? 'modalFadeIn 0.2s ease-out' : 'modalFadeOut 0.2s ease-in'
                    }}
                >
                    <div
                        className="cursor-default relative w-full max-w-6xl max-h-[95vh] bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            animation: isAnimating ? 'modalSlideIn 0.3s ease-out' : 'modalSlideOut 0.2s ease-in'
                        }}
                    >
                        {/* Close Button */}
                        <button
                            onClick={closeModal}
                            className="cursor-pointer absolute top-6 right-6 z-20 p-3 bg-white/95 dark:bg-gray-800/95 hover:bg-white dark:hover:bg-gray-800 rounded-full shadow-xl transition-all hover:scale-110 backdrop-blur-sm border border-gray-100 dark:border-gray-700"
                        >
                            <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                        </button>

                        <div className="overflow-y-auto max-h-[95vh] scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent">
                            {/* Image Gallery */}
                            {achievement.images.length > 0 && (
                                <div className="relative">
                                    {/* Main Image */}
                                    <div className="relative h-[500px] bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                                        <Image
                                            src={achievement.images[currentImageIndex].url}
                                            alt={tField(
                                                achievement.images[currentImageIndex].altText_th,
                                                achievement.images[currentImageIndex].altText_en,
                                                locale
                                            ) || title}
                                            fill
                                            className="object-contain transition-opacity duration-300 p-8"
                                            key={currentImageIndex}
                                        />

                                        <div className="absolute inset-0 bg-linear-to-r from-black/10 via-transparent to-black/10 pointer-events-none" />

                                        {/* Navigation Buttons */}
                                        {achievement.images.length > 1 && (
                                            <>
                                                <button
                                                    onClick={prevImage}
                                                    className="cursor-pointer absolute left-6 top-1/2 -translate-y-1/2 p-3 bg-white/95 dark:bg-gray-800/95 hover:bg-white dark:hover:bg-gray-800 rounded-full shadow-xl transition-all hover:scale-110 backdrop-blur-sm border border-gray-100 dark:border-gray-700"
                                                >
                                                    <ChevronLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                                                </button>
                                                <button
                                                    onClick={nextImage}
                                                    className="cursor-pointer absolute right-6 top-1/2 -translate-y-1/2 p-3 bg-white/95 dark:bg-gray-800/95 hover:bg-white dark:hover:bg-gray-800 rounded-full shadow-xl transition-all hover:scale-110 backdrop-blur-sm border border-gray-100 dark:border-gray-700"
                                                >
                                                    <ChevronRight className="w-6 h-6 text-gray-700 dark:text-gray-300" />
                                                </button>

                                                {/* Image Counter */}
                                                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/80 dark:bg-white/90 text-white dark:text-gray-900 text-sm font-medium rounded-full backdrop-blur-sm">
                                                    {currentImageIndex + 1} / {achievement.images.length}
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {/* Image Thumbnails Preview */}
                                    {achievement.images.length > 1 && (
                                        <div className="py-5 px-8 bg-gray-50/50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 backdrop-blur-sm">
                                            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                                                {achievement.images.map((image, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => setCurrentImageIndex(index)}
                                                        className={`cursor-pointer relative shrink-0 w-24 h-24 rounded-xl overflow-hidden border-2 transition-all duration-200 ${currentImageIndex === index
                                                            ? 'border-red-500 ring-2 ring-red-200 dark:ring-red-800 scale-105'
                                                            : 'border-gray-300 dark:border-gray-600 hover:border-red-400 dark:hover:border-red-500 hover:scale-105'
                                                            }`}
                                                    >
                                                        <Image
                                                            src={image.url}
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
                            <div className="p-10">
                                <div className="max-w-4xl mx-auto space-y-8">
                                    {/* Badges */}
                                    <div className="flex flex-wrap gap-2">
                                        {awardLevel && (
                                            <span className="px-4 py-2 bg-linear-to-r from-amber-400 to-orange-500 text-white text-sm font-bold rounded-xl shadow-lg border border-white/20">
                                                {awardLevel}
                                            </span>
                                        )}
                                        {achievement.categories.map((c) => (
                                            <span
                                                key={c.category.id}
                                                className="px-4 py-2 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-sm font-semibold rounded-xl border border-red-100 dark:border-red-800"
                                            >
                                                {tField(c.category.name_th, c.category.name_en, locale)}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Title */}
                                    <h2 className="text-4xl font-bold text-gray-900 dark:text-white leading-tight">
                                        {title}
                                    </h2>

                                    {/* Meta Info */}
                                    <div className="flex flex-wrap gap-6 text-gray-600 dark:text-gray-400">
                                        {achievement.receivedAt && (
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-50 dark:bg-red-900/30">
                                                    <Calendar className="w-5 h-5 text-red-600 dark:text-red-400" />
                                                </div>
                                                <span className="font-medium">{formatDate(achievement.receivedAt, locale)}</span>
                                            </div>
                                        )}
                                        {location && (
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-red-50 dark:bg-red-900/30">
                                                    <MapPin className="w-5 h-5 text-red-600 dark:text-red-400" />
                                                </div>
                                                <span className="font-medium">{location}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        {/* Given By */}
                                        {given_by && (
                                            <div className="bg-linear-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 rounded-2xl p-6 border border-amber-100 dark:border-amber-800/50 h-fit">
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                                    <div className="w-1 h-6 bg-linear-to-b from-amber-500 to-orange-500 rounded-full"></div>
                                                    {locale === "th" ? "ผู้มอบรางวัล" : "Awarded By"}
                                                </h3>
                                                <div className="flex items-start gap-3">
                                                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-linear-to-br from-amber-100 to-orange-100 dark:from-amber-900/50 dark:to-orange-900/50 shrink-0 shadow-sm">
                                                        <Award className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                                                    </div>
                                                    <p className="text-gray-800 dark:text-gray-200 leading-relaxed font-medium text-base mt-1">
                                                        {given_by}
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Description */}
                                        {description && (
                                            <div className={`bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 ${!given_by ? 'lg:col-span-2' : ''}`}>
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                                    <div className="w-1 h-6 bg-red-500 rounded-full"></div>
                                                    {locale === "th" ? "รายละเอียด" : "Description"}
                                                </h3>
                                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                                                    {description}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Links */}
                                    {achievement.links.length > 0 && (
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                                <div className="w-1 h-6 bg-red-500 rounded-full"></div>
                                                {locale === "th" ? "ลิงก์ที่เกี่ยวข้อง" : "Related Links"}
                                            </h3>
                                            <div className="flex flex-wrap gap-3">
                                                {achievement.links.map((link, index) => (
                                                    <a
                                                        key={index}
                                                        href={link.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-2 px-5 py-3 bg-linear-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium rounded-xl transition-all shadow-lg shadow-red-600/20 hover:shadow-xl hover:shadow-red-600/30 hover:scale-105"
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
                </div >
            )}
        </>
    );
};

export default AchievementCard;