"use client";

import { useRef, useState } from "react";
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

    const [lastTranslatedTh, setLastTranslatedTh] = useState<
        Record<number, string>
    >({});

    const timers = useRef<Record<number, number>>({});

    const translateLabel = async (index: number, textTh: string) => {
        try {
            setTranslatingLink((prev) => ({ ...prev, [index]: true }));

            const res = await fetch("/api/translate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: textTh }),
            });

            if (!res.ok) throw new Error("translate failed");

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

            setLastTranslatedTh((prev) => ({
                ...prev,
                [index]: textTh,
            }));
        } catch (e) {
            console.error("translate link error", e);
        } finally {
            setTranslatingLink((prev) => ({ ...prev, [index]: false }));
        }
    };

    const handleLinkThaiBlur = (index: number) => {
        if (isEditMode) return;

        const current = links[index];
        const raw = current?.label_th;

        if (typeof raw !== "string") return;

        const textTh = raw.trim();
        if (!textTh) return;

        if (lastTranslatedTh[index] === textTh) return;

        if (timers.current[index]) {
            clearTimeout(timers.current[index]);
        }

        timers.current[index] = window.setTimeout(() => {
            translateLabel(index, textTh);
        }, 250);
    };

    return {
        translatingLink,
        handleLinkThaiBlur,
    };
};
