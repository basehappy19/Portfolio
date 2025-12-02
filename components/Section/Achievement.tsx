import { getTranslations, getLocale } from "next-intl/server";
import SectionHeader from "../SectionHeader";
import CategoryFilterTab from "../CategoryFilterTab";
import AchievementCardSkeleton from "../Loading/AchievementCardSkeleton";
import { Suspense } from "react";
import AchievementsList from "../AchievementsList";

const Achievement = async ({ slug }: { slug: string | undefined }) => {
    const locale = await getLocale();
    const t = await getTranslations("Index");

    return (
        <div
            className="min-h-screen w-full"
        >
            <div className="max-w-6xl mx-auto">
                <SectionHeader text={t("Achievement.Heading")} />
                <CategoryFilterTab slugCurrentCategory={slug} />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
                    <Suspense fallback={<AchievementCardSkeleton />}>
                        <AchievementsList slug={slug} locale={locale} />
                    </Suspense>
                </div>
            </div>
        </div>
    );
};

export default Achievement;

