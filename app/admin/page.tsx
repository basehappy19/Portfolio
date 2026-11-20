import prisma from '@/lib/prisma';
import { Status } from '@/types/Achievements';
import { CategoriesProvider } from '@/app/contexts/CategoriesContext';
import AddAchievement from './Button/AddAchievement';
import SearchBar from './SearchBar';
import CategorySelectFilter from './CategorySelectFilter';
import StatusFilter from './StatusFilter';
import { AchievementModal } from './Modal/AchievementModal';
import { AchievementModalProvider } from '@/app/contexts/AchievementModalContext';
import AdminDashboard from './AdminDashboard';
import { auth } from '@/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
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
                icon: true,
                status: true,
                sortOrder: true,
                categories: {
                    orderBy: { sortOrder: "asc" },
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

    const statusCounts = await prisma.achievement.groupBy({ by: ["status"], _count: { _all: true } });
    const publicTotal = statusCounts.find((c) => c.status === "PUBLIC")?._count._all ?? 0;
    const draftTotal = statusCounts.find((c) => c.status === "DRAFT")?._count._all ?? 0;
    const totalCount = publicTotal + draftTotal;
    const nextSortOrder = (sortOrderAgg._max.sortOrder ?? 0) + 1;

    // Previously used organizers / locations, for autocomplete in the editor
    const uniquePairs = (pairs: Array<[string | null, string | null]>) => {
        const map = new Map<string, string>();
        for (const [th, en] of pairs) if (th && th.trim() && !map.has(th.trim())) map.set(th.trim(), (en ?? "").trim());
        return Array.from(map, ([th, en]) => ({ th, en }));
    };
    const suggestions = {
        givenBy: uniquePairs(achievements.map((a) => [a.given_by_th, a.given_by_en])),
        location: uniquePairs(achievements.map((a) => [a.location_th, a.location_en])),
    };


    const filtered = Boolean(categorySlug || search || statusValue);

    return (
        <CategoriesProvider categories={categories}>
            <AchievementModalProvider>
                <div className="min-h-screen bg-zinc-50 text-zinc-900">
                    <header className="sticky top-0 z-30 border-b border-zinc-200/80 bg-white/85 backdrop-blur-md">
                        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between gap-3 px-4 sm:px-6">
                            <div className="flex min-w-0 items-center gap-3">
                                <span className="flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-linear-to-br from-rose-500 to-rose-700 text-base font-bold text-white shadow-sm">P</span>
                                <div className="min-w-0 leading-tight">
                                    <p className="truncate text-[15px] font-bold">จัดการผลงาน</p>
                                    <p className="truncate text-xs text-zinc-500">Phakphumi Portfolio</p>
                                </div>
                            </div>
                            <Link
                                href="/"
                                className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900"
                            >
                                <ExternalLink className="h-4 w-4" />
                                <span className="hidden sm:inline">ดูหน้าเว็บ</span>
                            </Link>
                        </div>
                    </header>

                    <main className="mx-auto max-w-5xl px-4 pb-24 pt-6 sm:px-6 sm:pt-8">
                        <div className="flex flex-wrap items-end justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">ผลงานทั้งหมด</h1>
                                <div className="mt-2 flex flex-wrap gap-2 text-[13px] font-medium">
                                    <span className="rounded-full bg-white px-3 py-1 text-zinc-700 ring-1 ring-zinc-200">ทั้งหมด {totalCount}</span>
                                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700 ring-1 ring-emerald-200/70">เผยแพร่ {publicTotal}</span>
                                    <span className="rounded-full bg-amber-50 px-3 py-1 text-amber-700 ring-1 ring-amber-200/70">แบบร่าง {draftTotal}</span>
                                </div>
                            </div>
                            <AddAchievement />
                        </div>

                        <div className="mt-6 grid grid-cols-1 gap-2.5 rounded-2xl border border-zinc-200/80 bg-white p-2.5 shadow-2xs sm:grid-cols-[1fr_220px_210px]">
                            <SearchBar />
                            <CategorySelectFilter />
                            <StatusFilter />
                        </div>

                        <div className="mt-6">
                            <AdminDashboard achievements={achievements} filtered={filtered} />
                        </div>
                    </main>

                    <AchievementModal defaultSortOrder={nextSortOrder} suggestions={suggestions} />
                </div>
            </AchievementModalProvider>
        </CategoriesProvider>
    );
}
