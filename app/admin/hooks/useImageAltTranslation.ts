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
    imagePreview,
    setImagePreview,
}: Props) => {
    const [translatingImageAlt, setTranslatingImageAlt] = useState<
        Record<number, boolean>
    >({});

    const [lastTranslatedTh, setLastTranslatedTh] = useState<
        Record<number, string>
    >({});

    const translateAlt = async (index: number) => {
        const current = imagePreview[index];
        const raw = current?.altText_th;

        if (typeof raw !== "string") return;

        const textTh = raw.trim();
        if (!textTh) return;

        if (lastTranslatedTh[index] === textTh) return;

        try {
            setTranslatingImageAlt((prev) => ({ ...prev, [index]: true }));

            const res = await fetch("/api/translate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: textTh }),
            });

            if (!res.ok) throw new Error("translate failed");

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

            setLastTranslatedTh((prev) => ({
                ...prev,
                [index]: textTh,
            }));
        } catch (e) {
            console.error("translate image alt error", e);
        } finally {
            setTranslatingImageAlt((prev) => ({ ...prev, [index]: false }));
        }
    };

    return {
        translatingImageAlt,
        handleTranslateImageAlt: translateAlt,
    };
};
