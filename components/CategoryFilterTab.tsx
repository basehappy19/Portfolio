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

            {/* Horizontal Scrollable Category Bar on Mobile/Tablet (`overflow-x-auto no-scrollbar`), Clean Wrap on Desktop */}
            <div className="relative w-full -mx-2 px-2 sm:mx-0 sm:px-0">
                {/* Left/Right Subtle Fade Masks for Mobile Horizontal Swipe Hint */}
                <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-slate-50 dark:from-zinc-950 to-transparent pointer-events-none z-10 sm:hidden opacity-80" />
                <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-slate-50 dark:from-zinc-950 to-transparent pointer-events-none z-10 sm:hidden opacity-90" />

                <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto no-scrollbar scroll-smooth py-1.5 px-1 w-full snap-x snap-mandatory sm:flex-wrap sm:justify-start">
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
        </div>
    );
};

export default CategoryFilterTab;