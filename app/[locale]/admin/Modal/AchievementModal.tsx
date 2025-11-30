'use client';
import React, {
    useState,
    ChangeEvent,
    DragEvent,
} from 'react';
import { X, Plus, Trash2, GripVertical } from 'lucide-react';
import { useCategories } from '@/app/contexts/CategoriesContext';
import { useAchievementModal } from '@/app/contexts/AchievementModalContext';
import Image from 'next/image';
import { EditData } from '@/types/Achievements';
import { FormState, ImagePreview, LinkForm, SubmitData } from '@/types/Form';


// ---------- outer component: ใช้ context + เลือก inner ----------
export const AchievementModal = () => {
    const { isOpen, close, editData } = useAchievementModal();

    if (!isOpen) return null;

    return (
        <AchievementModalInner
            key={editData?.id ?? 'new'}
            editData={editData ?? null}
            close={close}
        />
    );
};

// ---------- inner component: มี state ฟอร์ม ----------
const AchievementModalInner = ({
    editData,
    close,
}: {
    editData: EditData | null;
    close: () => void;
}) => {
    const categories = useCategories();
    const receivedAt =
        editData?.receivedAt instanceof Date
            ? editData.receivedAt.toISOString().slice(0, 10) // "YYYY-MM-DD"
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


    const publicBase = process.env.NEXT_PUBLIC_ACHIEVEMENTS_PUBLIC_BASE ?? "/achievements";

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

    const [links, setLinks] = useState<LinkForm[]>(() =>
        editData?.links?.map((link, idx) => ({
            id: link.id,
            label_th: link.label_th ?? '',
            label_en: link.label_en ?? '',
            url: link.url ?? '',
            sortOrder: link.sortOrder ?? idx,
        })) ?? []
    );


    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
    const [draggedLinkIndex, setDraggedLinkIndex] = useState<number | null>(null);

    const uploadImage = async (file: File) => {
        const formDataUpload = new FormData();
        formDataUpload.append("file", file);

        const achievementIdForUpload = editData?.id ?? "_temp";

        const res = await fetch(
            `/api/uploads?achievementId=${achievementIdForUpload}`,
            {
                method: "POST",
                body: formDataUpload,
            }
        );

        if (!res.ok) {
            throw new Error("Upload image failed");
        }

        const json = (await res.json()) as { fileName: string; url: string };

        return json;
    };


    const handleAchievementSubmit = async (data: SubmitData) => {
        const status = data.isPublished ? "PUBLIC" : "DRAFT";

        const uploadedImages = await Promise.all(
            (data.images ?? []).map(async (img) => {
                if (img.file instanceof File) {
                    const { fileName } = await uploadImage(img.file);
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

        const normalizedLinks = (data.links ?? []).map((link) => ({
            id: link.id,
            label_th: link.label_th,
            label_en: link.label_en,
            url: link.url,
            sortOrder: link.sortOrder ?? 0,
        }));

        const payload = {
            ...data,
            status,
            images: uploadedImages,
            links: normalizedLinks,
            receivedAt: formData.receivedAt
                ? new Date(formData.receivedAt)
                : null,
        };

        if (data.id) {
            await fetch(`/api/admin/achievements/${data.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            console.log(payload);

        } else {
            await fetch(`/api/admin/achievements`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
        }
    };


    const handleInputChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const target = e.target;
        const name = target.name;

        let value: string | number | boolean = target.value;

        if (target instanceof HTMLInputElement && target.type === 'checkbox') {
            value = target.checked;
        }

        if (target instanceof HTMLInputElement && target.type === 'number') {
            value = Number(target.value);
        }

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


    const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const values = Array.from(e.target.selectedOptions, (opt) => opt.value);
        setFormData((prev) => ({
            ...prev,
            categorySlugs: values,
        }));
    };

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);
        const newImages: ImagePreview[] = files.map((file, index) => ({
            file,
            preview: URL.createObjectURL(file),
            altText_th: '',
            altText_en: '',
            sortOrder: imagePreview.length + index,
        }));

        setImagePreview((prev) => [...prev, ...newImages]);
    };

    const handleImageAltChange = (
        index: number,
        field: 'altText_th' | 'altText_en',
        value: string
    ) => {
        setImagePreview((prev) => {
            const updated = [...prev];
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    };

    const handleRemoveImage = (index: number) => {
        setImagePreview((prev) => prev.filter((_, i) => i !== index));
    };

    const handleDragStart = (e: DragEvent<HTMLDivElement>, index: number) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>, index: number) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;

        const newImages = [...imagePreview];
        const draggedItem = newImages[draggedIndex];
        newImages.splice(draggedIndex, 1);
        newImages.splice(index, 0, draggedItem);

        setImagePreview(newImages);
        setDraggedIndex(index);
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
        setImagePreview((prev) =>
            prev.map((img, idx) => ({
                ...img,
                sortOrder: idx,
            }))
        );
    };

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

    const handleSubmit = () => {
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


        void handleAchievementSubmit(submitData);
        // close();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white dark:bg-[#282c33] rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
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
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            ชื่อผลงาน (ไทย) <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="title_th"
                            value={formData.title_th}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                            placeholder="ระบบจัดการคลังสินค้า"
                        />
                    </div>

                    {/* ชื่อ (EN) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            ชื่อผลงาน (English) <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="title_en"
                            value={formData.title_en}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                            placeholder="Inventory Management System"
                        />
                    </div>

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
                        <div className='w-full md:w-1/2'>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                ระดับรางวัล (ไทย)
                            </label>
                            <input
                                type="text"
                                name="awardLevel_th"
                                value={formData.awardLevel_th}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                                placeholder="ประเทศ | จังหวัด | เขต"
                            />
                        </div>

                        {/* ระดับรางวัล (EN) */}
                        <div className='w-full md:w-1/2'>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                ระดับรางวัล (English) <span className="text-red-500"></span>
                            </label>
                            <input
                                type="text"
                                name="awardLevel_en"
                                value={formData.awardLevel_en}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                                placeholder="Country | Province | District"
                            />
                        </div>
                    </div>

                    {/* สถานที่ */}
                    <div className="flex gap-2">
                        {/* สถานที่ (TH) */}
                        <div className='w-full md:w-1/2'>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                สถานที่ (ไทย) <span className="text-red-500"></span>
                            </label>
                            <input
                                type="text"
                                name="location_th"
                                value={formData.location_th}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                                placeholder="สถานที่"
                            />
                        </div>

                        {/* สถานที่ (EN) */}
                        <div className='w-full md:w-1/2'>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                สถานที่ (English) <span className="text-red-500"></span>
                            </label>
                            <input
                                type="text"
                                name="location_en"
                                value={formData.location_en}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                                placeholder="Location"
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
                        <div>
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
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
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
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                ลิงก์ที่เกี่ยวข้อง
                            </label>
                            <button
                                type="button"
                                onClick={addLink}
                                className="text-sm px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                + เพิ่มลิงก์
                            </button>
                        </div>

                        {links.length === 0 ? (
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                ยังไม่มีลิงก์ที่เกี่ยวข้อง กดปุ่ม &quot;เพิ่มลิงก์&quot; เพื่อเพิ่ม
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {links.map((link, index) => (
                                    <div
                                        key={`${link.id ?? 'new'}-${index}`}
                                        draggable
                                        onDragStart={(e) => handleLinkDragStart(e, index)}
                                        onDragOver={(e) => handleLinkDragOver(e, index)}
                                        onDragEnd={handleLinkDragEnd}
                                        className={`p-3 border rounded-lg bg-gray-50 dark:bg-gray-800 space-y-2 ${draggedLinkIndex === index
                                            ? 'border-blue-500'
                                            : 'border-gray-200 dark:border-gray-700'
                                            }`}
                                    >
                                        <div className="flex justify-between items-center">
                                            <span className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                                                <GripVertical className="text-gray-400" size={14} />
                                                ลิงก์ที่ {index + 1}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => removeLink(index)}
                                                className="text-red-500 hover:text-red-700 text-xs flex items-center gap-1"
                                            >
                                                <Trash2 size={14} />
                                                ลบลิงก์นี้
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
                                                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                                            />
                                            <input
                                                type="text"
                                                placeholder="ชื่อปุ่ม (English)"
                                                value={link.label_en}
                                                onChange={(e) =>
                                                    handleLinkChange(index, 'label_en', e.target.value)
                                                }
                                                className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                                            />
                                        </div>

                                        <input
                                            type="text"
                                            placeholder="URL (เช่น https://...)"
                                            value={link.url}
                                            onChange={(e) =>
                                                handleLinkChange(index, 'url', e.target.value)
                                            }
                                            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    {/* ส่วนจัดการรูปภาพ */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            รูปภาพ (ลากเพื่อเรียงลำดับ)
                        </label>
                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageUpload}
                                className="hidden"
                                id="image-upload"
                            />
                            <label
                                htmlFor="image-upload"
                                className="flex flex-col items-center justify-center cursor-pointer py-4"
                            >
                                <Plus size={32} className="text-gray-400 mb-2" />
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    คลิกเพื่อเลือกรูปภาพ (สามารถเลือกได้หลายรูป)
                                </span>
                            </label>
                        </div>

                        {imagePreview.length > 0 && (
                            <div className="mt-4 space-y-3">
                                {imagePreview.map((img, index) => (
                                    <div
                                        key={index}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, index)}
                                        onDragOver={(e) => handleDragOver(e, index)}
                                        onDragEnd={handleDragEnd}
                                        className={`flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border ${draggedIndex === index
                                            ? 'border-blue-500'
                                            : 'border-gray-200 dark:border-gray-700'
                                            } cursor-move`}
                                    >
                                        <GripVertical
                                            size={20}
                                            className="text-gray-400 mt-2 shrink-0"
                                        />
                                        <Image
                                            src={img.preview}
                                            alt={img.altText_th || img.altText_en}
                                            className="w-24 h-24 object-cover rounded shrink-0"
                                            width={96}
                                            height={96}
                                        />
                                        <div className="flex-1 space-y-2">
                                            <input
                                                type="text"
                                                placeholder="Alt text (ไทย)"
                                                value={img.altText_th}
                                                onChange={(e) =>
                                                    handleImageAltChange(
                                                        index,
                                                        'altText_th',
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                                            />
                                            <input
                                                type="text"
                                                placeholder="Alt text (English)"
                                                value={img.altText_en}
                                                onChange={(e) =>
                                                    handleImageAltChange(
                                                        index,
                                                        'altText_en',
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                                            />
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                ลำดับ: {index + 1}
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImage(index)}
                                            className="text-red-500 hover:text-red-700 shrink-0"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

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
