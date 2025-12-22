"use client";

import { useState } from "react";
import { EditData } from "@/types/Achievements";
import { FormState } from "@/types/Form";

type Props = {
    editData: EditData | null;
    formData: FormState;
    setFormData: React.Dispatch<React.SetStateAction<FormState>>;
};

// 1. เพิ่ม Type เพื่อให้ระบุได้ว่าช่องไหนเป็น Rich Text
type FieldPair = {
    th: keyof FormState;
    en: keyof FormState;
    isRichText?: boolean; // เพิ่ม option นี้
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

    // 2. กำหนดว่า description คือ Rich Text
    const FIELD_PAIRS: FieldPair[] = [
        { th: "title_th", en: "title_en", isRichText: false },
        { th: "description_th", en: "description_en", isRichText: true }, // สำคัญ!
        { th: "awardLevel_th", en: "awardLevel_en", isRichText: false },
        { th: "location_th", en: "location_en", isRichText: false },
        { th: "given_by_th", en: "given_by_en", isRichText: false },
    ];

    const translateField = async (
        source: keyof FormState,
        target: keyof FormState,
        value: string,
        isRichText: boolean = false // รับค่านี้เข้ามา
    ) => {
        try {
            setTranslating((prev) => ({ ...prev, [source]: true }));

            // 3. ส่ง flag isRichText ไปที่ API
            const res = await fetch("/api/translate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    text: value, 
                    isRichText: isRichText 
                }),
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

    const handleTranslate = (field: keyof FormState) => {
        const pair = FIELD_PAIRS.find((p) => p.th === field);
        if (!pair) return;

        const sourceKey = pair.th;
        const targetKey = pair.en;

        const raw = formData[sourceKey];
        if (typeof raw !== "string" || !raw.trim()) return;

        const value = raw;

        if (lastTranslatedSource[sourceKey] === value) return;

        translateField(sourceKey, targetKey, value, pair.isRichText);
    };

    return {
        translating,
        handleTranslate,
    };
};