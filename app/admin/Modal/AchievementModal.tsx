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

    const toggleCategorySlug = (slug: string) => {
        setFormData((prev) => {
            const current = prev.categorySlugs || [];
            const exists = current.includes(slug);
            const updated = exists
                ? current.filter((s) => s !== slug)
                : [...current, slug];
            return { ...prev, categorySlugs: updated };
        });
        setTouched((prev) => ({ ...prev, categorySlugs: true }));
    };

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

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Category Selection Panel (2 Columns) */}
                                <div className="lg:col-span-2 space-y-2">
                                    <div className="flex items-center justify-between mb-1">
                                        <label className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-200">
                                            <Grid3x3 className="w-4 h-4 text-rose-500" />
                                            <span>เลือกหมวดหมู่ผลงาน</span>
                                            <span className="text-rose-500">*</span>
                                        </label>
                                        {formData.categorySlugs.length > 0 && (
                                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center gap-1">
                                                <CheckCircle2 size={13} />
                                                เลือกแล้ว {formData.categorySlugs.length} หมวดหมู่
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        💡 คลิกที่กล่องหมวดหมู่ด้านล่างเพื่อเลือกหรือยกเลิก (สามารถเลือกได้หลายหมวดหมู่พร้อมกันโดยไม่ต้องกดปุ่มอื่นค้าง)
                                    </p>

                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1.5">
                                        {categories.map((cat) => {
                                            const isSelected = formData.categorySlugs.includes(cat.slug);
                                            return (
                                                <button
                                                    key={cat.id}
                                                    type="button"
                                                    onClick={() => toggleCategorySlug(cat.slug)}
                                                    className={`cursor-pointer p-3 rounded-xl border text-left font-bold text-xs sm:text-sm transition-all duration-200 flex items-center justify-between gap-2 shadow-2xs select-none ${
                                                        isSelected
                                                            ? 'bg-rose-500 text-white border-rose-600 shadow-md ring-2 ring-rose-500/20 scale-[1.01]'
                                                            : 'bg-white dark:bg-zinc-800/80 text-gray-700 dark:text-gray-200 border-gray-200/80 dark:border-zinc-700 hover:border-rose-400 hover:bg-rose-50/50 dark:hover:bg-rose-950/30'
                                                    }`}
                                                >
                                                    <span className="truncate">{cat.name_th}</span>
                                                    <div className={`w-5 h-5 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                                                        isSelected ? 'bg-white/20 text-white' : 'bg-gray-100 dark:bg-zinc-700 text-gray-400'
                                                    }`}>
                                                        {isSelected ? <CheckCircle2 size={14} className="stroke-[2.5]" /> : <span className="text-xs font-black">+</span>}
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {errors.categorySlugs && touched.categorySlugs && (
                                        <div className="flex items-center gap-1.5 mt-2 text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 p-2.5 rounded-xl border border-red-200 dark:border-red-800/60">
                                            <AlertCircle size={15} className="shrink-0" />
                                            <span>{errors.categorySlugs}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Publish Setting Action Card (1 Column) */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-200 mb-1">
                                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse inline-block" />
                                        <span>สถานะการเผยแพร่</span>
                                    </label>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        กำหนดการแสดงผลบนหน้าเว็บสาธารณะ
                                    </p>

                                    <div
                                        onClick={() => setFormData(prev => ({ ...prev, isPublished: !prev.isPublished }))}
                                        className={`cursor-pointer p-4 sm:p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between gap-4 shadow-2xs select-none h-[calc(100%-44px)] min-h-[140px] ${
                                            formData.isPublished
                                                ? 'bg-emerald-50/90 dark:bg-emerald-950/30 border-emerald-500/80 dark:border-emerald-600/60 ring-2 ring-emerald-500/10'
                                                : 'bg-gray-50 dark:bg-zinc-800/60 border-gray-200 dark:border-zinc-700 hover:border-gray-300'
                                        }`}
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold flex items-center gap-1 ${
                                                        formData.isPublished
                                                            ? 'bg-emerald-500 text-white shadow-xs'
                                                            : 'bg-gray-200 dark:bg-zinc-700 text-gray-700 dark:text-gray-300'
                                                    }`}>
                                                        {formData.isPublished ? '🚀 เผยแพร่ทันที (Public)' : '📝 ฉบับร่าง (Draft)'}
                                                    </span>
                                                </div>
                                                <p className="text-xs font-medium text-gray-600 dark:text-gray-300 leading-relaxed pt-1">
                                                    {formData.isPublished
                                                        ? 'ผลงานนี้จะแสดงบนหน้าเว็บไซต์หลักทันที ทุกคนสามารถมองเห็นและเข้าชมได้'
                                                        : 'ผลงานนี้จะถูกบันทึกเก็บไว้เป็นฉบับร่าง ซ่อนจากสาธารณะ (เห็นเฉพาะผู้ดูแลระบบ)'}
                                                </p>
                                            </div>

                                            {/* Visual Toggle Switch */}
                                            <div className={`w-12 h-6.5 rounded-full p-1 transition-colors duration-300 ease-in-out shrink-0 flex items-center ${
                                                formData.isPublished ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-zinc-600'
                                            }`}>
                                                <div className={`w-4.5 h-4.5 rounded-full bg-white shadow-md transform transition-transform duration-300 ease-in-out ${
                                                    formData.isPublished ? 'translate-x-5.5' : 'translate-x-0'
                                                }`} />
                                            </div>
                                        </div>

                                        <div className="pt-2 border-t border-gray-200/60 dark:border-zinc-700/60 flex items-center justify-between text-[11px] font-bold text-gray-500">
                                            <span>คลิกเพื่อสลับสถานะ</span>
                                            <span>{formData.isPublished ? 'เปิดแสดงผล' : 'ซ่อนไว้ก่อน'}</span>
                                        </div>
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
