import { PrismaClient } from "@/app/generated/prisma/client";
import { auth } from "@/auth";
import { ApiLink } from "@/types/Api";
import { PrismaPg } from "@prisma/adapter-pg";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    const connectionString = process.env.DATABASE_URL;
    const adapter = new PrismaPg({ connectionString });
    const prisma = new PrismaClient({ adapter });

    try {
        const body = await req.json();

        const {
            title_th,
            title_en,
            description_th,
            description_en,
            awardLevel_th,
            awardLevel_en,
            location_th,
            location_en,
            given_by_th,
            given_by_en,
            receivedAt,
            sortOrder = 0,
            status = "DRAFT",
            categorySlugs = [],
            links = [],
        }: {
            title_th: string;
            title_en: string;
            description_th?: string | null;
            description_en?: string | null;
            awardLevel_th?: string | null;
            awardLevel_en?: string | null;
            location_th?: string | null;
            location_en?: string | null;
            given_by_th?: string | null;
            given_by_en?: string | null;
            receivedAt?: string | null;
            sortOrder?: number;
            status?: "PUBLIC" | "DRAFT";
            categorySlugs?: string[];
            links?: ApiLink[];
        } = body;

        if (!title_th || !title_en) {
            return NextResponse.json(
                { error: "title_th และ title_en เป็นข้อมูลบังคับ" },
                { status: 400 }
            );
        }

        const categories =
            categorySlugs.length > 0
                ? await prisma.category.findMany({
                      where: { slug: { in: categorySlugs } },
                  })
                : [];

        const achievement = await prisma.achievement.create({
            data: {
                title_th,
                title_en,
                description_th: description_th ?? null,
                description_en: description_en ?? null,
                awardLevel_th: awardLevel_th ?? null,
                awardLevel_en: awardLevel_en ?? null,
                location_th: location_th ?? null,
                location_en: location_en ?? null,
                given_by_th: given_by_th ?? null,
                given_by_en: given_by_en ?? null,
                receivedAt: receivedAt ?? null,
                sortOrder,
                status,

                categories: {
                    create: categories.map((cat, index) => ({
                        categoryId: cat.id,
                        sortOrder: index,
                    })),
                },

                links: {
                    create: (links as ApiLink[]).map((link) => ({
                        label_th: link.label_th,
                        label_en: link.label_en,
                        url: link.url,
                        sortOrder: link.sortOrder ?? 0,
                    })),
                },
            },
            include: {
                categories: { include: { category: true } },
                images: true,
                links: true,
            },
        });

        return NextResponse.json(achievement, { status: 201 });
    } catch (error) {
        console.error("POST /api/admin/achievements error", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
