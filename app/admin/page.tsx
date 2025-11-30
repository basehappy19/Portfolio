import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@/app/generated/prisma/client';
import { Status } from '@/types/Achievements';
import { CategoriesProvider } from '@/app/contexts/CategoriesContext';
import AddAchievement from './Button/AddAchievement';
import SearchBar from './SearchBar';
import CategorySelectFilter from './CategorySelectFilter';
import StatusFilter from './StatusFilter';
import { AchievementModal } from './Modal/AchievementModal';
import { AchievementModalProvider } from '@/app/contexts/AchievementModalContext';
import { AdminAchievementsTable } from './AdminAchievementsTable';
import { auth } from '@/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function AdminPage(props: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const searchParams = await props.searchParams;
    const categorySlug = typeof searchParams.category === "string"
        ? searchParams.category
        : undefined;
    const search = typeof searchParams.search === "string"
        ? searchParams.search
        : undefined;

    const connectionString = process.env.DATABASE_URL;
    const adapter = new PrismaPg({ connectionString });
    const prisma = new PrismaClient({ adapter });

    const statusValue: Status | undefined =
        typeof searchParams.status === "string" &&
            ["DRAFT", "PUBLIC"].includes(searchParams.status.toUpperCase())
            ? (searchParams.status.toUpperCase() as Status)
            : undefined;

    const achievements = await prisma.achievement.findMany({
        where: {
            // 1) filter by categorySlug
            categories: categorySlug
                ? {
                    some: {
                        category: { slug: categorySlug },
                    },
                }
                : undefined,

            OR: search
                ? [
                    { title_th: { contains: search, mode: "insensitive" } },
                    { title_en: { contains: search, mode: "insensitive" } },
                    { description_th: { contains: search, mode: "insensitive" } },
                    { description_en: { contains: search, mode: "insensitive" } },
                ]
                : undefined,

            status: statusValue
        },

        select: {
            id: true,
            title_th: true,
            title_en: true,
            description_th: true,
            description_en: true,
            awardLevel_th: true,
            awardLevel_en: true,
            location_th: true,
            location_en: true,
            receivedAt: true,
            status: true,
            sortOrder: true,
            categories: {
                select: {
                    category: {
                        select: {
                            id: true,
                            name_th: true,
                            name_en: true,
                            slug: true,
                            createdAt: true,
                            updatedAt: true,
                        },
                    },
                },
            },
            images: {
                select: {
                    id: true,
                    url: true,
                    altText_th: true,
                    altText_en: true,
                    sortOrder: true,
                    createdAt: true,
                    updatedAt: true,
                },
            },
            links: true,
            createdAt: true,
            updatedAt: true,
        },
    });

    const categories = await prisma.category.findMany({
        select: {
            id: true,
            name_th: true,
            name_en: true,
            slug: true,
        },
    });

    const ACHIEVEMENTS_BASE =
        process.env.NEXT_PUBLIC_ACHIEVEMENTS_PUBLIC_BASE ?? "/achievements";
    const session = await auth.api.getSession({
        headers: await headers(),
    })
    if(!session) {
        redirect("/");
    }
    return (
        <CategoriesProvider categories={categories}>
            <AchievementModalProvider>
                <div className="min-h-screen bg-gray-50 dark:bg-[#1a1d23] p-4 md:p-8">
                    <div className="max-w-7xl mx-auto">
                        {/* Header */}
                        <div className="bg-white dark:bg-[#282c33] rounded-lg shadow-sm p-6 mb-6">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                        จัดการผลงาน
                                    </h1>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        ทั้งหมด {achievements.length} ผลงาน
                                    </p>
                                </div>
                                <AddAchievement />
                            </div>
                        </div>

                        {/* Filters */}
                        <div className="bg-white dark:bg-[#282c33] rounded-lg shadow-sm p-6 mb-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <SearchBar />
                                <CategorySelectFilter />
                                <StatusFilter />
                            </div>
                        </div>

                        {/* Table */}
                        <AdminAchievementsTable
                            achievements={achievements}
                            achievementsBase={ACHIEVEMENTS_BASE}
                        />
                    </div>

                    <AchievementModal />


                </div>
            </AchievementModalProvider>
        </CategoriesProvider>
    )
}
