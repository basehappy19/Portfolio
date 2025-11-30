import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
    try {
        const fsBase =
            process.env.ACHIEVEMENTS_FS_BASE ?? "public/achievements";
        const publicBase =
            process.env.NEXT_PUBLIC_ACHIEVEMENTS_PUBLIC_BASE ?? "/achievements";

        // รับ achievementId จาก query เช่น /api/uploads?achievementId=xxx
        const { searchParams } = new URL(req.url);
        const achievementId = searchParams.get("achievementId") ?? "_temp"; // ถ้าไม่มี ใช้ _temp

        const formData = await req.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return NextResponse.json(
                { error: "No file provided" },
                { status: 400 }
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const originalName = file.name || "upload.png";
        const ext = originalName.includes(".")
            ? originalName.split(".").pop()
            : "png";

        const fileName = `${crypto.randomUUID()}.${ext}`;

        // โฟลเดอร์จริง: public/achievements/{achievementId}
        const uploadDir = path.join(process.cwd(), fsBase, achievementId);
        await mkdir(uploadDir, { recursive: true });

        const filePath = path.join(uploadDir, fileName);
        await writeFile(filePath, buffer);

        const url = `${publicBase}/${achievementId}/${fileName}`;

        return NextResponse.json({ fileName, url }, { status: 201 });
    } catch (error) {
        console.error("POST /api/uploads error", error);
        return NextResponse.json({ error: "Upload failed" }, { status: 500 });
    }
}
