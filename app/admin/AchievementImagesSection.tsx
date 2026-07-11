'use client';

import React, { ChangeEvent, DragEvent } from 'react';
import { GripVertical, Plus, Trash2, ChevronUp, ChevronDown, RefreshCw } from 'lucide-react';
import Image from 'next/image';
import { ImagePreview } from '@/types/Form';

type Props = {
    imagePreview: ImagePreview[];
    draggedIndex: number | null;
    handleImageUpload: (e: ChangeEvent<HTMLInputElement>) => void;
    handleReplaceImage: (index: number, e: ChangeEvent<HTMLInputElement>) => void;
    handleImageAltChange: (
        index: number,
        field: 'altText_th' | 'altText_en',
        value: string
    ) => void;
    handleRemoveImage: (index: number) => void;
    handleDragStart: (e: DragEvent<HTMLElement>, index: number) => void;
    handleDragOver: (e: DragEvent<HTMLElement>, index: number) => void;
    handleDragEnd: () => void;
};

export const AchievementImagesSection: React.FC<Props> = ({
    imagePreview,
    draggedIndex,
    handleImageUpload,
    handleReplaceImage,
    handleImageAltChange,
    handleRemoveImage,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
}) => {
    const moveUp = (index: number) => {
        if (index === 0) return;
        const currentImg = imagePreview[index];
        const prevImg = imagePreview[index - 1];
        handleImageAltChange(index, 'altText_th', prevImg.altText_th);
        handleImageAltChange(index, 'altText_en', prevImg.altText_en);
        handleImageAltChange(index - 1, 'altText_th', currentImg.altText_th);
        handleImageAltChange(index - 1, 'altText_en', currentImg.altText_en);
    };

    const moveDown = (index: number) => {
        if (index === imagePreview.length - 1) return;
        const currentImg = imagePreview[index];
        const nextImg = imagePreview[index + 1];
        handleImageAltChange(index, 'altText_th', nextImg.altText_th);
        handleImageAltChange(index, 'altText_en', nextImg.altText_en);
        handleImageAltChange(index + 1, 'altText_th', currentImg.altText_th);
        handleImageAltChange(index + 1, 'altText_en', currentImg.altText_en);
    };

    return (
        <div className="space-y-3">
            <label className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-200">
                <span>รูปภาพผลงานทั้งหมด</span>
                {imagePreview.length > 0 && (
                    <span className="px-2 py-0.5 bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 rounded-full text-xs font-bold">
                        {imagePreview.length} รูป
                    </span>
                )}
            </label>

            {/* Dropzone */}
            <div className="border-2 border-dashed rounded-2xl p-6 bg-gray-50/50 dark:bg-zinc-800/30 border-gray-300 dark:border-zinc-700 hover:border-rose-500 dark:hover:border-rose-500 hover:bg-rose-50/20 dark:hover:bg-rose-950/10 transition cursor-pointer group">
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                />
                <label
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center cursor-pointer py-3 text-center"
                >
                    <div className="w-12 h-12 rounded-2xl bg-white dark:bg-zinc-800 shadow-sm border border-gray-200/80 dark:border-zinc-700 flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform mb-3">
                        <Plus size={26} />
                    </div>
                    <span className="text-sm font-bold text-gray-800 dark:text-gray-200 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition">
                        คลิกเพื่อเลือกรูปภาพผลงาน
                    </span>
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1">
                        สามารถเลือกอัปโหลดพร้อมกันได้หลายรูปภาพ
                    </span>
                </label>
            </div>

            {imagePreview.length > 0 && (
                <div className="mt-4 space-y-4">
                    {imagePreview.map((img, index) => (
                        <div
                            key={index}
                            onDragOver={(e) => handleDragOver(e, index)}
                            className={`flex flex-col sm:flex-row sm:items-start gap-4 p-4 sm:p-5 rounded-2xl border transition-all bg-white shadow-2xs dark:bg-zinc-800/90 dark:shadow-none ${
                                draggedIndex === index
                                    ? 'border-rose-500 ring-2 ring-rose-500/20 shadow-lg scale-[0.99]'
                                    : 'border-gray-200/80 dark:border-zinc-700/80 hover:border-gray-300 dark:hover:border-zinc-600'
                            }`}
                        >
                            {/* Top / Left: Drag + Order Badge + Thumbnail + Mobile Quick Actions */}
                            <div className="flex items-center justify-between sm:justify-start gap-3 w-full sm:w-auto shrink-0 border-b border-gray-100 dark:border-zinc-700/60 pb-3 sm:pb-0 sm:border-b-0">
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, index)}
                                        onDragEnd={handleDragEnd}
                                        className="cursor-grab active:cursor-grabbing p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-700 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition shrink-0"
                                        title="ลากเพื่อเปลี่ยนลำดับ"
                                    >
                                        <GripVertical size={18} />
                                    </button>

                                    <div className="flex flex-col gap-0.5">
                                        <button
                                            type="button"
                                            onClick={() => moveUp(index)}
                                            disabled={index === 0}
                                            className="cursor-pointer p-1 rounded hover:bg-gray-100 dark:hover:bg-zinc-700 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-25 disabled:cursor-not-allowed transition"
                                            title="ย้ายขึ้น"
                                        >
                                            <ChevronUp size={15} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => moveDown(index)}
                                            disabled={index === imagePreview.length - 1}
                                            className="cursor-pointer p-1 rounded hover:bg-gray-100 dark:hover:bg-zinc-700 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-25 disabled:cursor-not-allowed transition"
                                            title="ย้ายลง"
                                        >
                                            <ChevronDown size={15} />
                                        </button>
                                    </div>

                                    <span className="px-2.5 py-1 bg-gray-100 dark:bg-zinc-700/80 text-gray-700 dark:text-gray-200 font-bold rounded-lg text-xs shrink-0">
                                        #{index + 1}
                                    </span>
                                </div>

                                <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border border-gray-200/80 dark:border-zinc-700 shrink-0 bg-gray-100 dark:bg-zinc-800 shadow-2xs">
                                    <Image
                                        src={img.preview}
                                        alt={img.altText_th || img.altText_en || 'achievement image'}
                                        className="object-cover"
                                        fill
                                        sizes="96px"
                                    />
                                </div>

                                {/* Mobile action buttons (shown on top right on mobile, right side on desktop) */}
                                <div className="flex sm:hidden items-center gap-1.5 shrink-0 ml-auto">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        id={`replace-image-mobile-${index}`}
                                        className="hidden"
                                        onChange={(e) => handleReplaceImage(index, e)}
                                    />
                                    <label
                                        htmlFor={`replace-image-mobile-${index}`}
                                        className="cursor-pointer inline-flex items-center justify-center p-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-300 transition shadow-2xs"
                                        title="เปลี่ยนรูปภาพ"
                                    >
                                        <RefreshCw size={16} />
                                    </label>

                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(index)}
                                        className="cursor-pointer inline-flex items-center justify-center p-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/40 text-rose-600 dark:text-rose-300 transition shadow-2xs"
                                        title="ลบรูปภาพ"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            {/* Middle / Inputs Section - 100% full width on mobile for easy typing! */}
                            <div className="w-full sm:flex-1 space-y-3 min-w-0">
                                <div>
                                    <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 mb-1">
                                        คำอธิบายภาพภาษาไทย
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="ระบุคำอธิบายรูปภาพภาษาไทย..."
                                        value={img.altText_th}
                                        onChange={(e) =>
                                            handleImageAltChange(index, 'altText_th', e.target.value)
                                        }
                                        className="w-full min-h-[46px] px-4 py-2.5 text-sm sm:text-base font-medium rounded-xl border shadow-2xs bg-gray-50/60 text-gray-900 placeholder-gray-400 border-gray-200/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 dark:bg-zinc-900/60 dark:focus:bg-zinc-900 dark:text-white dark:placeholder-gray-500 dark:border-zinc-700 transition"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 mb-1">
                                        คำอธิบายภาพภาษาอังกฤษ
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="ระบุคำอธิบายรูปภาพภาษาอังกฤษ..."
                                        value={img.altText_en}
                                        onChange={(e) =>
                                            handleImageAltChange(index, 'altText_en', e.target.value)
                                        }
                                        className="w-full min-h-[46px] px-4 py-2.5 text-sm sm:text-base font-medium rounded-xl border shadow-2xs bg-gray-50/60 text-gray-900 placeholder-gray-400 border-gray-200/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 dark:bg-zinc-900/60 dark:focus:bg-zinc-900 dark:text-white dark:placeholder-gray-500 dark:border-zinc-700 transition"
                                    />
                                </div>
                            </div>

                            {/* Desktop action buttons (shown on right side on desktop) */}
                            <div className="hidden sm:flex sm:flex-col gap-2 shrink-0 self-center">
                                <input
                                    type="file"
                                    accept="image/*"
                                    id={`replace-image-${index}`}
                                    className="hidden"
                                    onChange={(e) => handleReplaceImage(index, e)}
                                />
                                <label
                                    htmlFor={`replace-image-${index}`}
                                    className="cursor-pointer inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-300 text-xs font-bold transition shadow-2xs"
                                    title="เปลี่ยนรูปภาพ"
                                >
                                    <RefreshCw size={15} />
                                    <span>เปลี่ยนรูป</span>
                                </label>

                                <button
                                    type="button"
                                    onClick={() => handleRemoveImage(index)}
                                    className="cursor-pointer inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/40 text-rose-600 dark:text-rose-300 text-xs font-bold transition shadow-2xs"
                                    title="ลบรูปภาพ"
                                >
                                    <Trash2 size={15} />
                                    <span>ลบรูป</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};