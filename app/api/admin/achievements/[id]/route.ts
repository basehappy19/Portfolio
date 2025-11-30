import { Prisma, PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { unlink } from "fs/promises";

type ApiImage = {
    id?: string;
    preview: string;
    altText_th?: string | null;
    altText_en?: string | null;
    sortOrder?: number;
};

type ApiLink = {
    id?: string;
    label_th: string;
    label_en: string;
    url: string;
    sortOrder?: number;
};

const connectionString = process.env.DATABASE_URL;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {

    try {
        const { id: achievementId } = await params;
        const body = await req.json();

        const {
            title_th,
            title_en,
            description_th,
            description_en,
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
            sortOrder?: number;
            status?: "PUBLIC" | "DRAFT";
            categorySlugs?: string[];
            images?: ApiImage[];
            links?: ApiLink[];
        } = body;

        // ---- ดึงข้อมูลเดิม (รวม images & links ไว้ใช้เทียบ/ลบไฟล์) ----
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

        // --------- จัดการ Categories (ลบของเดิม + สร้างใหม่ตาม slug) ---------
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
        const fsBase =
            process.env.ACHIEVEMENTS_FS_BASE ?? "public/achievements";

        const imagePayload = images as ApiImage[];

        const imageIdsToKeep = new Set(
            imagePayload.filter((img) => img.id).map((img) => String(img.id))
        );

        const imagesToDelete = existing.images.filter(
            (img) => !imageIdsToKeep.has(String(img.id))
        );

        for (const img of imagesToDelete) {
            const filePath = path.join(
                process.cwd(),
                fsBase,
                achievementId,
                img.url
            );
            try {
                await unlink(filePath);
            } catch (err: unknown) {
                if (
                    typeof err === "object" &&
                    err &&
                    "code" in err &&
                    (err as { code: string }).code === "ENOENT"
                ) {
                } else {
                    console.warn("Failed to delete file:", filePath, err);
                }
            }
        }

        // ลบ record รูปใน DB
        if (imagesToDelete.length > 0) {
            await prisma.achievementImage.deleteMany({
                where: {
                    id: { in: imagesToDelete.map((img) => img.id) },
                },
            });
        }

        // อัปเดต/สร้างรูปที่ยังอยู่ในฟอร์ม
        for (const img of imagePayload) {
            let url = img.preview;
            if (url.startsWith("/achievements/")) {
                const parts = url.split("/");
                url = parts[parts.length - 1];
            }

            if (img.id) {
                // รูปเก่า → update
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
                // รูปใหม่ → create
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

        // --------- จัดการ Links (ลบใน DB ตามที่หายไปจากฟอร์ม) ---------
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

        // อัปเดต/สร้างลิงก์
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

        // --------- อัปเดตฟิลด์หลัก: อะไรไม่ส่งมา → ไม่แตะ ---------
        const updateData: Prisma.AchievementUpdateInput = {};

        if (title_th !== undefined) updateData.title_th = title_th;
        if (title_en !== undefined) updateData.title_en = title_en;
        if (description_th !== undefined)
            updateData.description_th = description_th ?? null;
        if (description_en !== undefined)
            updateData.description_en = description_en ?? null;
        if (sortOrder !== undefined) updateData.sortOrder = sortOrder;
        if (status !== undefined) updateData.status = status;

        const updated = await prisma.achievement.update({
            where: { id: achievementId },
            data: updateData,
            include: {
                categories: { include: { category: true } },
                images: true,
                links: true,
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

        const fsBase =
            process.env.ACHIEVEMENTS_FS_BASE ?? "public/achievements";

        // ลบไฟล์รูปในเครื่อง: /public/achievements/{achievementId}/{fileName}
        for (const img of existing.images) {
            const filePath = path.join(
                process.cwd(),
                fsBase,
                achievementId,
                img.url // ใน DB เก็บแค่ชื่อไฟล์
            );

            try {
                await unlink(filePath);
            } catch (err: unknown) {
                // ถ้าไฟล์ไม่มีแล้ว (ENOENT) ก็ข้าม
                if (
                    typeof err === "object" &&
                    err &&
                    "code" in err &&
                    (err as { code: string }).code === "ENOENT"
                ) {
                    continue;
                }
                console.warn("Failed to delete file:", filePath, err);
            }
        }

        // ลบ relation ต่าง ๆ (ถ้าไม่ได้ cascade ไว้ใน schema)
        await prisma.achievementsOnCategories.deleteMany({
            where: { achievementId },
        });

        await prisma.achievementImage.deleteMany({
            where: { achievementId },
        });

        await prisma.achievementLink.deleteMany({
            where: { achievementId },
        });

        // ลบ achievement หลัก
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
