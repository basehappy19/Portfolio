const SectionHeader = ({ text }: { text: string | null | undefined }) => {
    return (
        <div className="mb-16 animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
                <span className="text-6xl md:text-7xl font-bold text-red-500 dark:text-red-400 animate-pulse">
                    /
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white">
                    {text}
                </h1>
            </div>
            <div
                className="
                    h-1 w-32 rounded-full
                    bg-linear-to-r from-red-500 to-transparent
                    dark:from-red-400
                "
            ></div>
        </div>
    );
};

export default SectionHeader;
