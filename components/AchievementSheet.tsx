"use client";

import FadeImage from "./FadeImage";
import { SHEET_IMAGE_SIZES } from "@/lib/preload-images";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { CalendarDays, ExternalLink, MapPin, Building2, Pencil, X, Expand } from "lucide-react";
import type { Achievement } from "@/types/Achievements";
import { getAwardTier } from "@/lib/award-tier";
import { pick, formatDate } from "@/lib/achievement-format";
import { useSessionContext } from "@/app/contexts/SessionContext";
import Icon3D from "./Icon3D";
import CategoryBadge from "./CategoryBadge";
import { getAchievementIcon, getAwardIcon } from "@/lib/achievement-icon";
import ImageLightbox from "./ImageLightbox";

type Props = {
    achievement: Achievement | null;
    locale: string;
    onClose: () => void;
};

const CLOSE_MS = 280;

export default function AchievementSheet({ achievement, locale, onClose }: Props) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const drag = useRef<{ startY: number; dy: number; id: number } | null>(null);
    const closing = useRef(false);
    const [lightbox, setLightbox] = useState<number | null>(null);
    const { session } = useSessionContext();
    const isTH = locale === "th";

    const finishClose = useCallback(() => {
        const d = dialogRef.current;
        if (!d || closing.current) return;
        closing.current = true;
        d.setAttribute("data-closing", "");
        window.setTimeout(() => {
            d.removeAttribute("data-closing");
            if (panelRef.current) {
                panelRef.current.style.transform = "";
                panelRef.current.style.removeProperty("--drag-y");
            }
            d.close();
            closing.current = false;
            onClose();
        }, CLOSE_MS);
    }, [onClose]);

    // open / close the native dialog
    useEffect(() => {
        const d = dialogRef.current;
        if (!d) return;
        if (achievement && !d.open) {
            d.showModal();
            scrollRef.current?.scrollTo({ top: 0 });
            document.documentElement.style.overflow = "hidden";
        }
        return () => {
            document.documentElement.style.overflow = "";
        };
    }, [achievement]);

    // swipe down to dismiss
    const onPointerDown = (e: React.PointerEvent) => {
        if (e.pointerType === "mouse" && e.button !== 0) return;
        drag.current = { startY: e.clientY, dy: 0, id: e.pointerId };
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        if (panelRef.current) panelRef.current.style.transition = "none";
    };
    const onPointerMove = (e: React.PointerEvent) => {
        if (!drag.current || drag.current.id !== e.pointerId) return;
        const dy = Math.max(0, e.clientY - drag.current.startY);
        drag.current.dy = dy;
        if (panelRef.current) panelRef.current.style.transform = `translateY(${dy}px)`;
    };
    const onPointerUp = () => {
        const state = drag.current;
        drag.current = null;
        const panel = panelRef.current;
        if (!state || !panel) return;
        panel.style.transition = "";
        if (state.dy > 110) {
            panel.style.setProperty("--drag-y", `${state.dy}px`);
            finishClose();
        } else {
            panel.style.transition = "transform 0.5s cubic-bezier(0.32, 0.72, 0, 1)";
            panel.style.transform = "translateY(0)";
        }
    };

    const a = achievement;
    const title = a ? pick(a.title_th, a.title_en, locale) : "";
    const level = a ? pick(a.awardLevel_th, a.awardLevel_en, locale) : "";
    const givenBy = a ? pick(a.given_by_th, a.given_by_en, locale) : "";
    const location = a ? pick(a.location_th, a.location_en, locale) : "";
    const description = a ? pick(a.description_th, a.description_en, locale) : "";
    const tier = a ? getAwardTier(a.awardLevel_th, a.awardLevel_en) : "none";
    const images = a?.images ?? [];

    return (
        <>
            <dialog
                ref={dialogRef}
                className="sheet"
                aria-labelledby="sheet-title"
                onCancel={(e) => {
                    e.preventDefault();
                    finishClose();
                }}
                onClick={(e) => {
                    if (e.target === e.currentTarget) finishClose();
                }}
            >
                <div
                    className="flex h-full items-end justify-center md:px-6"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) finishClose();
                    }}
                >
                    {a && (
                        <div
                            ref={panelRef}
                            className="sheet-panel relative flex h-[94dvh] w-full max-w-5xl flex-col overflow-hidden rounded-t-[32px] bg-white shadow-[0_-30px_80px_-20px_rgba(0,0,0,0.45)] md:h-[90dvh]"
                        >
                            {/* drag handle + header */}
                            <div
                                className="shrink-0 cursor-grab touch-none select-none px-5 pb-2 pt-3 active:cursor-grabbing sm:px-8"
                                onPointerDown={onPointerDown}
                                onPointerMove={onPointerMove}
                                onPointerUp={onPointerUp}
                                onPointerCancel={onPointerUp}
                            >
                                <span aria-hidden="true" className="mx-auto block h-1.5 w-12 rounded-full bg-zinc-300" />
                                <div className="mt-3 flex items-center justify-between gap-3">
                                    <span className="text-sm font-semibold text-zinc-500">
                                        {isTH ? "รายละเอียดผลงาน" : "Achievement details"}
                                    </span>
                                    <button
                                        type="button"
                                        onPointerDown={(e) => e.stopPropagation()}
                                        onClick={finishClose}
                                        aria-label={isTH ? "ปิด" : "Close"}
                                        className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-zinc-900/5 text-zinc-800 transition-colors hover:bg-zinc-900/10"
                                    >
                                        <X aria-hidden="true" className="h-5 w-5" />
                                    </button>
                                </div>
                            </div>

                            <div ref={scrollRef} className="flex-1 overflow-y-auto overscroll-contain pb-32">
                                {images.length > 0 && (
                                    <ul className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 pt-1 sm:px-8">
                                        {images.map((img, i) => (
                                            <li
                                                key={img.id}
                                                className={`relative shrink-0 snap-center overflow-hidden rounded-[22px] bg-zinc-100 ${
                                                    images.length === 1 ? "w-full" : "w-[88%] sm:w-[72%]"
                                                } aspect-[16/10]`}
                                            >
                                                <button
                                                    type="button"
                                                    onClick={() => setLightbox(i)}
                                                    aria-label={`${isTH ? "ดูภาพเต็ม" : "View full image"} ${i + 1}`}
                                                    className="group absolute inset-0 cursor-zoom-in"
                                                >
                                                    <FadeImage
                                                        src={img.url}
                                                        alt={pick(img.altText_th, img.altText_en, locale) || `${title} ${i + 1}`}
                                                        fill
                                                        sizes={SHEET_IMAGE_SIZES}
                                                        loading={i < 3 ? "eager" : "lazy"}
                                                        fetchPriority={i === 0 ? "high" : "auto"}
                                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                                    />
                                                    <span className="glass-dark absolute bottom-3 right-3 inline-flex h-9 w-9 items-center justify-center rounded-full text-white opacity-0 transition-opacity group-hover:opacity-100">
                                                        <Expand aria-hidden="true" className="h-4 w-4" />
                                                    </span>
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}

                                <div className="mx-auto max-w-3xl px-5 pt-7 sm:px-8">
                                    <div className="anim-fade-rise flex items-center gap-4">
                                        <Icon3D name={getAchievementIcon(a)} size={60} />
                                        {level && (
                                            <p className="inline-flex items-center gap-2 text-base font-semibold text-zinc-800">
                                                {getAwardIcon(tier, level) && <Icon3D name={getAwardIcon(tier, level)!} size={22} className="drop-shadow-none" />}
                                                {level}
                                            </p>
                                        )}
                                    </div>
                                    <h2 id="sheet-title" className="anim-fade-rise delay-1 mt-4 text-2xl font-bold leading-snug text-zinc-900 sm:text-3xl">
                                        {title}
                                    </h2>

                                    <ul className="anim-fade-rise delay-2 mt-5 flex flex-wrap gap-2 text-sm">
                                        {a.receivedAt && (
                                            <li className="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-3.5 py-2 text-zinc-800">
                                                <CalendarDays aria-hidden="true" className="h-4 w-4 text-accent" />
                                                {formatDate(a.receivedAt, locale)}
                                            </li>
                                        )}
                                        {location && (
                                            <li className="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-3.5 py-2 text-zinc-800">
                                                <MapPin aria-hidden="true" className="h-4 w-4 text-accent" />
                                                {location}
                                            </li>
                                        )}
                                        {givenBy && (
                                            <li className="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-3.5 py-2 text-zinc-800">
                                                <Building2 aria-hidden="true" className="h-4 w-4 text-accent" />
                                                {isTH ? "มอบโดย" : "By"} {givenBy}
                                            </li>
                                        )}
                                    </ul>

                                    {a.categories.length > 0 && (
                                        <ul className="anim-fade-rise delay-2 mt-3 flex flex-wrap gap-2">
                                            {a.categories.map((c) => (
                                                <li key={c.category.id}>
                                                    <CategoryBadge slug={c.category.slug} name={pick(c.category.name_th, c.category.name_en, locale)} size="sm" />
                                                </li>
                                            ))}
                                        </ul>
                                    )}

                                    {description && (
                                        <div
                                            className="rich-text anim-fade-rise delay-3 mt-8 border-t border-zinc-100 pt-7 text-[17px] leading-[1.9] text-zinc-800"
                                            dangerouslySetInnerHTML={{ __html: description }}
                                        />
                                    )}
                                </div>
                            </div>

                            {/* floating glass action bar */}
                            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 border-t border-zinc-200 bg-white/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 sm:px-8">
                                <button
                                    type="button"
                                    onClick={finishClose}
                                    className="inline-flex min-h-12 cursor-pointer items-center rounded-2xl bg-zinc-900/5 px-5 font-semibold text-zinc-800 transition-colors hover:bg-zinc-900/10"
                                >
                                    {isTH ? "ปิด" : "Close"}
                                </button>
                                <div className="no-scrollbar flex min-w-0 items-center gap-2 overflow-x-auto">
                                    {session && (
                                        <Link
                                            href={`/admin?edit=${a.id}`}
                                            className="inline-flex min-h-12 shrink-0 items-center gap-2 rounded-2xl bg-accent px-4 font-semibold text-white"
                                        >
                                            <Pencil aria-hidden="true" className="h-4 w-4" />
                                            {isTH ? "แก้ไข" : "Edit"}
                                        </Link>
                                    )}
                                    {a.links.map((link) => (
                                        <a
                                            key={link.id}
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex min-h-12 shrink-0 items-center gap-2 rounded-2xl bg-zinc-900 px-5 font-semibold text-white transition-transform hover:-translate-y-0.5"
                                        >
                                            {pick(link.label_th, link.label_en, locale)}
                                            <ExternalLink aria-hidden="true" className="h-4 w-4" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </dialog>

            <ImageLightbox
                images={images}
                index={lightbox}
                title={title}
                locale={locale}
                canDownload={!!session}
                onClose={() => setLightbox(null)}
                onChange={setLightbox}
            />
        </>
    );
}
