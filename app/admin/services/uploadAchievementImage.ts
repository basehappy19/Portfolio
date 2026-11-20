/** Resize to max 1600px and encode as WebP (falls back to JPEG) so photos are small and load fast. */
const compressImage = async (file: File, quality = 0.82): Promise<File> => {
    if (!file.type.startsWith("image/") || file.type === "image/gif" || file.type === "image/svg+xml") return file;
    const bitmap = await createImageBitmap(file);
    const maxSide = 1600;
    const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close?.();

    const toBlob = (type: string) =>
        new Promise<Blob | null>((resolve) => canvas.toBlob((b) => resolve(b), type, quality));
    let blob = await toBlob("image/webp");
    let ext = "webp";
    if (!blob || blob.type !== "image/webp") {
        blob = await toBlob("image/jpeg");
        ext = "jpg";
    }
    if (!blob || blob.size >= file.size) return file; // never upload something bigger than the original
    return new File([blob], `photo_${Date.now()}.${ext}`, { type: blob.type });
};

export const uploadAchievementImageDirect = async (
    file: File,
    achievementId: string | null
) => {
    const compressedFile = await compressImage(file);

    const formData = new FormData();
    formData.append("file", compressedFile);
    formData.append("achievementId", achievementId ?? "_temp");

    const res = await fetch("/api/uploads", {
        method: "POST",
        body: formData,
    });

    if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json?.error ?? `Upload failed (${res.status})`);
    }

    const json = await res.json();
    return {
        fileName: json.fileName as string,
        url: json.url as string,
    };
};
