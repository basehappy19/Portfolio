'use client';

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CurrentCategory } from "../CategoryFilterTab";

type AllButtonProps = {
    TotalAchievements: number;
    AllButtonLabel: string;
    CurrentCategory: CurrentCategory | null;
};

const AllButton = ({ TotalAchievements, AllButtonLabel, CurrentCategory }: AllButtonProps) => {
    const isActive = !CurrentCategory;
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
