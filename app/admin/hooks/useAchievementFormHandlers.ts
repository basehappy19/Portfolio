import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { FormState } from "@/types/Form";
import { TouchedState, ValidationErrors } from "../types/achievementValidation";

type Params = {
    formData: FormState;
    setFormData: Dispatch<SetStateAction<FormState>>;
    setErrors: Dispatch<SetStateAction<ValidationErrors>>;
    setTouched: Dispatch<SetStateAction<TouchedState>>;
};

export const useAchievementFormHandlers = ({
    formData,
    setFormData,
    setErrors,
    setTouched,
}: Params) => {
    const handleBlur = (fieldName: keyof TouchedState) => {
        setTouched((prev) => ({ ...prev, [fieldName]: true }));
    };

    const handleInputChange = (
        e: ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const target = e.target;
        const name = target.name as keyof FormState;

        let value: string | number | boolean = target.value;

        if (target instanceof HTMLInputElement && target.type === "checkbox") {
            value = target.checked;
        }

        if (target instanceof HTMLInputElement && target.type === "number") {
            value = Number(target.value);
        }

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors((prev) => {
            if (!(name in prev)) return prev;

            const newErrors = { ...prev };
            delete newErrors[name];
            return newErrors;
        });
    };

    const handleCategoryChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const values = Array.from(e.target.selectedOptions, (opt) => opt.value);

        setFormData((prev) => ({
            ...prev,
            categorySlugs: values,
        }));

        setTouched((prev) => ({ ...prev, categorySlugs: true }));

        setErrors((prev) => {
            if (!prev.categorySlugs) return prev;
            const newErrors = { ...prev };
            delete newErrors.categorySlugs;
            return newErrors;
        });
    };

    const validateForm = (): boolean => {
        const newErrors: ValidationErrors = {};

        // บังคับเฉพาะฟิลด์ที่ต้องการเท่านั้น
        if (!formData.title_th.trim()) {
            newErrors.title_th = "กรุณากรอกชื่อผลงานภาษาไทย";
        }

        if (!formData.title_en.trim()) {
            newErrors.title_en = "กรุณากรอกชื่อผลงานภาษาอังกฤษ";
        }

        if (!formData.categorySlugs || formData.categorySlugs.length === 0) {
            newErrors.categorySlugs = "กรุณาเลือกหมวดหมู่อย่างน้อย 1 หมวด";
        }
        setTouched((prev) => ({
            ...prev,
            title_th: true,
            title_en: true,
            categorySlugs: true,
        }));

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    return {
        handleBlur,
        handleInputChange,
        handleCategoryChange,
        validateForm,
    };
};
