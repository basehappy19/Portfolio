'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type ClipboardEvent, type DragEvent } from 'react';
import {
    ArrowLeft, ArrowRight, Check, ChevronDown, Eye, EyeOff, ImagePlus, Languages, Link2, Loader2,
    Plus, Save, Star, Trash2, Upload, X,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useCategories } from '@/app/contexts/CategoriesContext';
import { useAchievementModal } from '@/app/contexts/AchievementModalContext';
import type { Achievement, EditData } from '@/types/Achievements';
import type { FormState, ImagePreview, LinkForm, SubmitData } from '@/types/Form';
import { uploadAchievementImageDirect } from '../services/uploadAchievementImage';
import { createAchievement, deleteAchievement, updateAchievement } from '../services/achievements';
import { AchievementRichText } from '../AchievementRichText';
import { useFormDraft } from '../hooks/useFormDraft';
import { AWARD_PRESETS, LEVEL_SUFFIXES, labelFromUrl, stripHtml, thaiDate, translateText, type Pair } from '../editor-helpers';
import { getAchievementIcon, getAwardIcon, iconSrc, ICON_OPTIONS } from '@/lib/achievement-icon';
import { getAwardTier, TIER_STYLE } from '@/lib/award-tier';
import Combobox from '../ui/Combobox';
import DatePicker from '../ui/DatePicker';

export type EditorSuggestions = { givenBy: Pair[]; location: Pair[] };

type TextKey = 'title' | 'given_by' | 'awardLevel' | 'location';

export const AchievementModal = ({
    defaultSortOrder,
    suggestions = { givenBy: [], location: [] },
}: {
    defaultSortOrder: number;
    suggestions?: EditorSuggestions;
}) => {
    const { isOpen, close, editData, isAnimating } = useAchievementModal();
    if (!isOpen) return null;
    return (
        <Editor
            key={editData?.id ?? 'new'}
            editData={editData ?? null}
            close={close}
            isAnimating={isAnimating}
            defaultSortOrder={defaultSortOrder}
            suggestions={suggestions}
        />
    );
};

const initialForm = (editData: EditData | null, defaultSortOrder: number): FormState => {
    const r = editData?.receivedAt as Date | string | null | undefined;
    const receivedAt = r ? new Date(r).toISOString().slice(0, 10) : '';
    return {
        title_th: editData?.title_th ?? '',
        title_en: editData?.title_en ?? '',
        description_th: editData?.description_th ?? '',
        description_en: editData?.description_en ?? '',
        awardLevel_th: editData?.awardLevel_th ?? '',
        awardLevel_en: editData?.awardLevel_en ?? '',
        location_th: editData?.location_th ?? '',
        location_en: editData?.location_en ?? '',
        given_by_th: editData?.given_by_th ?? '',
        given_by_en: editData?.given_by_en ?? '',
        receivedAt,
        icon: editData?.icon ?? '',
        categorySlugs: editData?.categories?.map((c) => c.category.slug) ?? [],
        sortOrder: Number(editData?.sortOrder ?? defaultSortOrder),
        isPublished: editData ? editData.status === 'PUBLIC' : true,
    };
};

const initialImages = (editData: EditData | null): ImagePreview[] =>
    (editData?.images ?? [])
        .slice()
        .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
        .map((img, idx) => ({
            id: img.id,
            file: undefined,
            preview: img.url,
            altText_th: img.altText_th ?? '',
            altText_en: img.altText_en ?? '',
            sortOrder: idx + 1,
            clientId: img.id ?? crypto.randomUUID(),
        }));

const initialLinks = (editData: EditData | null): LinkForm[] =>
    (editData?.links ?? []).map((l, idx) => ({
        id: l.id,
        label_th: l.label_th ?? '',
        label_en: l.label_en ?? '',
        url: l.url ?? '',
        sortOrder: l.sortOrder ?? idx + 1,
    }));

const inputCls =
    'w-full rounded-xl border border-zinc-200 bg-white px-4 text-[15px] text-zinc-900 placeholder-zinc-400 transition focus:border-rose-400 focus:outline-none focus:ring-4 focus:ring-rose-500/10';

function Editor({
    editData,
    close,
    isAnimating,
    defaultSortOrder,
    suggestions,
}: {
    editData: EditData | null;
    close: () => void;
    isAnimating: boolean;
    defaultSortOrder: number;
    suggestions: EditorSuggestions;
}) {
    const router = useRouter();
    const categories = useCategories();
    const isEdit = Boolean(editData);

    const [form, setForm] = useState<FormState>(() => initialForm(editData, defaultSortOrder));
    const [images, setImages] = useState<ImagePreview[]>(() => initialImages(editData));
    const [links, setLinks] = useState<LinkForm[]>(() => initialLinks(editData));
    const [saving, setSaving] = useState<null | string>(null);
    const [translating, setTranslating] = useState<Record<string, boolean>>({});
    const [showErrors, setShowErrors] = useState(false);
    const [dragOver, setDragOver] = useState(false);
    const [dragIndex, setDragIndex] = useState<number | null>(null);
    const [resetKey, setResetKey] = useState(0);
    const [showPreview, setShowPreview] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);
    const titleRef = useRef<HTMLInputElement>(null);
    const dirtyEN = useRef<Record<string, boolean>>({});

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        const t = setTimeout(() => titleRef.current?.focus(), 250);
        return () => {
            document.body.style.overflow = '';
            clearTimeout(t);
        };
    }, []);

    // ---------- draft (localStorage) ----------
    const initialComparison = useMemo(
        () => ({ formData: initialForm(editData, defaultSortOrder), links: initialLinks(editData) }),
        [editData, defaultSortOrder]
    );
    const isDirty = isEdit
        ? JSON.stringify(form) !== JSON.stringify(initialComparison.formData) ||
          JSON.stringify(links) !== JSON.stringify(initialComparison.links) ||
          images.some((i) => i.file) ||
          images.length !== (editData?.images?.length ?? 0)
        : Boolean(form.title_th.trim() || form.description_th.trim() || links.length || images.length);
    const draftKey = editData ? `achievement_draft_${editData.id}` : 'achievement_draft_new';
    const { hasDraft, draftTime, draftPreview, restoreDraft, saveDraftNow, clearDraft } = useFormDraft(
        draftKey,
        form,
        links,
        isDirty,
        initialComparison
    );

    const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((p) => ({ ...p, [key]: value }));

    // ---------- translation ----------
    const translateField = useCallback(
        async (key: TextKey | 'description', force = false) => {
            const thKey = `${key}_th` as keyof FormState;
            const enKey = `${key}_en` as keyof FormState;
            const th = String(form[thKey] ?? '');
            const en = String(form[enKey] ?? '');
            if (!th.trim() || (!force && en.trim())) return;
            setTranslating((t) => ({ ...t, [key]: true }));
            const out = await translateText(th, key === 'description');
            setTranslating((t) => ({ ...t, [key]: false }));
            if (out === null) {
                if (force) toast.error('แปลอัตโนมัติไม่ได้ตอนนี้ พิมพ์ภาษาอังกฤษเองได้เลย');
                return;
            }
            setForm((p) => (force || !String(p[enKey] ?? '').trim() ? { ...p, [enKey]: out } : p));
        },
        [form]
    );

    const translateAll = async () => {
        await Promise.all((['title', 'given_by', 'awardLevel', 'location', 'description'] as const).map((k) => translateField(k, true)));
    };

    // ---------- images ----------
    const addFiles = useCallback((files: FileList | File[]) => {
        const list = Array.from(files).filter((f) => f.type.startsWith('image/'));
        if (!list.length) return;
        setImages((prev) => [
            ...prev,
            ...list.map((file, i) => ({
                file,
                preview: URL.createObjectURL(file),
                altText_th: '',
                altText_en: '',
                clientId: crypto.randomUUID(),
                sortOrder: prev.length + i + 1,
            })),
        ]);
        toast.success(`เพิ่มรูป ${list.length} รูป`);
    }, []);

    const moveImage = (from: number, to: number) =>
        setImages((prev) => {
            if (to < 0 || to >= prev.length) return prev;
            const next = [...prev];
            const [it] = next.splice(from, 1);
            next.splice(to, 0, it);
            return next.map((img, i) => ({ ...img, sortOrder: i + 1 }));
        });

    const removeImage = (idx: number) =>
        setImages((prev) => prev.filter((_, i) => i !== idx).map((img, i) => ({ ...img, sortOrder: i + 1 })));

    const onPaste = (e: ClipboardEvent) => {
        const files = Array.from(e.clipboardData?.files ?? []).filter((f) => f.type.startsWith('image/'));
        if (files.length) {
            e.preventDefault();
            addFiles(files);
        }
    };

    const onDrop = (e: DragEvent) => {
        e.preventDefault();
        setDragOver(false);
        if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
    };

    // ---------- links ----------
    const updateLink = (idx: number, patch: Partial<LinkForm>) =>
        setLinks((prev) => prev.map((l, i) => (i === idx ? { ...l, ...patch } : l)));

    const onLinkUrl = (idx: number, url: string) => {
        setLinks((prev) =>
            prev.map((l, i) => {
                if (i !== idx) return l;
                const guess = !l.label_th.trim() ? labelFromUrl(url) : null;
                return { ...l, url, ...(guess ? { label_th: guess.th, label_en: guess.en } : {}) };
            })
        );
    };

    // ---------- validation ----------
    const missing: string[] = [];
    if (!form.title_th.trim()) missing.push('ชื่อผลงาน');
    if (!form.categorySlugs.length) missing.push('หมวดหมู่');

    // ---------- save ----------
    const save = useCallback(
        async (addAnother = false) => {
            if (saving) return;
            if (missing.length) {
                setShowErrors(true);
                toast.error(`ยังขาด: ${missing.join(', ')}`);
                return;
            }
            setSaving('กำลังเตรียมข้อมูล…');

            // Fill any empty English field: translate if possible, else reuse the Thai text.
            const filled = { ...form };
            const pairs: Array<[keyof FormState, keyof FormState, boolean]> = [
                ['title_th', 'title_en', false],
                ['given_by_th', 'given_by_en', false],
                ['awardLevel_th', 'awardLevel_en', false],
                ['location_th', 'location_en', false],
                ['description_th', 'description_en', true],
            ];
            const todo = pairs.filter(([th, en]) => String(filled[th] ?? '').trim() && !String(filled[en] ?? '').trim());
            if (todo.length) {
                setSaving('กำลังแปลภาษาอังกฤษ…');
                const results = await Promise.all(todo.map(([th, , rich]) => translateText(String(filled[th]), rich)));
                todo.forEach(([th, en], i) => {
                    (filled as Record<string, unknown>)[en] = results[i] ?? filled[th];
                });
                setForm(filled);
            }

            const normalizedLinks = links
                .filter((l) => l.url.trim())
                .map((l, i) => ({
                    ...l,
                    label_th: l.label_th.trim() || labelFromUrl(l.url)?.th || 'ลิงก์',
                    label_en: l.label_en.trim() || labelFromUrl(l.url)?.en || 'Link',
                    sortOrder: i + 1,
                }));

            let id: string | null = editData?.id ?? null;
            const base: SubmitData = {
                ...filled,
                images: [],
                links: normalizedLinks,
                status: filled.isPublished ? 'PUBLIC' : 'DRAFT',
                id: id ?? undefined,
                receivedAt: filled.receivedAt ? new Date(filled.receivedAt).toISOString() : undefined,
            };

            const isCreate = !id;
            try {
                if (isCreate) {
                    setSaving('กำลังสร้างผลงาน…');
                    id = (await createAchievement(base)).id;
                }

                const newCount = images.filter((i) => i.file).length;
                let done = 0;
                let uploaded: ImagePreview[];
                try {
                    uploaded = await Promise.all(
                        images.map(async (img, idx) => {
                            if (img.file instanceof File && id) {
                                const { url } = await uploadAchievementImageDirect(img.file, id);
                                done += 1;
                                setSaving(`กำลังอัปโหลดรูป ${done}/${newCount}…`);
                                return { ...img, preview: url, file: undefined, sortOrder: idx + 1 };
                            }
                            return { ...img, sortOrder: idx + 1 };
                        })
                    );
                } catch (err) {
                    console.error(err);
                    toast.error('อัปโหลดรูปไม่สำเร็จ ลองใหม่อีกครั้ง');
                    if (isCreate && id) await deleteAchievement(id).catch(() => undefined);
                    return;
                }

                setSaving('กำลังบันทึก…');
                await updateAchievement(id!, { ...base, id: id!, images: uploaded });
                clearDraft();
                toast.success(isCreate ? 'เพิ่มผลงานแล้ว' : 'บันทึกการแก้ไขแล้ว');
                router.refresh();

                if (addAnother) {
                    setForm({ ...initialForm(null, filled.sortOrder + 1), categorySlugs: filled.categorySlugs });
                    setImages([]);
                    setLinks([]);
                    setShowErrors(false);
                    setResetKey((k) => k + 1);
                    titleRef.current?.focus();
                } else {
                    close();
                }
            } catch (error) {
                console.error(error);
                toast.error('บันทึกไม่สำเร็จ กรุณาลองใหม่');
            } finally {
                setSaving(null);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [form, images, links, saving, missing.length]
    );

    const safeClose = () => {
        if (isDirty) saveDraftNow();
        close();
    };

    // keyboard shortcuts: Ctrl/Cmd+S save, Esc close
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
                e.preventDefault();
                save(false);
            } else if (e.key === 'Escape' && !saving) {
                safeClose();
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    });

    // ---------- preview data ----------
    const previewAchievement = {
        title_th: form.title_th,
        title_en: form.title_en,
        icon: form.icon || null,
        categories: categories
            .filter((c) => form.categorySlugs.includes(c.slug))
            .map((c) => ({ category: c })),
    } as unknown as Achievement;
    const icon = getAchievementIcon(previewAchievement);
    const autoIcon = getAchievementIcon({ ...previewAchievement, icon: null } as Achievement);
    const tier = getAwardTier(form.awardLevel_th, form.awardLevel_en);
    const awardIcon = getAwardIcon(tier, form.awardLevel_th);
    const cover = images[0]?.preview;
    const firstCategory = categories.find((c) => form.categorySlugs.includes(c.slug));

    const enRow = (k: TextKey, placeholder: string) => (
        <div className="mt-2 flex items-center gap-2">
            <span className="w-8 shrink-0 text-center text-[11px] font-bold text-zinc-400">EN</span>
            <input
                className={`${inputCls} min-h-10 bg-zinc-50 text-[14px]`}
                value={String(form[`${k}_en` as keyof FormState] ?? '')}
                onChange={(e) => {
                    dirtyEN.current[k] = true;
                    set(`${k}_en` as keyof FormState, e.target.value as never);
                }}
                placeholder={placeholder}
            />
            <button
                type="button"
                onClick={() => translateField(k, true)}
                title="แปลจากภาษาไทย"
                className="inline-flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-600 hover:border-rose-300 hover:text-rose-600"
            >
                {translating[k] ? <Loader2 className="h-4 w-4 animate-spin" /> : <Languages className="h-4 w-4" />}
            </button>
        </div>
    );

    const section = (n: number, title: string, hint: string, children: React.ReactNode) => (
        <section className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)] sm:p-7">
            <div className="mb-5 flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-900 text-sm font-bold text-white">{n}</span>
                <div>
                    <h3 className="text-lg font-bold text-zinc-900">{title}</h3>
                    {hint && <p className="text-sm text-zinc-500">{hint}</p>}
                </div>
            </div>
            {children}
        </section>
    );

    return (
        <div
            className={`fixed inset-0 z-50 flex flex-col bg-zinc-100 transition-all duration-300 ${
                isAnimating ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
            onPaste={onPaste}
        >
            {/* top bar */}
            <header className="flex shrink-0 items-center gap-3 border-b border-zinc-200 bg-white/90 px-3 py-2.5 backdrop-blur sm:px-6">
                <button
                    type="button"
                    onClick={safeClose}
                    className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full hover:bg-zinc-100"
                    aria-label="ปิด"
                    title="ปิด (Esc) — ข้อมูลที่พิมพ์ค้างจะถูกเก็บเป็นร่าง"
                >
                    <X className="h-5 w-5" />
                </button>
                <div className="min-w-0 flex-1">
                    <h2 className="truncate text-base font-bold sm:text-lg">{isEdit ? 'แก้ไขผลงาน' : 'เพิ่มผลงานใหม่'}</h2>
                    <p className="truncate text-xs text-zinc-500">
                        {saving ?? (isDirty ? 'มีการแก้ไขที่ยังไม่บันทึก · กด Ctrl+S เพื่อบันทึก' : 'กด Ctrl+V เพื่อวางรูปได้ทุกที่')}
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => set('isPublished', !form.isPublished)}
                    className={`hidden min-h-11 cursor-pointer items-center gap-2 rounded-full px-4 text-sm font-semibold sm:inline-flex ${
                        form.isPublished ? 'bg-emerald-50 text-emerald-700' : 'bg-zinc-100 text-zinc-600'
                    }`}
                    title="สลับการแสดงบนเว็บ"
                >
                    {form.isPublished ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    {form.isPublished ? 'แสดงบนเว็บ' : 'ซ่อน (ร่าง)'}
                </button>
                {!isEdit && (
                    <button
                        type="button"
                        disabled={!!saving}
                        onClick={() => save(true)}
                        className="hidden min-h-11 cursor-pointer items-center gap-2 rounded-full border border-zinc-300 bg-white px-4 text-sm font-semibold hover:border-zinc-400 disabled:opacity-50 md:inline-flex"
                    >
                        <Plus className="h-4 w-4" />
                        บันทึกแล้วเพิ่มต่อ
                    </button>
                )}
                <button
                    type="button"
                    disabled={!!saving}
                    onClick={() => save(false)}
                    className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full bg-rose-600 px-5 text-sm font-bold text-white shadow-sm hover:bg-rose-700 disabled:opacity-60"
                >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    บันทึก
                </button>
            </header>

            <div className="flex-1 overflow-y-auto overscroll-contain">
                <div className="mx-auto grid max-w-6xl gap-6 px-3 py-5 sm:px-6 lg:grid-cols-[minmax(0,1fr)_340px]">
                    <div className="space-y-5">
                        {hasDraft && (
                            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                                <span>
                                    พบข้อมูลที่พิมพ์ค้างไว้เมื่อ {draftTime}
                                    {draftPreview && <strong className="ml-1">“{draftPreview}”</strong>}
                                </span>
                                <span className="flex gap-2">
                                    <button
                                        type="button"
                                        className="cursor-pointer rounded-lg bg-amber-500 px-3 py-1.5 font-semibold text-white"
                                        onClick={() => {
                                            const r = restoreDraft();
                                            if (r?.formData) {
                                                setForm((p) => ({ ...p, ...r.formData }));
                                                if (Array.isArray(r.links)) setLinks(r.links);
                                                setResetKey((k) => k + 1);
                                                toast.success('กู้คืนแล้ว');
                                            }
                                        }}
                                    >
                                        กู้คืน
                                    </button>
                                    <button type="button" className="cursor-pointer rounded-lg px-3 py-1.5 font-semibold hover:bg-amber-100" onClick={clearDraft}>
                                        ทิ้ง
                                    </button>
                                </span>
                            </div>
                        )}

                        {section(1, "ผลงานนี้คืออะไร", "พิมพ์ภาษาไทยอย่างเดียวก็พอ ภาษาอังกฤษจะแปลให้อัตโนมัติตอนบันทึก", <>
                            <label className="mb-1.5 block text-sm font-semibold text-zinc-700">
                                ชื่อผลงาน <span className="text-rose-500">*</span>
                            </label>
                            <input
                                ref={titleRef}
                                className={`${inputCls} min-h-14 text-lg font-semibold ${showErrors && !form.title_th.trim() ? 'border-rose-400 ring-4 ring-rose-500/10' : ''}`}
                                value={form.title_th}
                                onChange={(e) => set('title_th', e.target.value)}
                                onBlur={() => translateField('title')}
                                placeholder="เช่น ระบบรับสมัครนักเรียนออนไลน์ โรงเรียนภูเขียว"
                            />
                            {enRow("title", "English title (แปลให้อัตโนมัติ)")}

                            <p className="mb-2 mt-6 text-sm font-semibold text-zinc-700">
                                หมวดหมู่ <span className="text-rose-500">*</span>
                                <span className="ml-2 font-normal text-zinc-500">เลือกได้หลายหมวด</span>
                            </p>
                            <div className={`flex flex-wrap gap-2 rounded-2xl ${showErrors && !form.categorySlugs.length ? 'ring-4 ring-rose-500/15' : ''}`}>
                                {categories.map((c) => {
                                    const on = form.categorySlugs.includes(c.slug);
                                    return (
                                        <button
                                            key={c.id}
                                            type="button"
                                            aria-pressed={on}
                                            onClick={() =>
                                                set('categorySlugs', on ? form.categorySlugs.filter((s) => s !== c.slug) : [...form.categorySlugs, c.slug])
                                            }
                                            className={`inline-flex min-h-11 cursor-pointer items-center gap-1.5 rounded-full border px-4 text-sm font-semibold transition ${
                                                on ? 'border-zinc-900 bg-zinc-900 text-white' : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-400'
                                            }`}
                                        >
                                            {on && <Check className="h-4 w-4" />}
                                            {c.name_th}
                                        </button>
                                    );
                                })}
                            </div>

                            <p className="mb-2 mt-6 text-sm font-semibold text-zinc-700">
                                ไอคอนผลงาน
                                <span className="ml-2 font-normal text-zinc-500">ไม่เลือกก็ได้ ระบบจะเลือกจากชื่อผลงานให้</span>
                            </p>
                            <div className="flex flex-wrap gap-1.5 rounded-2xl border border-zinc-200 bg-zinc-50 p-2">
                                <button
                                    type="button"
                                    onClick={() => set('icon', '')}
                                    aria-pressed={!form.icon}
                                    title="เลือกอัตโนมัติ"
                                    className={`flex h-16 w-[4.5rem] cursor-pointer flex-col items-center justify-center gap-0.5 rounded-xl text-[11px] font-semibold ${
                                        !form.icon ? 'bg-white text-zinc-900 ring-2 ring-rose-500' : 'text-zinc-600 hover:bg-white'
                                    }`}
                                >
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={iconSrc(autoIcon)} alt="" className="h-8 w-8 opacity-80" />
                                    อัตโนมัติ
                                </button>
                                {ICON_OPTIONS.map((o) => (
                                    <button
                                        key={o.key}
                                        type="button"
                                        onClick={() => set('icon', o.key)}
                                        aria-pressed={form.icon === o.key}
                                        title={o.label}
                                        className={`flex h-16 w-[4.5rem] cursor-pointer flex-col items-center justify-center gap-0.5 rounded-xl text-[11px] ${
                                            form.icon === o.key ? 'bg-white font-semibold text-zinc-900 ring-2 ring-rose-500' : 'text-zinc-600 hover:bg-white'
                                        }`}
                                    >
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={iconSrc(o.key)} alt="" className="h-8 w-8" />
                                        <span className="max-w-full truncate px-1">{o.label}</span>
                                    </button>
                                ))}
                            </div>
                        </>)}

                        {section(2, "รางวัลและผู้จัด", "กดปุ่มสำเร็จรูปได้เลย ไม่ต้องพิมพ์เอง", <>
                            <label className="mb-1.5 block text-sm font-semibold text-zinc-700">ระดับรางวัล / ผลที่ได้</label>
                            <div className="mb-2 flex flex-wrap gap-1.5">
                                {AWARD_PRESETS.map((p) => (
                                    <button
                                        key={p.th}
                                        type="button"
                                        onClick={() => setForm((f) => ({ ...f, awardLevel_th: p.th, awardLevel_en: p.en }))}
                                        className="min-h-9 cursor-pointer rounded-full border border-zinc-200 bg-zinc-50 px-3 text-[13px] font-medium text-zinc-700 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700"
                                    >
                                        {p.th}
                                    </button>
                                ))}
                            </div>
                            <div className="mb-2 flex flex-wrap gap-1.5">
                                {LEVEL_SUFFIXES.map((p) => (
                                    <button
                                        key={p.th}
                                        type="button"
                                        onClick={() =>
                                            setForm((f) => ({
                                                ...f,
                                                awardLevel_th: `${f.awardLevel_th.replace(/\s*ระดับ\S+$/, '')} ${p.th}`.trim(),
                                                awardLevel_en: `${f.awardLevel_en.replace(/\s*\S+ Level$/, '')} ${p.en}`.trim(),
                                            }))
                                        }
                                        className="min-h-9 cursor-pointer rounded-full border border-dashed border-zinc-300 px-3 text-[13px] text-zinc-600 hover:border-zinc-500"
                                    >
                                        + {p.th}
                                    </button>
                                ))}
                            </div>
                            <input
                                className={`${inputCls} min-h-12`}
                                value={form.awardLevel_th}
                                onChange={(e) => set('awardLevel_th', e.target.value)}
                                onBlur={() => translateField('awardLevel')}
                                placeholder="เช่น ผ่านเข้ารอบ 20 ทีมสุดท้าย / ผู้ใช้งานกว่า 1,500 คน"
                            />
                            {enRow("awardLevel", "Award (English)")}

                            <label className="mb-1.5 mt-6 block text-sm font-semibold text-zinc-700">ผู้จัด / ผู้มอบรางวัล</label>
                            <Combobox
                                className={`${inputCls} min-h-12`}
                                value={form.given_by_th}
                                options={suggestions.givenBy.map((s) => s.th)}
                                onChange={(v) => {
                                    const known = suggestions.givenBy.find((s) => s.th === v);
                                    setForm((f) => ({ ...f, given_by_th: v, ...(known && !dirtyEN.current.given_by ? { given_by_en: known.en } : {}) }));
                                }}
                                onBlur={() => translateField('given_by')}
                                placeholder="พิมพ์บางคำ แล้วเลือกจากรายการที่เคยใช้"
                            />
                            {enRow("given_by", "Organizer (English)")}

                            <div className="mt-6 grid gap-5 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1.5 block text-sm font-semibold text-zinc-700">สถานที่</label>
                                    <Combobox
                                        className={`${inputCls} min-h-12`}
                                        value={form.location_th}
                                        options={suggestions.location.map((s) => s.th)}
                                        onChange={(v) => {
                                            const known = suggestions.location.find((s) => s.th === v);
                                            setForm((f) => ({ ...f, location_th: v, ...(known && !dirtyEN.current.location ? { location_en: known.en } : {}) }));
                                        }}
                                        onBlur={() => translateField('location')}
                                        placeholder="เช่น มหาวิทยาลัยมหิดล"
                                    />
                                    {enRow("location", "Location (English)")}
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-sm font-semibold text-zinc-700">วันที่ได้รับ</label>
                                    <DatePicker
                                        className={`${inputCls} min-h-12`}
                                        value={form.receivedAt}
                                        onChange={(iso) => set('receivedAt', iso)}
                                    />
                                </div>
                            </div>
                        </>)}

                        {section(3, "เล่ารายละเอียด", "ทำอะไร แก้ปัญหาอะไร ใช้เทคโนโลยีอะไร ได้ผลอย่างไร", <>
                            <AchievementRichText
                                key={`th-${resetKey}`}
                                label="รายละเอียด (ไทย)"
                                name="description_th"
                                value={form.description_th}
                                onChange={(name, value) => set(name as 'description_th', value)}
                                placeholder="พิมพ์หรือวางข้อความที่นี่…"
                            />
                            <details className="group mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-zinc-700">
                                    <span className="flex items-center gap-2">
                                        <Languages className="h-4 w-4" />
                                        ภาษาอังกฤษ {form.description_en.trim() ? '(มีแล้ว)' : '(จะแปลให้ตอนบันทึก)'}
                                    </span>
                                    <ChevronDown className="h-4 w-4 transition group-open:rotate-180" />
                                </summary>
                                <div className="mt-3">
                                    <button
                                        type="button"
                                        onClick={() => translateField('description', true)}
                                        className="mb-3 inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 text-sm font-semibold hover:border-rose-300"
                                    >
                                        {translating.description ? <Loader2 className="h-4 w-4 animate-spin" /> : <Languages className="h-4 w-4" />}
                                        แปลจากภาษาไทยตอนนี้
                                    </button>
                                    <AchievementRichText
                                        key={`en-${resetKey}`}
                                        label="Description (English)"
                                        name="description_en"
                                        value={form.description_en}
                                        onChange={(name, value) => set(name as 'description_en', value)}
                                        placeholder="Description in English…"
                                    />
                                </div>
                            </details>
                        </>)}

                        {section(4, "รูปภาพ", "ลากรูปมาวาง กดเลือก หรือกด Ctrl+V วางรูปที่คัดลอกไว้ · รูปแรกคือภาพปก · ระบบย่อรูปให้อัตโนมัติ", <>
                            <div
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    setDragOver(true);
                                }}
                                onDragLeave={() => setDragOver(false)}
                                onDrop={onDrop}
                                onClick={() => fileRef.current?.click()}
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && fileRef.current?.click()}
                                className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-4 py-8 text-center transition ${
                                    dragOver ? 'border-rose-400 bg-rose-50' : 'border-zinc-300 bg-zinc-50 hover:border-zinc-400'
                                }`}
                            >
                                <Upload className="h-7 w-7 text-zinc-500" />
                                <p className="font-semibold text-zinc-800">ลากรูปมาวางที่นี่ หรือกดเพื่อเลือกรูป</p>
                                <p className="text-sm text-zinc-500">เลือกได้หลายรูปพร้อมกัน</p>
                                <input
                                    ref={fileRef}
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    hidden
                                    onChange={(e) => {
                                        if (e.target.files) addFiles(e.target.files);
                                        e.target.value = '';
                                    }}
                                />
                            </div>

                            {images.length > 0 && (
                                <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                                    {images.map((img, i) => (
                                        <li
                                            key={img.clientId}
                                            draggable
                                            onDragStart={() => setDragIndex(i)}
                                            onDragOver={(e) => {
                                                e.preventDefault();
                                                if (dragIndex !== null && dragIndex !== i) {
                                                    moveImage(dragIndex, i);
                                                    setDragIndex(i);
                                                }
                                            }}
                                            onDragEnd={() => setDragIndex(null)}
                                            className={`group relative overflow-hidden rounded-2xl border bg-white ${
                                                dragIndex === i ? 'border-rose-400 opacity-60' : 'border-zinc-200'
                                            }`}
                                        >
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={img.preview} alt="" className="aspect-[4/3] w-full cursor-grab object-cover" />
                                            {i === 0 && (
                                                <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-zinc-900/85 px-2.5 py-1 text-xs font-semibold text-white">
                                                    <Star className="h-3 w-3" /> ภาพปก
                                                </span>
                                            )}
                                            {img.file && (
                                                <span className="absolute right-2 top-2 rounded-full bg-emerald-600 px-2 py-0.5 text-[11px] font-semibold text-white">ใหม่</span>
                                            )}
                                            <div className="flex items-center justify-between gap-1 p-1.5">
                                                <div className="flex">
                                                    <button type="button" title="เลื่อนไปซ้าย" onClick={() => moveImage(i, i - 1)} disabled={i === 0} className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg hover:bg-zinc-100 disabled:opacity-30">
                                                        <ArrowLeft className="h-4 w-4" />
                                                    </button>
                                                    <button type="button" title="เลื่อนไปขวา" onClick={() => moveImage(i, i + 1)} disabled={i === images.length - 1} className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg hover:bg-zinc-100 disabled:opacity-30">
                                                        <ArrowRight className="h-4 w-4" />
                                                    </button>
                                                    {i !== 0 && (
                                                        <button type="button" title="ตั้งเป็นภาพปก" onClick={() => moveImage(i, 0)} className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg hover:bg-zinc-100">
                                                            <Star className="h-4 w-4" />
                                                        </button>
                                                    )}
                                                </div>
                                                <button type="button" title="ลบรูป" onClick={() => removeImage(i)} className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-rose-600 hover:bg-rose-50">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                    <li>
                                        <button
                                            type="button"
                                            onClick={() => fileRef.current?.click()}
                                            className="flex aspect-[4/3] w-full cursor-pointer flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed border-zinc-300 text-sm font-semibold text-zinc-600 hover:border-zinc-400"
                                        >
                                            <ImagePlus className="h-6 w-6" />
                                            เพิ่มรูป
                                        </button>
                                    </li>
                                </ul>
                            )}
                        </>)}

                        {section(5, "ลิงก์ที่เกี่ยวข้อง", "วางลิงก์ แล้วระบบตั้งชื่อปุ่มให้เอง (แก้ได้)", <>
                            <div className="space-y-3">
                                {links.map((l, i) => (
                                    <div key={i} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-3">
                                        <div className="flex gap-2">
                                            <input
                                                className={`${inputCls} min-h-11`}
                                                value={l.url}
                                                onChange={(e) => onLinkUrl(i, e.target.value)}
                                                placeholder="https://…"
                                                inputMode="url"
                                            />
                                            <button
                                                type="button"
                                                title="ลบลิงก์"
                                                onClick={() => setLinks((p) => p.filter((_, x) => x !== i))}
                                                className="inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-xl text-rose-600 hover:bg-rose-50"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                        <div className="mt-2 grid gap-2 sm:grid-cols-2">
                                            <input className={`${inputCls} min-h-10 text-sm`} value={l.label_th} onChange={(e) => updateLink(i, { label_th: e.target.value })} placeholder="ชื่อปุ่ม (ไทย)" />
                                            <input className={`${inputCls} min-h-10 text-sm`} value={l.label_en} onChange={(e) => updateLink(i, { label_en: e.target.value })} placeholder="Button label (EN)" />
                                        </div>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => setLinks((p) => [...p, { label_th: '', label_en: '', url: '', sortOrder: p.length + 1 }])}
                                    className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border border-dashed border-zinc-300 px-4 text-sm font-semibold text-zinc-700 hover:border-zinc-500"
                                >
                                    <Link2 className="h-4 w-4" /> เพิ่มลิงก์
                                </button>
                            </div>
                        </>)}

                        <div className="flex flex-wrap items-center justify-between gap-3 pb-10">
                            <button type="button" onClick={translateAll} className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-zinc-300 bg-white px-4 text-sm font-semibold hover:border-zinc-400">
                                <Languages className="h-4 w-4" /> แปลภาษาอังกฤษทั้งหมดใหม่
                            </button>
                            <div className="flex gap-2">
                                {!isEdit && (
                                    <button type="button" disabled={!!saving} onClick={() => save(true)} className="inline-flex min-h-12 cursor-pointer items-center gap-2 rounded-full border border-zinc-300 bg-white px-5 font-semibold hover:border-zinc-400 disabled:opacity-50">
                                        <Plus className="h-4 w-4" /> บันทึกแล้วเพิ่มต่อ
                                    </button>
                                )}
                                <button type="button" disabled={!!saving} onClick={() => save(false)} className="inline-flex min-h-12 cursor-pointer items-center gap-2 rounded-full bg-rose-600 px-6 font-bold text-white hover:bg-rose-700 disabled:opacity-60">
                                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                    {saving ?? 'บันทึก'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* live preview */}
                    <aside className="order-first lg:order-none">
                        <div className="lg:sticky lg:top-5">
                            <button
                                type="button"
                                onClick={() => setShowPreview((v) => !v)}
                                className="mb-3 flex w-full cursor-pointer items-center justify-between rounded-2xl bg-white px-4 py-3 text-sm font-semibold lg:hidden"
                            >
                                ตัวอย่างการ์ดบนเว็บ
                                <ChevronDown className={`h-4 w-4 transition ${showPreview ? 'rotate-180' : ''}`} />
                            </button>
                            <div className={`${showPreview ? 'block' : 'hidden'} space-y-4 lg:block`}>
                                <p className="hidden text-sm font-semibold text-zinc-500 lg:block">ตัวอย่างการ์ดบนเว็บ</p>
                                <div className="overflow-hidden rounded-[28px] border border-zinc-200 bg-white shadow-[0_14px_40px_-28px_rgba(24,24,27,0.55)]">
                                    <div className="relative aspect-[16/10] bg-zinc-100">
                                        {cover ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={cover} alt="" className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="flex h-full items-center justify-center text-sm text-zinc-400">ยังไม่มีภาพปก</div>
                                        )}
                                        {firstCategory && (
                                            <span className="absolute left-3 top-3 rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-semibold">{firstCategory.name_th}</span>
                                        )}
                                    </div>
                                    <div className="relative px-5 pb-5 pt-10">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={iconSrc(icon)} alt="" className="absolute -top-8 left-4 h-14 w-14 rounded-[18px] bg-white p-0.5 drop-shadow-lg" />
                                        {form.awardLevel_th && (
                                            <span
                                                className="inline-flex items-center gap-1.5 rounded-lg px-2 py-0.5 text-xs font-semibold"
                                                style={{ background: `${TIER_STYLE[tier].bg}14`, color: TIER_STYLE[tier].bg }}
                                            >
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                {awardIcon && <img src={iconSrc(awardIcon)} alt="" className="h-4 w-4" />}
                                                {form.awardLevel_th}
                                            </span>
                                        )}
                                        <p className="mt-2 line-clamp-2 text-lg font-bold leading-snug">{form.title_th || 'ชื่อผลงาน'}</p>
                                        {stripHtml(form.description_th) && (
                                            <p className="mt-1.5 line-clamp-2 text-sm text-zinc-600">{stripHtml(form.description_th)}</p>
                                        )}
                                        {form.given_by_th && <p className="mt-3 border-t border-zinc-100 pt-3 text-sm font-medium">{form.given_by_th}</p>}
                                        {form.receivedAt && <p className="mt-1 text-xs text-zinc-500">{thaiDate(form.receivedAt)}</p>}
                                    </div>
                                </div>
                                <p className="text-xs text-zinc-500">{form.icon ? 'ไอคอนที่เลือกเอง' : 'ไอคอนเลือกให้อัตโนมัติจากชื่อผลงาน'}</p>

                                <div className="rounded-2xl bg-white p-4 text-sm">
                                    <p className="mb-2 font-semibold">ตรวจความครบ</p>
                                    <ul className="space-y-1.5">
                                        {[
                                            ['ชื่อผลงาน', !!form.title_th.trim(), true],
                                            ['หมวดหมู่', form.categorySlugs.length > 0, true],
                                            ['ภาพปก', images.length > 0, false],
                                            ['ระดับรางวัล', !!form.awardLevel_th.trim(), false],
                                            ['ผู้จัด', !!form.given_by_th.trim(), false],
                                            ['รายละเอียด', !!stripHtml(form.description_th), false],
                                        ].map(([label, ok, req]) => (
                                            <li key={String(label)} className="flex items-center gap-2">
                                                <span className={`flex h-5 w-5 items-center justify-center rounded-full ${ok ? 'bg-emerald-500 text-white' : 'bg-zinc-200 text-zinc-500'}`}>
                                                    {ok ? <Check className="h-3 w-3" /> : null}
                                                </span>
                                                <span className={ok ? 'text-zinc-800' : 'text-zinc-500'}>
                                                    {label} {req ? <span className="text-rose-500">*</span> : null}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
