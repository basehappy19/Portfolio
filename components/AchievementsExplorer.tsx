"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, SearchX } from "lucide-react";
import type { Achievement } from "@/types/Achievements";
import AchievementCard from "./AchievementCard";
import { categoryStyle } from "@/lib/category-style";
import dynamic from "next/dynamic";

// The detail sheet (and its lightbox) is only downloaded the first time a card is opened.
const AchievementSheet = dynamic(() => import("./AchievementSheet"), { ssr: false });

type Batch = { achievements: Achievement[]; hasMore: boolean; nextOffset: number; total?: number };
type Category = { slug: string; name: string; count: number };

type Props = {
    locale: string;
    pageSize: number;
    initial: Batch;
    categories: Category[];
    total: number;
    labels: {
        all: string;
        loadMore: string;
        loading: string;
        viewDetail: string;
        emptyTitle: string;
        emptyDescription: string;
        filterLabel: string;
    };
};

export default function AchievementsExplorer({ locale, pageSize, initial, categories, total, labels }: Props) {
    const [category, setCategory] = useState<string | null>(null);
    const [items, setItems] = useState<Achievement[]>(initial.achievements);
    const [hasMore, setHasMore] = useState(initial.hasMore);
    const [offset, setOffset] = useState(initial.nextOffset);
    const [loading, setLoading] = useState(false);
    const [switching, setSwitching] = useState(false);
    const [selected, setSelected] = useState<Achievement | null>(null);
    const [sheetLoaded, setSheetLoaded] = useState(false);
    const sentinel = useRef<HTMLDivElement>(null);
    const requestId = useRef(0);

    const fetchBatch = useCallback(
        async (slug: string | null, from: number): Promise<Batch> => {
            const params = new URLSearchParams({ offset: String(from), limit: String(pageSize) });
            if (slug) params.set("category", slug);
            const res = await fetch(`/api/achievements?${params}`);
            if (!res.ok) throw new Error("Failed to load achievements");
            return res.json();
        },
        [pageSize]
    );

    const selectCategory = useCallback(
        async (slug: string | null, { updateUrl = true } = {}) => {
            setCategory(slug);
            if (updateUrl) {
                const url = new URL(window.location.href);
                if (slug) url.searchParams.set("category", slug);
                else url.searchParams.delete("category");
                window.history.replaceState(null, "", url);
            }
            if (!slug) {
                requestId.current++;
                setItems(initial.achievements);
                setHasMore(initial.hasMore);
                setOffset(initial.nextOffset);
                return;
            }
            const id = ++requestId.current;
            setSwitching(true);
            try {
                const data = await fetchBatch(slug, 0);
                if (id !== requestId.current) return;
                setItems(data.achievements);
                setHasMore(data.hasMore);
                setOffset(data.nextOffset);
            } catch (e) {
                console.error(e);
            } finally {
                if (id === requestId.current) setSwitching(false);
            }
        },
        [fetchBatch, initial]
    );

    // honour ?category= in shared links
    useEffect(() => {
        const slug = new URLSearchParams(window.location.search).get("category");
        if (slug && categories.some((c) => c.slug === slug)) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            selectCategory(slug, { updateUrl: false });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const loadMore = useCallback(async () => {
        if (loading || !hasMore || switching) return;
        const id = requestId.current;
        setLoading(true);
        try {
            const data = await fetchBatch(category, offset);
            if (id !== requestId.current) return;
            setItems((prev) => {
                const seen = new Set(prev.map((p) => p.id));
                return [...prev, ...data.achievements.filter((a) => !seen.has(a.id))];
            });
            setHasMore(data.hasMore);
            setOffset(data.nextOffset);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    }, [loading, hasMore, switching, fetchBatch, category, offset]);

    useEffect(() => {
        const el = sentinel.current;
        if (!el || !hasMore) return;
        const io = new IntersectionObserver(([entry]) => entry.isIntersecting && loadMore(), { rootMargin: "600px" });
        io.observe(el);
        return () => io.disconnect();
    }, [hasMore, loadMore]);

    const chips = [{ slug: null as string | null, name: labels.all, count: total }, ...categories];

    return (
        <div>
            <div role="group" aria-label={labels.filterLabel} className="no-scrollbar -mx-2.5 flex gap-2 overflow-x-auto px-2.5 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
                {chips.map((c) => {
                    const active = category === c.slug;
                    return (
                        <button
                            key={c.slug ?? "all"}
                            type="button"
                            aria-pressed={active}
                            onClick={() => !active && selectCategory(c.slug)}
                            className={`inline-flex min-h-11 shrink-0 cursor-pointer items-center gap-2 rounded-full border px-4 text-[15px] font-semibold transition-all duration-300 ${
                                active
                                    ? "border-zinc-900 bg-zinc-900 text-white shadow-[0_10px_24px_-12px_rgba(24,24,27,0.8)]"
                                    : "border-zinc-200 bg-white text-zinc-800 hover:-translate-y-0.5 hover:border-zinc-400"
                            }`}
                        >
                            {c.slug && (
                                <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full" style={{ background: categoryStyle(c.slug).bg }} />
                            )}
                            {c.name}
                            <span
                                className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                                    active ? "bg-white/20 text-white" : "bg-zinc-100 text-zinc-600"
                                }`}
                            >
                                {c.count}
                            </span>
                        </button>
                    );
                })}
            </div>

            <div aria-live="polite" aria-busy={switching} className={`mt-6 sm:mt-8 transition-opacity duration-300 ${switching ? "opacity-40" : "opacity-100"}`}>
                {items.length === 0 && !switching ? (
                    <div className="flex flex-col items-center rounded-[28px] border border-dashed border-zinc-300 px-6 py-16 text-center">
                        <SearchX aria-hidden="true" className="h-10 w-10 text-zinc-400" />
                        <p className="mt-4 text-lg font-semibold">{labels.emptyTitle}</p>
                        <p className="mt-1 text-zinc-600">{labels.emptyDescription}</p>
                    </div>
                ) : (
                    <ul className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 md:gap-8">
                        {items.map((a, i) => (
                            <li key={a.id} className="h-full min-w-0">
                                <AchievementCard
                                    achievement={a}
                                    locale={locale}
                                    index={i}
                                    viewDetailLabel={labels.viewDetail}
                                    onOpen={(item) => {
                                        setSheetLoaded(true);
                                        setSelected(item);
                                    }}
                                />
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {hasMore && (
                <div ref={sentinel} className="mt-10 flex justify-center">
                    <button
                        type="button"
                        onClick={loadMore}
                        disabled={loading}
                        className="inline-flex min-h-12 cursor-pointer items-center gap-2 rounded-2xl border border-zinc-300 bg-white px-7 font-semibold text-zinc-900 transition-all hover:-translate-y-0.5 hover:border-zinc-400 disabled:opacity-60"
                    >
                        {loading && <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" />}
                        {loading ? labels.loading : labels.loadMore}
                    </button>
                </div>
            )}

            {sheetLoaded && <AchievementSheet achievement={selected} locale={locale} onClose={() => setSelected(null)} />}
        </div>
    );
}
