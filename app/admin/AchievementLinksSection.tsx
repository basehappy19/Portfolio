'use client';

import React, { DragEvent } from 'react';
import { GripVertical, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
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
    const moveUp = (index: number) => {
        if (index === 0) return;
        const currentLink = links[index];
        const prevLink = links[index - 1];
        handleLinkChange(index, 'label_th', prevLink.label_th);
        handleLinkChange(index, 'label_en', prevLink.label_en);
        handleLinkChange(index, 'url', prevLink.url);
        handleLinkChange(index - 1, 'label_th', currentLink.label_th);
        handleLinkChange(index - 1, 'label_en', currentLink.label_en);
        handleLinkChange(index - 1, 'url', currentLink.url);
    };

    const moveDown = (index: number) => {
        if (index === links.length - 1) return;
        const currentLink = links[index];
        const nextLink = links[index + 1];
        handleLinkChange(index, 'label_th', nextLink.label_th);
        handleLinkChange(index, 'label_en', nextLink.label_en);
        handleLinkChange(index, 'url', nextLink.url);
        handleLinkChange(index + 1, 'label_th', currentLink.label_th);
        handleLinkChange(index + 1, 'label_en', currentLink.label_en);
        handleLinkChange(index + 1, 'url', currentLink.url);
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-2">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 dark:text-gray-200">
                    ลิงก์ที่เกี่ยวข้อง
                </label>
                <button
                    type="button"
                    onClick={addLink}
                    className="cursor-pointer text-xs font-medium px-3 py-1 rounded-md border transition bg-white text-gray-700 border-gray-200 hover:border-rose-400 dark:bg-zinc-800 dark:text-gray-200 dark:border-zinc-700 dark:hover:border-rose-500 shadow-2xs"
                >
                    + เพิ่มลิงก์
                </button>
            </div>

            {links.length === 0 ? (
                <p className="text-xs text-gray-500 dark:text-gray-400 p-3 rounded-md bg-gray-50 dark:bg-zinc-800/40 border border-dashed border-gray-200 dark:border-zinc-700 text-center">
                    ยังไม่มีลิงก์ที่เกี่ยวข้อง กดปุ่ม &quot;+ เพิ่มลิงก์&quot; เพื่อเพิ่ม
                </p>
            ) : (
                <div className="space-y-2.5">
                    {links.map((link, index) => (
                        <div
                            key={`${link.id ?? 'new'}-${index}`}
                            onDragOver={(e) => handleLinkDragOver(e, index)}
                            className={`p-3 rounded-md border space-y-2 transition bg-white shadow-2xs dark:bg-zinc-800/80 dark:shadow-none ${
                                draggedLinkIndex === index
                                    ? 'border-rose-500 ring-1 ring-rose-500'
                                    : 'border-gray-200 dark:border-zinc-700'
                            }`}
                        >
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-1.5">
                                    {/* Dedicated Drag Grip Button so dragging text inside inputs won't trigger row reordering */}
                                    <button
                                        type="button"
                                        draggable
                                        onDragStart={(e) => handleLinkDragStart(e, index)}
                                        onDragEnd={handleLinkDragEnd}
                                        className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-gray-100 dark:hover:bg-zinc-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                        title="ลากเพื่อเปลี่ยนลำดับ"
                                    >
                                        <GripVertical size={16} />
                                    </button>
                                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                                        ลำดับที่ {index + 1}
                                    </span>
                                    <div className="flex items-center gap-0.5 ml-1">
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
                                            disabled={index === links.length - 1}
                                            className="cursor-pointer p-0.5 rounded text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100 dark:hover:bg-zinc-700"
                                            title="ย้ายลง"
                                        >
                                            <ChevronDown size={14} />
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => removeLink(index)}
                                    className="cursor-pointer text-red-500 hover:text-red-600 text-xs flex items-center gap-1 font-medium px-2 py-0.5 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                                >
                                    <Trash2 size={13} />
                                    ลบ
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
                                    className="w-full px-3 py-1.5 text-xs rounded-md border shadow-2xs bg-white text-gray-900 placeholder-gray-400 border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 dark:bg-zinc-900/80 dark:text-white dark:placeholder-gray-500 dark:border-zinc-700"
                                />

                                <input
                                    type="text"
                                    placeholder="ชื่อปุ่ม (English)"
                                    value={link.label_en}
                                    onChange={(e) =>
                                        handleLinkChange(index, 'label_en', e.target.value)
                                    }
                                    className="w-full px-3 py-1.5 text-xs rounded-md border shadow-2xs bg-white text-gray-900 placeholder-gray-400 border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 dark:bg-zinc-900/80 dark:text-white dark:placeholder-gray-500 dark:border-zinc-700"
                                />
                            </div>

                            <input
                                type="text"
                                placeholder="URL (เช่น https://...)"
                                value={link.url}
                                onChange={(e) =>
                                    handleLinkChange(index, 'url', e.target.value)
                                }
                                className="w-full px-3 py-1.5 text-xs rounded-md border shadow-2xs bg-white text-gray-900 placeholder-gray-400 border-gray-200 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 dark:bg-zinc-900/80 dark:text-white dark:placeholder-gray-500 dark:border-zinc-700"
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};