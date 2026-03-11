"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Achievement as AchievementType } from "@/types/Achievements";
import AchievementGrid from "./AchievementGrid";

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

    const sentinelRef = useRef<HTMLDivElement | null>(null);

    const loadMore = useCallback(async () => {
        if (loading || !hasMore) return;

        setLoading(true);

        try {
            const params = new URLSearchParams();
            if (slug) params.set("category", slug);
            params.set("offset", String(offset));
            params.set("limit", "9");

            const res = await fetch(`/api/achievements?${params.toString()}`, {
                method: "GET",
                cache: "no-store",
            });

            if (!res.ok) {
                throw new Error("Failed to fetch more achievements");
            }

            const data = await res.json();

            setItems((prev) => [...prev, ...data.achievements]);
            setHasMore(data.hasMore);
            setOffset(data.nextOffset);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, [hasMore, loading, offset, slug]);

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
                rootMargin: "300px",
            }
        );

        observer.observe(el);

        return () => observer.disconnect();
    }, [hasMore, loadMore]);

    useEffect(() => {
        setItems(initialAchievements);
        setHasMore(initialHasMore);
        setOffset(initialOffset);
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