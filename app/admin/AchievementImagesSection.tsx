'use client';

import React, { ChangeEvent, DragEvent } from 'react';
import { GripVertical, Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import Image from 'next/image';
import { ImagePreview } from '@/types/Form';

type Props = {
    imagePreview: ImagePreview[];
    draggedIndex: number | null;
    handleImageUpload: (e: ChangeEvent<HTMLInputElement>) => void;
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
    handleImageAltChange,
    handleRemoveImage,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleMoveImage,
}) => {
    const moveUp = (index: number) => {
        if (index === 0) return;
        handleMoveImage(index, index - 1);
    };

    const moveDown = (index: number) => {
        if (index === imagePreview.length - 1) return;
        handleMoveImage(index, index + 1);
    };

    return (
        <div>
            <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 dark:text-gray-200 mb-1.5">
                รูปภาพผลงาน
            </label>

            {/* Dropzone */}
            <div className="border border-dashed rounded-md p-4 bg-white dark:bg-zinc-800/40 border-gray-300 dark:border-zinc-700 hover:border-rose-400 dark:hover:border-rose-500 transition cursor-pointer">
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
                    className="flex flex-col items-center justify-center cursor-pointer py-2"
                >
                    <Plus size={24} className="text-gray-400 mb-1" />
                    <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                        คลิกเพื่อเลือกรูปภาพ (สามารถเลือกได้หลายรูป)
                    </span>
                </label>
            </div>

            {imagePreview.length > 0 && (
                <div className="mt-3 space-y-2.5">
                    {imagePreview.map((img, index) => (
                        <div
                            key={index}
                            onDragOver={(e) => handleDragOver(e, index)}
                            className={`flex items-start gap-3 p-3 rounded-md border transition bg-white shadow-2xs dark:bg-zinc-800/80 dark:shadow-none ${
                                draggedIndex === index
                                    ? 'border-rose-500 ring-1 ring-rose-500'
                                    : 'border-gray-200 dark:border-zinc-700'
                            }`}
                        >
                            <div className="flex flex-col items-center gap-1 mt-1">
                                <button
                                    type="button"
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, index)}
                                    onDragEnd={handleDragEnd}
                                    className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-gray-100 dark:hover:bg-zinc-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                    title="ลากเพื่อเปลี่ยนลำดับ"
                                >
                                    <GripVertical size={16} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => moveUp(index)}
                                    disabled={index === 0}
                                    className="cursor-pointer p-0.5 rounded text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-zinc-700"
                                    title="ย้ายขึ้น"
                                >
                                    <ChevronUp size={14} />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => moveDown(index)}
                                    disabled={index === imagePreview.length - 1}
                                    className="cursor-pointer p-0.5 rounded text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-zinc-700"
                                    title="ย้ายลง"
                                >
                                    <ChevronDown size={14} />
                                </button>
                            </div>

                            <Image
                                src={img.preview}
                                alt={img.altText_th || img.altText_en || 'achievement image'}
                                className="w-20 h-20 object-cover rounded border border-gray-200 dark:border-zinc-700 shrink-0"
                                width={80}
                                height={80}
                            />

                            <div className="flex-1 space-y-2">
                                <input
                                    type="text"
                                    placeholder="คำอธิบายภาพ (ไทย)"
                                    value={img.altText_th}
                                    onChange={(e) =>
                                        handleImageAltChange(index, 'altText_th', e.target.value)
                                    }
                                    className="w-full px-3 py-1.5 text-xs rounded-md border shadow-2xs bg-white text-gray-900 placeholder-gray-400 border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 dark:bg-zinc-900/80 dark:text-white dark:placeholder-gray-500 dark:border-zinc-700"
                                />

                                <input
                                    type="text"
                                    placeholder="คำอธิบายภาพ (English)"
                                    value={img.altText_en}
                                    onChange={(e) =>
                                        handleImageAltChange(index, 'altText_en', e.target.value)
                                    }
                                    className="w-full px-3 py-1.5 text-xs rounded-md border shadow-2xs bg-white text-gray-900 placeholder-gray-400 border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 dark:bg-zinc-900/80 dark:text-white dark:placeholder-gray-500 dark:border-zinc-700"
                                />
                            </div>

                            <button
                                type="button"
                                onClick={() => handleRemoveImage(index)}
                                className="cursor-pointer text-gray-400 hover:text-red-500 p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition shrink-0"
                                title="ลบรูปภาพ"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};