"use client";

import { useState } from "react";
import { EditData } from "@/types/Achievements";
import { FormState } from "@/types/Form";

type Props = {
    editData: EditData | null;
    formData: FormState;
    setFormData: React.Dispatch<React.SetStateAction<FormState>>;
};

export const useAchievementTextTranslation = ({
    formData,
    setFormData,
}: Props) => {
    const [translating, setTranslating] = useState<
        Partial<Record<keyof FormState, boolean>>
    >({});

    const [lastTranslatedSource, setLastTranslatedSource] = useState<
        Partial<Record<keyof FormState, string>>
    >({});

    const FIELD_PAIRS: { th: keyof FormState; en: keyof FormState }[] = [
        { th: "title_th", en: "title_en" },
        { th: "description_th", en: "description_en" },
        { th: "awardLevel_th", en: "awardLevel_en" },
        { th: "location_th", en: "location_en" },
        { th: "given_by_th", en: "given_by_en" },
    ];

    const translateField = async (
        source: keyof FormState,
        target: keyof FormState,
        value: string
    ) => {
        try {
            setTranslating((prev) => ({ ...prev, [source]: true }));

            const res = await fetch("/api/translate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: value }),
            });

            if (!res.ok) throw new Error("Translate failed");

            const data = await res.json();
            const translated = data.translated || "";

            setFormData((prev) => ({
                ...prev,
                [target]: translated,
            }));

            setLastTranslatedSource((prev) => ({
                ...prev,
                [source]: value,
            }));
        } catch (e) {
            console.error("translate error:", e);
        } finally {
            setTranslating((prev) => ({
                ...prev,
                [source]: false,
            }));
        }
    };

    // เรียกตอนกดปุ่มแปล
    const handleTranslate = (field: keyof FormState) => {
        const pair = FIELD_PAIRS.find((p) => p.th === field);
        if (!pair) return;

        const sourceKey = pair.th;
        const targetKey = pair.en;

        const raw = formData[sourceKey];
        if (typeof raw !== "string" || !raw.trim()) return;

        const value = raw;

        // กัน spam แปลซ้ำข้อความเดิม (จะรักษาไว้หรือจะลบก็ได้)
        if (lastTranslatedSource[sourceKey] === value) return;

        translateField(sourceKey, targetKey, value);
    };

    return {
        translating,
        handleTranslate,
    };
};
