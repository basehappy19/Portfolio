import { revalidatePortfolio } from "@/lib/revalidate";
import prisma from "@/lib/prisma";
import { auth } from "@/auth";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

/**
 * Save a new order for a set of achievements.
 * Body: { ids: string[] } in display order (first = shown first on the site).
 * Only the listed items are touched: they swap the sortOrder values they already
 * own, so reordering a filtered subset never disturbs the rest of the list.
 */
export async function PUT(req: NextRequest) {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json().catch(() => null);
    const ids: unknown = body?.ids;
    if (!Array.isArray(ids) || ids.length === 0 || !ids.every((x) => typeof x === "string") || new Set(ids).size !== ids.length) {
        return NextResponse.json({ error: "ids must be a non-empty list of unique ids" }, { status: 400 });
    }

    const rows = await prisma.achievement.findMany({
        where: { id: { in: ids as string[] } },
        select: { id: true, sortOrder: true },
    });
    if (rows.length !== ids.length) return NextResponse.json({ error: "Some achievements were not found" }, { status: 404 });

    // the slots these items occupy, highest first (the site lists by sortOrder desc)
    let slots = rows.map((r) => r.sortOrder).sort((a, b) => b - a);
    // duplicate values would make the order ambiguous: spread them out above the current max
    if (new Set(slots).size !== slots.length) {
        const max = (await prisma.achievement.aggregate({ _max: { sortOrder: true } }))._max.sortOrder ?? 0;
        slots = slots.map((_, i) => max + slots.length - i);
    }

    await prisma.$transaction(
        (ids as string[]).map((id, i) => prisma.achievement.update({ where: { id }, data: { sortOrder: slots[i] } })),
    );

    revalidatePortfolio();
    return NextResponse.json({ ok: true });
}
