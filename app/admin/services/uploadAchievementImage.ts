export type UploadImageResult = {
    fileName: string;
    url: string;
};

export const uploadAchievementImage = async (
    file: File,
    achievementId: string | null
): Promise<UploadImageResult> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("achievementId", achievementId ?? "_temp");

    const res = await fetch(`/api/uploads`, {
        method: "POST",
        body: formData,
    });

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        console.error("Upload image failed:", res.status, text);
        throw new Error("Upload image failed");
    }

    return (await res.json()) as UploadImageResult;
};
