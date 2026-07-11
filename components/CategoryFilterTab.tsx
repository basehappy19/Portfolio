import prisma from '@/lib/prisma';
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
        orderBy: {
            id: "asc",
        }
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
        <div className="space-y-3 mb-6">
            {currentFilterText && (
                <div className="text-xs sm:text-sm font-medium text-zinc-600 dark:text-zinc-400 px-1">
                    {currentFilterText}
                </div>
            )}

            {/* Category Pill Tag Cloud: Balanced flex-wrap centered on mobile (`justify-center sm:justify-start`), tap right away without scrolling */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 sm:gap-2.5 py-1 w-full">
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