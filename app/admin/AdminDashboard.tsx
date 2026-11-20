'use client';

import { useAchievementModal } from '@/app/contexts/AchievementModalContext';
import CategoryBadge from '@/components/CategoryBadge';
import { Achievement } from '@/types/Achievements';
import {
    DndContext, DragEndEvent, KeyboardSensor, PointerSensor, TouchSensor, closestCenter, useSensor, useSensors,
} from '@dnd-kit/core';
import {
    SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
    ArrowDownToLine, ArrowUpToLine, ChevronDown, ChevronUp, Eye, EyeOff, GripVertical, ImageIcon, ListOrdered, Pencil, Trash2, X,
} from 'lucide-react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState, useTransition } from 'react';
import toast from 'react-hot-toast';
import DeleteModal from './Modal/AchievementDelete';
import { deleteAchievement, reorderAchievements, toggleAchievementStatus } from './services/achievements';

const ImageLightbox = dynamic(() => import('@/components/ImageLightbox'), { ssr: false });

const yearTH = (d?: Date | string | null) => (d ? `พ.ศ. ${new Date(d).getFullYear() + 543}` : 'ไม่ระบุวันที่');

type Props = { achievements: Achievement[]; filtered: boolean };

export default function AdminDashboard({ achievements, filtered }: Props) {
    const router = useRouter();
    const { open } = useAchievementModal();
    const [items, setItems] = useState(achievements);
    const [prev, setPrev] = useState(achievements);
    const [sorting, setSorting] = useState(false);
    const [order, setOrder] = useState<string[]>([]);
    const [busyId, setBusyId] = useState<string | null>(null);
    const [saving, startSaving] = useTransition();
    const [del, setDel] = useState<{ id: string; title: string } | null>(null);
    const [delAnim, setDelAnim] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [lightbox, setLightbox] = useState<{ a: Achievement; i: number } | null>(null);

    // new data from the server (after refresh) replaces the local copy
    if (achievements !== prev) {
        setPrev(achievements);
        setItems(achievements);
    }

    // ?edit=<id> opens the editor straight away (used by links from the site)
    useEffect(() => {
        const id = new URLSearchParams(window.location.search).get('edit');
        const target = id && items.find((a) => a.id === id);
        if (target) {
            open(target);
            window.history.replaceState({}, '', window.location.pathname);
        }
    }, [items, open]);

    const byId = useMemo(() => new Map(items.map((a) => [a.id, a])), [items]);
    const list = sorting ? order.map((id) => byId.get(id)!).filter(Boolean) : items;
    const changed = sorting && order.some((id, i) => id !== items[i]?.id);
    const movedCount = sorting ? order.filter((id, i) => id !== items[i]?.id).length : 0;

    const startSorting = () => { setOrder(items.map((a) => a.id)); setSorting(true); };
    const cancelSorting = () => { setSorting(false); setOrder([]); };
    const move = (from: number, to: number) => {
        if (to < 0 || to >= order.length || from === to) return;
        setOrder((o) => arrayMove(o, from, to));
    };
    const saveOrder = () => startSaving(async () => {
        try {
            await reorderAchievements(order);
            setItems(order.map((id) => byId.get(id)!));
            setSorting(false);
            toast.success('บันทึกลำดับแล้ว');
            router.refresh();
        } catch {
            toast.error('บันทึกลำดับไม่สำเร็จ ลองใหม่อีกครั้ง');
        }
    });

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
        useSensor(TouchSensor, { activationConstraint: { delay: 120, tolerance: 6 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
    );
    const onDragEnd = ({ active, over }: DragEndEvent) => {
        if (over && active.id !== over.id) move(order.indexOf(String(active.id)), order.indexOf(String(over.id)));
    };

    const toggleStatus = async (a: Achievement) => {
        setBusyId(a.id);
        try {
            await toggleAchievementStatus(a.id, a.status);
            setItems((xs) => xs.map((x) => (x.id === a.id ? { ...x, status: a.status === 'PUBLIC' ? 'DRAFT' : 'PUBLIC' } : x)));
            toast.success(a.status === 'PUBLIC' ? 'ซ่อนจากหน้าเว็บแล้ว' : 'เผยแพร่แล้ว');
            router.refresh();
        } catch {
            toast.error('เปลี่ยนสถานะไม่สำเร็จ');
        } finally {
            setBusyId(null);
        }
    };

    const askDelete = (a: Achievement) => { setDel({ id: a.id, title: a.title_th }); setDelAnim(true); };
    const closeDelete = () => { setDelAnim(false); setTimeout(() => setDel(null), 200); };
    const confirmDelete = async () => {
        if (!del) return;
        setDeleting(true);
        try {
            await deleteAchievement(del.id);
            setItems((xs) => xs.filter((x) => x.id !== del.id));
            toast.success('ลบผลงานแล้ว');
            closeDelete();
            router.refresh();
        } catch {
            toast.error('ลบไม่สำเร็จ');
        } finally {
            setDeleting(false);
        }
    };

    return (
        <section>
            {/* list header */}
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-zinc-500">
                    {sorting ? (
                        <>ลากที่ <GripVertical className="inline h-4 w-4 align-[-3px]" /> หรือกดลูกศรเพื่อย้าย · รายการบนสุดจะแสดงก่อนบนเว็บ</>
                    ) : (
                        <>{items.length} รายการ · เรียงตามที่แสดงบนเว็บ</>
                    )}
                </p>
                {!sorting ? (
                    <button
                        type="button"
                        onClick={startSorting}
                        disabled={items.length < 2}
                        className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-800 shadow-2xs transition hover:border-zinc-400 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <ListOrdered className="h-4 w-4" /> จัดลำดับ
                    </button>
                ) : (
                    <button type="button" onClick={cancelSorting} className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold text-zinc-500 hover:bg-zinc-100">
                        <X className="h-4 w-4" /> ออกจากโหมดจัดลำดับ
                    </button>
                )}
            </div>
            {sorting && filtered && (
                <p className="mb-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-800">
                    กำลังจัดลำดับเฉพาะรายการที่กรองอยู่ รายการอื่นยังอยู่ตำแหน่งเดิม
                </p>
            )}

            {list.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-zinc-300 bg-white px-6 py-16 text-center text-zinc-500">
                    ไม่พบผลงานตามที่ค้นหา
                </div>
            ) : (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
                    <SortableContext items={list.map((a) => a.id)} strategy={verticalListSortingStrategy} disabled={!sorting}>
                        <ol className="space-y-2.5">
                            {list.map((a, i) => (
                                <Row
                                    key={a.id}
                                    a={a}
                                    index={i}
                                    total={list.length}
                                    sorting={sorting}
                                    moved={sorting && items[i]?.id !== a.id}
                                    busy={busyId === a.id}
                                    onMove={move}
                                    onEdit={() => open(a)}
                                    onToggle={() => toggleStatus(a)}
                                    onDelete={() => askDelete(a)}
                                    onPreview={() => a.images.length && setLightbox({ a, i: 0 })}
                                />
                            ))}
                        </ol>
                    </SortableContext>
                </DndContext>
            )}

            {/* save bar for the reorder mode */}
            {sorting && (
                <div className="sticky bottom-4 z-20 mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-zinc-200 bg-white/95 px-4 py-3 shadow-[0_18px_50px_-15px_rgba(0,0,0,0.35)] backdrop-blur sm:px-5">
                    <span className="text-sm font-medium text-zinc-600">
                        {changed ? `ย้ายแล้ว ${movedCount} รายการ ยังไม่ได้บันทึก` : 'ยังไม่มีการเปลี่ยนแปลง'}
                    </span>
                    <div className="flex gap-2">
                        <button type="button" onClick={cancelSorting} className="cursor-pointer rounded-xl px-4 py-2.5 text-sm font-semibold text-zinc-600 hover:bg-zinc-100">
                            ยกเลิก
                        </button>
                        <button
                            type="button"
                            onClick={saveOrder}
                            disabled={!changed || saving}
                            className="cursor-pointer rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            {saving ? 'กำลังบันทึก…' : 'บันทึกลำดับ'}
                        </button>
                    </div>
                </div>
            )}

            {del && (
                <DeleteModal isOpen onClose={closeDelete} onConfirm={confirmDelete} itemName={del.title} isLoading={deleting} isAnimating={delAnim} />
            )}
            {lightbox && (
                <ImageLightbox
                    images={lightbox.a.images}
                    index={lightbox.i}
                    title={lightbox.a.title_th}
                    locale="th"
                    canDownload
                    onClose={() => setLightbox(null)}
                    onChange={(i) => setLightbox((l) => (l ? { ...l, i } : l))}
                />
            )}
        </section>
    );
}

type RowProps = {
    a: Achievement; index: number; total: number; sorting: boolean; moved: boolean; busy: boolean;
    onMove: (from: number, to: number) => void; onEdit: () => void; onToggle: () => void; onDelete: () => void; onPreview: () => void;
};

function Row({ a, index, total, sorting, moved, busy, onMove, onEdit, onToggle, onDelete, onPreview }: RowProps) {
    const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } = useSortable({ id: a.id, disabled: !sorting });
    const cover = a.images[0];
    const isPublic = a.status === 'PUBLIC';
    const iconBase = 'h-8 w-8 sm:h-9 sm:w-9 cursor-pointer items-center justify-center rounded-xl text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-30';
    const iconBtn = `inline-flex ${iconBase}`;
    const iconBtnDesktop = `hidden sm:inline-flex ${iconBase}`;

    return (
        <li
            ref={setNodeRef}
            style={{ transform: CSS.Translate.toString(transform), transition }}
            className={`group relative flex items-center gap-2.5 rounded-2xl border bg-white p-2 pr-1.5 sm:gap-4 sm:p-3 sm:pr-3 ${
                isDragging ? 'z-10 border-rose-300 shadow-[0_20px_50px_-18px_rgba(190,18,60,0.45)]' : moved ? 'border-rose-200 bg-rose-50/40' : 'border-zinc-200/80 hover:border-zinc-300'
            } ${!isPublic ? 'opacity-[0.85]' : ''}`}
        >
            {sorting && (
                <button
                    type="button"
                    ref={setActivatorNodeRef}
                    {...attributes}
                    {...listeners}
                    aria-label={`ลากเพื่อย้าย ${a.title_th}`}
                    className="flex h-12 w-8 flex-none cursor-grab touch-none items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 active:cursor-grabbing"
                >
                    <GripVertical className="h-5 w-5" />
                </button>
            )}

            <span className="hidden w-6 flex-none text-center text-sm font-semibold tabular-nums text-zinc-400 sm:block">{index + 1}</span>

            <button
                type="button"
                onClick={onPreview}
                className={`relative h-12 w-16 flex-none cursor-zoom-in ${sorting ? "hidden sm:block" : ""} overflow-hidden rounded-xl bg-zinc-100 sm:h-16 sm:w-24`}
                aria-label="ดูรูป"
            >
                {cover ? (
                    <Image src={cover.url} alt="" fill sizes="96px" className="object-cover" />
                ) : (
                    <ImageIcon className="absolute inset-0 m-auto h-5 w-5 text-zinc-300" />
                )}
                {a.images.length > 1 && (
                    <span className="absolute bottom-1 right-1 rounded-md bg-black/60 px-1.5 text-[11px] font-semibold text-white">{a.images.length}</span>
                )}
            </button>

            <div className="min-w-0 flex-1">
                <button type="button" onClick={onEdit} disabled={sorting} className="block w-full cursor-pointer text-left disabled:cursor-default">
                    <span className="line-clamp-2 text-[15px] font-semibold leading-snug text-zinc-900 group-hover:text-rose-700 sm:line-clamp-1">{a.title_th}</span>
                </button>
                <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-zinc-500">
                    {a.categories.slice(0, 2).map((c, i) => (
                        <span key={c.category.slug} className={i > 0 ? 'hidden sm:inline-flex' : 'inline-flex'}>
                            <CategoryBadge slug={c.category.slug} name={c.category.name_th} size="sm" />
                        </span>
                    ))}
                    {a.awardLevel_th && <span className="hidden max-w-[16rem] truncate sm:inline">{a.awardLevel_th}</span>}
                    <span className="text-zinc-400">{yearTH(a.receivedAt)}</span>
                </div>
            </div>

            {sorting ? (
                <div className="flex flex-none items-center gap-0.5">
                    <button type="button" className={iconBtnDesktop} disabled={index === 0} onClick={() => onMove(index, 0)} title="ย้ายไปบนสุด">
                        <ArrowUpToLine className="h-4 w-4" />
                    </button>
                    <button type="button" className={iconBtn} disabled={index === 0} onClick={() => onMove(index, index - 1)} title="เลื่อนขึ้น">
                        <ChevronUp className="h-5 w-5" />
                    </button>
                    <button type="button" className={iconBtn} disabled={index === total - 1} onClick={() => onMove(index, index + 1)} title="เลื่อนลง">
                        <ChevronDown className="h-5 w-5" />
                    </button>
                    <button type="button" className={iconBtnDesktop} disabled={index === total - 1} onClick={() => onMove(index, total - 1)} title="ย้ายไปล่างสุด">
                        <ArrowDownToLine className="h-4 w-4" />
                    </button>
                </div>
            ) : (
                <div className="flex flex-none items-center sm:gap-1">
                    <button
                        type="button"
                        onClick={onToggle}
                        disabled={busy}
                        title={isPublic ? 'กดเพื่อซ่อนจากหน้าเว็บ' : 'กดเพื่อเผยแพร่'}
                        className={`hidden cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold transition sm:inline-flex ${
                            isPublic ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                        } ${busy ? 'opacity-50' : ''}`}
                    >
                        <span className={`h-1.5 w-1.5 rounded-full ${isPublic ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        {isPublic ? 'เผยแพร่' : 'แบบร่าง'}
                    </button>
                    <button type="button" onClick={onToggle} disabled={busy} className={`inline-flex sm:hidden ${iconBase}`} title={isPublic ? 'ซ่อน' : 'เผยแพร่'}>
                        {isPublic ? <Eye className="h-4 w-4 text-emerald-600" /> : <EyeOff className="h-4 w-4 text-amber-600" />}
                    </button>
                    <button type="button" onClick={onEdit} className={iconBtn} title="แก้ไข">
                        <Pencil className="h-4 w-4" />
                    </button>
                    <button type="button" onClick={onDelete} className={`${iconBtn} hover:bg-red-50 hover:text-red-600`} title="ลบ">
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            )}
        </li>
    );
}
