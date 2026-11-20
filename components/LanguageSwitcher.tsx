"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useTransition, useState } from "react";

const LOCALES = [
    { code: "th", label: "TH", name: "ภาษาไทย" },
    { code: "en", label: "EN", name: "English" },
] as const;

export default function LanguageSwitcher({ label = "Language" }: { label?: string }) {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const [, startTransition] = useTransition();
    const [optimistic, setOptimistic] = useState<string | null>(null);
    const current = optimistic ?? locale;

    const switchTo = (next: "th" | "en") => {
        if (next === current) return;
        setOptimistic(next);
        const { search, hash } = window.location;
        startTransition(() => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            router.replace(`${pathname}${search}${hash}` as any, { locale: next, scroll: false });
        });
    };

    return (
        <div role="group" aria-label={label} className="relative inline-grid grid-cols-2 rounded-full bg-zinc-900/5 p-1">
            <span
                aria-hidden="true"
                className="absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full bg-white shadow-sm transition-transform duration-500 ease-[var(--ease-spring)]"
                style={{ transform: current === "en" ? "translateX(100%)" : "translateX(0)" }}
            />
            {LOCALES.map((l) => (
                <button
                    key={l.code}
                    type="button"
                    lang={l.code}
                    aria-pressed={current === l.code}
                    aria-label={`${l.label} – ${l.name}`}
                    onClick={() => switchTo(l.code)}
                    className={`relative z-10 min-h-9 min-w-11 cursor-pointer rounded-full px-3 text-[13px] font-semibold transition-colors ${
                        current === l.code ? "text-zinc-900" : "text-zinc-600 hover:text-zinc-900"
                    }`}
                >
                    {l.label}
                </button>
            ))}
        </div>
    );
}
