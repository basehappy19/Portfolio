import { getTranslations, getLocale } from "next-intl/server";
import SectionHeader from "../SectionHeader";
import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import CategoryFilterTab from "../CategoryFilterTab";
import AchievementCard from "../AchievementCard";

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

                status: true,
                sortOrder: true,
                receivedAt: true,
                createdAt: true,
                updatedAt: true,
                categories: {
                    select: {
                        category: true
                    }
                },
                images: true,
                links: true
            },
            where: {
                categories: {
                    some: {
                        category: {
                            slug: currentCategory.slug
                        }
                    }
                },
                status: "PUBLIC"
            },
            orderBy: { receivedAt: "desc" },
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

                status: true,
                sortOrder: true,
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
                images: true,
                links: true
            },
            orderBy: { receivedAt: "desc" },
            where: {
                status: "PUBLIC"
            }
        });
    }
    const t = await getTranslations("Index");

    return (
        <section className="min-h-screen w-full px-4 md:px-8 lg:px-16" id="Achievements">
            <div className="max-w-7xl mx-auto">
                <SectionHeader text={t("Achievement.Heading")} />
                <CategoryFilterTab currentCategory={currentCategory} />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                    {(!achievements || achievements.length === 0) ? (
                        <div className="flex flex-col items-center justify-center p-10 bg-gray-50 rounded-xl border border-gray-200 text-center">
                            <div className="w-16 h-16 mb-4 text-gray-400">
                                {/* ไอคอนว่าง */}
                                <svg xmlns="http://www.w3.org/2000/svg"
                                    fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                                    stroke="currentColor" className="w-full h-full">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                        d="M9 12h3.75M9 15h3.75M9 9h3.75m3 6.75H18a2.25 2.25 0 002.25-2.25V6.108
                       c0-.393-.154-.77-.427-1.05l-2.672-2.708A1.5 1.5 0 0015.879 2.25H6A2.25 
                       2.25 0 003.75 4.5v12A2.25 2.25 0 006 18.75h9" />
                                </svg>
                            </div>

                            <h3 className="text-lg font-semibold text-gray-700">
                                ไม่พบผลงาน
                            </h3>
                            <p className="text-gray-500 mt-1">
                                กรุณาค้นหา หรือ เลือกหมวดหมู่ใหม่ !
                            </p>

                        </div>
                    ) : (
                        achievements.map((achievement, idx) => (
                            <AchievementCard
                                key={idx}
                                achievement={achievement}
                                locale={locale}
                            />
                        ))
                    )}
                </div>
            </div>
        </section>
    )
}

export default Achievement;
