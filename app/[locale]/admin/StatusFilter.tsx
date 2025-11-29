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
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                       focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
        >
            <option value="">ทุกสถานะ</option>
            <option value="PUBLIC">เผยแพร่แล้ว</option>
            <option value="DRAFT">แบบร่าง</option>
        </select>
    );
}
