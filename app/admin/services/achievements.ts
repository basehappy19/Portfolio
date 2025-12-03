import { SubmitData } from "@/types/Form";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export async function updateAchievement(id: string, payload: SubmitData) {
    const res = await fetch(`${baseUrl}/api/admin/achievements/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || "Update failed");
    }

    return res.json();
}

export const createAchievement = async (payload: SubmitData) => {
    try {
        const res = await fetch(`${baseUrl}/api/admin/achievements`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            const errorText = await res.text().catch(() => "");
            throw new Error(`Create failed: ${errorText}`);
        }

        const data = await res.json();
        // ❌ ไม่ต้อง revalidatePath ที่นี่ เพราะคุณใช้ router.refresh() แล้ว
        return data;
    } catch (error) {
        console.error("❌ createAchievement Error:", error);
        throw error;
    }
};

export const deleteAchievement = async (id: string): Promise<void> => {
    const res = await fetch(`${baseUrl}/api/admin/achievements/${id}`, {
        method: "DELETE",
    });

    if (!res.ok) {
        const message = await res.text().catch(() => "");
        throw new Error(message || "Failed to delete achievement");
    }
};

export const toggleAchievementStatus = async (
    id: string,
    currentStatus: "PUBLIC" | "DRAFT"
) => {
    const newStatus = currentStatus === "PUBLIC" ? "DRAFT" : "PUBLIC";

    const res = await fetch(`${baseUrl}/api/admin/achievements/${id}/status`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
    });

    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || "Failed to update status");
    }

    const data = await res.json();
    return data;
};

export const changeAchievementSortOrder = async (
    id: string,
    newSortOrder: number
) => {
    const res = await fetch(
        `${baseUrl}/api/admin/achievements/${id}/sort-order`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ newSortOrder }),
        }
    );

    if (!res.ok) {
        const errorText = await res.text().catch(() => "");
        throw new Error(errorText || "Failed to change sort order");
    }

    const data = await res.json();
    return data;
};
