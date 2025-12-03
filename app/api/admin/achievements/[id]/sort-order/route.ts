import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { auth } from "@/auth";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id: achievementId } = await params;
        const { newSortOrder } = await req.json();

        if (typeof newSortOrder !== "number") {
            return NextResponse.json(
                { error: "newSortOrder is required and must be a number" },
                { status: 400 }
            );
        }

        const item = await prisma.achievement.findUnique({
            where: { id: achievementId },
            select: { id: true, sortOrder: true },
        });

        if (!item) {
            return NextResponse.json(
                { error: "Achievement not found" },
                { status: 404 }
            );
        }

        const oldSort = item.sortOrder;

        if (newSortOrder === oldSort) {
            return NextResponse.json(item, { status: 200 });
        }

        if (newSortOrder > oldSort) {
            await prisma.achievement.updateMany({
                where: {
                    sortOrder: {
                        gt: oldSort,
                        lte: newSortOrder,
                    },
                },
                data: {
                    sortOrder: { decrement: 1 },
                },
            });
        } else {
            await prisma.achievement.updateMany({
                where: {
                    sortOrder: {
                        gte: newSortOrder,
                        lt: oldSort,
                    },
                },
                data: {
                    sortOrder: { increment: 1 },
                },
            });
        }

        const updated = await prisma.achievement.update({
            where: { id: achievementId },
            data: { sortOrder: newSortOrder },
        });

        return NextResponse.json(updated, { status: 200 });
    } catch (error) {
        console.error(
            "PATCH /api/admin/achievements/[id]/sort-order error",
            error
        );
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
