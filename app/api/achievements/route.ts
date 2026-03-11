import { NextResponse } from "next/server";
import { getAchievements } from "@/lib/achievements";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);

        const category = searchParams.get("category") || undefined;
        const offset = Math.max(0, Number(searchParams.get("offset")) || 0);
        const limit = Math.max(1, Number(searchParams.get("limit")) || 9);

        const data = await getAchievements({
            category,
            offset,
            limit,
        });

        return NextResponse.json({
            ok: true,
            ...data,
        });
    } catch (error) {
        console.error("GET /api/achievements error:", error);

        return NextResponse.json(
            {
                ok: false,
                error: "Failed to fetch achievements",
            },
            { status: 500 }
        );
    }
}