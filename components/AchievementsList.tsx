import { Achievement as AchievementType } from "@/types/Achievements";
import { getTranslations } from "next-intl/server";
import AchievementGrid from "./AchievementGrid";
import { getAchievements } from "@/lib/achievements";
import Link from "next/link";

async function getData(slug?: string, page = 1) {
    return await getAchievements({
        category: slug,
        page,
        limit: 10,
    });
}

export default async function AchievementsList({
    slug,
    locale,
    page = 1,
}: {
    slug?: string;
    locale: string;
    page?: number;
}) {
    const t = await getTranslations("Index");
    const { achievements, totalPages } = await getData(slug, page);

    if (!achievements || achievements.length === 0) {
        return (
            <div
                className="
                    col-span-full flex flex-col items-center justify-center p-12 rounded-xl text-center
                    transition-all
                    bg-gray-100 border border-gray-300
                    text-gray-700
                    dark:bg-white/5 dark:border-white/10 dark:text-white
                    dark:backdrop-blur-lg
                "
            >
                <div className="w-20 h-20 mb-6 text-gray-400 dark:text-white/20">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-full h-full"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12h3.75M9 15h3.75M9 9h3.75m3 6.75H18a2.25 2.25 0 002.25-2.25V6.108
                            c0-.393-.154-.77-.427-1.05l-2.672-2.708A1.5 1.5 0 0015.879 2.25H6A2.25
                            2.25 0 003.75 4.5v12A2.25 2.25 0 006 18.75h9"
                        />
                    </svg>
                </div>

                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">
                    {t("Achievement.NoItemsTitle")}
                </h3>

                <p className="text-sm text-gray-500 dark:text-white/50">
                    {t("Achievement.NoItemsDescription")}
                </p>
            </div>
        );
    }

    const buildPageHref = (targetPage: number) => {
        const params = new URLSearchParams();
        if (slug) params.set("category", slug);
        params.set("page", String(targetPage));
        return `?${params.toString()}`;
    };

    return (
        <div className="space-y-8">
            <AchievementGrid
                achievements={achievements as AchievementType[]}
                locale={locale}
            />

            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 flex-wrap">
                    <Link
                        href={buildPageHref(Math.max(1, page - 1))}
                        className={`px-4 py-2 rounded-lg border text-sm font-medium transition ${
                            page <= 1
                                ? "pointer-events-none opacity-50 border-gray-200 text-gray-400 dark:border-gray-700 dark:text-gray-500"
                                : "border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
                        }`}
                    >
                        {locale === "th" ? "ก่อนหน้า" : "Previous"}
                    </Link>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                        <Link
                            key={p}
                            href={buildPageHref(p)}
                            className={`px-4 py-2 rounded-lg border text-sm font-medium transition ${
                                p === page
                                    ? "bg-red-600 text-white border-red-600"
                                    : "border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
                            }`}
                        >
                            {p}
                        </Link>
                    ))}

                    <Link
                        href={buildPageHref(Math.min(totalPages, page + 1))}
                        className={`px-4 py-2 rounded-lg border text-sm font-medium transition ${
                            page >= totalPages
                                ? "pointer-events-none opacity-50 border-gray-200 text-gray-400 dark:border-gray-700 dark:text-gray-500"
                                : "border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800"
                        }`}
                    >
                        {locale === "th" ? "ถัดไป" : "Next"}
                    </Link>
                </div>
            )}
        </div>
    );
}