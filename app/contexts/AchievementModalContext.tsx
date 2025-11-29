"use client";

import { createContext, useContext, useState } from "react";
import type { Achievement } from "@/types/Achievements";

export type EditData = Partial<Achievement> & { id: number }; // แก้ไขได้บาง field แต่ต้องมี id

type AchievementModalContextType = {
    isOpen: boolean;
    editData: EditData | null;
    open: (data?: EditData) => void;
    close: () => void;
    toggle: () => void;
};

const AchievementModalContext = createContext<AchievementModalContextType | undefined>(undefined);

export function AchievementModalProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [editData, setEditData] = useState<EditData | null>(null);

    const open = (data?: EditData) => {
        if (data) {
            setEditData(data);
        } else {
            setEditData(null);
        }
        setIsOpen(true);
    };

    const close = () => {
        setIsOpen(false);
        setEditData(null);
    };

    const toggle = () => setIsOpen(prev => !prev);

    return (
        <AchievementModalContext.Provider
            value={{ isOpen, editData, open, close, toggle }}
        >
            {children}
        </AchievementModalContext.Provider>
    );
}

export function useAchievementModal() {
    const ctx = useContext(AchievementModalContext);

    if (!ctx) {
        throw new Error("useAchievementModal must be used inside <AchievementModalProvider>");
    }

    return ctx;
}
