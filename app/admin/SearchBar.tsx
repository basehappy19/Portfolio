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
    }, [value]);

    return (
        <div className="relative w-full">
            <Search
                className="
                    absolute left-3 top-1/2 -translate-y-1/2
                    text-gray-400
                    dark:text-gray-400
                "
                size={20}
            />

            <input
                type="text"
                placeholder="ค้นหาผลงาน..."
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="
                    w-full pl-10 pr-4 py-2 rounded-lg border
                    bg-white text-gray-900 placeholder-gray-400 border-gray-300 transition-all
                    focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent
                    shadow-sm

                    dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:border-gray-600
                "
            />
        </div>
    );
}
