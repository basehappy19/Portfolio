'use client';
import {
    useState,
    DragEvent,
} from 'react';
import { X, AlertCircle } from 'lucide-react';
import { useCategories } from '@/app/contexts/CategoriesContext';
import { useAchievementModal } from '@/app/contexts/AchievementModalContext';
import { EditData } from '@/types/Achievements';
import { FormState, ImagePreview, LinkForm, SubmitData } from '@/types/Form';
import { uploadAchievementImage } from '../lib/uploadAchievementImage';
import { useAchievementFormHandlers } from '../hooks/useAchievementFormHandlers';
import { useImageHandlers } from '../hooks/useImageHandlers';
import { AchievementLinksSection } from '../AchievementLinksSection';
import { AchievementImagesSection } from '../AchievementImagesSection';
import { TouchedState, ValidationErrors } from '../types/achievementValidation';
import { AchievementTextField } from '../AchievementTextField';
import { useRouter } from 'next/navigation';
import { createAchievement, updateAchievement } from '../services/achievements';
import toast from 'react-hot-toast';
import { AchievementTextarea } from '../AchievementTextarea';
import { useAchievementTextTranslation } from '../hooks/useAchievementTextTranslation';
import { useLinkTranslation } from '../hooks/useLinkTranslation';
import { useImageAltTranslation } from '../hooks/useImageAltTranslation';

const publicBase = process.env.NEXT_PUBLIC_ACHIEVEMENTS_PUBLIC_BASE ?? "/achievements";


export const AchievementModal = () => {
    const { isOpen, close, editData, isAnimating } = useAchievementModal();

    if (!isOpen) return null;

    return (
        <AchievementModalInner
            key={editData?.id ?? 'new'}
            editData={editData ?? null}
            close={close}
            isAnimating={isAnimating}
        />
    );
};


const AchievementModalInner = ({
    editData,
    close,
    isAnimating
}: {
    editData: EditData | null;
    close: () => void;
    isAnimating: boolean
}) => {
    const router = useRouter();
    const categories = useCategories();
    const receivedAt =
        editData?.receivedAt instanceof Date
            ? editData.receivedAt.toISOString().slice(0, 10) // -> "2025-12-01"
            : editData?.receivedAt ?? "";
            
    const [formData, setFormData] = useState<FormState>(() => ({
        title_th: editData?.title_th ?? '',
        title_en: editData?.title_en ?? '',
        description_th: editData?.description_th ?? '',
        description_en: editData?.description_en ?? '',
        awardLevel_th: editData?.awardLevel_th ?? '',
        awardLevel_en: editData?.awardLevel_en ?? '',
        location_th: editData?.location_th ?? '',
        location_en: editData?.location_en ?? '',
        receivedAt,
        categorySlugs: editData?.categories?.map((c) => c.category.slug) ?? [],
        sortOrder: Number(editData?.sortOrder ?? 0),
        isPublished: editData ? editData.status === 'PUBLIC' : true,
    }));
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [touched, setTouched] = useState<TouchedState>({
        title_th: false,
        title_en: false,
        categorySlugs: false,
    });

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
        editData?.images?.map((img, idx) => ({
            id: img.id,
            file: undefined,
            preview: `${publicBase}/${editData.id}/${img.url}`,
            altText_th: img.altText_th ?? "",
            altText_en: img.altText_en ?? "",
            sortOrder: img.sortOrder ?? idx,
        })) ?? []
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
            sortOrder: link.sortOrder ?? idx,
        })) ?? []
    );

    const { translating, handleThaiBlur } = useAchievementTextTranslation({
        editData,
        formData,
        setFormData,
        handleBlur,
    });

    const { translatingLink, handleLinkThaiBlur } = useLinkTranslation({
        editData,
        links,
        setLinks,
    });

    const { translatingImageAlt, handleImageAltThaiBlur } = useImageAltTranslation({
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
                sortOrder: idx,
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
                sortOrder: prev.length,
            },
        ]);
    };

    const removeLink = (index: number) => {
        setLinks(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        const submitData: SubmitData = {
            ...formData,
            images: imagePreview.map((img, idx) => ({
                ...img,
                sortOrder: idx,
            })),
            links: links.map((link, idx) => ({
                ...link,
                sortOrder: idx,
            })),
            status: formData.isPublished ? 'PUBLIC' : 'DRAFT',
            id: editData?.id,
        };

        if (!validateForm()) {
            toast.error("กรุณากรอกข้อมูลให้ครบถ้วน");

            const firstError = document.querySelector('.error-field');
            firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });

            return;
        }

        const { id: achievementId } = editData ?? {};

        const uploadedImages = await Promise.all(
            (submitData.images ?? []).map(async (img) => {
                if (img.file instanceof File) {
                    const { fileName } = await uploadAchievementImage(
                        img.file,
                        achievementId ?? null
                    );
                    return {
                        id: img.id,
                        preview: fileName,
                        altText_th: img.altText_th ?? null,
                        altText_en: img.altText_en ?? null,
                        sortOrder: img.sortOrder ?? 0,
                    };
                }

                return {
                    id: img.id,
                    preview: img.preview,
                    altText_th: img.altText_th ?? null,
                    altText_en: img.altText_en ?? null,
                    sortOrder: img.sortOrder ?? 0,
                };
            })
        );

        const normalizedLinks = (submitData.links ?? []).map((link) => ({
            id: link.id,
            label_th: link.label_th,
            label_en: link.label_en,
            url: link.url,
            sortOrder: link.sortOrder ?? 0,
        }));


        const payload: SubmitData = {
            ...submitData,
            images: uploadedImages,
            links: normalizedLinks,
            receivedAt: formData.receivedAt
                ? new Date(formData.receivedAt).toISOString()
                : undefined,
        };


        try {
            if (submitData.id) {
                await updateAchievement(submitData.id, payload);
                toast.success('แก้ไขผลงานเรียบร้อย');
            } else {
                await createAchievement(payload);
                toast.success('เพิ่มผลงานเรียบร้อย');
            }
        } catch (error) {
            console.error(error);
            toast.error('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
        }

        router.refresh();
        close();
    };


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 cursor-pointer backdrop-blur-sm bg-black/20"
            onClick={close}
            style={{
                animation: isAnimating ? 'modalFadeIn 0.2s ease-out' : 'modalFadeOut 0.2s ease-in'
            }}>
            <div
                style={{
                    animation: isAnimating ? 'modalSlideIn 0.3s ease-out' : 'modalSlideOut 0.2s ease-in'
                }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-[#1e222a] rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">

                {/* Header - Minimal & Clean */}
                <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-800">
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
                            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Body - Scrollable */}
                <div className="overflow-y-auto flex-1 px-8 py-6">
                    <div className="max-w-3xl mx-auto space-y-8">

                        {/* Section: ข้อมูลหลัก */}
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
                                onBlur={() => handleThaiBlur('title_th')}
                                placeholder="ชื่อผลงาน"
                                required
                                size="lg"
                                error={errors.title_th}
                                touched={touched.title_th}
                                isTranslating={!!translating.title_th}
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

                            <AchievementTextarea
                                label="รายละเอียด (ไทย)"
                                name="description_th"
                                value={formData.description_th}
                                onChange={handleInputChange}
                                onBlur={() => handleThaiBlur('description_th')}
                                placeholder="อธิบายรายละเอียดผลงาน..."
                                rows={4}
                                isTranslating={!!translating.description_th}
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

                        {/* Section: ข้อมูลรางวัล */}
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
                                    onBlur={() => handleThaiBlur('awardLevel_th')}
                                    placeholder="ประเทศ | จังหวัด | เขต"
                                    size="md"
                                    isTranslating={!!translating.awardLevel_th}
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
                                    onBlur={() => handleThaiBlur('location_th')}
                                    placeholder="สถานที่"
                                    size="md"
                                    isTranslating={!!translating.location_th}
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

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    ได้รับเมื่อ
                                </label>
                                <input
                                    type="date"
                                    name="receivedAt"
                                    value={formData.receivedAt ?? ""}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-gray-800/50 dark:text-white transition-all"
                                    placeholder="2025-11-30"
                                />
                            </div>
                        </div>

                        {/* Section: การจัดการ */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-1 h-6 bg-emerald-500 rounded-full"></div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                    การจัดการ
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className={errors.categorySlugs && touched.categorySlugs ? 'error-field' : ''}>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        หมวดหมู่ <span className="text-red-500">*</span>
                                    </label>

                                    <select
                                        multiple
                                        name="categorySlugs"
                                        value={formData.categorySlugs}
                                        onChange={handleCategoryChange}
                                        onBlur={() => handleBlur('categorySlugs')}
                                        className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500/20 dark:bg-gray-800/50 dark:text-white transition-all ${errors.categorySlugs && touched.categorySlugs
                                            ? 'border-red-400 bg-red-50 dark:bg-red-900/20 focus:border-red-500'
                                            : 'border-gray-200 dark:border-gray-700 focus:border-blue-500'
                                            }`}
                                    >
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.slug}>
                                                {cat.name_th} - {cat.name_en}
                                            </option>
                                        ))}
                                    </select>

                                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                        💡 กด Ctrl / Cmd ค้างไว้เพื่อเลือกหลายหมวดหมู่
                                    </p>

                                    {errors.categorySlugs && touched.categorySlugs && (
                                        <div className="flex items-center gap-2 mt-2 text-red-600 dark:text-red-400 text-sm">
                                            <AlertCircle size={16} />
                                            <span>{errors.categorySlugs}</span>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        ลำดับการแสดงผล
                                    </label>
                                    <input
                                        type="number"
                                        name="sortOrder"
                                        value={formData.sortOrder}
                                        onChange={handleInputChange}
                                        min={0}
                                        className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:bg-gray-800/50 dark:text-white transition-all"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/30 rounded-xl border border-gray-100 dark:border-gray-800">
                                <input
                                    type="checkbox"
                                    name="isPublished"
                                    checked={formData.isPublished}
                                    onChange={handleInputChange}
                                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
                                />
                                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer select-none">
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
                                handleLinkThaiBlur={handleLinkThaiBlur}
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
                                handleImageAltThaiBlur={handleImageAltThaiBlur}
                                translatingImageAlt={translatingImageAlt}
                            />
                        </div>
                    </div>
                </div>

                {/* Footer - Fixed at Bottom */}
                <div className="px-8 py-5 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/30">
                    <div className="max-w-3xl mx-auto flex justify-end gap-3">
                        <button
                            onClick={close}
                            className="cursor-pointer px-6 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 font-medium transition-all"
                        >
                            ยกเลิก
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="cursor-pointer px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium shadow-sm shadow-blue-600/20 hover:shadow-md hover:shadow-blue-600/30 transition-all"
                        >
                            {editData ? 'บันทึกการแก้ไข' : 'บันทึกผลงาน'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
