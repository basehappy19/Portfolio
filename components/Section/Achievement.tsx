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
            {/* STUNNING FLANK & BACKDROP ARTWORK FOR ACHIEVEMENTS SECTION (z-0 so clearly visible above section backgrounds) */}
            <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
                {/* 1. Flank Glowing Mesh Spheres (Left & Right Flanks - high contrast & inward position) */}
                <div className="absolute -left-20 sm:-left-10 lg:left-0 top-[18%] w-[450px] h-[450px] sm:w-[550px] sm:h-[550px] rounded-full bg-radial from-rose-500/30 sm:from-rose-500/35 via-pink-500/15 to-transparent blur-2xl sm:blur-3xl opacity-100 animate-pulse [animation-duration:6s]" />
                <div className="absolute -right-20 sm:-right-10 lg:right-0 top-[42%] w-[450px] h-[450px] sm:w-[550px] sm:h-[550px] rounded-full bg-radial from-blue-500/30 sm:from-blue-500/35 via-indigo-500/15 to-transparent blur-2xl sm:blur-3xl opacity-100 animate-pulse [animation-duration:8s]" />
                <div className="absolute -left-16 sm:left-0 bottom-[8%] w-[400px] h-[400px] rounded-full bg-radial from-amber-500/25 via-orange-500/10 to-transparent blur-2xl opacity-90" />
                <div className="absolute -right-16 sm:right-0 bottom-[18%] w-[400px] h-[400px] rounded-full bg-radial from-violet-500/25 via-fuchsia-500/10 to-transparent blur-2xl opacity-90" />

                {/* 2. Architectural Side Light Beams & Glowing LED Jewels (Right inside flank margins) */}
                <div className="absolute left-3 sm:left-6 lg:left-12 top-[4%] bottom-[4%] w-[2px] bg-gradient-to-b from-transparent via-rose-500/60 dark:via-rose-400/60 to-transparent hidden sm:block shadow-[0_0_8px_rgba(244,63,94,0.4)]">
                    <div className="absolute top-[25%] -left-[3px] w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,1)] animate-ping" />
                    <div className="absolute top-[25%] -left-[3px] w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,1)]" />
                    <div className="absolute top-[58%] -left-[3px] w-2 h-2 rounded-full bg-rose-400 shadow-[0_0_10px_rgba(251,113,133,1)]" />
                    <div className="absolute top-[82%] -left-[3px] w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,1)]" />
                </div>
                <div className="absolute right-3 sm:right-6 lg:right-12 top-[8%] bottom-[8%] w-[2px] bg-gradient-to-b from-transparent via-blue-500/60 dark:via-blue-400/60 to-transparent hidden sm:block shadow-[0_0_8px_rgba(59,130,246,0.4)]">
                    <div className="absolute top-[35%] -right-[3px] w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,1)] animate-ping" />
                    <div className="absolute top-[35%] -right-[3px] w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,1)]" />
                    <div className="absolute top-[70%] -right-[3px] w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,1)]" />
                </div>

                {/* 3. Spinning Geometric Wireframe Rings (Inward positioning so visible and unclipped) */}
                <div className="absolute left-4 sm:left-10 lg:left-16 top-[26%] w-40 h-40 sm:w-56 sm:h-56 lg:w-64 lg:h-64 rounded-full border-2 border-dashed border-rose-500/50 dark:border-rose-400/40 animate-[spin_40s_linear_infinite] hidden sm:block">
                    <div className="absolute inset-4 rounded-full border border-rose-500/30 dark:border-rose-400/25" />
                </div>
                <div className="absolute right-4 sm:right-10 lg:right-16 top-[48%] w-48 h-48 sm:w-64 sm:h-64 lg:w-72 lg:h-72 rounded-full border-2 border-dashed border-blue-500/50 dark:border-blue-400/40 animate-[spin_50s_linear_infinite_reverse] hidden sm:block">
                    <div className="absolute inset-6 rounded-full border border-blue-500/30 dark:border-blue-400/25" />
                </div>

                {/* 4. Dotted Matrix Patterns (High contrast dots on left and right) */}
                <div className="absolute left-6 lg:left-14 top-[14%] hidden lg:grid grid-cols-4 gap-3.5 opacity-90">
                    {Array.from({ length: 16 }).map((_, idx) => (
                        <div key={`dot-left-${idx}`} className="w-2 h-2 rounded-full bg-rose-500/80 shadow-[0_0_6px_rgba(244,63,94,0.6)]" />
                    ))}
                </div>
                <div className="absolute right-6 lg:right-14 bottom-[24%] hidden lg:grid grid-cols-4 gap-3.5 opacity-90">
                    {Array.from({ length: 16 }).map((_, idx) => (
                        <div key={`dot-right-${idx}`} className="w-2 h-2 rounded-full bg-blue-500/80 shadow-[0_0_6px_rgba(59,130,246,0.6)]" />
                    ))}
                </div>

                {/* 5. Glowing Watermark Badges along Flanks */}
                <div className="absolute left-8 lg:left-16 top-[22%] hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-zinc-900/90 border border-rose-300 dark:border-rose-800 shadow-md shadow-rose-500/10 rotate-[-6deg]">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                    <span className="text-[11px] font-extrabold tracking-wider text-rose-600 dark:text-rose-400 uppercase">Featured Works</span>
                </div>
                <div className="absolute right-8 lg:right-16 top-[44%] hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-zinc-900/90 border border-blue-300 dark:border-blue-800 shadow-md shadow-blue-500/10 rotate-[6deg]">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-[11px] font-extrabold tracking-wider text-blue-600 dark:text-blue-400 uppercase">Portfolio Gallery</span>
                </div>

                {/* 6. Floating Stars & Plus Symbols in Flank Space */}
                <span className="absolute left-[8%] top-[20%] text-rose-500/80 dark:text-rose-400/70 text-2xl font-bold select-none animate-bounce [animation-duration:5s] hidden sm:block">✦</span>
                <span className="absolute right-[8%] top-[34%] text-blue-500/80 dark:text-blue-400/70 text-3xl font-bold select-none animate-bounce [animation-duration:6s] hidden sm:block">✧</span>
                <span className="absolute left-[6%] top-[60%] text-amber-500/80 dark:text-amber-400/70 text-2xl font-bold select-none hidden sm:block">+</span>
                <span className="absolute right-[6%] top-[72%] text-purple-500/80 dark:text-purple-400/70 text-2xl font-bold select-none hidden sm:block">✦</span>
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