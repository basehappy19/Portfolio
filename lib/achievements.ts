import prisma from "@/lib/prisma";
import { cache } from "react";
import { categoryRank } from "./category-style";

type GetAchievementsParams = {
    category?: string;
    offset?: number;
    limit?: number;
};

export const getAchievements = cache(async function getAchievements({
    category,
    offset = 0,
    limit = 9,
}: GetAchievementsParams) {
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
        icon: true,
        createdAt: true,
        updatedAt: true,
    };

    const where = {
        status: "PUBLIC" as const,
        ...(category
            ? {
                  categories: {
                      some: {
                          category: {
                              slug: category,
                          },
                      },
                  },
              }
            : {}),
    };

    const [achievements, total] = await Promise.all([
        prisma.achievement.findMany({
            select: {
                ...baseSelect,
                images: {
                    orderBy: {
                        sortOrder: "asc",
                    },
                },
                links: {
                    orderBy: {
                        sortOrder: "asc",
                    },
                },
                categories: {
                    orderBy: { sortOrder: "asc" },
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
            },
            where,
            orderBy: {
                sortOrder: "desc",
            },
            skip: offset,
            take: limit,
        }),
        prisma.achievement.count({
            where,
        }),
    ]);

    return {
        achievements,
        total,
        hasMore: offset + achievements.length < total,
        nextOffset: offset + achievements.length,
    };
});
export const getAchievementCategories = cache(async function getAchievementCategories() {
    const [categories, total] = await Promise.all([
        prisma.category.findMany({
            select: {
                id: true,
                name_th: true,
                name_en: true,
                slug: true,
                _count: {
                    select: {
                        achievements: { where: { achievement: { status: "PUBLIC" } } },
                    },
                },
            },
            orderBy: { id: "asc" },
        }),
        prisma.achievement.count({ where: { status: "PUBLIC" } }),
    ]);

    return {
        total,
        categories: categories
            .map((c) => ({
                id: c.id,
                slug: c.slug,
                name_th: c.name_th,
                name_en: c.name_en,
                count: c._count.achievements,
            }))
            .filter((c) => c.count > 0)
            .sort((a, b) => categoryRank(a.slug) - categoryRank(b.slug)),
    };
});
