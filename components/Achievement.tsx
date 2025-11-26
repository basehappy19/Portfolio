import { getTranslations, getLocale } from "next-intl/server";
import SectionHeader from "./SectionHeader";
import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import CategoryFilterTab from "./CategoryFilterTab";
import AchievementCard from "./AchievementCard";

export type Category = {
    id: number,
    name: string,
    slug: string,
    totalAchievements?: number
}

const Achievement = async ({ slug }: { slug: string | undefined }) => {
    const locale = await getLocale();

    const connectionString = process.env.DATABASE_URL;
    const adapter = new PrismaPg({ connectionString });
    const prisma = new PrismaClient({ adapter });

    let currentCategoryRaw = null;

    if (slug) {
        currentCategoryRaw = await prisma.category.findFirst({
            select: {
                id: true,
                name_th: true,
                name_en: true,
                slug: true,
            },
            where: { slug }
        });
    }

    const currentCategory = currentCategoryRaw
        ? {
            id: currentCategoryRaw.id,
            name: locale === "th" ? currentCategoryRaw.name_th : currentCategoryRaw.name_en,
            slug: currentCategoryRaw.slug
        }
        : null;


    let achievements;

    if (currentCategory) {
        achievements = await prisma.achievement.findMany({
            select: {
                id: true,
                title_th: true,
                description_th: true,
                awardLevel_th: true,
                location_th: true,

                title_en: true,
                description_en: true,
                awardLevel_en: true,
                location_en: true,

                receivedAt: true,
                createdAt: true,
                updatedAt: true,
                categories: {
                    select: {
                        category: {
                            select: {
                                id: true,
                                name_en: true,
                                name_th: true,
                                slug: true
                            }
                        }
                    }
                },
                images: {
                    select: {
                        url: true,
                        altText_th: true,
                        altText_en: true,
                    }
                },
                links: true
            },
            where: {
                categories: {
                    some: {
                        category: {
                            slug: currentCategory.slug
                        }
                    }
                }
            },
            orderBy: { receivedAt: "desc" }
        });
    } else {
        achievements = await prisma.achievement.findMany({
            select: {
                id: true,
                title_th: true,
                description_th: true,
                awardLevel_th: true,
                location_th: true,

                title_en: true,
                description_en: true,
                awardLevel_en: true,
                location_en: true,

                receivedAt: true,
                createdAt: true,
                updatedAt: true,
                categories: {
                    select: {
                        category: {
                            select: {
                                id: true,
                                name_en: true,
                                name_th: true,
                                slug: true
                            }
                        }
                    }
                },
                images: {
                    select: {
                        url: true,
                        altText_th: true,
                        altText_en: true,
                    }
                },
                links: true
            },
            orderBy: { receivedAt: "desc" }
        });
    }
    const t = await getTranslations("Index");

    return (
        <section className="min-h-screen w-full px-4 md:px-8 lg:px-16" id="Achievements">
            <div className="max-w-7xl mx-auto">
                <SectionHeader text={t("Achievement.Heading")} />
                <CategoryFilterTab currentCategory={currentCategory} />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                    {achievements.map((achievement, idx) => (
                        <AchievementCard
                            key={idx}
                            achievement={achievement}
                            locale={locale}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Achievement;
