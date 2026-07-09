import { Achievement as AchievementType } from "@/types/Achievements";
import { getTranslations } from "next-intl/server";
import { getAchievements } from "@/lib/achievements";
import AchievementsInfiniteList from "./AchievementsInfiniteList";

async function getData(slug?: string) {
    return await getAchievements({
        category: slug,
        offset: 0,
        limit: 9,
    });
}

export default async function AchievementsList({
  slug,
  locale,
}: {
  slug?: string;
  locale: string;
}) {
  const t = await getTranslations("Index");
  const { achievements, hasMore, nextOffset } = await getData(slug);

  if (!achievements || achievements.length === 0) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center p-12 rounded-xl text-center bg-white border border-slate-200 text-slate-700 shadow-2xs">
        <div className="w-16 h-16 mb-4 text-slate-400">
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
        <h3 className="text-lg font-semibold mb-1 text-slate-900">
          {t("Achievement.NoItemsTitle")}
        </h3>
        <p className="text-sm text-slate-500">
          {t("Achievement.NoItemsDescription")}
        </p>
      </div>
    );
  }

  return (
    <AchievementsInfiniteList
      initialAchievements={achievements as AchievementType[]}
      initialHasMore={hasMore}
      initialOffset={nextOffset}
      slug={slug}
      locale={locale}
    />
  );
}