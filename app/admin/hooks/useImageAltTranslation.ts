"use client";

import { useState } from "react";
import { EditData } from "@/types/Achievements";
import { ImagePreview } from "@/types/Form";

type Props = {
    editData: EditData | null;
    imagePreview: ImagePreview[];
    setImagePreview: React.Dispatch<React.SetStateAction<ImagePreview[]>>;
};

export const useImageAltTranslation = ({
    editData,
    imagePreview,
    setImagePreview,
}: Props) => {
    const isEditMode = !!editData;
    const [translatingImageAlt, setTranslatingImageAlt] = useState<
        Record<number, boolean>
    >({});

    const handleImageAltThaiBlur = async (index: number) => {
        if (isEditMode) return;

        const current = imagePreview[index];
        if (!current?.altText_th?.trim()) return;

        setTranslatingImageAlt((prev) => ({ ...prev, [index]: true }));

        try {
            const res = await fetch("/api/translate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: current.altText_th.trim() }),
            });

            if (res.ok) {
                const data = await res.json();
                const translated = data.translated || "";

                setImagePreview((prev) => {
                    const updated = [...prev];
                    if (!updated[index]) return prev;
                    updated[index] = {
                        ...updated[index],
                        altText_en: translated,
                    };
                    return updated;
                });
            }
        } catch (e) {
            console.error("translate image alt error", e);
        } finally {
            setTranslatingImageAlt((prev) => ({ ...prev, [index]: false }));
        }
    };

    return {
        translatingImageAlt,
        handleImageAltThaiBlur,
    };
};
