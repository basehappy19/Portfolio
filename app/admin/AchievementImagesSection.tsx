'use client';

import React, { ChangeEvent, DragEvent, useState } from 'react';
import { GripVertical, Plus, Trash2, ChevronUp, ChevronDown, RefreshCw, ZoomIn, X } from 'lucide-react';
import Image from 'next/image';
import { ImagePreview } from '@/types/Form';
import { createPortal } from 'react-dom';

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
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [previewTitle, setPreviewTitle] = useState<string>('');
    const [mounted, setMounted] = useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

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

    const openPreview = (url: string, title: string) => {
        setPreviewUrl(url);
        setPreviewTitle(title);
    };

    return (
        <div className="space-y-4">
            <label className="flex items-center justify-between text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-200">
                <div className="flex items-center gap-2">
                    <span>รูปภาพผลงานทั้งหมด</span>
                    {imagePreview.length > 0 && (
                        <span className="px-2.5 py-0.5 bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 rounded-full text-xs font-bold">
                            {imagePreview.length} รูป
                        </span>
                    )}
                </div>
                {imagePreview.length > 0 && (
                    <span className="text-[11px] sm:text-xs font-medium text-gray-500 dark:text-gray-400">
                        💡 คลิกที่รูปเพื่อขยายดูภาพขนาดเต็มและตรวจสอบความคมชัด
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
                        คลิกเพื่อเลือกรูปภาพผลงานเพิ่ม
                    </span>
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 mt-1">
                        สามารถเลือกอัปโหลดพร้อมกันได้หลายรูปภาพ
                    </span>
                </label>
            </div>

            {/* Gallery Items Grid/List */}
            {imagePreview.length > 0 && (
                <div className="mt-6 space-y-5">
                    {imagePreview.map((img, index) => (
                        <div
                            key={index}
                            onDragOver={(e) => handleDragOver(e, index)}
                            className={`flex flex-col sm:flex-row gap-5 p-4 sm:p-6 rounded-2xl border transition-all bg-white shadow-2xs dark:bg-zinc-900/90 ${
                                draggedIndex === index
                                    ? 'border-rose-500 ring-2 ring-rose-500/20 shadow-lg scale-[0.99]'
                                    : 'border-gray-200/80 dark:border-zinc-800 hover:border-gray-300 dark:hover:border-zinc-700'
                            }`}
                        >
                            {/* Left Panel: Order Header + Spacious Image Preview Box + Quick Actions */}
                            <div className="w-full sm:w-56 md:w-64 shrink-0 flex flex-col gap-3">
                                {/* Order Controls Row */}
                                <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-zinc-800">
                                    <div className="flex items-center gap-1.5">
                                        <button
                                            type="button"
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, index)}
                                            onDragEnd={handleDragEnd}
                                            className="cursor-grab active:cursor-grabbing p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition"
                                            title="ลากเพื่อเปลี่ยนลำดับ"
                                        >
                                            <GripVertical size={18} />
                                        </button>

                                        <div className="flex items-center gap-1">
                                            <button
                                                type="button"
                                                onClick={() => moveUp(index)}
                                                disabled={index === 0}
                                                className="cursor-pointer p-1 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 disabled:opacity-25 disabled:cursor-not-allowed transition"
                                                title="ย้ายลำดับขึ้น"
                                            >
                                                <ChevronUp size={16} />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => moveDown(index)}
                                                disabled={index === imagePreview.length - 1}
                                                className="cursor-pointer p-1 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 disabled:opacity-25 disabled:cursor-not-allowed transition"
                                                title="ย้ายลำดับลง"
                                            >
                                                <ChevronDown size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    <span className="px-3 py-1 bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-gray-200 font-extrabold rounded-lg text-xs">
                                        ลำดับที่ #{index + 1}
                                    </span>
                                </div>

                                {/* Large, Crisp Image Preview Box with Click to Zoom */}
                                <div
                                    onClick={() => openPreview(img.preview, img.altText_th || img.altText_en || `รูปภาพผลงานลำดับที่ ${index + 1}`)}
                                    className="relative w-full aspect-4/3 sm:aspect-square rounded-xl overflow-hidden border border-gray-200/80 dark:border-zinc-800 bg-gray-100 dark:bg-zinc-800/80 shadow-inner group/img cursor-pointer flex items-center justify-center"
                                    title="คลิกเพื่อขยายดูภาพเต็มและตรวจสอบความชัด"
                                >
                                    <Image
                                        src={img.preview}
                                        alt={img.altText_th || img.altText_en || 'achievement image'}
                                        className="object-contain p-1 group-hover/img:scale-105 transition-transform duration-300"
                                        fill
                                        sizes="(max-width: 640px) 100vw, 256px"
                                    />

                                    {/* Hover Overlay Prompt */}
                                    <div className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover/img:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center text-white p-2 text-center gap-1.5 backdrop-blur-[2px]">
                                        <ZoomIn className="w-7 h-7 text-rose-400" />
                                        <span className="text-xs font-bold tracking-wide">คลิกเพื่อขยายดูภาพชัดๆ</span>
                                    </div>

                                </div>

                                {/* Action Buttons underneath the photo (Replace & Delete) */}
                                <div className="grid grid-cols-2 gap-2 w-full pt-1">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        id={`replace-image-${index}`}
                                        className="hidden"
                                        onChange={(e) => handleReplaceImage(index, e)}
                                    />
                                    <label
                                        htmlFor={`replace-image-${index}`}
                                        className="cursor-pointer inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-300 text-xs font-bold transition shadow-2xs text-center"
                                        title="เลือกไฟล์รูปใหม่มาแทนที่รูปนี้"
                                    >
                                        <RefreshCw size={14} className="shrink-0" />
                                        <span className="truncate">เปลี่ยนรูป</span>
                                    </label>

                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(index)}
                                        className="cursor-pointer inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/40 text-rose-600 dark:text-rose-300 text-xs font-bold transition shadow-2xs text-center"
                                        title="ลบรูปภาพนี้ออกจากผลงาน"
                                    >
                                        <Trash2 size={14} className="shrink-0" />
                                        <span className="truncate">ลบรูป</span>
                                    </button>
                                </div>
                            </div>

                            {/* Right Panel: Spacious Captions Inputs */}
                            <div className="flex-1 min-w-0 flex flex-col justify-center gap-4 bg-gray-50/60 dark:bg-zinc-800/40 p-4 sm:p-5 rounded-xl border border-gray-100 dark:border-zinc-800/80">
                                <div>
                                    <div className="flex items-center justify-between mb-1.5">
                                        <label className="block text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                                            <span className="w-1.5 h-3.5 bg-rose-500 rounded-full inline-block" />
                                            <span>คำอธิบายภาพภาษาไทย</span>
                                        </label>
                                    </div>
                                    <textarea
                                        rows={3}
                                        placeholder="ระบุคำอธิบายรูปภาพภาษาไทย เช่น ภาพโปสเตอร์หลัก, บรรยากาศการรับรางวัล..."
                                        value={img.altText_th}
                                        onChange={(e) =>
                                            handleImageAltChange(index, 'altText_th', e.target.value)
                                        }
                                        className="w-full min-h-[76px] px-4 py-3 text-sm sm:text-base font-medium rounded-xl border shadow-2xs bg-white text-gray-900 placeholder-gray-400 border-gray-200/80 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 dark:bg-zinc-900 dark:text-white dark:placeholder-gray-500 dark:border-zinc-700 transition resize-y leading-relaxed"
                                    />
                                </div>

                                <div className="border-t border-gray-200/50 dark:border-zinc-700/50 pt-3 sm:pt-4">
                                    <div className="flex items-center justify-between mb-1.5">
                                        <label className="block text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-200 flex items-center gap-1.5">
                                            <span className="w-1.5 h-3.5 bg-blue-500 rounded-full inline-block" />
                                            <span>คำอธิบายภาพภาษาอังกฤษ</span>
                                        </label>
                                    </div>
                                    <textarea
                                        rows={3}
                                        placeholder="Enter English caption for this image..."
                                        value={img.altText_en}
                                        onChange={(e) =>
                                            handleImageAltChange(index, 'altText_en', e.target.value)
                                        }
                                        className="w-full min-h-[76px] px-4 py-3 text-sm sm:text-base font-medium rounded-xl border shadow-2xs bg-white text-gray-900 placeholder-gray-400 border-gray-200/80 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-zinc-900 dark:text-white dark:placeholder-gray-500 dark:border-zinc-700 transition resize-y leading-relaxed"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Full-Screen Image Lightbox Preview inside Modal */}
            {mounted && previewUrl && createPortal(
                <div
                    className="fixed inset-0 z-[100000] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-8 animate-fadeIn"
                    onClick={() => setPreviewUrl(null)}
                >
                    {/* Close button */}
                    <button
                        type="button"
                        onClick={() => setPreviewUrl(null)}
                        className="absolute top-4 right-4 sm:top-6 sm:right-6 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer z-50 flex items-center gap-1.5 text-sm font-bold"
                        title="ปิดหน้าต่างแสดงรูปภาพ"
                    >
                        <X size={20} />
                        <span className="hidden sm:inline">ปิด</span>
                    </button>

                    <div className="w-full max-w-5xl flex-1 flex items-center justify-center overflow-hidden relative my-4" onClick={(e) => e.stopPropagation()}>
                        <div className="relative w-full h-full flex items-center justify-center">
                            <Image
                                src={previewUrl}
                                alt={previewTitle || 'Achievement image full preview'}
                                className="object-contain max-h-[80vh] rounded-xl shadow-2xl"
                                fill
                                sizes="100vw"
                                priority
                            />
                        </div>
                    </div>

                    {previewTitle && (
                        <div
                            onClick={(e) => e.stopPropagation()}
                            className="max-w-3xl text-center px-6 py-3 rounded-2xl bg-zinc-900/90 text-white text-sm sm:text-base font-bold border border-zinc-700 shadow-xl"
                        >
                            {previewTitle}
                        </div>
                    )}
                </div>,
                document.body
            )}
        </div>
    );
};