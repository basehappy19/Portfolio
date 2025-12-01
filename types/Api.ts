export type ApiImage = {
    id?: string;
    preview: string;
    altText_th?: string | null;
    altText_en?: string | null;
    sortOrder?: number;
};

export type ApiLink = {
    id?: string;
    label_th: string;
    label_en: string;
    url: string;
    sortOrder?: number;
};