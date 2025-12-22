'use client';

import React, { ChangeEvent, DragEvent } from 'react';
import { GripVertical, Plus, Trash2 } from 'lucide-react';
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
    handleDragStart: (e: DragEvent<HTMLDivElement>, index: number) => void;
    handleDragOver: (e: DragEvent<HTMLDivElement>, index: number) => void;
    handleDragEnd: () => void;
    handleTranslateImageAlt: (index: number) => void;
    translatingImageAlt?: Record<number, boolean>;
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
    handleTranslateImageAlt,
    translatingImageAlt,
}) => {
    return (
        <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
                รูปภาพ
            </label>

            {/* Dropzone */}
            <div className="border-2 border-dashed rounded-lg p-4 bg-white border-gray-300 dark:bg-transparent dark:border-gray-600">
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                />
                <label
                    htmlFor="image-upload"
                    className="flex flex-col items-center justify-center cursor-pointer py-4"
                >
                    <Plus size={32} className="text-gray-400 mb-2" />
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        คลิกเพื่อเลือกรูปภาพ (สามารถเลือกได้หลายรูป)
                    </span>
                </label>
            </div>

            {imagePreview.length > 0 && (
                <div className="mt-4 space-y-3">
                    {imagePreview.map((img, index) => {
                        const isTranslating = !!translatingImageAlt?.[index];

                        return (
                            <div
                                key={index}
                                draggable
                                onDragStart={(e) => handleDragStart(e, index)}
                                onDragOver={(e) => handleDragOver(e, index)}
                                onDragEnd={handleDragEnd}
                                className={`
                  flex items-start gap-3 p-3 rounded-lg border cursor-move transition-all
                  bg-white shadow-sm
                  dark:bg-gray-800 dark:shadow-none
                  ${draggedIndex === index
                                        ? 'border-red-500'
                                        : 'border-gray-200 dark:border-gray-700'
                                    }
                `}
                            >
                                <GripVertical
                                    size={20}
                                    className="text-gray-400 mt-2 shrink-0"
                                />

                                <Image
                                    src={img.preview}
                                    alt={img.altText_th || img.altText_en || 'achievement image'}
                                    className="w-24 h-24 object-cover rounded shrink-0"
                                    width={96}
                                    height={96}
                                />

                                <div className="flex-1 space-y-2">
                                    {/* Alt TH + ปุ่มแปล */}
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Alt text (ไทย)"
                                            value={img.altText_th}
                                            onChange={(e) =>
                                                handleImageAltChange(index, 'altText_th', e.target.value)
                                            }
                                            className={`
                        w-full px-3 py-2 text-sm rounded border shadow-sm
                        bg-white text-gray-900 placeholder-gray-400
                        focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500
                        pr-12 
                        dark:bg-gray-700 dark:text-white dark:placeholder-gray-400
                        ${isTranslating
                                                    ? 'border-red-400 animate-pulse'
                                                    : 'border-gray-300 dark:border-gray-600'
                                                }
                      `}
                                        />

                                        <button
                                            type="button"
                                            onClick={() => handleTranslateImageAlt(index)}
                                            disabled={isTranslating}
                                            className="
                        cursor-pointer absolute right-2 top-1/2 -translate-y-1/2 z-10 
                        p-1.5 rounded-md 
                        bg-white/80 dark:bg-gray-800/80 
                        hover:bg-sky-50 text-sky-600 
                        border border-gray-200 shadow-sm backdrop-blur-sm 
                        transition-all
                        disabled:opacity-50
                      "
                                            title="Translate to English"
                                        >
                                            {isTranslating ? (
                                                <span className="w-4 h-4 block rounded-full border-2 border-sky-500 border-t-transparent animate-spin" />
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m5 8 6 6" /><path d="m4 14 6-6 2-3" /><path d="M2 5h12" /><path d="M7 2h1" /><path d="m22 22-5-10-5 10" /><path d="M14 18h6" /></svg>
                                            )}
                                        </button>
                                    </div>

                                    {/* Alt EN */}
                                    <input
                                        type="text"
                                        placeholder="Alt text (English)"
                                        value={img.altText_en}
                                        onChange={(e) =>
                                            handleImageAltChange(index, 'altText_en', e.target.value)
                                        }
                                        className="
                      w-full px-3 py-2 text-sm rounded border shadow-sm
                      bg-white text-gray-900 placeholder-gray-400 border-gray-300
                      focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500
                      dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:border-gray-600
                    "
                                    />

                                    {isTranslating && (
                                        <div className="flex items-center gap-2 text-xs text-red-600 dark:text-red-400">
                                            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                                            <span>AI กำลังแปล...</span>
                                        </div>
                                    )}

                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        ลำดับ: {index + 1}
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => handleRemoveImage(index)}
                                    className="cursor-pointer text-red-500 hover:text-red-700 shrink-0"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};