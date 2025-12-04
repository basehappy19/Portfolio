import { FormState } from "@/types/Form";

export type ValidationErrors = Partial<Record<keyof FormState, string>>;

export type TouchedState = {
    title_th: boolean;
    title_en: boolean;
    categorySlugs: boolean;
};
