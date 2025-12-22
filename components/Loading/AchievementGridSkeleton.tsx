"use client";

const AchievementCardSkeleton = () => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden animate-pulse">
            {/* Image Section */}
            <div className="relative h-56 bg-linear-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
                {/* main image placeholder */}
                <div className="absolute inset-0" />

                {/* category badges placeholder */}
                <div className="absolute top-4 left-4 flex gap-2">
                    <div className="h-7 w-20 rounded-lg bg-white/80 dark:bg-gray-900/80" />
                    <div className="h-7 w-16 rounded-lg bg-white/80 dark:bg-gray-900/80" />
                </div>

                {/* award badge placeholder */}
                <div className="absolute top-4 right-4">
                    <div className="h-7 w-28 rounded-lg bg-amber-300/80 dark:bg-amber-500/70" />
                </div>
            </div>

            {/* Content Section */}
            <div className="p-6">
                {/* Title */}
                <div className="h-5 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                <div className="h-5 w-1/2 bg-gray-200 dark:bg-gray-700 rounded mb-4" />

                {/* Description */}
                <div className="space-y-2 mb-5">
                    <div className="h-3 w-full bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="h-3 w-5/6 bg-gray-200 dark:bg-gray-700 rounded" />
                    <div className="h-3 w-4/6 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>

                {/* Location */}
                <div className="flex items-center gap-2 mb-5">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700" />
                    <div className="h-3 w-1/2 bg-gray-200 dark:bg-gray-700 rounded" />
                </div>

                {/* CTA */}
                <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700" />
                    </div>
                </div>
            </div>

            {/* Bottom accent line */}
            <div className="h-1 bg-linear-to-r from-red-400 via-red-500 to-red-600 opacity-40" />
        </div>
    );
};

const AchievementGridSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
            <AchievementCardSkeleton key={i} />
        ))}
    </div>
);

export default AchievementGridSkeleton;
