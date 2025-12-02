'use client';

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { slugCurrentCategory } from "../CategoryFilterTab";

type AllButtonProps = {
    TotalAchievements: number;
    AllButtonLabel: string;
    slugCurrentCategory?: slugCurrentCategory | null;
};

const AllButton = ({ TotalAchievements, AllButtonLabel, slugCurrentCategory }: AllButtonProps) => {
    const isActive = !slugCurrentCategory;
    const pathname = usePathname();
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleClick = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("category");
        router.push(`${pathname}`, { scroll: false });
    };
    return (
        <button
            onClick={handleClick}
            className={`cursor-pointer px-6 py-2.5 rounded-full font-medium transition-all ${isActive
                ? 'bg-red-600 text-white shadow-lg shadow-red-500/30'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md'
                }`}
        >
            {AllButtonLabel} ({TotalAchievements})
        </button>
    );
};

export default AllButton;
