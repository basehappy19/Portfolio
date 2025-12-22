import { getTranslations, getLocale } from "next-intl/server";
import SectionHeader from "../SectionHeader";
import CategoryFilterTab from "../CategoryFilterTab";
import { Suspense } from "react";
import AchievementsList from "../AchievementsList";
import AchievementGridSkeleton from "../Loading/AchievementGridSkeleton";

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

                <Suspense fallback={<AchievementGridSkeleton />}>
                    <AchievementsList slug={slug} locale={locale} />
                </Suspense>
            </div>
        </div>
    );
};

export default Achievement;

