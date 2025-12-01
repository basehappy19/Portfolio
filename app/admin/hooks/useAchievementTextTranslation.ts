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

    const translateTimers = useRef<Partial<Record<keyof FormState, number>>>(
        {}
    );

    const FIELD_PAIRS: { th: keyof FormState; en: keyof FormState }[] = [
        { th: "title_th", en: "title_en" },
        { th: "description_th", en: "description_en" },
        { th: "awardLevel_th", en: "awardLevel_en" },
        { th: "location_th", en: "location_en" },
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
        target: keyof FormState
    ) => {
        const text = formData[source];
        if (!text) return;

        try {
            const res = await fetch("/api/translate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text }),
            });

            if (!res.ok) return;

            const data = await res.json();

            setFormData((prev) => ({
                ...prev,
                [target]: data.translated || "",
            }));
        } catch (e) {
            console.error("translate error", e);
        }
    };

    const handleThaiBlur = (field: keyof FormState) => {
        // validate ตามเดิม
        if (isTouchedKey(field)) {
            handleBlur(field);
        }

        // โหมดแก้ไข ไม่ต้องแปล
        if (isEditMode) return;

        const pair = FIELD_PAIRS.find((p) => p.th === field);
        if (!pair) return;

        const sourceKey = pair.th;
        const targetKey = pair.en;

        const currentSource = formData[sourceKey];
        if (!currentSource) return;

        if (lastTranslatedSource[sourceKey] === currentSource) return;

        // clear timer เดิม
        if (translateTimers.current[field]) {
            clearTimeout(translateTimers.current[field]!);
        }

        translateTimers.current[field] = window.setTimeout(async () => {
            setTranslating((prev) => ({
                ...prev,
                [sourceKey]: true,
            }));

            await translateField(sourceKey, targetKey);

            setLastTranslatedSource((prev) => ({
                ...prev,
                [sourceKey]: currentSource,
            }));

            setTranslating((prev) => ({
                ...prev,
                [sourceKey]: false,
            }));
        }, 700);
    };

    return {
        translating,
        handleThaiBlur,
    };
};
