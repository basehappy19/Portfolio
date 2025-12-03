import { PrismaClient } from "@/app/generated/prisma/client";
import { auth } from "@/auth";
import { PrismaPg } from "@prisma/adapter-pg";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

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
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { id: achievementId } = await params;

        const existing = await prisma.achievement.findUnique({
            where: { id: achievementId },
            select: { id: true, status: true },
        });

        if (!existing) {
            return NextResponse.json(
                { error: "Achievement not found" },
                { status: 404 }
            );
        }

        const newStatus = existing.status === "PUBLIC" ? "DRAFT" : "PUBLIC";

        const updated = await prisma.achievement.update({
            where: { id: achievementId },
            data: { status: newStatus },
            select: {
                id: true,
                status: true,
                updatedAt: true,
            },
        });

        return NextResponse.json(updated, { status: 200 });
    } catch (error) {
        console.error("PUT /api/admin/achievements/[id]/status error", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
