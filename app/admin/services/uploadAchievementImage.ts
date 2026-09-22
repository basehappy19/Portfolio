const compressImage = async (file: File, quality = 0.9): Promise<File> => {
    const imageBitmap = await createImageBitmap(file);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const maxWidth = 1920;
    const scale = Math.min(1, maxWidth / imageBitmap.width);

    canvas.width = imageBitmap.width * scale;
    canvas.height = imageBitmap.height * scale;

    ctx?.drawImage(imageBitmap, 0, 0, canvas.width, canvas.height);

    const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((b) => resolve(b as Blob), "image/jpeg", quality);
    });

    return new File([blob], `compressed_${Date.now()}.jpg`, { type: "image/jpeg" });
};

export const uploadAchievementImageDirect = async (
    file: File,
    achievementId: string | null
) => {
    const compressedFile = await compressImage(file, 0.9);

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
