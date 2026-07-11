import { getTranslations, getLocale } from "next-intl/server";
import SectionHeader from "../SectionHeader";
import CategoryFilterTab from "../CategoryFilterTab";
import { Suspense } from "react";
import AchievementsList from "../AchievementsList";
import AchievementGridSkeleton from "../Loading/AchievementGridSkeleton";

const Achievement = async ({
    slug,
}: {
    slug: string | undefined;
}) => {
    const locale = await getLocale();
    const t = await getTranslations("Index");

    return (
        <div className="min-h-screen w-full relative overflow-hidden py-4 sm:py-8">
            {/* STUNNING FLANK & BACKDROP ARTWORK FOR ACHIEVEMENTS SECTION */}
            <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
                {/* 1. Flank Glowing Mesh Spheres (Left & Right Flanks) */}
                <div className="absolute -left-[160px] top-[22%] w-[550px] h-[550px] sm:w-[650px] sm:h-[650px] rounded-full bg-radial from-rose-500/18 via-pink-500/8 to-transparent blur-3xl opacity-85 animate-pulse [animation-duration:8s]" />
                <div className="absolute -right-[160px] top-[42%] w-[550px] h-[550px] sm:w-[650px] sm:h-[650px] rounded-full bg-radial from-blue-500/18 via-indigo-500/8 to-transparent blur-3xl opacity-85 animate-pulse [animation-duration:10s]" />
                <div className="absolute -left-[120px] bottom-[12%] w-[480px] h-[480px] rounded-full bg-radial from-amber-500/15 via-orange-500/6 to-transparent blur-3xl opacity-75" />
                <div className="absolute -right-[120px] bottom-[22%] w-[480px] h-[480px] rounded-full bg-radial from-violet-500/15 via-fuchsia-500/6 to-transparent blur-3xl opacity-75" />

                {/* 2. Architectural Side Light Beams & Glowing LED Jewels (Flank Margins) */}
                <div className="absolute left-2 sm:left-6 xl:left-10 top-[6%] bottom-[6%] w-[1px] bg-gradient-to-b from-transparent via-rose-500/35 dark:via-rose-500/45 to-transparent hidden md:block">
                    <div className="absolute top-[28%] -left-[3px] w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.9)]" />
                    <div className="absolute top-[62%] -left-[3px] w-1.5 h-1.5 rounded-full bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.8)]" />
                    <div className="absolute top-[85%] -left-[3px] w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.9)]" />
                </div>
                <div className="absolute right-2 sm:right-6 xl:right-10 top-[10%] bottom-[10%] w-[1px] bg-gradient-to-b from-transparent via-blue-500/35 dark:via-blue-500/45 to-transparent hidden md:block">
                    <div className="absolute top-[35%] -right-[3px] w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.9)]" />
                    <div className="absolute top-[72%] -right-[3px] w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.8)]" />
                </div>

                {/* 3. Floating Geometric Wireframe Rings & Hexagons along Flanks */}
                <div className="absolute -left-20 sm:-left-12 lg:left-4 top-[30%] w-56 h-56 xl:w-72 xl:h-72 rounded-full border border-dashed border-rose-400/35 dark:border-rose-500/25 animate-[spin_60s_linear_infinite] hidden sm:block">
                    <div className="absolute inset-6 rounded-full border border-rose-400/20 dark:border-rose-400/15" />
                </div>
                <div className="absolute -right-20 sm:-right-12 lg:right-4 top-[54%] w-64 h-64 xl:w-80 xl:h-80 rounded-full border border-dashed border-blue-400/35 dark:border-blue-500/25 animate-[spin_80s_linear_infinite_reverse] hidden sm:block">
                    <div className="absolute inset-8 rounded-full border border-blue-400/20 dark:border-blue-400/15" />
                </div>

                {/* 4. Dotted Matrix Patterns (Top Left & Bottom Right Flanks) */}
                <div className="absolute left-6 xl:left-14 top-[16%] hidden xl:grid grid-cols-4 gap-3 opacity-50 dark:opacity-35">
                    {Array.from({ length: 16 }).map((_, idx) => (
                        <div key={`dot-left-${idx}`} className="w-1.5 h-1.5 rounded-full bg-rose-500/75" />
                    ))}
                </div>
                <div className="absolute right-6 xl:right-14 bottom-[26%] hidden xl:grid grid-cols-4 gap-3 opacity-50 dark:opacity-35">
                    {Array.from({ length: 16 }).map((_, idx) => (
                        <div key={`dot-right-${idx}`} className="w-1.5 h-1.5 rounded-full bg-blue-500/75" />
                    ))}
                </div>

                {/* 5. Floating Stars & Plus Symbols in Flank Space */}
                <span className="absolute left-[5%] top-[24%] text-rose-400/50 dark:text-rose-400/40 text-xl font-light select-none animate-bounce [animation-duration:6s] hidden md:block">✦</span>
                <span className="absolute right-[5%] top-[38%] text-blue-400/50 dark:text-blue-400/40 text-2xl font-light select-none animate-bounce [animation-duration:7s] hidden md:block">✧</span>
                <span className="absolute left-[4%] top-[66%] text-amber-400/50 dark:text-amber-400/40 text-lg font-light select-none hidden md:block">+</span>
                <span className="absolute right-[4%] top-[76%] text-purple-400/50 dark:text-purple-400/40 text-xl font-light select-none hidden md:block">✦</span>
            </div>

            <div className="w-full max-w-7xl mx-auto relative z-10 px-2 sm:px-4">
                <SectionHeader text={t("Achievement.Heading")} />
                <CategoryFilterTab slugCurrentCategory={slug} />
                <Suspense fallback={<AchievementGridSkeleton />} key={slug ?? "all"}>
                    <AchievementsList slug={slug} locale={locale} />
                </Suspense>
            </div>
        </div>
    );
};

export default Achievement;