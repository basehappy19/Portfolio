export type AchievementImage = {
    id: string;
    url: string;
    altText_th: string | null;
    altText_en: string | null;
    sortOrder: number;
    createdAt: Date;
    updatedAt: Date;
};

export type AchievementLink = {
    id: string;
    achievementId: string;
    label_th: string;
    label_en: string;
    url: string;
    sortOrder: number;
    createdAt: Date;
    updatedAt: Date;
};

export type Category = {
    id: number;
    name_th: string;
    name_en: string;
    slug: string;
};

export type AchievementsOnCategories = {
    category: Category;
};

export type Status = "DRAFT" | "PUBLIC";

export type Achievement = {
    id: string;
    title_th: string;
    description_th: string | null;
    awardLevel_th: string | null;
    location_th: string | null;
    gived_by_th: string | null;

    title_en: string;
    description_en: string | null;
    awardLevel_en: string | null;
    location_en: string | null;
    gived_by_en: string | null;

    sortOrder: number;
    receivedAt: Date | null;
    status: Status;

    categories: AchievementsOnCategories[];
    images: AchievementImage[];
    links: AchievementLink[];

    createdAt: Date;
    updatedAt: Date;
};

export type Message = {
    id: string;
    name: string;
    email: string;
    message: string;
    createdAt: Date;
    updatedAt: Date;
};

export type EditData = Partial<Achievement> & { id: string };

export type AchievementModalContextType = {
    isOpen: boolean;
    isAnimating: boolean; 
    editData: EditData | null;
    open: (data?: EditData) => void;
    close: () => void;
    toggle: () => void;
};
