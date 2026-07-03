import { Achievement as AchievementType } from "@/types/Achievements";
import { getTranslations } from "next-intl/server";
import AchievementGrid from "./AchievementGrid";
import prisma from "@/lib/prisma";

async function getData(slug?: string): Promise<AchievementType[]> {
  const baseSelect = {
    id: true,
    title_th: true,
    description_th: true,
    awardLevel_th: true,
    location_th: true,
    given_by_th: true,

    title_en: true,
    description_en: true,
    awardLevel_en: true,
    location_en: true,
    given_by_en: true,

    status: true,
    sortOrder: true,
    receivedAt: true,
    createdAt: true,
    updatedAt: true,
    images: {
      orderBy: {
        sortOrder: 'asc' as const,
      },
    },
    links: {
      orderBy: {
        sortOrder: 'asc' as const,
      },
    },
    categories: {
      select: {
        category: {
          select: {
            id: true,
            name_en: true,
            name_th: true,
            slug: true,
          },
        },
      },
    },
  };

  const achievements = await prisma.achievement.findMany({
    select: baseSelect,
    where: {
      status: "PUBLIC",
      ...(slug
        ? {
            categories: {
              some: {
                category: { slug },
              },
            },
          }
        : {}),
    },
    orderBy: { sortOrder: "desc" },
  });

  return achievements as unknown as AchievementType[];
}

export default async function AchievementsList({
  slug,
  locale,
}: {
  slug?: string;
  locale: string;
}) {
  const t = await getTranslations("Index");
  const achievements = await getData(slug);

  if (!achievements || achievements.length === 0) {
    return (
      <div className="col-span-full flex flex-col items-center justify-center p-12 rounded-lg text-center bg-gray-50 border border-gray-200 dark:bg-gray-800/50 dark:border-gray-700">
        <div className="w-16 h-16 mb-4 text-gray-400 dark:text-gray-500">
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
        <h3 className="text-lg font-semibold mb-1 text-gray-900 dark:text-white">
          {t("Achievement.NoItemsTitle")}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {t("Achievement.NoItemsDescription")}
        </p>
      </div>
    );
  }

  return <AchievementGrid achievements={achievements} locale={locale} />;
}