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
    // ใช้ string key แทน number
    const [translatingImageAlt, setTranslatingImageAlt] = useState<
        Record<string, boolean>
    >({});

    const [lastTranslatedTh, setLastTranslatedTh] = useState<
        Record<string, string>
    >({});

    const translateAlt = async (index: number) => {
        const current = imagePreview[index];
        if (!current) return;

        const key =
            current.id ?? current.clientId ?? current.preview ?? String(index);

        const raw = current.altText_th;
        if (typeof raw !== "string") return;

        const textTh = raw.trim();
        if (!textTh) return;

        if (lastTranslatedTh[key] === textTh) return;

        try {
            setTranslatingImageAlt((prev) => ({ ...prev, [key]: true }));

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
                [key]: textTh,
            }));
        } catch (e) {
            console.error("translate image alt error", e);
        } finally {
            setTranslatingImageAlt((prev) => ({ ...prev, [key]: false }));
        }
    };


    return {
        translatingImageAlt,
        handleTranslateImageAlt: translateAlt,
    };
};
