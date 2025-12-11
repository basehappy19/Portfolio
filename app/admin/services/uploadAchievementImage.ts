import { supabaseServerClient } from "@/lib/supabaseServer";

const compressImage = async (file: File, quality = 0.8): Promise<Blob> => {
    const imageBitmap = await createImageBitmap(file);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const maxWidth = 1920;
    const scale = Math.min(1, maxWidth / imageBitmap.width);

    canvas.width = imageBitmap.width * scale;
    canvas.height = imageBitmap.height * scale;

    ctx?.drawImage(imageBitmap, 0, 0, canvas.width, canvas.height);

    return await new Promise((resolve) => {
        canvas.toBlob((blob) => resolve(blob as Blob), "image/jpeg", quality);
    });
};

export const uploadAchievementImageDirect = async (
    file: File,
    achievementId: string | null
) => {
    const ext = file.name.split(".").pop() || "jpg";
    const randomName = `${crypto.randomUUID()}.${ext}`;

    const path = `${achievementId ?? "_temp"}/${randomName}`;

    const compressedBlob = await compressImage(file, 0.9);

    const { error } = await supabaseServerClient.storage
        .from("achievements")
        .upload(path, compressedBlob, {
            contentType: "image/jpeg",
        });

    if (error) throw error;

    const { data: publicUrlData } = supabaseServerClient.storage
        .from("achievements")
        .getPublicUrl(path);

    return {
        fileName: randomName,
        url: publicUrlData.publicUrl,
    };
};
