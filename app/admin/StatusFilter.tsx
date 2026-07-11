"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function StatusFilter() {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();

    const current = searchParams.get("status") ?? "";

    const handleChange = (value: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (value) params.set("status", value);
        else params.delete("status");

        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    return (
        <select
            value={current}
            onChange={(e) => handleChange(e.target.value)}
            className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50/70 dark:bg-zinc-800/70 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all shadow-2xs cursor-pointer"
        >
            <option value="">ทุกสถานะ (All Statuses)</option>
            <option value="PUBLIC">เผยแพร่แล้ว (Public)</option>
            <option value="DRAFT">แบบร่าง (Draft)</option>
        </select>

    );
}
