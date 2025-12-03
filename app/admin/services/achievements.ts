"use server";

"use server";
import { revalidatePath } from "next/cache";
import { SubmitData } from "@/types/Form";
import { headers } from "next/headers";

const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export async function updateAchievement(id: string, payload: SubmitData) {
    const headersList = await headers();

    const res = await fetch(`${baseUrl}/api/admin/achievements/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            cookie: headersList.get("cookie") ?? "",
        },
        body: JSON.stringify(payload),
    });

    if (!res.ok) {
        throw new Error("Update failed");
    }

    return res.json();
}

export const createAchievement = async (payload: SubmitData) => {
    const headersList = await headers();
    try {
        const res = await fetch(`${baseUrl}/api/admin/achievements`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                cookie: headersList.get("cookie") ?? "",
            },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Create failed: ${errorText}`);
        }

        const data = await res.json();
        revalidatePath("/admin");

        return data;
    } catch (error) {
        console.error("❌ createAchievement Error:", error);
        throw error;
    }
};

export const deleteAchievement = async (id: string): Promise<void> => {
    const headersList = await headers();

    const res = await fetch(`${baseUrl}/api/admin/achievements/${id}`, {
        method: "DELETE",
        headers: {
            cookie: headersList.get("cookie") ?? "",
        },
    });

    if (!res.ok) {
        const message = await res.text().catch(() => "");
        throw new Error(message || "Failed to delete achievement");
    }
    revalidatePath("/admin");
};

export const toggleAchievementStatus = async (
    id: string,
    currentStatus: "PUBLIC" | "DRAFT"
) => {
    const headersList = await headers();
    const newStatus = currentStatus === "PUBLIC" ? "DRAFT" : "PUBLIC";

    const res = await fetch(`${baseUrl}/api/admin/achievements/${id}/status`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            cookie: headersList.get("cookie") ?? "",
        },
        body: JSON.stringify({ status: newStatus }),
    });

    if (!res.ok) {
        throw new Error("Failed to update status");
    }

    const data = await res.json();
    revalidatePath("/admin");
    return data;
};

export const changeAchievementSortOrder = async (
    id: string,
    newSortOrder: number
) => {
    const headersList = await headers();

    const res = await fetch(
        `${baseUrl}/api/admin/achievements/${id}/sort-order`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                cookie: headersList.get("cookie") ?? "",
            },
            body: JSON.stringify({ newSortOrder }),
        }
    );

    if (!res.ok) {
        const errorText = await res.text().catch(() => "");
        throw new Error(errorText || "Failed to change sort order");
    }

    const data = await res.json();
    revalidatePath("/admin");
    return data;
};
