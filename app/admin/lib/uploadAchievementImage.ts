export type UploadImageResult = {
    fileName: string;
    url: string;
};

export const uploadAchievementImage = async (
    file: File,
    achievementId: string | null
): Promise<UploadImageResult> => {
    const formDataUpload = new FormData();
    formDataUpload.append("file", file);

    const achievementIdForUpload = achievementId ?? "_temp";

    const res = await fetch(
        `/api/uploads?achievementId=${achievementIdForUpload}`,
        {
            method: "POST",
            body: formDataUpload,
        }
    );

    if (!res.ok) {
        throw new Error("Upload image failed");
    }

    const json = (await res.json()) as UploadImageResult;
    return json;
};
