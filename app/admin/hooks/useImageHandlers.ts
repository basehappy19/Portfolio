import { ChangeEvent, DragEvent, Dispatch, SetStateAction } from "react";
import { ImagePreview } from "@/types/Form";

type Params = {
    imagePreview: ImagePreview[];
    setImagePreview: Dispatch<SetStateAction<ImagePreview[]>>;
    draggedIndex: number | null;
    setDraggedIndex: Dispatch<SetStateAction<number | null>>;
};

export const useImageHandlers = ({
    imagePreview,
    setImagePreview,
    draggedIndex,
    setDraggedIndex,
}: Params) => {
    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files ?? []);

        setImagePreview((prev) => {
            const baseIndex = prev.length;
            const newImages: ImagePreview[] = files.map((file, index) => ({
                file,
                preview: URL.createObjectURL(file),
                altText_th: "",
                altText_en: "",
                sortOrder: baseIndex + index,
            }));

            return [...prev, ...newImages];
        });
    };

    const handleImageAltChange = (
        index: number,
        field: "altText_th" | "altText_en",
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
        e.dataTransfer.effectAllowed = "move";
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

    return {
        handleImageUpload,
        handleImageAltChange,
        handleRemoveImage,
        handleDragStart,
        handleDragOver,
        handleDragEnd,
    };
};
