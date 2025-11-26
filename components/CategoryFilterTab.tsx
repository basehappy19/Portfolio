import { PrismaClient } from '@/app/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { getLocale, getTranslations } from 'next-intl/server';
import { Category } from './Achievement';
import CategoryButton from './CategoryButton';
import AllButton from './AllButton';

const CategoryFilterTab = async ({ currentCategory }: { currentCategory: Category | null }) => {
    const locale = await getLocale();
    const t = await getTranslations("Index");
    const AllButtonLabel = t("Achievement.Buttons.AllButtonLabel");

    const connectionString = process.env.DATABASE_URL;
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
                    achievements: true
                }
            }
        }
    });

    const categories = categoriesRaw.map(cat => ({
        id: cat.id,
        name: locale === "th" ? cat.name_th : cat.name_en,
        slug: cat.slug,
        totalAchievements: cat._count.achievements
    }));

    const totalAchievements = await prisma.achievement.count();

    return (
        <div className="flex flex-wrap gap-3">
            <AllButton TotalAchievements={totalAchievements} AllButtonLabel={AllButtonLabel} CurrentCategory={currentCategory} />

            {categories.map((category, idx) => (
                <CategoryButton key={idx} currentCategory={currentCategory} category={category} />
            ))}
        </div>
    )
}

export default CategoryFilterTab