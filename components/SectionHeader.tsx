const SectionHeader = ({ text }: { text: string | null | undefined }) => {
    return (
        <div className="mb-6 md:mb-8 animate-fade-in flex flex-col items-start">
            <div className="flex items-center gap-3">
                <span className="w-1.5 h-7 bg-rose-600 rounded-xs shrink-0" />
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {text}
                </h2>
            </div>
            <div className="h-px w-full max-w-xs bg-slate-200 mt-3" />
        </div>
    );
};

export default SectionHeader;
