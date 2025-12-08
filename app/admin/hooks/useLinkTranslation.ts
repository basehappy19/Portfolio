"use client";

import { useState } from "react";
import { LinkForm } from "@/types/Form";

type Props = {
    links: LinkForm[];
    setLinks: React.Dispatch<React.SetStateAction<LinkForm[]>>;
};

export const useLinkTranslation = ({ links, setLinks }: Props) => {
    const [translatingLink, setTranslatingLink] = useState<
        Record<number, boolean>
    >({});

    const [lastTranslatedTh, setLastTranslatedTh] = useState<
        Record<number, string>
    >({});

    const translateLabel = async (index: number) => {
        const current = links[index];
        const raw = current?.label_th;

        if (typeof raw !== "string") return;

        const textTh = raw.trim();
        if (!textTh) return;

        if (lastTranslatedTh[index] === textTh) return;

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

    return {
        translatingLink,
        handleTranslateLink: translateLabel,
    };
};
