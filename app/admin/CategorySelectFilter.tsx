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
            className="
                px-4 py-2 rounded-lg transition-all border shadow-sm

                bg-white text-gray-900 border-gray-300
                focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent

                dark:bg-gray-800 dark:text-white dark:border-gray-600
            "
        >
            <option value="">ทุกหมวดหมู่</option>

            {categories.map(cat => (
                <option key={cat.id} value={cat.slug}>
                    {cat.name_th} - {cat.name_en}
                </option>
            ))}
        </select>
    );
}
