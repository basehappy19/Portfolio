'use client'
import { Category } from './Achievement';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const CategoryButton = ({ currentCategory, category }: { currentCategory: Category | null, category: Category }) => {
    const pathname = usePathname()
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleClick = () => {
        const params = new URLSearchParams(searchParams.toString());

        const isActive = currentCategory && currentCategory.id === category.id;

        if (isActive) {
            params.delete("category");
        } else {
            params.set("category", category.slug);
        }

        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };


    return (
        <button
            onClick={handleClick}
            className={`cursor-pointer px-6 py-2.5 rounded-full font-medium transition-all duration-200 ${currentCategory && currentCategory.id === category.id
                ? "bg-red-600 text-white shadow-lg shadow-red-500/30"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md"
                }`}
        >
            {category.name} ({category.totalAchievements})
        </button>
    )
}

export default CategoryButton
