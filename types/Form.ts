export type LinkForm = {
    id?: string;
    label_th: string;
    label_en: string;
    url: string;
    sortOrder: number;
};

export type ImagePreview = {
    id?: string;
    file?: File;
    preview: string;
    altText_th: string;
    altText_en: string;
    sortOrder: number;
};

export type FormState = {
    title_th: string;
    title_en: string;
    description_th: string;
    description_en: string;
    awardLevel_th: string;
    awardLevel_en: string;
    location_th: string;
    location_en: string;
    receivedAt?: string;
    categorySlugs: string[];
    sortOrder: number;
    isPublished: boolean;
};

export type SubmitData = FormState & {
    images: ImagePreview[];
    links: LinkForm[];
    id?: string;
    status: "PUBLIC" | "DRAFT";
};
