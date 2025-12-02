import { Achievement as AchievementType } from "@/types/Achievements";
import AchievementCard from "./AchievementCard";
import { getTranslations } from "next-intl/server";

async function getData(slug?: string) {
    const qs = slug ? `?category=${encodeURIComponent(slug)}` : "";
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL}/api/achievements${qs}`,
        { cache: "no-store" }
    );

    if (!res.ok) throw new Error("Failed to fetch achievements");

    const { achievements }: { achievements: AchievementType[] } =
        await res.json();

    return achievements;
}

export default async function AchievementsList({
    slug,
    locale,
}: {
    slug?: string;
    locale: string;
}) {
    const t = await getTranslations("Index");
    const achievements = await getData(slug);

    if (!achievements || achievements.length === 0) {
        return (
            <div
                className="
                col-span-full flex flex-col items-center justify-center p-12 rounded-xl text-center
                transition-all

                bg-gray-100 border border-gray-300
                text-gray-700
                dark:bg-white/5 dark:border-white/10 dark:text-white
                dark:backdrop-blur-lg
            "
            >
                {/* Icon */}
                <div className="
                w-20 h-20 mb-6
                text-gray-400
                dark:text-white/20
            ">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-full h-full"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 12h3.75M9 15h3.75M9 9h3.75m3 6.75H18a2.25 2.25 0 002.25-2.25V6.108
                           c0-.393-.154-.77-.427-1.05l-2.672-2.708A1.5 1.5 0 0015.879 2.25H6A2.25 
                           2.25 0 003.75 4.5v12A2.25 2.25 0 006 18.75h9"
                        />
                    </svg>
                </div>

                {/* Title */}
                <h3 className="
                text-xl font-bold mb-2
                text-gray-900
                dark:text-white
            ">
                    {t("Achievement.NoItemsTitle")}
                </h3>

                {/* Description */}
                <p className="
                text-sm
                text-gray-500
                dark:text-white/50
            ">
                    {t("Achievement.NoItemsDescription")}
                </p>
            </div>
        );
    }

    return (
        <>
            {achievements.map((achievement, idx) => (
                <AchievementCard
                    key={idx}
                    achievement={achievement}
                    locale={locale}
                />
            ))}
        </>
    );
}
