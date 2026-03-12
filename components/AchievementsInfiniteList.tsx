"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Achievement as AchievementType } from "@/types/Achievements";
import AchievementGrid from "./AchievementGrid";

type LoadMoreResponse = {
    achievements: AchievementType[];
    hasMore: boolean;
    nextOffset: number;
};

type Props = {
    initialAchievements: AchievementType[];
    initialHasMore: boolean;
    initialOffset: number;
    slug?: string;
    locale: string;
};

export default function AchievementsInfiniteList({
    initialAchievements,
    initialHasMore,
    initialOffset,
    slug,
    locale,
}: Props) {
    const [items, setItems] = useState<AchievementType[]>(initialAchievements);
    const [hasMore, setHasMore] = useState(initialHasMore);
    const [offset, setOffset] = useState(initialOffset);
    const [loading, setLoading] = useState(false);

    const [prefetchedData, setPrefetchedData] = useState<LoadMoreResponse | null>(null);
    const [isPrefetching, setIsPrefetching] = useState(false);

    const sentinelRef = useRef<HTMLDivElement | null>(null);

    const fetchBatch = useCallback(async (targetOffset: number) => {
        const params = new URLSearchParams();
        if (slug) params.set("category", slug);
        params.set("offset", String(targetOffset));
        params.set("limit", "9");

        const res = await fetch(`/api/achievements?${params.toString()}`, {
            method: "GET",
            cache: "no-store",
        });

        if (!res.ok) {
            throw new Error("Failed to fetch more achievements");
        }

        return (await res.json()) as LoadMoreResponse;
    }, [slug]);

    const prefetchMore = useCallback(async () => {
        if (!hasMore || isPrefetching || prefetchedData) return;

        setIsPrefetching(true);
        try {
            const data = await fetchBatch(offset);
            setPrefetchedData(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsPrefetching(false);
        }
    }, [fetchBatch, hasMore, isPrefetching, offset, prefetchedData]);

    const loadMore = useCallback(async () => {
        if (loading || !hasMore) return;

        setLoading(true);

        try {
            if (prefetchedData) {
                setItems((prev) => [...prev, ...prefetchedData.achievements]);
                setHasMore(prefetchedData.hasMore);
                setOffset(prefetchedData.nextOffset);
                setPrefetchedData(null);
                return;
            }

            const data = await fetchBatch(offset);
            setItems((prev) => [...prev, ...data.achievements]);
            setHasMore(data.hasMore);
            setOffset(data.nextOffset);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [fetchBatch, hasMore, loading, offset, prefetchedData]);

    // prefetch รอบแรกทันทีหลัง mount ถ้ายังมีข้อมูลต่อ
    useEffect(() => {
        if (hasMore) {
            prefetchMore();
        }
    }, [hasMore, prefetchMore]);

    // observer สำหรับ “โหลดจริง”
    useEffect(() => {
        const el = sentinelRef.current;
        if (!el || !hasMore) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                if (entry.isIntersecting) {
                    loadMore();
                }
            },
            {
                rootMargin: "500px",
            }
        );

        observer.observe(el);

        return () => observer.disconnect();
    }, [hasMore, loadMore]);

    // หลังจาก offset เปลี่ยนแล้ว ให้ prefetch ชุดถัดไปต่อ
    useEffect(() => {
        if (hasMore && !prefetchedData) {
            prefetchMore();
        }
    }, [hasMore, offset, prefetchedData, prefetchMore]);

    // reset เมื่อเปลี่ยนหมวด
    useEffect(() => {
        setItems(initialAchievements);
        setHasMore(initialHasMore);
        setOffset(initialOffset);
        setPrefetchedData(null);
    }, [initialAchievements, initialHasMore, initialOffset, slug]);

    return (
        <div className="space-y-8">
            <AchievementGrid achievements={items} locale={locale} />

            {hasMore && (
                <div
                    ref={sentinelRef}
                    className="flex items-center justify-center py-4"
                >
                    {loading ? (
                        <div className="text-lg text-gray-500 dark:text-gray-400">
                            {locale === "th" ? "กำลังโหลดเพิ่มเติม..." : "Loading more..."}
                        </div>
                    ) : (
                        <div className="text-lg text-gray-400 dark:text-gray-500">
                            {locale === "th" ? "เลื่อนลงเพื่อโหลดเพิ่ม" : "Scroll down to load more"}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}