import { revalidatePortfolio } from "@/lib/revalidate";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

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

        revalidatePortfolio();
        return NextResponse.json(updated, { status: 200 });
    } catch (error) {
        console.error("PUT /api/admin/achievements/[id]/status error", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
