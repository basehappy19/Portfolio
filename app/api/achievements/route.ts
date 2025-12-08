import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { NextResponse } from "next/server";

const connectionString = process.env.DATABASE_URL;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const category = searchParams.get("category");

        const baseSelect = {
            id: true,
            title_th: true,
            description_th: true,
            awardLevel_th: true,
            location_th: true,
            given_by_th: true,

            title_en: true,
            description_en: true,
            awardLevel_en: true,
            location_en: true,
            given_by_en: true,

            status: true,
            sortOrder: true,
            receivedAt: true,
            createdAt: true,
            updatedAt: true,

            images: true,
            links: true,
        };

        let achievements;

        // ✔ ถ้ามี category → filter categories.some.category.slug
        if (category) {
            achievements = await prisma.achievement.findMany({
                select: {
                    ...baseSelect,
                    categories: {
                        select: {
                            category: true, // select all fields
                        },
                    },
                },
                where: {
                    status: "PUBLIC",
                    categories: {
                        some: {
                            category: { slug: category },
                        },
                    },
                },
                orderBy: { receivedAt: "desc" },
            });
        }
        // ✔ ถ้าไม่มี category → ดึงทั้งหมด (เวอร์ชัน select เฉพาะ)
        else {
            achievements = await prisma.achievement.findMany({
                select: {
                    ...baseSelect,
                    categories: {
                        select: {
                            category: {
                                select: {
                                    id: true,
                                    name_en: true,
                                    name_th: true,
                                    slug: true,
                                },
                            },
                        },
                    },
                },
                where: {
                    status: "PUBLIC",
                },
                orderBy: { receivedAt: "desc" },
            });
        }

        return NextResponse.json({ ok: true, achievements });
    } catch (error) {
        console.error("GET /api/achievements error:", error);
        return NextResponse.json(
            { ok: false, error: "Failed to fetch achievements" },
            { status: 500 }
        );
    }
}
