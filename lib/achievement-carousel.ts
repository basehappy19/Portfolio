import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
const connectionString = process.env.DATABASE_URL;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export async function getAchievementFirstImages(limit = undefined) {
    const achievements = await prisma.achievement.findMany({
        where: {
            status: "PUBLIC",
            images: {
                some: {},
            },
        },
        select: {
            id: true,
            images: {
                orderBy: {
                    sortOrder: "asc",
                },
                take: 1,
                select: {
                    id: true,
                    url: true,
                    altText_th: true,
                    altText_en: true,
                },
            },
        },
        take: limit,
    });

    return achievements
        .map((a) => ({
            id: a.images[0].id,
            url: a.images[0].url,
            alt_th: a.images[0].altText_th,
            alt_en: a.images[0].altText_en,
        }))
        .filter(Boolean);
}