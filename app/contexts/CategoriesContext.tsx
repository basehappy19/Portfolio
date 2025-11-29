"use client";

import { createContext, useContext } from "react";

export type Category = {
    id: number;
    name_th: string;
    name_en: string;
    slug: string;
};

const CategoriesContext = createContext<Category[]>([]);

export function CategoriesProvider({
    categories,
    children,
}: {
    categories: Category[];
    children: React.ReactNode;
}) {
    return (
        <CategoriesContext.Provider value={categories}>
            {children}
        </CategoriesContext.Provider>
    );
}

export function useCategories() {
    return useContext(CategoriesContext);
}
