"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useTransition, useState } from "react";

const LanguageSwitcher = () => {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [, startTransition] = useTransition();
    const [optimisticLocale, setOptimisticLocale] = useState<string | null>(null);

    const currentLocale = optimisticLocale || locale;

    const switchLanguage = (newLocale: "th" | "en") => {
        if (newLocale === currentLocale) return;

        setOptimisticLocale(newLocale);

        const queryString = searchParams.toString();
        const hash = typeof window !== "undefined" ? window.location.hash : "";
        const basePath = queryString ? `${pathname}?${queryString}` : pathname;
        const fullPathWithHash = hash ? `${basePath}${hash}` : basePath;

        startTransition(() => {
            router.replace(fullPathWithHash as any, { locale: newLocale, scroll: false });
        });
    };

    return (
        <div className="inline-flex items-center rounded-xl border p-1 bg-white/40 backdrop-blur-md border-white/60 shadow-2xs">
            {/* TH Button */}
            <button
                type="button"
                onClick={() => switchLanguage("th")}
                className={`cursor-pointer px-3 py-1.5 text-xs sm:text-sm font-bold rounded-lg transition-all duration-150 ${
                    currentLocale === "th"
                        ? "bg-rose-600 text-white shadow-2xs scale-102"
                        : "text-slate-600 hover:text-rose-600 hover:bg-white/60"
                }`}
            >
                ไทย
            </button>

            {/* EN Button */}
            <button
                type="button"
                onClick={() => switchLanguage("en")}
                className={`cursor-pointer px-3 py-1.5 text-xs sm:text-sm font-bold rounded-lg transition-all duration-150 ${
                    currentLocale === "en"
                        ? "bg-rose-600 text-white shadow-2xs scale-102"
                        : "text-slate-600 hover:text-rose-600 hover:bg-white/60"
                }`}
            >
                English
            </button>
        </div>
    );
};

export default LanguageSwitcher;
