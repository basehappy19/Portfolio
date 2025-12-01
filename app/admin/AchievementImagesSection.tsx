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
}) => {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                รูปภาพ (ลากเพื่อเรียงลำดับ)
            </label>

            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
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
                    {imagePreview.map((img, index) => (
                        <div
                            key={index}
                            draggable
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragOver={(e) => handleDragOver(e, index)}
                            onDragEnd={handleDragEnd}
                            className={`flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border ${draggedIndex === index
                                    ? 'border-blue-500'
                                    : 'border-gray-200 dark:border-gray-700'
                                } cursor-move`}
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
                                <input
                                    type="text"
                                    placeholder="Alt text (ไทย)"
                                    value={img.altText_th}
                                    onChange={(e) =>
                                        handleImageAltChange(index, 'altText_th', e.target.value)
                                    }
                                    className="w-full px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                                />
                                <input
                                    type="text"
                                    placeholder="Alt text (English)"
                                    value={img.altText_en}
                                    onChange={(e) =>
                                        handleImageAltChange(index, 'altText_en', e.target.value)
                                    }
                                    className="w-full px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                                />
                                <div className="text-xs text-gray-500 dark:text-gray-400">
                                    ลำดับ: {index + 1}
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => handleRemoveImage(index)}
                                className="text-red-500 hover:text-red-700 shrink-0"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
