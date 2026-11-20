"use client"

import { useCategories } from '@/app/contexts/CategoriesContext';
import { categoryRank, categoryStyle } from '@/lib/category-style';
import { Tag } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import Select from './ui/Select';

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
    const options = [
        { value: "", label: "ทุกหมวดหมู่", color: "" },
        ...[...categories]
            .sort((a, b) => categoryRank(a.slug) - categoryRank(b.slug))
            .map((cat) => ({ value: cat.slug, label: cat.name_th, color: categoryStyle(cat.slug).bg })),
    ];

    return (
        <Select
            value={current}
            options={options}
            onChange={handleChange}
            label="หมวด"
            ariaLabel="กรองตามหมวดหมู่"
            icon={<Tag className="h-4 w-4" />}
        />
    );
}
