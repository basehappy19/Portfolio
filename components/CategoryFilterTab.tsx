import { PrismaClient } from '@/app/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { getLocale, getTranslations } from 'next-intl/server';
import CategoryButton from './Button/CategoryButton';
import AllButton from './Button/AllButton';

export type UiCategory = {
    id: number;
    name: string;
    slug: string;
    totalAchievements: number;
};

export type slugCurrentCategory = string | null;

const CategoryFilterTab = async ({
    slugCurrentCategory,
}: {
    slugCurrentCategory?: slugCurrentCategory;
}) => {
    const locale = await getLocale();
    const t = await getTranslations('Index');
    const AllButtonLabel = t('Achievement.Buttons.AllButtonLabel');

    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
        throw new Error('DATABASE_URL is not defined');
    }

    const adapter = new PrismaPg({ connectionString });
    const prisma = new PrismaClient({ adapter });

    const categoriesRaw = await prisma.category.findMany({
        select: {
            id: true,
            name_th: true,
            name_en: true,
            slug: true,
            _count: {
                select: {
                    achievements: {
                        where: {
                            achievement: {
                                status: 'PUBLIC',
                            },
                        },
                    },
                },
            },
        },
    });

    const categories: UiCategory[] = categoriesRaw.map((cat) => ({
        id: cat.id,
        name: locale === 'th' ? cat.name_th : cat.name_en,
        slug: cat.slug,
        totalAchievements: cat._count.achievements,
    }));

    const totalAchievements = await prisma.achievement.count({
        where: {
            status: 'PUBLIC',
        },
    });

    const currentCategory =
        categories.find((cat) => cat.slug === slugCurrentCategory) ?? null;

    const currentFilterText = currentCategory
        ? locale === 'th'
            ? `กำลังค้นหาหมวด: ${currentCategory.name}`
            : `Current category: ${currentCategory.name}`
        : ``

    return (
        <div className="space-y-3">
            <div className="text-sm text-zinc-600 dark:text-zinc-400">
                {currentFilterText}
            </div>

            <div className="flex flex-wrap gap-3 mb:mb-0 mb-6">
                <AllButton
                    TotalAchievements={totalAchievements}
                    AllButtonLabel={AllButtonLabel}
                    slugCurrentCategory={slugCurrentCategory}
                />

                {categories.map((category) => (
                    <CategoryButton
                        key={category.id}
                        slugCurrentCategory={slugCurrentCategory}
                        category={category}
                    />
                ))}
            </div>
        </div>
    );
};

export default CategoryFilterTab;