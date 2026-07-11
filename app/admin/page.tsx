import prisma from '@/lib/prisma';
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
import { getLocale } from 'next-intl/server';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
    const locale = await getLocale();
    const isTH = locale === "th";

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";
    const path = "/admin";
    const url = `${baseUrl}${path}`;

    const title = isTH
        ? "ระบบจัดการผลงาน | พอร์ตฟอลิโอของผม"
        : "Achievements Admin Panel | My Portfolio";

    const description = isTH
        ? "ระบบหลังบ้านสำหรับจัดการผลงาน รางวัล และข้อมูลในพอร์ตฟอลิโอของผม"
        : "Admin dashboard for managing achievements, awards, and portfolio content.";

    const image = process.env.NEXT_PUBLIC_OG_IMAGE_URL ?? "";

    return {
        title,
        description,
        keywords: isTH
            ? [
                "ระบบจัดการผลงาน",
                "แอดมิน",
                "พอร์ตฟอลิโอ",
                "ผลงาน",
                "จัดการเนื้อหา",
            ]
            : [
                "admin",
                "dashboard",
                "achievements",
                "portfolio admin",
                "content management",
            ],

        openGraph: {
            title,
            description,
            url,
            siteName: isTH ? "พอร์ตฟอลิโอของผม" : "My Portfolio",
            images: [
                {
                    url: image,
                    width: 1200,
                    height: 630,
                    alt: isTH ? "ระบบจัดการผลงาน" : "Achievements Admin Panel",
                },
            ],
            locale,
            type: "website",
        },

        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [image],
        },

        alternates: {
            canonical: url,
            languages: {
                en: `${baseUrl}/en${path}`,
                th: `${baseUrl}/th${path}`,
            },
        },

        robots: {
            index: false,
            follow: false,
        },
    };
}

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


    const statusValue: Status | undefined =
        typeof searchParams.status === "string" &&
            ["DRAFT", "PUBLIC"].includes(searchParams.status.toUpperCase())
            ? (searchParams.status.toUpperCase() as Status)
            : undefined;

    const [achievements, categories, sortOrderAgg] = await Promise.all([
        prisma.achievement.findMany({
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
                given_by_th: true,
                given_by_en: true,
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
                    orderBy: {
                        sortOrder: "asc",
                    },
                },
                links: {
                    orderBy: {
                        sortOrder: "asc",
                    },
                },
                createdAt: true,
                updatedAt: true,
            },

            orderBy: {
                sortOrder: "desc",
            },
        }),
        prisma.category.findMany({
            select: {
                id: true,
                name_th: true,
                name_en: true,
                slug: true,
            },
            orderBy: {
                id: "asc",
            }
        }),
        prisma.achievement.aggregate({
            _max: {
                sortOrder: true,
            },
        })
    ]);

    const publicCount = achievements.filter((a: any) => a.status === 'PUBLIC').length;
    const draftCount = achievements.filter((a: any) => a.status === 'DRAFT').length;

    const totalImages = achievements.reduce((sum: number, a: any) => sum + a.images.length, 0);
    const nextSortOrder = (sortOrderAgg._max.sortOrder ?? 0) + 1;


    return (
        <CategoriesProvider categories={categories}>
            <AchievementModalProvider>
                <div className="min-h-screen bg-linear-to-br from-gray-50 via-rose-50/30 to-red-50/40 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-900/90 text-gray-900 dark:text-gray-100 transition-colors duration-300">
                    {/* Top Glassmorphism Navigation Bar */}
                    <header className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-gray-200/80 dark:border-zinc-800/80 sticky top-0 z-30 shadow-2xs">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                            <div className="flex items-center justify-between h-16 gap-4">
                                <div className="flex items-center gap-2 sm:gap-3.5">
                                    <Link
                                        href="/"
                                        className="group flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-gray-100/80 hover:bg-rose-50 dark:bg-zinc-800/80 dark:hover:bg-rose-950/40 text-gray-700 hover:text-rose-600 dark:text-gray-300 dark:hover:text-rose-400 transition-all shadow-2xs"
                                    >
                                        <Home className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                                        <span className="hidden sm:inline">หน้าหลัก (Home)</span>
                                    </Link>
                                    <div className="h-5 w-px bg-gray-200 dark:bg-zinc-800"></div>
                                    <div className="flex items-center gap-2">
                                        <div className="bg-linear-to-tr from-rose-600 to-red-500 p-1.5 rounded-lg text-white shadow-sm shadow-rose-500/20">
                                            <Award className="w-4 h-4 sm:w-5 sm:h-5" />
                                        </div>
                                        <h2 className="text-sm sm:text-base md:text-lg font-extrabold tracking-tight bg-linear-to-r from-gray-900 via-gray-800 to-gray-600 dark:from-white dark:via-zinc-200 dark:to-zinc-400 bg-clip-text text-transparent">
                                            ระบบจัดการผลงาน <span className="hidden sm:inline font-normal text-xs text-gray-500 dark:text-zinc-400">(Studio Admin)</span>
                                        </h2>
                                    </div>
                                </div>

                                <div className="flex items-center gap-1.5 sm:gap-2.5 text-xs">
                                    <span className="px-2.5 py-1 rounded-full bg-gray-100 dark:bg-zinc-800 font-semibold text-gray-700 dark:text-gray-300 border border-gray-200/60 dark:border-zinc-700">
                                        ทั้งหมด: <strong className="text-rose-600 dark:text-rose-400">{achievements.length}</strong>
                                    </span>
                                    <span className="hidden xs:inline-block px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-200/60 dark:border-emerald-800/60">
                                        เผยแพร่: <strong>{publicCount}</strong>
                                    </span>
                                    <span className="hidden sm:inline-block px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 font-semibold border border-amber-200/60 dark:border-amber-800/60">
                                        แบบร่าง: <strong>{draftCount}</strong>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </header>

                    <main className="max-w-7xl mx-auto p-4 sm:p-6 md:p-8 space-y-6 sm:space-y-8">
                        {/* Premium Hero Banner */}
                        <div className="bg-linear-to-r from-zinc-900 via-zinc-800 to-zinc-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-zinc-800 relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                            <div className="absolute -right-12 -top-12 w-48 h-48 bg-rose-500/20 rounded-full blur-3xl pointer-events-none"></div>
                            <div className="absolute -left-12 -bottom-12 w-48 h-48 bg-red-500/10 rounded-full blur-3xl pointer-events-none"></div>
                            
                            <div className="relative z-10 space-y-1.5 max-w-2xl">
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30 mb-1">
                                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse"></span>
                                    <span>Workspace Management</span>
                                </div>
                                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                                    จัดการพอร์ตฟอลิโอและผลงาน
                                </h1>
                                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                                    เพิ่ม แก้ไข จัดเรียงลำดับ หรือปรับสถานะการเผยแพร่ผลงานของคุณบนหน้าเว็บไซต์จริง รองรับการใช้งานเต็มรูปแบบทุกขนาดหน้าจอ
                                </p>
                            </div>

                            <div className="relative z-10 shrink-0">
                                <AddAchievement />
                            </div>
                        </div>

                        {/* Interactive Metric Cards (4 Grid) */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 sm:p-5 border border-gray-200/80 dark:border-zinc-800 shadow-2xs hover:shadow-md transition-all flex items-center gap-3.5 group">
                                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200/60 dark:border-rose-800/60 flex items-center justify-center text-rose-600 dark:text-rose-400 group-hover:scale-105 transition-transform shrink-0">
                                    <Award className="w-5 h-5 sm:w-6 sm:h-6" />
                                </div>
                                <div className="min-w-0">
                                    <div className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white truncate">
                                        {achievements.length}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-zinc-400 font-medium truncate">
                                        ผลงานทั้งหมด
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 sm:p-5 border border-gray-200/80 dark:border-zinc-800 shadow-2xs hover:shadow-md transition-all flex items-center gap-3.5 group">
                                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform shrink-0">
                                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <div className="min-w-0">
                                    <div className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white truncate">
                                        {publicCount}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-zinc-400 font-medium truncate">
                                        เผยแพร่แล้ว (Public)
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 sm:p-5 border border-gray-200/80 dark:border-zinc-800 shadow-2xs hover:shadow-md transition-all flex items-center gap-3.5 group">
                                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/60 dark:border-amber-800/60 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:scale-105 transition-transform shrink-0">
                                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div className="min-w-0">
                                    <div className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white truncate">
                                        {draftCount}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-zinc-400 font-medium truncate">
                                        แบบร่าง (Drafts)
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 sm:p-5 border border-gray-200/80 dark:border-zinc-800 shadow-2xs hover:shadow-md transition-all flex items-center gap-3.5 group">
                                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-violet-50 dark:bg-violet-950/40 border border-violet-200/60 dark:border-violet-800/60 flex items-center justify-center text-violet-600 dark:text-violet-400 group-hover:scale-105 transition-transform shrink-0">
                                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div className="min-w-0">
                                    <div className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-white truncate">
                                        {totalImages} <span className="text-xs font-normal text-gray-400">({categories.length} หมวด)</span>
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-zinc-400 font-medium truncate">
                                        รูปภาพและหมวดหมู่
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Filters & Search Control Bar */}
                        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xs border border-gray-200/80 dark:border-zinc-800 p-4 sm:p-5 space-y-3 sm:space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <div className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-700 dark:text-gray-300">
                                        <Filter className="w-4 h-4 text-rose-500" />
                                    </div>
                                    <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white">
                                        ค้นหาและกรองข้อมูล (Filter & Search)
                                    </h3>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                <SearchBar />
                                <CategorySelectFilter />
                                <StatusFilter />
                            </div>
                        </div>

                        {/* Main Responsive Hybrid Table / Grid Section */}
                        <AdminAchievementsTable
                            achievements={achievements}
                        />
                    </main>

                    <AchievementModal defaultSortOrder={nextSortOrder} />
                </div>
            </AchievementModalProvider>
        </CategoriesProvider>
    );
}