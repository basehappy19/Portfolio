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
    handleLinkDragStart: (e: DragEvent<HTMLElement>, index: number) => void;
    handleLinkDragOver: (e: DragEvent<HTMLElement>, index: number) => void;
    handleLinkDragEnd: () => void;
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
}) => {
    return (
        <div className="space-y-2">
            {/* Header */}
            <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-200">
                    <span>ลิงก์ที่เกี่ยวข้อง</span>
                    {links.length > 0 && (
                        <span className="px-2 py-0.5 bg-gray-100 dark:bg-zinc-700 text-gray-600 dark:text-gray-300 rounded-full text-[10px] font-bold">
                            {links.length}
                        </span>
                    )}
                </label>
                <button
                    type="button"
                    onClick={addLink}
                    className="cursor-pointer text-xs font-semibold px-3 py-1.5 rounded-lg border transition bg-white text-rose-600 border-rose-200 hover:bg-rose-50 dark:bg-zinc-800 dark:text-rose-400 dark:border-zinc-700 dark:hover:bg-zinc-700"
                >
                    + เพิ่มลิงก์
                </button>
            </div>

            {links.length === 0 ? (
                <p className="text-[11px] text-gray-400 dark:text-gray-500 text-center py-2">
                    ยังไม่มีลิงก์ที่เกี่ยวข้อง
                </p>
            ) : (
                <div className="space-y-1.5">
                    {links.map((link, index) => (
                        <div
                            key={`${link.id ?? 'new'}-${index}`}
                            onDragOver={(e) => handleLinkDragOver(e, index)}
                            className={`flex items-center gap-2 p-2 rounded-xl border transition bg-white dark:bg-zinc-800/80 ${
                                draggedLinkIndex === index
                                    ? 'border-rose-500 ring-1 ring-rose-500/40 opacity-70 scale-[0.99]'
                                    : 'border-gray-200 dark:border-zinc-700'
                            }`}
                        >
                            {/* Drag grip */}
                            <button
                                type="button"
                                draggable
                                onDragStart={(e) => handleLinkDragStart(e, index)}
                                onDragEnd={handleLinkDragEnd}
                                className="cursor-grab active:cursor-grabbing p-1 rounded text-gray-300 dark:text-zinc-600 hover:text-gray-500 dark:hover:text-gray-400 shrink-0"
                                title="ลากเพื่อเรียง"
                            >
                                <GripVertical size={15} />
                            </button>

                            {/* Inline inputs */}
                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-1.5 min-w-0">
                                <input
                                    type="text"
                                    placeholder="ชื่อปุ่ม (ไทย)"
                                    value={link.label_th}
                                    onChange={(e) => handleLinkChange(index, 'label_th', e.target.value)}
                                    className="w-full px-2.5 py-1.5 text-xs font-medium rounded-lg border bg-gray-50 dark:bg-zinc-900/80 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 border-gray-200 dark:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-rose-500/30 focus:border-rose-500"
                                />
                                <input
                                    type="text"
                                    placeholder="Label (English)"
                                    value={link.label_en}
                                    onChange={(e) => handleLinkChange(index, 'label_en', e.target.value)}
                                    className="w-full px-2.5 py-1.5 text-xs font-medium rounded-lg border bg-gray-50 dark:bg-zinc-900/80 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 border-gray-200 dark:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-rose-500/30 focus:border-rose-500"
                                />
                                <input
                                    type="text"
                                    placeholder="https://..."
                                    value={link.url}
                                    onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                                    className="w-full px-2.5 py-1.5 text-xs font-medium rounded-lg border bg-gray-50 dark:bg-zinc-900/80 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 border-gray-200 dark:border-zinc-700 focus:outline-none focus:ring-1 focus:ring-rose-500/30 focus:border-rose-500"
                                />
                            </div>

                            {/* Delete */}
                            <button
                                type="button"
                                onClick={() => removeLink(index)}
                                className="cursor-pointer p-1.5 rounded-lg text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition shrink-0"
                                title="ลบลิงก์"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};