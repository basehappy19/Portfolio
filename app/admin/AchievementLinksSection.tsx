'use client';

import React, { DragEvent } from 'react';
import { GripVertical, Trash2 } from 'lucide-react';
import { LinkForm } from '@/types/Form';

type LinkField = keyof Omit<LinkForm, 'id' | 'sortOrder'>;

type Props = {
    links: LinkForm[];
    draggedLinkIndex: number | null;
    addLink: () => void;
    removeLink: (index: number) => void;
    handleLinkChange: (index: number, field: LinkField, value: string) => void;
    handleLinkDragStart: (e: DragEvent<HTMLDivElement>, index: number) => void;
    handleLinkDragOver: (e: DragEvent<HTMLDivElement>, index: number) => void;
    handleLinkDragEnd: () => void;
    handleLinkThaiBlur: (index: number) => void;
    translatingLink?: Record<number, boolean>;
};

export const AchievementLinksSection: React.FC<Props> = ({
    links,
    draggedLinkIndex,
    addLink,
    removeLink,
    handleLinkChange,
    handleLinkDragStart,
    handleLinkDragOver,
    handleLinkDragEnd,
    handleLinkThaiBlur,
    translatingLink
}) => {
    return (
        <div>
            <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    ลิงก์ที่เกี่ยวข้อง
                </label>
                <button
                    type="button"
                    onClick={addLink}
                    className="cursor-pointer text-sm px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                    + เพิ่มลิงก์
                </button>
            </div>

            {links.length === 0 ? (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    ยังไม่มีลิงก์ที่เกี่ยวข้อง กดปุ่ม &quot;เพิ่มลิงก์&quot; เพื่อเพิ่ม
                </p>
            ) : (
                <div className="space-y-3">
                    {links.map((link, index) => {
                        const isTranslating = !!translatingLink?.[index];

                        return (
                            <div
                                key={`${link.id ?? 'new'}-${index}`}
                                draggable
                                onDragStart={(e) => handleLinkDragStart(e, index)}
                                onDragOver={(e) => handleLinkDragOver(e, index)}
                                onDragEnd={handleLinkDragEnd}
                                className={`p-3 border rounded-lg bg-gray-50 dark:bg-gray-800 space-y-2 ${draggedLinkIndex === index
                                    ? 'border-blue-500'
                                    : 'border-gray-200 dark:border-gray-700'
                                    }`}
                            >
                                <div className="flex justify-between items-center">
                                    <span className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                        <GripVertical className="text-gray-400" size={14} />
                                        ลิงก์ที่ {index + 1}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => removeLink(index)}
                                        className="cursor-pointer text-red-500 hover:text-red-700 text-xs flex items-center gap-1"
                                    >
                                        <Trash2 size={14} />
                                        ลบลิงก์นี้
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    <input
                                        type="text"
                                        placeholder="ชื่อปุ่ม (ไทย)"
                                        value={link.label_th}
                                        onChange={(e) =>
                                            handleLinkChange(index, 'label_th', e.target.value)
                                        }
                                        onBlur={() => handleLinkThaiBlur(index)}
                                        className={
                                            `w-full px-3 py-2 text-sm border rounded dark:bg-gray-700 dark:text-white ` +
                                            (isTranslating
                                                ? 'border-blue-400 animate-pulse'
                                                : 'border-gray-300 dark:border-gray-600')
                                        }
                                    />
                                    <input
                                        type="text"
                                        placeholder="ชื่อปุ่ม (English)"
                                        value={link.label_en}
                                        onChange={(e) =>
                                            handleLinkChange(index, 'label_en', e.target.value)
                                        }
                                        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                                    />
                                </div>

                                {isTranslating && (
                                    <div className="flex items-center gap-2 mt-1 text-xs text-blue-600 dark:text-blue-400">
                                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                                        <span>AI กำลังแปล...</span>
                                    </div>
                                )}

                                <input
                                    type="text"
                                    placeholder="URL (เช่น https://...)"
                                    value={link.url}
                                    onChange={(e) =>
                                        handleLinkChange(index, 'url', e.target.value)
                                    }
                                    className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
