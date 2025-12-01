"use client";

import { useState } from "react";
import { EditData } from "@/types/Achievements";
import { LinkForm } from "@/types/Form";

type Props = {
    editData: EditData | null;
    links: LinkForm[];
    setLinks: React.Dispatch<React.SetStateAction<LinkForm[]>>;
};

export const useLinkTranslation = ({ editData, links, setLinks }: Props) => {
    const isEditMode = !!editData;
    const [translatingLink, setTranslatingLink] = useState<
        Record<number, boolean>
    >({});

    const handleLinkThaiBlur = async (index: number) => {
        if (isEditMode) return;

        const current = links[index];
        if (!current?.label_th?.trim()) return;

        setTranslatingLink((prev) => ({ ...prev, [index]: true }));

        try {
            const res = await fetch("/api/translate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: current.label_th.trim() }),
            });

            if (res.ok) {
                const data = await res.json();
                const translated = data.translated || "";

                setLinks((prev) => {
                    const updated = [...prev];
                    if (!updated[index]) return prev;
                    updated[index] = {
                        ...updated[index],
                        label_en: translated,
                    };
                    return updated;
                });
            }
        } catch (e) {
            console.error("translate link error", e);
        } finally {
            setTranslatingLink((prev) => ({ ...prev, [index]: false }));
        }
    };

    return {
        translatingLink,
        handleLinkThaiBlur,
    };
};
