'use client';
import {
    useState,
    useMemo,
    DragEvent,
    useEffect,
} from 'react';
import { X, AlertCircle, Save, Loader2, Grid3x3, CheckCircle2, Info, Image as ImageIcon } from 'lucide-react';
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

type Tab = 'general' | 'details' | 'media';

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
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

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

    const [activeTab, setActiveTab] = useState<Tab>('general');
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
        handleMoveImage,
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

    const mediaCount = imagePreview.length + links.length;

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
                    isAnimating ? 'opacity-100' : 'opacity-0'
                }`}
                onClick={handleSafeClose}
            />

            {/* Modal Panel */}
            <div
                className={`relative w-full sm:max-w-3xl bg-white dark:bg-zinc-900 shadow-2xl flex flex-col
                    rounded-t-2xl sm:rounded-2xl border border-gray-200 dark:border-zinc-800
                    transform transition-all duration-300 ease-out
                    max-h-[95dvh] sm:max-h-[90dvh]
                    ${isAnimating
                        ? 'translate-y-0 opacity-100 scale-100'
                        : 'translate-y-8 opacity-0 scale-[0.98]'
                    }`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 dark:border-zinc-800 shrink-0">
                    <div className="flex items-center gap-2.5 min-w-0">
                        <h2 className="text-base font-bold text-gray-900 dark:text-white truncate">
                            {editData ? 'แก้ไขผลงาน' : 'เพิ่มผลงานใหม่'}
                        </h2>
                        {isDirty && (
                            <span
                                className="w-2 h-2 rounded-full bg-amber-400 shrink-0 animate-pulse"
                                title="มีการแก้ไขที่ยังไม่ได้บันทึก"
                            />
                        )}
                    </div>
                    <button
                        onClick={handleSafeClose}
                        type="button"
                        className="cursor-pointer p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-zinc-800 dark:hover:text-gray-300 transition shrink-0"
                        title="ปิดหน้าต่าง"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Draft Banner */}
                {hasDraft && (
                    <div className="mx-4 mt-3 px-4 py-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/80 dark:border-amber-800/60 flex items-center justify-between gap-3 text-xs text-amber-900 dark:text-amber-200 shrink-0">
                        <div className="flex items-center gap-2 font-semibold min-w-0">
                            <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 animate-pulse" />
                            <span className="truncate">พบข้อมูลร่างล่าสุดเมื่อ {draftTime}</span>
                            {draftPreview && (
                                <span className="hidden sm:inline px-2 py-0.5 rounded-md bg-amber-100/90 dark:bg-amber-900/60 border border-amber-300/60 font-bold truncate max-w-[180px]">
                                    &ldquo;{draftPreview}&rdquo;
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                            <button
                                type="button"
                                onClick={handleRestoreDraft}
                                className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg text-xs transition cursor-pointer"
                            >
                                กู้คืน
                            </button>
                            <button
                                type="button"
                                onClick={clearDraft}
                                className="px-2.5 py-1 hover:bg-amber-100 dark:hover:bg-amber-900/50 text-amber-800 dark:text-amber-300 font-bold rounded-lg text-xs transition cursor-pointer"
                            >
                                ลบร่าง
                            </button>
                        </div>
                    </div>
                )}

                {/* Tab Bar */}
                <div className="flex items-center gap-0.5 px-4 pt-3 pb-0 border-b border-gray-100 dark:border-zinc-800 shrink-0">
                    {([
                        {
                            id: 'general' as Tab,
                            label: 'ทั่วไป',
                            icon: <Grid3x3 size={13} />,
                            badge: (!formData.title_th || !formData.title_en || formData.categorySlugs.length === 0) ? '!' : null,
                        },
                        {
                            id: 'details' as Tab,
                            label: 'รายละเอียด',
                            icon: <Info size={13} />,
                            badge: null,
                        },
                        {
                            id: 'media' as Tab,
                            label: 'รูปภาพ & ลิงก์',
                            icon: <ImageIcon size={13} />,
                            badge: mediaCount > 0 ? mediaCount : null,
                        },
                    ]).map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => setActiveTab(tab.id)}
                            className={`cursor-pointer flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-t-lg border-b-2 transition-all -mb-px ${
                                activeTab === tab.id
                                    ? 'border-rose-500 text-rose-600 dark:text-rose-400 bg-rose-50/50 dark:bg-rose-950/20'
                                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300 dark:hover:border-zinc-600'
                            }`}
                        >
                            {tab.icon}
                            <span>{tab.label}</span>
                            {tab.badge !== null && (
                                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold leading-none ${
                                    tab.badge === '!'
                                        ? 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400'
                                        : 'bg-gray-100 dark:bg-zinc-700 text-gray-600 dark:text-gray-300'
                                }`}>
                                    {tab.badge}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Scrollable Tab Content */}
                <div className="flex-1 overflow-y-auto overscroll-contain">

                    {/* TAB 1: ทั่วไป */}
                    {activeTab === 'general' && (
                        <div className="px-5 py-5 space-y-5">
                            {/* ชื่อผลงาน */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                            </div>

                            {/* มอบโดย */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                            <hr className="border-gray-100 dark:border-zinc-800" />

                            {/* หมวดหมู่ + สถานะ */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                                {/* Category */}
                                <div className="lg:col-span-2 space-y-2">
                                    <div className="flex items-center justify-between">
                                        <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700 dark:text-gray-200">
                                            <Grid3x3 className="w-3.5 h-3.5 text-rose-500" />
                                            <span>หมวดหมู่</span>
                                            <span className="text-rose-500">*</span>
                                        </label>
                                        {formData.categorySlugs.length > 0 && (
                                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-bold text-[10px] flex items-center gap-1">
                                                <CheckCircle2 size={11} />
                                                {formData.categorySlugs.length} หมวด
                                            </span>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                        {categories.map((cat) => {
                                            const isSelected = formData.categorySlugs.includes(cat.slug);
                                            return (
                                                <button
                                                    key={cat.id}
                                                    type="button"
                                                    onClick={() => toggleCategorySlug(cat.slug)}
                                                    className={`cursor-pointer px-3 py-2 rounded-lg border text-left text-xs font-semibold transition-all flex items-center justify-between gap-1.5 select-none ${
                                                        isSelected
                                                            ? 'bg-rose-500 text-white border-rose-600 shadow-sm ring-2 ring-rose-500/20'
                                                            : 'bg-white dark:bg-zinc-800/80 text-gray-700 dark:text-gray-200 border-gray-200/80 dark:border-zinc-700 hover:border-rose-400 hover:bg-rose-50/50 dark:hover:bg-rose-950/30'
                                                    }`}
                                                >
                                                    <span className="truncate">{cat.name_th}</span>
                                                    {isSelected && <CheckCircle2 size={13} className="shrink-0 stroke-[2.5]" />}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    {errors.categorySlugs && touched.categorySlugs && (
                                        <div className="flex items-center gap-1.5 mt-1 text-xs font-semibold text-red-600 dark:text-red-400">
                                            <AlertCircle size={13} className="shrink-0" />
                                            <span>{errors.categorySlugs}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Publish Toggle */}
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-gray-700 dark:text-gray-200 block">
                                        สถานะการเผยแพร่
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setFormData(prev => ({ ...prev, isPublished: !prev.isPublished }))}
                                        className={`w-full cursor-pointer p-3.5 rounded-xl border transition-all duration-200 flex items-center justify-between gap-3 shadow-xs select-none ${
                                            formData.isPublished
                                                ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-400 dark:border-emerald-600/60'
                                                : 'bg-gray-50 dark:bg-zinc-800/60 border-gray-200 dark:border-zinc-700'
                                        }`}
                                    >
                                        <div className="text-left">
                                            <div className={`text-xs font-bold ${formData.isPublished ? 'text-emerald-700 dark:text-emerald-300' : 'text-gray-600 dark:text-gray-400'}`}>
                                                {formData.isPublished ? 'เผยแพร่แล้ว' : 'ฉบับร่าง'}
                                            </div>
                                            <div className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 leading-snug">
                                                {formData.isPublished ? 'แสดงบนเว็บสาธารณะ' : 'ซ่อนจากสาธารณะ'}
                                            </div>
                                        </div>
                                        <div className={`w-10 h-5 rounded-full p-0.5 transition-colors duration-200 flex items-center shrink-0 ${
                                            formData.isPublished ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-zinc-600'
                                        }`}>
                                            <div className={`w-4 h-4 rounded-full bg-white shadow transform transition-transform duration-200 ${
                                                formData.isPublished ? 'translate-x-5' : 'translate-x-0'
                                            }`} />
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB 2: รายละเอียด */}
                    {activeTab === 'details' && (
                        <div className="px-5 py-5 space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                    className="px-3.5 py-2.5 rounded-lg border text-sm font-medium bg-white text-gray-900 border-gray-200 shadow-xs focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 dark:bg-zinc-800/80 dark:text-white dark:border-zinc-700"
                                />
                            </div>

                            <hr className="border-gray-100 dark:border-zinc-800" />

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
                    )}

                    {/* TAB 3: รูปภาพ & ลิงก์ */}
                    {activeTab === 'media' && (
                        <div className="px-5 py-5 space-y-6">
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
                                handleMoveImage={handleMoveImage}
                            />
                            <hr className="border-gray-100 dark:border-zinc-800" />
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
                        </div>
                    )}
                </div>

                {/* Action Bar */}
                <div className="px-5 py-3.5 border-t border-gray-100 dark:border-zinc-800 bg-gray-50/80 dark:bg-zinc-900/90 flex items-center justify-between gap-3 shrink-0">
                    {/* Tab dots indicator */}
                    <div className="flex items-center gap-1.5">
                        {(['general', 'details', 'media'] as const).map((tab, i) => (
                            <button
                                key={tab}
                                type="button"
                                onClick={() => setActiveTab(tab)}
                                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                                    activeTab === tab
                                        ? 'bg-rose-500 w-5'
                                        : 'bg-gray-300 dark:bg-zinc-600 hover:bg-gray-400 w-1.5'
                                }`}
                                aria-label={`Tab ${i + 1}`}
                            />
                        ))}
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={close}
                            type="button"
                            className="cursor-pointer px-4 py-2 rounded-lg font-medium text-xs border border-gray-200 text-gray-600 hover:bg-gray-100 dark:border-zinc-700 dark:text-gray-300 dark:hover:bg-zinc-800 transition"
                        >
                            ยกเลิก
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting || !isFormValid}
                            className="cursor-pointer inline-flex items-center gap-2 px-5 py-2 rounded-lg font-semibold text-sm bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>กำลังบันทึก...</span>
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
