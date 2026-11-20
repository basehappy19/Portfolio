import { revalidatePath } from "next/cache";

/** Refresh the static portfolio pages after admin changes. */
export function revalidatePortfolio() {
    try {
        revalidatePath("/[locale]", "page");
    } catch (error) {
        console.error("revalidatePortfolio failed", error);
    }
}
