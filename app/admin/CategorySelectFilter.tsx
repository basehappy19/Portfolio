"use client"

import { useCategories } from '@/app/contexts/CategoriesContext';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function CategorySelectFilter() {
    const categories = useCategories();
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleChange = (slug: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (slug) params.set("category", slug);
        else params.delete("category");

        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    const current = searchParams.get("category") ?? "";

    return (
        <select
            value={current}
            onChange={(e) => handleChange(e.target.value)}
            className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50/70 dark:bg-zinc-800/70 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all shadow-2xs cursor-pointer"
        >
            <option value="">ทุกหมวดหมู่</option>

            {categories.map(cat => (
                <option key={cat.id} value={cat.slug}>
                    {cat.name_th}
                </option>
            ))}
        </select>

    );
}
