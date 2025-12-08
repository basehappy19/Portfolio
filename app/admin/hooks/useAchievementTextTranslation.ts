"use client";

import { useRef, useState } from "react";
import { EditData } from "@/types/Achievements";
import { FormState } from "@/types/Form";
import { TouchedState } from "../types/achievementValidation";

type Props = {
    editData: EditData | null;
    formData: FormState;
    setFormData: React.Dispatch<React.SetStateAction<FormState>>;
    handleBlur: (field: keyof TouchedState) => void;
};

export const useAchievementTextTranslation = ({
    editData,
    formData,
    setFormData,
    handleBlur,
}: Props) => {
    const isEditMode = !!editData;

    const [translating, setTranslating] = useState<
        Partial<Record<keyof FormState, boolean>>
    >({});

    const [lastTranslatedSource, setLastTranslatedSource] = useState<
        Partial<Record<keyof FormState, string>>
    >({});

    // debounce แยก field
    const translateTimers = useRef<Partial<Record<keyof FormState, number>>>(
        {}
    );

    const FIELD_PAIRS: { th: keyof FormState; en: keyof FormState }[] = [
        { th: "title_th", en: "title_en" },
        { th: "description_th", en: "description_en" },
        { th: "awardLevel_th", en: "awardLevel_en" },
        { th: "location_th", en: "location_en" },
        { th: "given_by_th", en: "given_by_en" },
    ];

    const isTouchedKey = (
        field: keyof FormState
    ): field is keyof TouchedState => {
        return ["title_th", "title_en", "categorySlugs"].includes(
            field as string
        );
    };

    const translateField = async (
        source: keyof FormState,
        target: keyof FormState,
        value: string
    ) => {
        try {
            setTranslating((prev) => ({
                ...prev,
                [source]: true,
            }));

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

    const handleThaiBlur = (field: keyof FormState) => {
        if (isTouchedKey(field)) {
            handleBlur(field);
        }

        if (isEditMode) return;

        const pair = FIELD_PAIRS.find((p) => p.th === field);
        if (!pair) return;

        const sourceKey = pair.th;
        const targetKey = pair.en;

        const raw = formData[sourceKey];

        if (typeof raw !== "string" || !raw.trim()) return;

        const value = raw;

        if (lastTranslatedSource[sourceKey] === value) return;

        if (translateTimers.current[field]) {
            clearTimeout(translateTimers.current[field]!);
        }

        translateTimers.current[field] = window.setTimeout(() => {
            translateField(sourceKey, targetKey, value);
        }, 250);
    };

    return {
        translating,
        handleThaiBlur,
    };
};
