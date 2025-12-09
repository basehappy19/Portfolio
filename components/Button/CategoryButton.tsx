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
                cursor-pointer px-6 py-2.5 rounded-full font-medium
                transition-all duration-200

                ${isActive
                    ? `
                        bg-red-600 text-white
                        shadow-lg shadow-red-500/30
                        dark:bg-red-500 dark:text-black
                        dark:shadow-red-400/30
                      `
                    : `
                        bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md
                        dark:bg-white/10 dark:text-gray-200
                        dark:hover:bg-white/20 dark:hover:shadow-lg
                      `
                }
            `}
        >
            {category.name} ({category.totalAchievements})
        </Link>
    );
};

export default CategoryButton;
