"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Download, X } from "lucide-react";
import type { AchievementImage } from "@/types/Achievements";
import { pick } from "@/lib/achievement-format";
import { downloadImage } from "@/lib/download";

type Props = {
    images: AchievementImage[];
    index: number | null;
    title: string;
    locale: string;
    canDownload: boolean;
    onClose: () => void;
    onChange: (i: number) => void;
};

export default function ImageLightbox({ images, index, title, locale, canDownload, onClose, onChange }: Props) {
    const ref = useRef<HTMLDialogElement>(null);
    const [downloading, setDownloading] = useState(false);
    const isTH = locale === "th";
    const open = index !== null && images.length > 0;

    useEffect(() => {
        const d = ref.current;
        if (!d) return;
        if (open && !d.open) d.showModal();
        if (!open && d.open) d.close();
    }, [open]);

    const go = useCallback(
        (dir: 1 | -1) => {
            if (index === null) return;
            onChange((index + dir + images.length) % images.length);
        },
        [index, images.length, onChange]
    );

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") go(1);
            if (e.key === "ArrowLeft") go(-1);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open, go]);

    const img = open ? images[index!] : null;
    const alt = img ? pick(img.altText_th, img.altText_en, locale) || title : "";

    return (
        <dialog
            ref={ref}
            onCancel={(e) => {
                e.preventDefault();
                onClose();
            }}
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
            aria-label={isTH ? "ภาพขนาดเต็ม" : "Full-size image"}
            className="m-0 h-dvh max-h-none w-screen max-w-none bg-black/90 p-0 text-white backdrop:bg-black/80"
        >
            {img && (
                <div className="flex h-full flex-col" onClick={(e) => e.target === e.currentTarget && onClose()}>
                    <div className="flex items-center justify-between gap-3 px-4 pb-2 pt-[max(1rem,env(safe-area-inset-top))]">
                        <p className="text-sm text-white/80">
                            {index! + 1} / {images.length}
                        </p>
                        <div className="flex items-center gap-2">
                            {canDownload && (
                                <button
                                    type="button"
                                    disabled={downloading}
                                    onClick={async () => {
                                        setDownloading(true);
                                        try {
                                            await downloadImage(img.url, `img-${img.id.slice(0, 12)}.jpg`);
                                        } finally {
                                            setDownloading(false);
                                        }
                                    }}
                                    className="glass-dark inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-semibold"
                                >
                                    <Download aria-hidden="true" className="h-4 w-4" />
                                    {downloading ? (isTH ? "กำลังดาวน์โหลด…" : "Downloading…") : isTH ? "ดาวน์โหลด" : "Download"}
                                </button>
                            )}
                            <button
                                type="button"
                                onClick={onClose}
                                aria-label={isTH ? "ปิด" : "Close"}
                                className="glass-dark inline-flex h-11 w-11 items-center justify-center rounded-full"
                            >
                                <X aria-hidden="true" className="h-5 w-5" />
                            </button>
                        </div>
                    </div>
                    <div className="relative flex-1" onClick={(e) => e.target === e.currentTarget && onClose()}>
                        <Image key={img.id} src={img.url} alt={alt} fill sizes="100vw" className="anim-pop object-contain p-2 sm:p-8" />
                        {images.length > 1 && (
                            <>
                                <button
                                    type="button"
                                    onClick={() => go(-1)}
                                    aria-label={isTH ? "ภาพก่อนหน้า" : "Previous image"}
                                    className="glass-dark absolute left-3 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full"
                                >
                                    <ChevronLeft aria-hidden="true" className="h-6 w-6" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => go(1)}
                                    aria-label={isTH ? "ภาพถัดไป" : "Next image"}
                                    className="glass-dark absolute right-3 top-1/2 inline-flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full"
                                >
                                    <ChevronRight aria-hidden="true" className="h-6 w-6" />
                                </button>
                            </>
                        )}
                    </div>
                    {alt && <p className="px-6 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-2 text-center text-sm text-white/85">{alt}</p>}
                </div>
            )}
        </dialog>
    );
}
