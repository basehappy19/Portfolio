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
                    className="fixed inset-0 z-50 flex items-center justify-center 
    cursor-pointer backdrop-blur-md bg-black/40 
    md:p-4"
                    onClick={closeModal}
                    style={{
                        animation: isAnimating ? "modalFadeIn 0.2s ease-out" : "modalFadeOut 0.2s ease-in",
                    }}
                >
                    <div
                        className="
      cursor-default relative 
      w-full h-full              
      md:w-full md:max-w-4xl     
      md:h-auto md:max-h-[95vh]  
      bg-white dark:bg-gray-900 
      md:rounded-3xl shadow-2xl 
      overflow-hidden"
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
                                    <div className="relative h-[400px]">
                                        <Image
                                            src={achievement.images[currentImageIndex].url}
                                            alt={tField(
                                                achievement.images[currentImageIndex].altText_th,
                                                achievement.images[currentImageIndex].altText_en,
                                                locale
                                            ) || title}
                                            fill
                                            className="object-contain p-8"
                                            key={currentImageIndex}
                                        />

                                        {/* Navigation Buttons */}
                                        {achievement.images.length > 1 && (
                                            <>
                                                <button
                                                    onClick={prevImage}
                                                    className="cursor-pointer absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors"
                                                >
                                                    <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                                                </button>
                                                <button
                                                    onClick={nextImage}
                                                    className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 dark:bg-gray-800/90 hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors"
                                                >
                                                    <ChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                                                </button>

                                                {/* Image Counter */}
                                                <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-black/70 text-white text-sm rounded-lg">
                                                    {currentImageIndex + 1} / {achievement.images.length}
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {/* Image Thumbnails */}
                                    {achievement.images.length > 1 && (
                                        <div className="px-6 pb-4">
                                            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
                                                {achievement.images.map((image, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => setCurrentImageIndex(index)}
                                                        className={`cursor-pointer relative shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${currentImageIndex === index
                                                                ? 'border-gray-900 dark:border-gray-100'
                                                                : 'border-gray-200 dark:border-gray-700 opacity-60 hover:opacity-100'
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
                                {/* Badges */}
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

                                {/* Title */}
                                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                                    {title}
                                </h2>

                                {/* Meta Info */}
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

                                {/* Description */}
                                {description && (
                                    <div className="mb-6">
                                        <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                                            {description}
                                        </p>
                                    </div>
                                )}

                                {/* Links */}
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
                    </div>
                </div>
            )}
        </>
    );
};

export default AchievementCard;