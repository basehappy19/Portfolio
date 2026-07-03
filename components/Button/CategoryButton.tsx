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
            className={`
                inline-flex items-center justify-center
                cursor-pointer px-5 py-2 rounded-md font-medium text-sm
                transition-all duration-200

                ${isActive
                    ? `
                        bg-rose-500 text-white shadow-xs border border-rose-500
                      `
                    : `
                        bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-zinc-700 hover:border-rose-400 dark:hover:border-rose-500
                      `
                }
            `}
        >
            {category.name} ({category.totalAchievements})
        </Link>
    );
};

export default CategoryButton;
