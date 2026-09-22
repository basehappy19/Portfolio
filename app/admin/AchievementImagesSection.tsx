'use client';

import React, { ChangeEvent, DragEvent, useState } from 'react';
import { GripVertical, Plus, Trash2, ChevronUp, ChevronDown, RefreshCw, ZoomIn, X, ChevronDown as CollapseIcon } from 'lucide-react';
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
    handleMoveImage: (fromIndex: number, toIndex: number) => void;
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
    handleMoveImage,
}) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [previewTitle, setPreviewTitle] = useState<string>('');
    const [mounted, setMounted] = useState(false);
    const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    React.useEffect(() => {
        if (previewUrl) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [previewUrl]);

    const moveUp = (index: number) => {
        if (index === 0) return;
        handleMoveImage(index, index - 1);
    };

    const moveDown = (index: number) => {
        if (index === imagePreview.length - 1) return;
        handleMoveImage(index, index + 1);
    };

    const openPreview = (url: string, title: string) => {
        setPreviewUrl(url);
        setPreviewTitle(title);
    };

    const toggleExpand = (index: number) => {
        setExpandedIndex(prev => prev === index ? null : index);
    };

    return (
        <div className="space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-200">
                    <span>รูปภาพผลงาน</span>
                    {imagePreview.length > 0 && (
                        <span className="px-2 py-0.5 bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 rounded-full text-[10px] font-bold">
                            {imagePreview.length} รูป
                        </span>
                    )}
                </label>
                {imagePreview.length > 0 && (
                    <span className="text-[10px] text-gray-400 dark:text-gray-500">คลิกรูปเพื่อขยาย</span>
                )}
            </div>

            {/* Upload dropzone (compact) */}
            <label
                htmlFor="image-upload"
                className="flex items-center justify-center gap-2 p-3 rounded-xl border-2 border-dashed border-gray-200 dark:border-zinc-700 hover:border-rose-400 dark:hover:border-rose-500 bg-gray-50/50 dark:bg-zinc-800/20 hover:bg-rose-50/20 dark:hover:bg-rose-950/10 transition cursor-pointer group"
            >
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                />
                <Plus size={16} className="text-rose-500 group-hover:scale-110 transition-transform" />
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition">
                    คลิกเพื่อเพิ่มรูปภาพ (เลือกได้หลายรูป)
                </span>
            </label>

            {/* Compact Image Grid */}
            {imagePreview.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {imagePreview.map((img, index) => (
                        <div
                            key={index}
                            onDragOver={(e) => handleDragOver(e, index)}
                            className={`relative group rounded-xl overflow-hidden border transition-all ${
                                draggedIndex === index
                                    ? 'border-rose-500 ring-2 ring-rose-500/30 scale-[0.97] opacity-70'
                                    : 'border-gray-200 dark:border-zinc-700'
                            }`}
                        >
                            {/* Thumbnail */}
                            <div
                                className="relative aspect-square bg-gray-100 dark:bg-zinc-800 cursor-pointer"
                                onClick={() => openPreview(img.preview, img.altText_th || img.altText_en || `รูป #${index + 1}`)}
                            >
                                <Image
                                    src={img.preview}
                                    alt={img.altText_th || img.altText_en || 'achievement image'}
                                    className="object-cover"
                                    fill
                                    sizes="120px"
                                />
                                {/* Hover overlay */}
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <ZoomIn size={20} className="text-white" />
                                </div>

                                {/* Order badge */}
                                <div className="absolute top-1 left-1 w-5 h-5 rounded-md bg-black/60 text-white text-[10px] font-bold flex items-center justify-center">
                                    {index + 1}
                                </div>

                                {/* Drag grip */}
                                <button
                                    type="button"
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, index)}
                                    onDragEnd={handleDragEnd}
                                    className="absolute top-1 right-1 w-5 h-5 rounded-md bg-black/50 text-white flex items-center justify-center cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="ลากเพื่อเรียง"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <GripVertical size={11} />
                                </button>
                            </div>

                            {/* Quick action bar */}
                            <div className="flex items-center justify-between bg-white dark:bg-zinc-900 px-1.5 py-1 gap-1">
                                <div className="flex items-center gap-0.5">
                                    <button
                                        type="button"
                                        onClick={() => moveUp(index)}
                                        disabled={index === 0}
                                        className="p-0.5 rounded text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-25 disabled:cursor-not-allowed transition cursor-pointer"
                                    >
                                        <ChevronUp size={13} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => moveDown(index)}
                                        disabled={index === imagePreview.length - 1}
                                        className="p-0.5 rounded text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-25 disabled:cursor-not-allowed transition cursor-pointer"
                                    >
                                        <ChevronDown size={13} />
                                    </button>
                                </div>

                                <div className="flex items-center gap-0.5">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        id={`replace-image-${index}`}
                                        className="hidden"
                                        onChange={(e) => handleReplaceImage(index, e)}
                                    />
                                    <label
                                        htmlFor={`replace-image-${index}`}
                                        className="p-0.5 rounded text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30 transition cursor-pointer"
                                        title="เปลี่ยนรูป"
                                    >
                                        <RefreshCw size={13} />
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveImage(index)}
                                        className="p-0.5 rounded text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition cursor-pointer"
                                        title="ลบรูป"
                                    >
                                        <Trash2 size={13} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => toggleExpand(index)}
                                        className="p-0.5 rounded text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition cursor-pointer"
                                        title="แก้ไขคำอธิบาย"
                                    >
                                        <CollapseIcon
                                            size={13}
                                            className={`transition-transform ${expandedIndex === index ? 'rotate-180' : ''}`}
                                        />
                                    </button>
                                </div>
                            </div>

                            {/* Expandable caption inputs */}
                            {expandedIndex === index && (
                                <div className="bg-gray-50 dark:bg-zinc-800/60 border-t border-gray-100 dark:border-zinc-700 p-2 space-y-1.5 col-span-full">
                                    <input
                                        type="text"
                                        placeholder="คำอธิบาย (ไทย)"
                                        value={img.altText_th}
                                        onChange={(e) => handleImageAltChange(index, 'altText_th', e.target.value)}
                                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border bg-white dark:bg-zinc-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 border-gray-200 dark:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-rose-500/30 focus:border-rose-500"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Caption (English)"
                                        value={img.altText_en}
                                        onChange={(e) => handleImageAltChange(index, 'altText_en', e.target.value)}
                                        className="w-full px-2.5 py-1.5 text-xs rounded-lg border bg-white dark:bg-zinc-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 border-gray-200 dark:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-blue-500/30 focus:border-blue-500"
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Full-Screen Lightbox */}
            {mounted && previewUrl && createPortal(
                <div
                    className="fixed inset-0 z-[100000] bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-4 sm:p-8"
                    onClick={() => setPreviewUrl(null)}
                >
                    <button
                        type="button"
                        onClick={() => setPreviewUrl(null)}
                        className="absolute top-4 right-4 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer flex items-center gap-1.5 text-xs font-bold"
                    >
                        <X size={18} />
                        <span className="hidden sm:inline">ปิด</span>
                    </button>

                    <div className="w-full max-w-5xl flex-1 flex items-center justify-center overflow-hidden relative" onClick={(e) => e.stopPropagation()}>
                        <div className="relative w-full h-full flex items-center justify-center">
                            <Image
                                src={previewUrl}
                                alt={previewTitle || 'Achievement image'}
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
                            className="mt-4 max-w-2xl text-center px-5 py-2.5 rounded-2xl bg-zinc-900/90 text-white text-sm font-bold border border-zinc-700"
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