import { getTranslations, getLocale } from "next-intl/server";
import SectionHeader from "../SectionHeader";
import CategoryFilterTab from "../CategoryFilterTab";
import AchievementCard from "../AchievementCard";
import { Achievement as AchievementType } from "@/types/Achievements";

const Achievement = async ({ slug }: { slug: string | undefined }) => {
    const locale = await getLocale();

    const qs = slug ? `?category=${encodeURIComponent(slug)}` : "";

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/achievements${qs}`
    );
    const { achievements }: { achievements: AchievementType[] } =
        await res.json();

    const t = await getTranslations("Index");

    return (
        <section className="min-h-screen w-full px-4 md:px-8 lg:px-16 py-16" id="Achievements">
            <div className="max-w-6xl mx-auto">
                <SectionHeader text={t("Achievement.Heading")} />
                <CategoryFilterTab slugCurrentCategory={slug} />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
                    {(!achievements || achievements.length === 0) ? (
                        <div className="col-span-full flex flex-col items-center justify-center p-12 bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 text-center">
                            <div className="w-20 h-20 mb-6 text-white/20">
                                <svg xmlns="http://www.w3.org/2000/svg"
                                    fill="none" viewBox="0 0 24 24" strokeWidth={1.5}
                                    stroke="currentColor" className="w-full h-full">
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                        d="M9 12h3.75M9 15h3.75M9 9h3.75m3 6.75H18a2.25 2.25 0 002.25-2.25V6.108
                     c0-.393-.154-.77-.427-1.05l-2.672-2.708A1.5 1.5 0 0015.879 2.25H6A2.25 
                     2.25 0 003.75 4.5v12A2.25 2.25 0 006 18.75h9" />
                                </svg>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2">
                                {t("Achievement.NoItemsTitle")}
                            </h3>
                            <p className="text-white/50 text-sm">
                                {t("Achievement.NoItemsDescription")}
                            </p>
                        </div>
                    ) : (
                        achievements.map((achievement, idx) => (
                            <AchievementCard
                                key={idx}
                                achievement={achievement}
                                locale={locale}
                            />
                        ))
                    )}
                </div>
            </div>
        </section>
    )
}

export default Achievement;
