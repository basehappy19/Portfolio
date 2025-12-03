import { NextRequest, NextResponse } from "next/server";
import { supabaseServerClient } from "@/lib/supabaseServer";
import { auth } from "@/auth";
import { headers } from "next/headers";

export async function POST(req: NextRequest) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const achievementId = formData.get("achievementId") as string | null;

    if (!file || !achievementId) {
        return NextResponse.json({ error: "file + achievementId required" }, { status: 400 });
    }

    const ext = file.name.split(".").pop()!;
    const fileName = `${Date.now()}.${ext}`;
    const filePath = `${achievementId}/${fileName}`;

    const { data, error } = await supabaseServerClient.storage
        .from("achievements")
        .upload(filePath, file);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const {
        data: { publicUrl },
    } = supabaseServerClient.storage.from("achievements").getPublicUrl(data.path);

    return NextResponse.json({
        fileName,
        url: publicUrl,
    });
}
