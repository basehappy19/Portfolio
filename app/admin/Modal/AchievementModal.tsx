'use client';
import React, {
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
    const categories = useCategories();
    const receivedAt =
        editData?.receivedAt instanceof Date
            ? editData.receivedAt.toISOString().slice(0, 10)
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
        receivedAt: receivedAt,
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
            id: editData?.id,
        };

        if (!validateForm()) {
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

        const status = submitData.isPublished ? 'PUBLIC' : 'DRAFT';

        const payload = {
            ...submitData,
            status,
            images: uploadedImages,
            links: normalizedLinks,
            receivedAt: formData.receivedAt
                ? new Date(formData.receivedAt)
                : null,
        };

        if (submitData.id) {
            await fetch(`/api/admin/achievements/${submitData.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
        } else {
            await fetch(`/api/admin/achievements`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
        }

        close();
    };


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 cursor-pointer backdrop-blur-sm" onClick={close}
            style={{
                animation: isAnimating ? 'modalFadeIn 0.2s ease-out' : 'modalFadeOut 0.2s ease-in'
            }}>
            <div
                style={{
                    animation: isAnimating ? 'modalSlideIn 0.3s ease-out' : 'modalSlideOut 0.2s ease-in'
                }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-[#282c33] rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white dark:bg-[#282c33] border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {editData ? 'แก้ไขผลงาน' : 'เพิ่มผลงานใหม่'}
                    </h2>
                    <button
                        onClick={close}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    {/* ชื่อ (ไทย) */}
                    <AchievementTextField
                        label="ชื่อผลงาน (ไทย)"
                        name="title_th"
                        value={formData.title_th}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur('title_th')}
                        placeholder="เช่น ระบบจัดการคลังสินค้าอัจฉริยะ"
                        required
                        size="lg"
                        error={errors.title_th}
                        touched={touched.title_th}
                    />

                    {/* ชื่อ (EN) */}
                    <AchievementTextField
                        label="ชื่อผลงาน (English)"
                        name="title_en"
                        value={formData.title_en}
                        onChange={handleInputChange}
                        onBlur={() => handleBlur('title_en')}
                        placeholder="Inventory Management System"
                        required
                        size="md"
                        error={errors.title_en}
                        touched={touched.title_en}
                    />

                    {/* รายละเอียด (ไทย) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            รายละเอียด (ไทย)
                        </label>
                        <textarea
                            name="description_th"
                            value={formData.description_th}
                            onChange={handleInputChange}
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                            placeholder="อธิบายรายละเอียดผลงาน..."
                        />
                    </div>

                    {/* รายละเอียด (EN) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            รายละเอียด (English)
                        </label>
                        <textarea
                            name="description_en"
                            value={formData.description_en}
                            onChange={handleInputChange}
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                            placeholder="Describe your project..."
                        />
                    </div>

                    {/* ระดับรางวัล */}
                    <div className="flex gap-2">
                        {/* ระดับรางวัล (TH) */}
                        <div className="w-full md:w-1/2">
                            <AchievementTextField
                                label="ระดับรางวัล (ไทย)"
                                name="awardLevel_th"
                                value={formData.awardLevel_th}
                                onChange={handleInputChange}
                                placeholder="ประเทศ | จังหวัด | เขต"
                                size="md"
                            />
                        </div>

                        {/* ระดับรางวัล (EN) */}
                        <div className="w-full md:w-1/2">
                            <AchievementTextField
                                label="ระดับรางวัล (English)"
                                name="awardLevel_en"
                                value={formData.awardLevel_en}
                                onChange={handleInputChange}
                                placeholder="Country | Province | District"
                                size="md"
                            />
                        </div>
                    </div>

                    {/* สถานที่ */}
                    <div className="flex gap-2">
                        {/* สถานที่ (TH) */}
                        <div className="w-full md:w-1/2">
                            <AchievementTextField
                                label="สถานที่ (ไทย)"
                                name="location_th"
                                value={formData.location_th}
                                onChange={handleInputChange}
                                placeholder="สถานที่"
                                size="md"
                            />
                        </div>

                        {/* สถานที่ (EN) */}
                        <div className="w-full md:w-1/2">
                            <AchievementTextField
                                label="สถานที่ (English)"
                                name="location_en"
                                value={formData.location_en}
                                onChange={handleInputChange}
                                placeholder="Location"
                                size="md"
                            />
                        </div>
                    </div>

                    {/* ได้รับเมื่อ */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            ได้รับเมื่อ
                        </label>
                        <input
                            type="date"
                            name="receivedAt"
                            value={formData.receivedAt ?? ""}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                            placeholder="2025-11-30"
                        />
                    </div>

                    {/* หมวดหมู่ + Sort order */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className={errors.categorySlugs && touched.categorySlugs ? 'error-field' : ''}>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                หมวดหมู่ <span className="text-red-500">*</span>
                                <span className="ml-1 text-xs text-gray-500">
                                    (เลือกได้หลายหมวดหมู่)
                                </span>
                            </label>

                            <select
                                multiple
                                name="categorySlugs"
                                value={formData.categorySlugs}
                                onChange={handleCategoryChange}
                                onBlur={() => handleBlur('categorySlugs')}
                                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white ${errors.categorySlugs && touched.categorySlugs
                                    ? 'border-red-400 bg-red-50 dark:bg-red-900/20'
                                    : 'border-gray-300 dark:border-gray-600'
                                    }`}
                            >
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.slug}>
                                        {cat.name_th} - {cat.name_en}
                                    </option>
                                ))}
                            </select>

                            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                กด Ctrl / Cmd ค้างไว้เพื่อเลือกหลายหมวดหมู่
                            </p>

                            {errors.categorySlugs && touched.categorySlugs && (
                                <div className="flex items-center gap-2 mt-2 text-red-600 dark:text-red-400 text-sm">
                                    <AlertCircle size={16} />
                                    <span>{errors.categorySlugs}</span>
                                </div>
                            )}
                        </div>

                        {/* อีกฝั่งคือ sortOrder ตามเดิม */}
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
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                            />
                        </div>
                    </div>


                    {/* สถานะเผยแพร่ */}
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            name="isPublished"
                            checked={formData.isPublished}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            เผยแพร่ผลงานนี้
                        </label>
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
                    />

                    <AchievementImagesSection
                        imagePreview={imagePreview}
                        draggedIndex={draggedIndex}
                        handleImageUpload={handleImageUpload}
                        handleImageAltChange={handleImageAltChange}
                        handleRemoveImage={handleRemoveImage}
                        handleDragStart={handleDragStart}
                        handleDragOver={handleDragOver}
                        handleDragEnd={handleDragEnd}
                    />

                    {/* Footer Buttons */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <button
                            onClick={close}
                            className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                            ยกเลิก
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                        >
                            {editData ? 'บันทึกการแก้ไข' : 'บันทึกผลงาน'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
