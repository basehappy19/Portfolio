import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { NextRequest, NextResponse } from "next/server";

type ApiImage = {
    id?: number;
    preview: string;
    altText_th?: string | null;
    altText_en?: string | null;
    sortOrder?: number;
};

type ApiLink = {
    id?: number;
    label_th: string;
    label_en: string;
    url: string;
    sortOrder?: number;
};

export async function POST(req: NextRequest) {
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
            receivedAt,
            sortOrder = 0,
            status = "DRAFT",
            categorySlugs = [],
            images = [],
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
            receivedAt?: string | null;
            sortOrder?: number;
            status?: "PUBLIC" | "DRAFT";
            categorySlugs?: string[];
            images?: ApiImage[];
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
                receivedAt: receivedAt ?? null,
                sortOrder,
                status,

                categories: {
                    create: categories.map((cat, index) => ({
                        categoryId: cat.id,
                        sortOrder: index,
                    })),
                },

                images: {
                    create: (images as ApiImage[])
                        .filter((img) => typeof img.preview === "string")
                        .map((img) => {
                            let url = img.preview;
                            if (url.startsWith("/achievements/")) {
                                url = url.replace("/achievements/", "");
                            }

                            return {
                                url,
                                altText_th: img.altText_th ?? null,
                                altText_en: img.altText_en ?? null,
                                sortOrder: img.sortOrder ?? 0,
                            };
                        }),
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
