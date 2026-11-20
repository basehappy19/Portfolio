"use client";

import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function SearchBar() {
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();

    const [value, setValue] = useState(searchParams.get("search") ?? "");

    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());

        if (value) params.set("search", value);
        else params.delete("search");

        router.push(`${pathname}?${params.toString()}`, { scroll: false });
        // only react to typing; router/searchParams change as a result of this push
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    return (
        <div className="relative w-full">
            <Search
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none"
                size={18}
            />

            <input
                type="text"
                placeholder="ค้นหาชื่อผลงาน, สถานที่, หรือรางวัล..."
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800/70 hover:border-gray-300 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all shadow-2xs"
            />
        </div>

    );
}
