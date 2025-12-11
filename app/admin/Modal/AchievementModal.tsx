'use client';
import {
    useState,
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
import { AchievementTextarea } from '../AchievementTextarea';
import { useAchievementTextTranslation } from '../hooks/useAchievementTextTranslation';
import { useLinkTranslation } from '../hooks/useLinkTranslation';
import { useImageAltTranslation } from '../hooks/useImageAltTranslation';


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
    isAnimating: boolean
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

    const [links, setLinks] = useState<LinkForm[]>(() =>
        editData?.links?.map((link, idx) => ({
            id: link.id,
            label_th: link.label_th ?? '',
            label_en: link.label_en ?? '',
            url: link.url ?? '',
            sortOrder: link.sortOrder ?? idx + 1,
        })) ?? []
    );

    const { translating, handleTranslate } = useAchievementTextTranslation({
        editData,
        formData,
        setFormData,
    });

    const { translatingLink, handleTranslateLink } = useLinkTranslation({
        links,
        setLinks,
    });

    const { translatingImageAlt, handleTranslateImageAlt } = useImageAltTranslation({
        editData,
        imagePreview,
        setImagePreview,
    });

    const handleLinkDragStart = (e: DragEvent<HTMLDivElement>, index: number) => {
        setDraggedLinkIndex(index);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleLinkDragOver = (e: DragEvent<HTMLDivElement>, index: number) => {
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
                sortOrder: prev.length + 1, // 👈 +1
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


    return (
        <div
            className="
    fixed inset-0 z-50 flex items-center justify-center p-4 cursor-pointer
    backdrop-blur-sm
    bg-black/30 dark:bg-black/60
  "
            onClick={close}
            style={{
                animation: isAnimating ? 'modalFadeIn 0.2s ease-out' : 'modalFadeOut 0.2s ease-in'
            }}
        >
            <div
                style={{
                    animation: isAnimating ? 'modalSlideIn 0.3s ease-out' : 'modalSlideOut 0.2s ease-in'
                }}
                onClick={(e) => e.stopPropagation()}
                className="
      max-w-5xl w-full max-h-[90vh]
      overflow-hidden flex flex-col
      rounded-2xl shadow-2xl border
      bg-white border-gray-200
      dark:bg-[#1e222a] dark:border-gray-800
    "
            >
                {/* Header */}
                <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/80 dark:bg-[#1e222a]">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                                {editData ? 'แก้ไขผลงาน' : 'เพิ่มผลงานใหม่'}
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                กรอกข้อมูลผลงานของคุณ
                            </p>
                        </div>
                        <button
                            onClick={close}
                            className="
            cursor-pointer w-10 h-10 flex items-center justify-center rounded-full
            text-gray-500 hover:bg-gray-100
            dark:text-gray-400 dark:hover:bg-gray-800
            transition-colors
          "
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="overflow-y-auto flex-1 px-8 py-6 bg-white dark:bg-[#1e222a]">
                    <div className="max-w-3xl mx-auto space-y-8">

                        {/* ข้อมูลหลัก */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                    ข้อมูลหลัก
                                </h3>
                            </div>

                            <AchievementTextField
                                label="ชื่อผลงาน (ไทย)"
                                name="title_th"
                                value={formData.title_th}
                                onChange={handleInputChange}
                                onBlur={() => handleBlur("title_th")}
                                placeholder="ชื่อผลงาน"
                                required
                                size="lg"
                                error={errors.title_th}
                                touched={touched.title_th}
                                isTranslating={!!translating.title_th}
                                onTranslate={() => handleTranslate("title_th")}
                            />

                            <AchievementTextField
                                label="ชื่อผลงาน (English)"
                                name="title_en"
                                value={formData.title_en}
                                onChange={handleInputChange}
                                onBlur={() => handleBlur('title_en')}
                                placeholder="Title"
                                required
                                size="md"
                                error={errors.title_en}
                                touched={touched.title_en}
                            />

                            <AchievementTextField
                                label="มอบโดย"
                                name="given_by_th"
                                value={formData.given_by_th}
                                onChange={handleInputChange}
                                placeholder="มอบโดย"
                                size="md"
                                isTranslating={!!translating.given_by_th}
                                onTranslate={() => handleTranslate("given_by_th")}
                            />

                            <AchievementTextField
                                label="มอบโดย (English)"
                                name="given_by_en"
                                value={formData.given_by_en}
                                onChange={handleInputChange}
                                placeholder="Given by"
                                size="md"
                            />

                            <AchievementTextarea
                                label="รายละเอียด (ไทย)"
                                name="description_th"
                                value={formData.description_th}
                                onChange={handleInputChange}
                                placeholder="อธิบายรายละเอียดผลงาน..."
                                rows={4}
                                isTranslating={!!translating.description_th}
                                onTranslate={() => handleTranslate("description_th")}
                            />

                            <AchievementTextarea
                                label="รายละเอียด (English)"
                                name="description_en"
                                value={formData.description_en}
                                onChange={handleInputChange}
                                placeholder="Describe your project..."
                                rows={4}
                            />
                        </div>

                        {/* ข้อมูลรางวัล */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-1 h-6 bg-amber-500 rounded-full"></div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                    ข้อมูลรางวัล
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <AchievementTextField
                                    label="ระดับรางวัล (ไทย)"
                                    name="awardLevel_th"
                                    value={formData.awardLevel_th}
                                    onChange={handleInputChange}
                                    placeholder="ประเทศ | จังหวัด | เขต"
                                    size="md"
                                    isTranslating={!!translating.awardLevel_th}
                                    onTranslate={() => handleTranslate("awardLevel_th")}
                                />

                                <AchievementTextField
                                    label="ระดับรางวัล (English)"
                                    name="awardLevel_en"
                                    value={formData.awardLevel_en}
                                    onChange={handleInputChange}
                                    placeholder="Country | Province | District"
                                    size="md"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <AchievementTextField
                                    label="สถานที่ (ไทย)"
                                    name="location_th"
                                    value={formData.location_th}
                                    onChange={handleInputChange}
                                    placeholder="สถานที่"
                                    size="md"
                                    isTranslating={!!translating.location_th}
                                    onTranslate={() => handleTranslate("location_th")}
                                />

                                <AchievementTextField
                                    label="สถานที่ (English)"
                                    name="location_en"
                                    value={formData.location_en}
                                    onChange={handleInputChange}
                                    placeholder="Location"
                                    size="md"
                                />
                            </div>

                            <div className="group">
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
                                    วันที่ได้รับ
                                </label>
                                <div className="relative">
                                    <input
                                        type="date"
                                        name="receivedAt"
                                        value={formData.receivedAt}
                                        onChange={handleInputChange}
                                        className="
                    w-full px-4 py-3.5 rounded-xl border-gray-300 border-2 transition-all duration-200
                    bg-white text-gray-900 placeholder-gray-400 hover:border-red-300 hover:bg-white
                    dark:hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500
                    shadow-sm dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:border-red-500
                  "
                                    />
                                </div>
                            </div>
                        </div>

                        {/* การจัดการ */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-1 h-6 bg-emerald-500 rounded-full"></div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                    การจัดการ
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {/* Categories - Enhanced Multi-Select */}
                                <div className="lg:col-span-2">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
                                        <Grid3x3 className="w-4 h-4 text-red-500" />
                                        หมวดหมู่
                                        <span className="text-red-500">*</span>
                                    </label>

                                    <div className={`
                  rounded-xl border-2 transition-all duration-200 overflow-hidden
                  ${errors.categorySlugs && touched.categorySlugs
                                            ? 'border-red-400 bg-red-50/50 dark:bg-red-950/20 dark:border-red-500'
                                            : 'border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-700'
                                        }
                `}>
                                        <select
                                            multiple
                                            name="categorySlugs"
                                            value={formData.categorySlugs}
                                            onChange={handleCategoryChange}
                                            onBlur={() => handleBlur('categorySlugs')}
                                            className="
  w-full min-h-[200px] border-2 px-4 py-3
  text-sm sm:text-base
  bg-white text-gray-900 border-gray-200 shadow-sm
  focus:outline-none

  dark:bg-gray-900 dark:text-gray-50 dark:border-gray-700 dark:shadow-sm

  [&>option]:bg-white [&>option]:text-gray-900 [&>option]:border [&>option]:border-gray-200
  [&>option]:py-2.5 [&>option]:px-3 [&>option]:my-1 [&>option]:rounded-lg

  [&>option:hover]:bg-gray-100 [&>option:hover]:cursor-pointer

  [&>option:checked]:bg-red-500 [&>option:checked]:text-white

  dark:[&>option]:bg-gray-800 dark:[&>option]:text-gray-100 dark:[&>option]:border-gray-600
  dark:[&>option:hover]:bg-gray-700
  dark:[&>option:checked]:bg-red-500 dark:[&>option:checked]:text-white
"
                                        >
                                            {categories.map((cat) => (
                                                <option key={cat.id} value={cat.slug}>
                                                    {cat.name_th} - {cat.name_en}
                                                </option>
                                            ))}
                                        </select>

                                        <div className="cursor-default px-4 py-3 bg-gray-50 border-t border-gray-200 dark:bg-gray-900/50 dark:border-gray-700">
                                            <div className="flex items-center justify-between gap-4">
                                                <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-2">
                                                    <span>💡</span>
                                                    <span>
                                                        กด <kbd className="px-2 py-0.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-xs font-mono">Ctrl</kbd>
                                                        {' '}/{' '}
                                                        <kbd className="px-2 py-0.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded text-xs font-mono">Cmd</kbd>
                                                        {' '}ค้างไว้เพื่อเลือกหลายหมวดหมู่
                                                    </span>
                                                </p>

                                                {formData.categorySlugs.length > 0 && (
                                                    <div className="flex items-center gap-2 px-3 py-1 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                                                        <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                                                        <span className="text-xs font-medium text-green-700 dark:text-green-300">
                                                            {formData.categorySlugs.length} หมวดหมู่
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>


                                    {errors.categorySlugs && touched.categorySlugs && (
                                        <div className="flex items-center gap-2 mt-3 px-4 py-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                                            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" />
                                            <span className="text-sm text-red-600 dark:text-red-400 font-medium">{errors.categorySlugs}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Sort Order - Enhanced */}
                                <div className="lg:col-span-2">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">
                                        ลำดับการแสดงผล
                                    </label>
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="number"
                                            name="sortOrder"
                                            value={formData.sortOrder}
                                            onChange={handleInputChange}
                                            min={1}
                                            className="
                      flex-1 px-4 py-3.5 rounded-xl border-2 transition-all duration-200
                      bg-gray-50 text-gray-900 border-gray-200
                      hover:border-red-300 hover:bg-white
                      focus:outline-none focus:ring-4 focus:ring-red-500/10 focus:border-red-500 focus:bg-white
                      dark:bg-gray-900/50 dark:text-white dark:border-gray-700
                      dark:hover:border-red-400 dark:hover:bg-gray-900
                      dark:focus:border-red-500
                    "
                                        />
                                        <div className="flex gap-2">
                                            <button
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, sortOrder: Math.max(1, prev.sortOrder - 1) }))}
                                                className="cursor-pointer p-3 rounded-lg border-2 border-gray-200 bg-white hover:bg-gray-50 hover:border-red-300 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 transition-all"
                                            >
                                                <span className="text-lg font-bold text-gray-700 dark:text-gray-300">−</span>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, sortOrder: prev.sortOrder + 1 }))}
                                                className="cursor-pointer p-3 rounded-lg border-2 border-gray-200 bg-white hover:bg-gray-50 hover:border-red-300 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 transition-all"
                                            >
                                                <span className="text-lg font-bold text-gray-700 dark:text-gray-300">+</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div
                                className="
              flex items-center gap-3 p-4 rounded-xl border transition-all
              bg-white border-gray-300
              dark:bg-gray-800/30 dark:border-gray-800
            "
                            >
                                <input
                                    type="checkbox"
                                    name="isPublished"
                                    checked={formData.isPublished}
                                    onChange={handleInputChange}
                                    className="
                w-5 h-5 cursor-pointer rounded
                text-blue-600 border-gray-300 focus:ring-blue-500 focus:ring-2
              "
                                />

                                <label
                                    className="
                text-sm font-medium cursor-pointer select-none
                text-gray-900
                dark:text-gray-300
              "
                                >
                                    เผยแพร่ผลงานนี้ทันทีหลังบันทึก
                                </label>
                            </div>
                        </div>

                        {/* Links Section */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-1 h-6 bg-violet-500 rounded-full"></div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                    ลิงก์ที่เกี่ยวข้อง
                                </h3>
                            </div>

                            <AchievementLinksSection
                                links={links}
                                draggedLinkIndex={draggedLinkIndex}
                                addLink={addLink}
                                removeLink={removeLink}
                                handleLinkChange={handleLinkChange}
                                handleLinkDragStart={handleLinkDragStart}
                                handleLinkDragOver={handleLinkDragOver}
                                handleLinkDragEnd={handleLinkDragEnd}
                                handleTranslateLink={handleTranslateLink}
                                translatingLink={translatingLink}
                            />
                        </div>

                        {/* Images Section */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-1 h-6 bg-pink-500 rounded-full"></div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                    รูปภาพผลงาน
                                </h3>
                            </div>

                            <AchievementImagesSection
                                imagePreview={imagePreview}
                                draggedIndex={draggedIndex}
                                handleImageUpload={handleImageUpload}
                                handleImageAltChange={handleImageAltChange}
                                handleRemoveImage={handleRemoveImage}
                                handleDragStart={handleDragStart}
                                handleDragOver={handleDragOver}
                                handleDragEnd={handleDragEnd}
                                handleTranslateImageAlt={handleTranslateImageAlt}
                                translatingImageAlt={translatingImageAlt}
                            />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="
      px-8 py-5 border-t
      border-gray-100 bg-gray-50/80
      dark:border-gray-800 dark:bg-gray-900/30
    ">

                    <div className="max-w-3xl mx-auto flex justify-end gap-3">
                        <button
                            onClick={close}
                            className="
            cursor-pointer px-6 py-2.5 rounded-xl font-medium transition-all
            border border-gray-200 text-gray-700 hover:bg-white
            dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800
        "
                        >
                            ยกเลิก
                        </button>

                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting || !isFormValid}
                            className="
            cursor-pointer px-6 py-2.5 rounded-xl font-medium
            bg-blue-600 text-white
            shadow-sm shadow-blue-600/20
            transition-all
            hover:bg-blue-700 hover:shadow-md hover:shadow-blue-600/30
            disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:shadow-none
            relative overflow-hidden group
        "
                        >
                            {isSubmitting && (
                                <div
                                    className="absolute inset-0 bg-linear-to-r from-blue-700 via-sky-400 to-blue-700"
                                    style={{
                                        backgroundSize: '200% 100%',
                                        animation: 'shimmer 2s infinite linear',
                                    }}
                                />
                            )}

                            <div className="relative z-10 flex items-center gap-2">
                                {isSubmitting ? (
                                    <>
                                        <div className="relative">
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            <div className="absolute inset-0 w-5 h-5 rounded-full border-2 border-white/30 animate-ping" />
                                        </div>
                                        <span className="animate-pulse">
                                            {editData ? 'กำลังบันทึกการแก้ไข...' : 'กำลังบันทึกผลงาน...'}
                                        </span>
                                        <div className="flex gap-1">
                                            <div
                                                className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"
                                                style={{ animationDelay: '0ms' }}
                                            />
                                            <div
                                                className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"
                                                style={{ animationDelay: '150ms' }}
                                            />
                                            <div
                                                className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"
                                                style={{ animationDelay: '300ms' }}
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <span>
                                            {editData ? 'บันทึกการแก้ไข' : 'บันทึกผลงาน'}
                                        </span>
                                        <Save className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
