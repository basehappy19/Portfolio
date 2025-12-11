import { Prisma, PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { NextRequest, NextResponse } from "next/server";
import { ApiImage, ApiLink } from "@/types/Api";
import { headers } from "next/headers";
import { auth } from "@/auth";
import { supabaseServerClient } from "@/lib/supabaseServer";

const connectionString = process.env.DATABASE_URL;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    try {
        const { id: achievementId } = await params;
        const body = await req.json();

        const {
            title_th,
            title_en,
            description_th,
            description_en,
            location_th,
            location_en,
            given_by_th,
            given_by_en,
            awardLevel_th,
            awardLevel_en,
            receivedAt,
            sortOrder,
            status,
            categorySlugs = [],
            images = [],
            links = [],
        }: {
            title_th?: string;
            title_en?: string;
            description_th?: string | null;
            description_en?: string | null;
            location_th?: string | null;
            location_en?: string | null;
            given_by_th?: string | null;
            given_by_en?: string | null;
            awardLevel_th?: string | null;
            awardLevel_en?: string | null;
            receivedAt?: string | null;
            sortOrder?: number;
            status?: "PUBLIC" | "DRAFT";
            categorySlugs?: string[];
            images?: ApiImage[];
            links?: ApiLink[];
        } = body;

        const existing = await prisma.achievement.findFirst({
            where: { id: achievementId },
            include: {
                images: true,
                links: true,
            },
        });

        if (!existing) {
            return NextResponse.json(
                { error: "Achievement not found" },
                { status: 404 }
            );
        }

        const categories =
            categorySlugs.length > 0
                ? await prisma.category.findMany({
                      where: { slug: { in: categorySlugs } },
                  })
                : [];

        await prisma.achievementsOnCategories.deleteMany({
            where: { achievementId },
        });

        if (categories.length > 0) {
            await prisma.achievementsOnCategories.createMany({
                data: categories.map((cat, index) => ({
                    achievementId,
                    categoryId: cat.id,
                    sortOrder: index,
                })),
            });
        }

        const imagePayload = images as ApiImage[];

        const imageIdsToKeep = new Set(
            imagePayload.filter((img) => img.id).map((img) => String(img.id))
        );

        const imagesToDelete = existing.images.filter(
            (img) => !imageIdsToKeep.has(String(img.id))
        );

        if (imagesToDelete.length > 0) {
            const pathsToDelete: string[] = [];

            for (const img of imagesToDelete) {
                if (!img.url) continue;

                try {
                    const url = new URL(img.url);
                    const prefix = "/storage/v1/object/public/achievements/";
                    const idx = url.pathname.indexOf(prefix);

                    if (idx !== -1) {
                        const pathInBucket = url.pathname.substring(
                            idx + prefix.length
                        );
                        pathsToDelete.push(pathInBucket);
                    } else {
                        pathsToDelete.push(img.url);
                    }
                } catch {
                    pathsToDelete.push(img.url);
                }
            }

            if (pathsToDelete.length > 0) {
                const { error: deleteError } =
                    await supabaseServerClient.storage
                        .from("achievements")
                        .remove(pathsToDelete);

                if (deleteError) {
                    console.warn(
                        "Failed to delete images from Supabase:",
                        deleteError
                    );
                }
            }

            // ลบ record image จาก DB
            await prisma.achievementImage.deleteMany({
                where: {
                    id: { in: imagesToDelete.map((img) => img.id) },
                },
            });
        }

        for (const img of imagePayload) {
            let url = img.preview;

            if (url.startsWith("/achievements/")) {
                const parts = url.split("/");
                url = parts[parts.length - 1];
            }

            if (img.id) {
                await prisma.achievementImage.update({
                    where: { id: img.id },
                    data: {
                        url,
                        altText_th: img.altText_th ?? null,
                        altText_en: img.altText_en ?? null,
                        sortOrder: img.sortOrder ?? 0,
                    },
                });
            } else {
                await prisma.achievementImage.create({
                    data: {
                        achievementId,
                        url,
                        altText_th: img.altText_th ?? null,
                        altText_en: img.altText_en ?? null,
                        sortOrder: img.sortOrder ?? 0,
                    },
                });
            }
        }

        // --- links ---
        const linkPayload = links as ApiLink[];

        const linkIdsToKeep = linkPayload
            .filter((l) => l.id)
            .map((l) => l.id!) as string[];

        await prisma.achievementLink.deleteMany({
            where: {
                achievementId,
                ...(linkIdsToKeep.length > 0
                    ? { id: { notIn: linkIdsToKeep } }
                    : {}),
            },
        });

        for (const link of linkPayload) {
            if (link.id) {
                await prisma.achievementLink.update({
                    where: { id: link.id },
                    data: {
                        label_th: link.label_th,
                        label_en: link.label_en,
                        url: link.url,
                        sortOrder: link.sortOrder ?? 0,
                    },
                });
            } else {
                await prisma.achievementLink.create({
                    data: {
                        achievementId,
                        label_th: link.label_th,
                        label_en: link.label_en,
                        url: link.url,
                        sortOrder: link.sortOrder ?? 0,
                    },
                });
            }
        }

        // --- achievement fields ---
        const updateData: Prisma.AchievementUpdateInput = {};

        if (title_th !== undefined) updateData.title_th = title_th;
        if (title_en !== undefined) updateData.title_en = title_en;
        if (description_th !== undefined)
            updateData.description_th = description_th ?? null;
        if (description_en !== undefined)
            updateData.description_en = description_en ?? null;
        if (location_th !== undefined)
            updateData.location_th = location_th ?? null;
        if (location_en !== undefined)
            updateData.location_en = location_en ?? null;
        if (given_by_th !== undefined)
            updateData.given_by_th = given_by_th ?? null;
        if (given_by_en !== undefined)
            updateData.given_by_en = given_by_en ?? null;
        if (awardLevel_th !== undefined)
            updateData.awardLevel_th = awardLevel_th ?? null;
        if (awardLevel_en !== undefined)
            updateData.awardLevel_en = awardLevel_en ?? null;
        if (receivedAt !== undefined)
            updateData.receivedAt = receivedAt ?? null;
        if (sortOrder !== undefined) updateData.sortOrder = sortOrder;
        if (status !== undefined) updateData.status = status;

        const allImages = await prisma.achievementImage.findMany({
            where: { achievementId },
            orderBy: {
                sortOrder: "asc",
            },
        });

        for (let index = 0; index < allImages.length; index++) {
            const img = allImages[index];
            await prisma.achievementImage.update({
                where: { id: img.id },
                data: { sortOrder: index + 1 },
            });
        }

        const updated = await prisma.achievement.update({
            where: { id: achievementId },
            data: updateData,
            include: {
                categories: { include: { category: true } },
                images: {
                    orderBy: {
                        sortOrder: "asc",
                    },
                },
                links: {
                    orderBy: {
                        sortOrder: "asc",
                    },
                },
            },
        });

        return NextResponse.json(updated, { status: 200 });
    } catch (error) {
        console.error("PUT /api/admin/achievements/[id] error", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    try {
        const { id: achievementId } = await params;

        const existing = await prisma.achievement.findUnique({
            where: { id: achievementId },
            include: {
                images: true,
            },
        });

        if (!existing) {
            return NextResponse.json(
                { error: "Achievement not found" },
                { status: 404 }
            );
        }

        const pathsToDelete: string[] = [];

        for (const img of existing.images) {
            if (!img.url) continue;

            try {
                const url = new URL(img.url);
                const prefix = "/storage/v1/object/public/achievements/";
                const idx = url.pathname.indexOf(prefix);

                if (idx !== -1) {
                    const pathInBucket = url.pathname.substring(
                        idx + prefix.length
                    );
                    pathsToDelete.push(pathInBucket);
                } else {
                    pathsToDelete.push(img.url);
                }
            } catch {
                pathsToDelete.push(img.url);
            }
        }

        if (pathsToDelete.length > 0) {
            const { error: deleteError } = await supabaseServerClient.storage
                .from("achievements") // ชื่อ bucket
                .remove(pathsToDelete);

            if (deleteError) {
                console.warn(
                    "Failed to delete files from Supabase:",
                    deleteError
                );
            }
        }

        // 🗂️ ลบ relation / records ใน DB ตามเดิม
        await prisma.achievementsOnCategories.deleteMany({
            where: { achievementId },
        });

        await prisma.achievementImage.deleteMany({
            where: { achievementId },
        });

        await prisma.achievementLink.deleteMany({
            where: { achievementId },
        });

        await prisma.achievement.delete({
            where: { id: achievementId },
        });

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (error) {
        console.error("DELETE /api/admin/achievements/[id] error", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
