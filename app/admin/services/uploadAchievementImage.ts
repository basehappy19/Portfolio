'use server'
import { headers } from "next/headers";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export type UploadImageResult = {
    fileName: string;
    url: string;
};

export const uploadAchievementImage = async (
    file: File,
    achievementId: string | null
): Promise<UploadImageResult> => {
    const headersList = await headers();
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("achievementId", achievementId ?? "_temp");

    const res = await fetch(`${baseUrl}/api/uploads`, {
        method: "POST",
        body: formData,
        headers: {
            cookie: headersList.get("cookie") ?? "",
        },
    });

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        console.error("Upload image failed:", res.status, text);
        throw new Error("Upload image failed");
    }

    return (await res.json()) as UploadImageResult;
};
