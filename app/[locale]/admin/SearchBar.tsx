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
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
            />

            <input
                type="text"
                placeholder="ค้นหาผลงาน..."
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600
                           rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
            />
        </div>
    );
}
