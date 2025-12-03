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
import Link from 'next/link';
import { Home, Award, Filter } from 'lucide-react';


export default async function AdminPage(props: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const session = await auth.api.getSession({
        headers: await headers(),
    })
    if (!session) {
        redirect("/");
    }
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
        orderBy: {
            sortOrder: "desc"
        }
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
    
    const publicCount = achievements.filter(a => a.status === 'PUBLIC').length;
    const draftCount = achievements.filter(a => a.status === 'DRAFT').length;
    const totalImages = achievements.reduce((sum, a) => sum + a.images.length, 0);
    const sortOrderAgg = await prisma.achievement.aggregate({
        _max: {
            sortOrder: true,
        },
    });

    const nextSortOrder = (sortOrderAgg._max.sortOrder ?? 0) + 1;
    
    return (
        <CategoriesProvider categories={categories}>
            <AchievementModalProvider>
                <div className="min-h-screen bg-linear-to-br from-gray-50 via-red-50 to-rose-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
                    {/* Top Navigation Bar */}
                    <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-30 shadow-sm">
                        <div className="max-w-7xl mx-auto px-4 md:px-8">
                            <div className="flex items-center justify-between h-16">
                                <div className="flex items-center gap-4">
                                    <Link
                                        href="/"
                                        className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all group"
                                    >
                                        <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                        <span className="font-medium hidden sm:inline">หน้าหลัก</span>
                                    </Link>
                                    <div className="h-6 w-px bg-gray-300 dark:bg-gray-700"></div>
                                    <div className="flex items-center gap-2">
                                        <Award className="w-6 h-6 text-red-600 dark:text-red-400" />
                                        <h2 className="text-lg font-bold text-gray-900 dark:text-white sm:inline">
                                            ระบบจัดการผลงาน
                                        </h2>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="hidden md:flex items-center gap-4 px-4 py-2">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                                                {achievements.length}
                                            </div>
                                            <div className="text-xs text-gray-600 dark:text-gray-400">ทั้งหมด</div>
                                        </div>
                                        <div className="h-8 w-px bg-gray-300 dark:bg-gray-600"></div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                                                {publicCount}
                                            </div>
                                            <div className="text-xs text-gray-600 dark:text-gray-400">เผยแพร่</div>
                                        </div>
                                        <div className="h-8 w-px bg-gray-300 dark:bg-gray-600"></div>
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                                                {draftCount}
                                            </div>
                                            <div className="text-xs text-gray-600 dark:text-gray-400">แบบร่าง</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="max-w-7xl mx-auto p-4 md:p-8">
                        {/* Header Section with Stats */}
                        <div className="mb-6">
                            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-800">
                                {/* Gradient Header */}
                                <div className="bg-red-500 p-6 md:p-8">
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                        <div className="text-white">
                                            <div className="flex items-center gap-3 mb-2">

                                                <div>
                                                    <h1 className="text-3xl md:text-4xl font-bold">
                                                        จัดการผลงาน
                                                    </h1>
                                                    <p className="text-red-100 text-sm mt-1">
                                                        ระบบจัดการและติดตามผลงานรางวัล
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <AddAchievement />
                                    </div>
                                </div>

                                {/* Stats Cards - Mobile View */}
                                <div className="md:hidden grid grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-800">
                                    <div className="text-center p-3 bg-white dark:bg-gray-900 rounded-lg">
                                        <div className="text-xl font-bold text-red-600 dark:text-red-400">
                                            {achievements.length}
                                        </div>
                                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">ทั้งหมด</div>
                                    </div>
                                    <div className="text-center p-3 bg-white dark:bg-gray-900 rounded-lg">
                                        <div className="text-xl font-bold text-green-600 dark:text-green-400">
                                            {publicCount}
                                        </div>
                                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">เผยแพร่</div>
                                    </div>
                                    <div className="text-center p-3 bg-white dark:bg-gray-900 rounded-lg">
                                        <div className="text-xl font-bold text-gray-600 dark:text-gray-400">
                                            {draftCount}
                                        </div>
                                        <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">แบบร่าง</div>
                                    </div>
                                </div>

                                {/* Additional Stats */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 border-t border-gray-200 dark:border-gray-800">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center shadow-lg">
                                            <Award className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                                {achievements.length}
                                            </div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">ผลงานทั้งหมด</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center shadow-lg">
                                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                                {publicCount}
                                            </div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">เผยแพร่แล้ว</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                                {totalImages}
                                            </div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">รูปภาพ</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                                            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <div className="text-2xl font-bold text-gray-900 dark:text-white">
                                                {categories.length}
                                            </div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">หมวดหมู่</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Filters Section */}
                        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 mb-6 border border-gray-200 dark:border-gray-800">
                            <div className="flex items-center gap-2 mb-4">
                                <Filter className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                    ตัวกรองข้อมูล
                                </h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <SearchBar />
                                <CategorySelectFilter />
                                <StatusFilter />
                            </div>
                        </div>

                        <AdminAchievementsTable
                            achievements={achievements}
                            achievementsBase={ACHIEVEMENTS_BASE}
                        />
                    </div>

                    <AchievementModal defaultSortOrder={nextSortOrder} />
                </div>
            </AchievementModalProvider>
        </CategoriesProvider>
    )
}