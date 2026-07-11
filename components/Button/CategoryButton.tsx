'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import type { slugCurrentCategory, UiCategory } from '../CategoryFilterTab';

type CategoryButtonProps = {
    slugCurrentCategory?: slugCurrentCategory;
    category: UiCategory;
};

const CategoryButton = ({ slugCurrentCategory, category }: CategoryButtonProps) => {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const isActive = slugCurrentCategory && slugCurrentCategory === category.slug;

    const params = new URLSearchParams(searchParams.toString());
    if (isActive) {
        params.delete('category');
    } else {
        params.set('category', category.slug);
    }

    const href = `${pathname}?${params.toString()}`;

    return (
        <Link
            href={href}
            scroll={false}
            prefetch
            className={`inline-flex items-center justify-center cursor-pointer px-4 sm:px-5 py-2 rounded-full font-bold text-xs sm:text-sm shrink-0 whitespace-nowrap snap-start transition-all duration-300 select-none
                ${isActive
                    ? "bg-rose-500 text-white shadow-md shadow-rose-500/25 border border-rose-500 scale-[1.02] ring-2 ring-rose-500/20"
                    : "bg-white/90 dark:bg-zinc-800/90 text-gray-700 dark:text-gray-200 border border-gray-200/80 dark:border-zinc-700 hover:border-rose-300 dark:hover:border-rose-600 hover:bg-rose-50/80 dark:hover:bg-rose-950/30 hover:text-rose-600 dark:hover:text-rose-400 shadow-2xs"
                }
            `}
        >
            <span>{category.name}</span>
            <span className={`ml-1.5 px-2 py-0.5 rounded-full text-[11px] font-extrabold transition-colors ${
                isActive ? "bg-white/20 text-white" : "bg-gray-100 dark:bg-zinc-700 text-gray-500 dark:text-gray-400 group-hover:bg-rose-100 dark:group-hover:bg-rose-900/50"
            }`}>
                {category.totalAchievements}
            </span>
        </Link>
    );
};

export default CategoryButton;
