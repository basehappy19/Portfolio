"use client";

import { AchievementModalContextType, EditData } from "@/types/Achievements";
import { createContext, useContext, useState } from "react";

const AchievementModalContext = createContext<AchievementModalContextType | undefined>(undefined);

export function AchievementModalProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);           // ควบคุม mount/unmount
    const [isAnimating, setIsAnimating] = useState(false); // ควบคุม animation
    const [editData, setEditData] = useState<EditData | null>(null);

    // เปิด modal พร้อม animation
    const open = (data?: EditData) => {
        if (data) setEditData(data);
        else setEditData(null);

        setIsAnimating(true);
        setIsOpen(true); // mount modal
        document.body.style.overflow = "hidden";
    };

    // ปิด modal พร้อม animation
    const close = () => {
        setIsAnimating(false); // เริ่ม fade-out

        setTimeout(() => {
            setIsOpen(false); // unmount modal
            setEditData(null);
            document.body.style.overflow = "unset";
        }, 200); // ต้องตรงกับ animation duration
    };

    const toggle = () => {
        if (isOpen) close();
        else open();
    };

    return (
        <AchievementModalContext.Provider
            value={{ isOpen, isAnimating, editData, open, close, toggle }}
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
