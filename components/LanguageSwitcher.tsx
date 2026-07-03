"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useSearchParams } from "next/navigation";
import { useTransition } from "react";

const LanguageSwitcher = () => {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const switchLanguage = (newLocale: "th" | "en") => {
        if (newLocale === locale || isPending) return;

        const queryString = searchParams.toString();
        const fullPath = queryString ? `${pathname}?${queryString}` : pathname;

        startTransition(() => {
            router.replace(fullPath, { locale: newLocale });
        });
    };

    return (
        <div className={`inline-flex items-center rounded-md border p-0.5 transition bg-white/90 border-gray-200 dark:bg-zinc-800/90 dark:border-zinc-700 shadow-2xs ${isPending ? "opacity-60 pointer-events-none" : ""}`}>
            {/* TH Button */}
            <button
                type="button"
                onClick={() => switchLanguage("th")}
                className={`cursor-pointer px-2.5 py-1 text-xs font-semibold rounded transition ${
                    locale === "th"
                        ? "bg-rose-500 text-white shadow-2xs"
                        : "text-zinc-600 hover:text-rose-600 dark:text-zinc-300 dark:hover:text-white"
                }`}
            >
                ไทย
            </button>

            {/* EN Button */}
            <button
                type="button"
                onClick={() => switchLanguage("en")}
                className={`cursor-pointer px-2.5 py-1 text-xs font-semibold rounded transition ${
                    locale === "en"
                        ? "bg-rose-500 text-white shadow-2xs"
                        : "text-zinc-600 hover:text-rose-600 dark:text-zinc-300 dark:hover:text-white"
                }`}
            >
                EN
            </button>
        </div>
    );
};

export default LanguageSwitcher;
