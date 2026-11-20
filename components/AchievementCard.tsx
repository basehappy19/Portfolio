"use client";

import FadeImage from "./FadeImage";
import { preloadImages, SHEET_IMAGE_SIZES } from "@/lib/preload-images";
import { ArrowUpRight, ImageOff } from "lucide-react";
import type { Achievement } from "@/types/Achievements";
import { getAwardTier, TIER_STYLE } from "@/lib/award-tier";
import { pick, formatYear } from "@/lib/achievement-format";
import Icon3D from "./Icon3D";
import CategoryBadge from "./CategoryBadge";
import { getAchievementIcon, getAwardIcon } from "@/lib/achievement-icon";

type Props = {
    achievement: Achievement;
    locale: string;
    index: number;
    viewDetailLabel: string;
    onOpen: (a: Achievement) => void;
};

const stripHtml = (html: string) =>
    html.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();

export default function AchievementCard({ achievement, locale, index, viewDetailLabel, onOpen }: Props) {
    const title = pick(achievement.title_th, achievement.title_en, locale);
    const level = pick(achievement.awardLevel_th, achievement.awardLevel_en, locale);
    const givenBy = pick(achievement.given_by_th, achievement.given_by_en, locale);
    const summary = stripHtml(pick(achievement.description_th, achievement.description_en, locale));
    const cats = achievement.categories.slice(0, 2).map((c) => ({ slug: c.category.slug, name: pick(c.category.name_th, c.category.name_en, locale) }));
    const tier = getAwardTier(achievement.awardLevel_th, achievement.awardLevel_en);
    const tierStyle = TIER_STYLE[tier];
    const image = achievement.images[0];
    const year = formatYear(achievement.receivedAt, locale);
    const icon = getAchievementIcon(achievement);
    const awardIcon = getAwardIcon(tier, level);
    const warm = () => preloadImages(achievement.images.slice(0, 3).map((i) => i.url), SHEET_IMAGE_SIZES);

    return (
        <article
            data-reveal="scale"
            style={{ ["--reveal-delay" as string]: `${(index % 2) * 100}ms` }}
            className="h-full"
        >
            <button
                type="button"
                onClick={() => onOpen(achievement)}
                // start fetching the detail photos as soon as the user shows intent
                onPointerEnter={warm}
                onFocus={warm}
                onTouchStart={warm}
                aria-haspopup="dialog"
                aria-label={`${viewDetailLabel}: ${title}`}
                className="card-lift group flex h-full w-full cursor-pointer flex-col overflow-hidden rounded-[22px] sm:rounded-[28px] border border-zinc-200/80 bg-white text-left shadow-[0_14px_40px_-28px_rgba(24,24,27,0.55)]"
            >
                {/* image */}
                <span className="relative block aspect-[16/10] w-full overflow-hidden bg-zinc-100">
                    {image ? (
                        <FadeImage
                            src={image.url}
                            alt=""
                            fill
                            sizes="(max-width: 768px) 92vw, 560px"
                            quality={70}
                            className="card-zoom object-cover"
                        />
                    ) : (
                        <span className="absolute inset-0 flex items-center justify-center text-zinc-400">
                            <ImageOff aria-hidden="true" className="h-10 w-10" />
                        </span>
                    )}
                    <span aria-hidden="true" className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/30 to-transparent" />
                    <span className="absolute left-3 top-3 flex flex-wrap gap-2 sm:left-4 sm:top-4">
                        {cats.map((c) => (
                            <CategoryBadge key={c.slug} slug={c.slug} name={c.name} />
                        ))}
                    </span>
                </span>

                {/* body: solid background for easy reading */}
                <span className="relative flex flex-1 flex-col px-4 pb-5 pt-11 sm:px-7 sm:pb-6">
                    <span className="absolute -top-10 left-3 rounded-[24px] bg-white p-1 transition-transform duration-500 ease-[var(--ease-spring)] group-hover:-translate-y-1 group-hover:-rotate-6 sm:left-6">
                        <Icon3D name={icon} size={64} />
                    </span>

                    {level && (
                        <span
                            className="inline-flex items-center gap-1.5 self-start rounded-lg px-2.5 py-1 text-[13px] font-semibold leading-snug"
                            style={{ background: `${tierStyle.bg}14`, color: tierStyle.bg }}
                        >
                            {awardIcon && <Icon3D name={awardIcon} size={18} className="drop-shadow-none" />}
                            {level}
                        </span>
                    )}

                    <span className="mt-3 line-clamp-2 text-xl font-bold leading-snug text-zinc-900 transition-colors duration-300 group-hover:text-accent sm:text-[22px]">
                        {title}
                    </span>

                    {summary && (
                        <span className="mt-2.5 line-clamp-2 text-[15px] leading-relaxed text-zinc-600">{summary}</span>
                    )}

                    <span className="mt-auto pt-5">
                        {givenBy && (
                            <span className="block border-t border-zinc-100 pt-4 text-[15px] font-medium leading-snug text-zinc-800">
                                {givenBy}
                            </span>
                        )}
                        <span className="mt-3 flex items-center justify-between gap-4 text-sm">
                            <span className="text-zinc-500">{year}</span>
                            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-zinc-900 py-2 pl-4 pr-3 font-semibold text-white transition-all duration-300 group-hover:bg-accent">
                                {viewDetailLabel}
                                <ArrowUpRight aria-hidden="true" className="h-4 w-4 transition-transform duration-300 group-hover:rotate-45" />
                            </span>
                        </span>
                    </span>
                </span>
            </button>
        </article>
    );
}
