'use client';

import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import type { slugCurrentCategory } from "../CategoryFilterTab";

type AllButtonProps = {
    TotalAchievements: number;
    AllButtonLabel: string;
    slugCurrentCategory?: slugCurrentCategory | null;
};

const AllButton = ({
    TotalAchievements,
    AllButtonLabel,
    slugCurrentCategory
}: AllButtonProps) => {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const isActive = !slugCurrentCategory;

    const params = new URLSearchParams(searchParams.toString());
    params.delete("category");

    const href =
        params.toString().length > 0
            ? `${pathname}?${params.toString()}`
            : pathname;

    return (
        <Link
            href={href}
            scroll={false}
            prefetch
            className={`cursor-pointer px-6 py-2.5 rounded-full font-medium transition-all
                ${isActive
                    ? "bg-red-600 text-white shadow-lg shadow-red-500/30"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md dark:bg-white/10 dark:text-gray-200 dark:hover:bg-white/20 dark:hover:shadow-lg"
                }
            `}
        >
            {AllButtonLabel} ({TotalAchievements})
        </Link>
    );
};

export default AllButton;
