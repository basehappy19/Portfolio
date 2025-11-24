const SectionHeader = ({ text }: { text: string | null | undefined }) => {
    return (
        <div className="mb-16 animate-fade-in">
            <div className="flex items-center gap-3 mb-4">
                <span className="text-6xl md:text-7xl font-bold text-red-400 animate-pulse">/</span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
                    {text}
                </h1>
            </div>
            <div className="h-1 w-32 bg-linear-to-r from-red-400 to-transparent rounded-full"></div>
        </div>
    )
}

export default SectionHeader