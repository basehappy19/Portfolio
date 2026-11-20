import { getLocale, getTranslations } from "next-intl/server";
import { getAchievements, getAchievementCategories } from "@/lib/achievements";
import { getAchievementFirstImages } from "@/lib/achievement-carousel";
import type { Achievement as AchievementType } from "@/types/Achievements";
import AchievementsExplorer from "../AchievementsExplorer";
import AchievementMarquee from "../AchievementMarquee";
import SectionLabel from "../SectionLabel";

const INITIAL_COUNT = 6;
const PAGE_SIZE = 8;
const MARQUEE_COUNT = 16;

export default async function Achievement() {
    const locale = await getLocale();
    const t = await getTranslations("Index.Achievement");
    const isTH = locale === "th";

    const [initial, cats, images] = await Promise.all([
        getAchievements({ offset: 0, limit: INITIAL_COUNT }),
        getAchievementCategories(),
        getAchievementFirstImages(MARQUEE_COUNT),
    ]);

    const marqueeImages = images.map((img) => ({
        id: img.id,
        url: img.url,
        alt: (isTH ? img.alt_th : img.alt_en) || undefined,
    }));

    return (
        <div className="py-20 md:py-28">
            <div className="mx-auto max-w-6xl px-5 sm:px-8">
                <SectionLabel>{t("Eyebrow")}</SectionLabel>
                <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                    <h2 data-reveal className="sd-title max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
                        {t("Title")}
                    </h2>
                    <p data-reveal className="max-w-sm text-base text-zinc-600">
                        {t("Subtitle")}
                    </p>
                </div>
            </div>

            <div className="mt-10" data-reveal>
                <AchievementMarquee images={marqueeImages} />
            </div>

            <div className="mx-auto mt-10 max-w-6xl px-2.5 sm:mt-12 sm:px-8">
                <AchievementsExplorer
                    locale={locale}
                    pageSize={PAGE_SIZE}
                    initial={{
                        achievements: JSON.parse(JSON.stringify(initial.achievements)) as AchievementType[],
                        hasMore: initial.hasMore,
                        nextOffset: initial.nextOffset,
                        total: initial.total,
                    }}
                    categories={cats.categories.map((c) => ({
                        slug: c.slug,
                        name: isTH ? c.name_th : c.name_en,
                        count: c.count,
                    }))}
                    total={cats.total}
                    labels={{
                        all: t("Buttons.AllButtonLabel"),
                        loadMore: t("LoadMore"),
                        loading: t("Loading"),
                        viewDetail: t("ViewDetail"),
                        emptyTitle: t("NoItemsTitle"),
                        emptyDescription: t("NoItemsDescription"),
                        filterLabel: isTH ? "กรองตามหมวดหมู่" : "Filter by category",
                    }}
                />
            </div>
        </div>
    );
}
