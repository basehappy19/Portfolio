export const downloadImage = async (url: string, filename?: string) => {
    try {
        const res = await fetch(url, { mode: "cors" });
        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);

        const blob = await res.blob();
        const objectUrl = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = objectUrl;
        a.download = filename || url.split("/").pop() || "image";
        document.body.appendChild(a);
        a.click();
        a.remove();

        URL.revokeObjectURL(objectUrl);
    } catch (err) {
        window.open(url, "_blank", "noopener,noreferrer");
    }
};
