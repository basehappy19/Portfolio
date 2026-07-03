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
            className={`cursor-pointer px-5 py-2 rounded-md font-medium text-sm transition-all
                ${isActive
                    ? "bg-rose-500 text-white shadow-xs border border-rose-500"
                    : "bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-zinc-700 hover:border-rose-400 dark:hover:border-rose-500"
                }
            `}
        >
            {AllButtonLabel} ({TotalAchievements})
        </Link>
    );
};

export default AllButton;
