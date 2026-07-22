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
                clientId: crypto.randomUUID(), 
                sortOrder: baseIndex + index + 1,
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
            if (!updated[index]) return prev;
            updated[index] = { ...updated[index], [field]: value };
            return updated;
        });
    };

    const handleRemoveImage = (index: number) => {
        setImagePreview((prev) =>
            prev
                .filter((_, i) => i !== index)
                .map((img, idx) => ({
                    ...img,
                    sortOrder: idx + 1,
                }))
        );
    };

    const handleReplaceImage = (
        index: number,
        e: ChangeEvent<HTMLInputElement>
    ) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setImagePreview((prev) => {
            const updated = [...prev];
            const oldImg = updated[index];
            if (!oldImg) return prev;

            updated[index] = {
                ...oldImg,
                file,
                preview: URL.createObjectURL(file),
                id: undefined, // Clear ID so backend treats it as new and deletes old image record + file
            };
            return updated;
        });
    };

    const handleDragStart = (e: DragEvent<HTMLElement>, index: number) => {
        setDraggedIndex(index);
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (e: DragEvent<HTMLElement>, index: number) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;

        const newImages = [...imagePreview];
        const draggedItem = newImages[draggedIndex];
        if (!draggedItem) return;

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
                sortOrder: idx + 1,
            }))
        );
    };

    const handleMoveImage = (fromIndex: number, toIndex: number) => {
        setImagePreview((prev) => {
            const newImages = [...prev];
            const item = newImages[fromIndex];
            if (!item) return prev;
            newImages.splice(fromIndex, 1);
            newImages.splice(toIndex, 0, item);
            return newImages.map((img, idx) => ({
                ...img,
                sortOrder: idx + 1,
            }));
        });
    };

    return {
        handleImageUpload,
        handleReplaceImage,
        handleImageAltChange,
        handleRemoveImage,
        handleDragStart,
        handleDragOver,
        handleDragEnd,
        handleMoveImage,
    };
};

