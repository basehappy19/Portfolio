"use server";

import { revalidatePath } from "next/cache";
import { SubmitData } from "@/types/Form";

export const updateAchievement = async (id: string, payload: SubmitData) => {
    try {
        const res = await fetch(`/api/admin/achievements/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Update failed: ${errorText}`);
        }

        const data = await res.json();
        revalidatePath("/admin");

        return data;
    } catch (error) {
        console.error("❌ updateAchievement Error:", error);
        throw error;
    }
};

export const createAchievement = async (payload: SubmitData) => {
    try {
        const res = await fetch(`/api/admin/achievements`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
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
    const res = await fetch(`/api/admin/achievements/${id}`, {
        method: "DELETE",
    });

    if (!res.ok) {
        const message = await res.text().catch(() => "");
        throw new Error(message || "Failed to delete achievement");
    }
    revalidatePath("/admin");
};
