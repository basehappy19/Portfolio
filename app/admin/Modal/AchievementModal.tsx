'use client';
import {
    useState,
    useMemo,
    DragEvent,
} from 'react';
import { X, AlertCircle, Save, Loader2, Grid3x3, CheckCircle2 } from 'lucide-react';
import { useCategories } from '@/app/contexts/CategoriesContext';
import { useAchievementModal } from '@/app/contexts/AchievementModalContext';
import { EditData } from '@/types/Achievements';
import { FormState, ImagePreview, LinkForm, SubmitData } from '@/types/Form';
import { uploadAchievementImageDirect } from '../services/uploadAchievementImage';
import { useAchievementFormHandlers } from '../hooks/useAchievementFormHandlers';
import { useImageHandlers } from '../hooks/useImageHandlers';
import { AchievementLinksSection } from '../AchievementLinksSection';
import { AchievementImagesSection } from '../AchievementImagesSection';
import { TouchedState, ValidationErrors } from '../types/achievementValidation';
import { AchievementTextField } from '../AchievementTextField';
import { useRouter } from 'next/navigation';
import { createAchievement, deleteAchievement, updateAchievement } from '../services/achievements';
import toast from 'react-hot-toast';
import { AchievementRichText } from '../AchievementRichText';
import { useFormDraft } from '../hooks/useFormDraft';

export const AchievementModal = ({ defaultSortOrder }: { defaultSortOrder: number }) => {
    const { isOpen, close, editData, isAnimating } = useAchievementModal();

    if (!isOpen) return null;

    return (
        <AchievementModalInner
            key={editData?.id ?? 'new'}
            editData={editData ?? null}
            close={close}
            isAnimating={isAnimating}
            defaultSortOrder={defaultSortOrder}
        />
    );
};

const AchievementModalInner = ({
    editData,
    close,
    isAnimating,
    defaultSortOrder
}: {
    editData: EditData | null;
    close: () => void;
    isAnimating: boolean;
    defaultSortOrder: number;
}) => {
    const createInitialFormState = (
        editData: EditData | null,
        defaultSortOrder: number
    ): FormState => {
        const receivedAt =
            editData?.receivedAt instanceof Date
                ? editData.receivedAt.toISOString().slice(0, 10)
                : editData?.receivedAt ?? "";

        return {
            title_th: editData?.title_th ?? "",
            title_en: editData?.title_en ?? "",
            description_th: editData?.description_th ?? "",
            description_en: editData?.description_en ?? "",
            awardLevel_th: editData?.awardLevel_th ?? "",
            awardLevel_en: editData?.awardLevel_en ?? "",
            location_th: editData?.location_th ?? "",
            location_en: editData?.location_en ?? "",
            given_by_th: editData?.given_by_th ?? "",
            given_by_en: editData?.given_by_en ?? "",
            receivedAt,
            categorySlugs: editData?.categories?.map((c) => c.category.slug) ?? [],
            sortOrder: Number(
                editData?.sortOrder != null ? editData.sortOrder : defaultSortOrder
            ),
            isPublished: editData ? editData.status === "PUBLIC" : true,
        };
    };

    const router = useRouter();
    const categories = useCategories();

    const [formData, setFormData] = useState<FormState>(() =>
        createInitialFormState(editData, defaultSortOrder)
    );

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [touched, setTouched] = useState<TouchedState>({
        title_th: false,
        title_en: false,
        categorySlugs: false,
    });

    const isFormValid =
        formData.title_th.trim() !== '' &&
        formData.title_en.trim() !== '' &&
        formData.categorySlugs.length > 0;

    const {
        handleBlur,
        handleInputChange,
        handleCategoryChange,
        validateForm,
    } = useAchievementFormHandlers({
        formData,
        setFormData,
        setErrors,
        setTouched,
    });

    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [draggedLinkIndex, setDraggedLinkIndex] = useState<number | null>(null);
    const [imagePreview, setImagePreview] = useState<ImagePreview[]>(() =>
    (editData?.images
        ?.slice()
        .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
        .map((img, idx) => ({
            id: img.id,
            file: undefined,
            preview: img.url,
            altText_th: img.altText_th ?? "",
            altText_en: img.altText_en ?? "",
            sortOrder: idx + 1,
            clientId: img.id ?? crypto.randomUUID(),
        })) ?? [])
    );

    const {
        handleImageUpload,
        handleReplaceImage,
        handleImageAltChange,
        handleRemoveImage,
        handleDragStart,
        handleDragOver,
        handleDragEnd,
    } = useImageHandlers({
        imagePreview,
        setImagePreview,
        draggedIndex,
        setDraggedIndex,
    });


    const initialComparisonData = useMemo(() => ({
        formData: createInitialFormState(editData, defaultSortOrder),
        links: editData?.links?.map((link, idx) => ({
            id: link.id,
            label_th: link.label_th ?? '',
            label_en: link.label_en ?? '',
            url: link.url ?? '',
            sortOrder: link.sortOrder ?? idx + 1,
        })) ?? []
    }), [editData, defaultSortOrder]);

    const [links, setLinks] = useState<LinkForm[]>(() => initialComparisonData.links);

    const isDirty = editData ? (
        JSON.stringify(formData) !== JSON.stringify(initialComparisonData.formData) ||
        JSON.stringify(links) !== JSON.stringify(initialComparisonData.links)
    ) : Boolean(
        formData.title_th.trim() ||
        formData.title_en.trim() ||
        formData.description_th.trim() ||
        formData.description_en.trim() ||
        links.length > 0 ||
        imagePreview.length > 0
    );

    const draftKey = editData ? `achievement_draft_${editData.id}` : 'achievement_draft_new';
    const { hasDraft, draftTime, draftPreview, restoreDraft, saveDraftNow, clearDraft } = useFormDraft(
        draftKey,
        formData,
        links,
        isDirty,
        initialComparisonData
    );

    const handleRestoreDraft = () => {
        const recovered = restoreDraft();
        if (recovered && recovered.formData) {
            setFormData(prev => ({
                ...prev,
                ...recovered.formData,
            }));
            if (Array.isArray(recovered.links)) {
                setLinks(recovered.links);
            }
            toast.success('กู้คืนข้อมูลที่พิมพ์ค้างไว้เรียบร้อยแล้ว');
        } else {
            toast.error('ไม่พบข้อมูลร่างหรือข้อมูลร่างว่างเปล่า');
        }
    };

    const handleSafeClose = () => {
        if (isDirty) {
            saveDraftNow();
        }
        close();
    };

    const handleLinkDragStart = (e: DragEvent<HTMLElement>, index: number) => {
        setDraggedLinkIndex(index);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleLinkDragOver = (e: DragEvent<HTMLElement>, index: number) => {
        e.preventDefault();
        if (draggedLinkIndex === null || draggedLinkIndex === index) return;

        setLinks(prev => {
            const newLinks = [...prev];
            const draggedItem = newLinks[draggedLinkIndex];
            newLinks.splice(draggedLinkIndex, 1);
            newLinks.splice(index, 0, draggedItem);
            return newLinks;
        });

        setDraggedLinkIndex(index);
    };

    const handleLinkDragEnd = () => {
        setDraggedLinkIndex(null);
        setLinks(prev =>
            prev.map((link, idx) => ({
                ...link,
                sortOrder: idx + 1,
            }))
        );
    };

    const handleLinkChange = (
        index: number,
        field: keyof Omit<LinkForm, 'id' | 'sortOrder'>,
        value: string
    ) => {
        setLinks(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    };

    const addLink = () => {
        setLinks(prev => [
            ...prev,
            {
                label_th: '',
                label_en: '',
                url: '',
                sortOrder: prev.length + 1,
            },
        ]);
    };

    const removeLink = (index: number) => {
        setLinks(prev =>
            prev
                .filter((_, i) => i !== index)
                .map((link, idx) => ({
                    ...link,
                    sortOrder: idx + 1,
                }))
        );
    };

    const handleSubmit = async () => {
        if (isSubmitting) return;
        if (!validateForm()) {
            toast.error("กรุณากรอกข้อมูลให้ครบถ้วน");

            const firstError = document.querySelector('.error-field');
            firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });

            return;
        }

        setIsSubmitting(true);

        const normalizedLinks = links.map((link, idx) => ({
            ...link,
            sortOrder: idx + 1,
        }));

        let achievementId: string | null = editData?.id ?? null;

        const basePayload: SubmitData = {
            ...formData,
            images: [],
            links: normalizedLinks,
            status: formData.isPublished ? 'PUBLIC' : 'DRAFT',
            id: achievementId ?? undefined,
            receivedAt: formData.receivedAt
                ? new Date(formData.receivedAt).toISOString()
                : undefined,
        };

        try {
            const isCreate = !achievementId;

            if (isCreate) {
                const created = await createAchievement(basePayload);
                achievementId = created.id;
            }

            let uploadedImages: ImagePreview[] = [];

            try {
                uploadedImages = await Promise.all(
                    imagePreview.map(async (img, idx) => {
                        if (img.file instanceof File && achievementId) {
                            const { url } = await uploadAchievementImageDirect(
                                img.file,
                                achievementId
                            );

                            return {
                                ...img,
                                preview: url,
                                sortOrder: idx + 1,
                            };
                        }

                        return {
                            ...img,
                            sortOrder: idx + 1,
                        };
                    })
                );
            } catch (uploadErr) {
                console.error(uploadErr);
                toast.error("อัพโหลดรูปภาพไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");

                if (isCreate && achievementId) {
                    try {
                        await deleteAchievement(achievementId);
                    } catch (rollbackErr) {
                        console.error("ไม่สามารถลบ achievement ที่สร้างค้างไว้ได้", rollbackErr);
                    }
                }

                return;
            }

            const finalPayload: SubmitData = {
                ...basePayload,
                id: achievementId ?? undefined,
                images: uploadedImages,
            };

            await updateAchievement(achievementId!, finalPayload);

            toast.success(editData ? "แก้ไขผลงานเรียบร้อย" : "เพิ่มผลงานเรียบร้อย");
            clearDraft();
            router.refresh();

            if (!editData) {
                const nextSortOrder = formData.sortOrder + 1;
                setFormData(createInitialFormState(null, nextSortOrder));
                setImagePreview([]);
                setLinks([]);
                setErrors({});
                setTouched({
                    title_th: false,
                    title_en: false,
                    categorySlugs: false,
                });
            }
        } catch (error) {
            console.error(error);
            toast.error("เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRichChange = (name: string, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300 ${
                    isAnimating ? 'opacity-100' : 'opacity-0'
                }`}
                onClick={handleSafeClose}
            />

            {/* Slide-over Studio Drawer Panel */}
            <div className="fixed inset-y-0 right-0 max-w-6xl w-full flex pl-0 sm:pl-6">
                <div
                    className={`w-full bg-white dark:bg-zinc-900 shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out border-l border-gray-200 dark:border-zinc-800 ${
                        isAnimating ? 'translate-x-0' : 'translate-x-full'
                    }`}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Sticky Top Header Bar */}
                    <div className="px-6 py-4 border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-between sticky top-0 z-20">
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                                {editData ? 'แก้ไขผลงาน' : 'เพิ่มผลงานใหม่'}
                            </h2>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                จัดการรายละเอียด หมวดหมู่ รูปภาพ และลิงก์ที่เกี่ยวข้อง
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={handleSafeClose}
                                type="button"
                                className="cursor-pointer p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-zinc-800 dark:hover:text-gray-300 transition"
                                title="ปิดหน้าต่าง"
                            >
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Draft Banner */}
                    {hasDraft && (
                        <div className="mx-6 mt-4 px-4.5 py-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm text-amber-900 dark:text-amber-200 shrink-0 shadow-xs">
                            <div className="flex items-center gap-3 font-semibold min-w-0">
                                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0 animate-pulse" />
                                <div className="min-w-0 flex flex-wrap items-center gap-2">
                                    <span>พบข้อมูลร่างที่พิมพ์ค้างไว้ล่าสุดเมื่อเวลา {draftTime}</span>
                                    {draftPreview && (
                                        <span className="px-2.5 py-0.5 rounded-lg bg-amber-100/90 dark:bg-amber-900/60 border border-amber-300/80 dark:border-amber-700/60 font-bold text-amber-950 dark:text-amber-100 truncate max-w-[280px]">
                                            "{draftPreview}"
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                                <button
                                    type="button"
                                    onClick={handleRestoreDraft}
                                    className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg shadow-2xs transition cursor-pointer"
                                >
                                    กู้คืนข้อมูล
                                </button>
                                <button
                                    type="button"
                                    onClick={clearDraft}
                                    className="px-3.5 py-1.5 hover:bg-amber-100 dark:hover:bg-amber-900/50 text-amber-800 dark:text-amber-300 font-bold rounded-lg transition cursor-pointer"
                                >
                                    ลบร่าง
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Scrollable Body */}
                    <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
                        {/* ข้อมูลหลัก */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-zinc-800">
                                <div className="w-1 h-4 bg-rose-500 rounded-full"></div>
                                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                                    ข้อมูลทั่วไป
                                </h3>
                            </div>

                            <AchievementTextField
                                label="ชื่อผลงาน (ไทย)"
                                name="title_th"
                                value={formData.title_th}
                                onChange={handleInputChange}
                                onBlur={() => handleBlur("title_th")}
                                placeholder="ชื่อผลงานภาษาไทย"
                                required
                                size="lg"
                                error={errors.title_th}
                                touched={touched.title_th}
                            />

                            <AchievementTextField
                                label="ชื่อผลงาน (English)"
                                name="title_en"
                                value={formData.title_en}
                                onChange={handleInputChange}
                                onBlur={() => handleBlur('title_en')}
                                placeholder="Achievement Title"
                                required
                                size="lg"
                                error={errors.title_en}
                                touched={touched.title_en}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <AchievementTextField
                                    label="มอบโดย (ไทย)"
                                    name="given_by_th"
                                    value={formData.given_by_th}
                                    onChange={handleInputChange}
                                    placeholder="ชื่อองค์กร / สถาบัน"
                                    size="md"
                                />

                                <AchievementTextField
                                    label="มอบโดย (English)"
                                    name="given_by_en"
                                    value={formData.given_by_en}
                                    onChange={handleInputChange}
                                    placeholder="Organization / Institution"
                                    size="md"
                                />
                            </div>

                            <AchievementRichText
                                label="รายละเอียด (ไทย)"
                                name="description_th"
                                value={formData.description_th}
                                onChange={handleRichChange}
                                placeholder="อธิบายรายละเอียดของผลงาน รางวัล หรือโครงการนี้..."
                            />

                            <AchievementRichText
                                label="รายละเอียด (English)"
                                name="description_en"
                                value={formData.description_en}
                                onChange={handleRichChange}
                                placeholder="Describe the achievement, competition, or project details..."
                            />
                        </div>

                        {/* ข้อมูลรางวัลและสถานที่ */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-zinc-800">
                                <div className="w-1 h-4 bg-amber-500 rounded-full"></div>
                                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                                    ระดับรางวัล & สถานที่
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <AchievementTextField
                                    label="ระดับรางวัล (ไทย)"
                                    name="awardLevel_th"
                                    value={formData.awardLevel_th}
                                    onChange={handleInputChange}
                                    placeholder="เช่น ระดับประเทศ / ระดับภาค"
                                    size="md"
                                />

                                <AchievementTextField
                                    label="ระดับรางวัล (English)"
                                    name="awardLevel_en"
                                    value={formData.awardLevel_en}
                                    onChange={handleInputChange}
                                    placeholder="e.g. National / Regional"
                                    size="md"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <AchievementTextField
                                    label="สถานที่ (ไทย)"
                                    name="location_th"
                                    value={formData.location_th}
                                    onChange={handleInputChange}
                                    placeholder="สถานที่จัดงาน / เมือง"
                                    size="md"
                                />

                                <AchievementTextField
                                    label="สถานที่ (English)"
                                    name="location_en"
                                    value={formData.location_en}
                                    onChange={handleInputChange}
                                    placeholder="Location / City"
                                    size="md"
                                />
                            </div>

                            <div>
                                <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 dark:text-gray-200 mb-1.5">
                                    วันที่ได้รับ
                                </label>
                                <input
                                    type="date"
                                    name="receivedAt"
                                    value={formData.receivedAt}
                                    onChange={handleInputChange}
                                    className="w-full px-3.5 py-2.5 rounded-lg border text-sm sm:text-base font-medium bg-white text-gray-900 border-gray-200 shadow-2xs focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 dark:bg-zinc-800/80 dark:text-white dark:border-zinc-700"
                                />
                            </div>
                        </div>

                        {/* การตั้งค่าและหมวดหมู่ */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-zinc-800">
                                <div className="w-1 h-4 bg-emerald-500 rounded-full"></div>
                                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">
                                    หมวดหมู่และการเผยแพร่
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div>
                                    <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 dark:text-gray-200 mb-1.5">
                                        <Grid3x3 className="w-3.5 h-3.5 text-rose-500" />
                                        เลือกหมวดหมู่
                                        <span className="text-rose-500">*</span>
                                    </label>

                                    <div className={`rounded-md border overflow-hidden transition ${
                                        errors.categorySlugs && touched.categorySlugs
                                            ? 'border-red-500 bg-red-50/50 dark:bg-red-950/20'
                                            : 'border-gray-200 bg-white dark:bg-zinc-800/80 dark:border-zinc-700'
                                    }`}>
                                        <select
                                            multiple
                                            name="categorySlugs"
                                            value={formData.categorySlugs}
                                            onChange={handleCategoryChange}
                                            onBlur={() => handleBlur('categorySlugs')}
                                            className="w-full min-h-[160px] border-none p-2 text-xs bg-transparent text-gray-900 dark:text-gray-100 focus:outline-none [&>option]:py-2 [&>option]:px-2.5 [&>option]:my-0.5 [&>option]:rounded [&>option:checked]:bg-rose-600 [&>option:checked]:text-white"
                                        >
                                            {categories.map((cat) => (
                                                <option key={cat.id} value={cat.slug}>
                                                    {cat.name_th}
                                                </option>
                                            ))}
                                        </select>

                                        <div className="px-3 py-2 bg-gray-50 border-t border-gray-200 dark:bg-zinc-900/60 dark:border-zinc-700 flex items-center justify-between">
                                            <span className="text-[11px] text-gray-500 dark:text-gray-400">
                                                💡 กด Ctrl / Cmd ค้างไว้เพื่อเลือกหลายรายการ
                                            </span>
                                            {formData.categorySlugs.length > 0 && (
                                                <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                                    <CheckCircle2 size={12} />
                                                    {formData.categorySlugs.length} หมวดหมู่
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    {errors.categorySlugs && touched.categorySlugs && (
                                        <div className="flex items-center gap-1.5 mt-1 text-xs text-red-600 dark:text-red-400">
                                            <AlertCircle size={14} />
                                            <span>{errors.categorySlugs}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 bg-gray-50/60 dark:border-zinc-700 dark:bg-zinc-800/40">
                                        <input
                                            type="checkbox"
                                            id="isPublished"
                                            name="isPublished"
                                            checked={formData.isPublished}
                                            onChange={handleInputChange}
                                            className="w-4 h-4 cursor-pointer rounded text-rose-600 border-gray-300 focus:ring-rose-500"
                                        />
                                        <label
                                            htmlFor="isPublished"
                                            className="text-xs font-medium cursor-pointer text-gray-800 dark:text-gray-200 select-none"
                                        >
                                            เผยแพร่ผลงานนี้สู่สาธารณะทันทีหลังบันทึก
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ลิงก์และรูปภาพ */}
                        <div className="space-y-6 pt-2">
                            <AchievementLinksSection
                                links={links}
                                draggedLinkIndex={draggedLinkIndex}
                                addLink={addLink}
                                removeLink={removeLink}
                                handleLinkChange={handleLinkChange}
                                handleLinkDragStart={handleLinkDragStart}
                                handleLinkDragOver={handleLinkDragOver}
                                handleLinkDragEnd={handleLinkDragEnd}
                            />

                            <AchievementImagesSection
                                imagePreview={imagePreview}
                                draggedIndex={draggedIndex}
                                handleImageUpload={handleImageUpload}
                                handleReplaceImage={handleReplaceImage}
                                handleImageAltChange={handleImageAltChange}
                                handleRemoveImage={handleRemoveImage}
                                handleDragStart={handleDragStart}
                                handleDragOver={handleDragOver}
                                handleDragEnd={handleDragEnd}
                            />

                        </div>
                    </div>

                    {/* Sticky Bottom Action Bar */}
                    <div className="px-6 py-4 border-t border-gray-200 dark:border-zinc-800 bg-gray-50/80 dark:bg-zinc-900/90 flex justify-end gap-3 sticky bottom-0 z-20">
                        <button
                            onClick={close}
                            type="button"
                            className="cursor-pointer px-4 py-2 rounded-md font-medium text-xs border border-gray-200 text-gray-700 hover:bg-gray-100 dark:border-zinc-700 dark:text-gray-300 dark:hover:bg-zinc-800 transition"
                        >
                            ยกเลิก
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting || !isFormValid}
                            className="cursor-pointer inline-flex items-center gap-1.5 px-5 py-2 rounded-md font-medium text-xs bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>กำลังบันทึกข้อมูล...</span>
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    <span>{editData ? 'บันทึกการแก้ไข' : 'สร้างผลงานใหม่'}</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
