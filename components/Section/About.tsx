import { getMessages, getTranslations } from 'next-intl/server';
import SectionHeader from '../SectionHeader';
import WarpToAchievement from '../Button/WarpToAchievement';
import WarpToContact from '../Button/WarpToContact';
import ProfileImageSection from '../ProfileImageSection';

const About = async () => {
    type Status = {
        number: string;
        label: string;
    };

    type AboutMessages = {
        Index: {
            About: {
                data: {
                    statuses: Status[];
                };
            };
        };
    };

    const t = await getTranslations("Index");
    const messages = await getMessages();

    const statuses =
        (messages as unknown as AboutMessages).Index.About.data.statuses;

    return (
        <div
            className="
                min-h-screen w-full
                text-gray-900
                dark:text-white
            "
        >
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <SectionHeader text={t("About.Heading")} />

                {/* Content Grid */}
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Image Section */}
                    <ProfileImageSection />

                    {/* Text Section */}
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <p className="text-lg md:text-xl leading-relaxed text-gray-800 dark:text-gray-300">
                                {t("About.Introduce_1")}
                            </p>
                            <p className="text-lg md:text-xl leading-relaxed text-gray-600 dark:text-gray-400">
                                {t("About.Introduce_2")}
                            </p>
                        </div>

                        {/* Call to Action */}
                        <div className="flex gap-4 pt-6">
                            <WarpToContact text={t("About.Buttons.Contact")} />
                            <WarpToAchievement text={t("About.Buttons.Achievements")} />
                        </div>
                    </div>
                </div>

                {/* Status Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
                    {statuses.map((stat, index) => (
                        <div
                            key={index}
                            className="
                                flex flex-col items-center justify-center text-center p-6 rounded-xl
                                bg-white
                                dark:bg-transparent border border-gray-200
                                hover:border-red-400/40
                                shadow-sm
                                dark:bg-linear-to-br dark:from-gray-800/50 dark:to-gray-900/50
                                dark:border-gray-800 dark:hover:border-red-400/30
                                transition duration-300
                            "
                        >
                            <div className="text-3xl font-bold text-red-500 dark:text-red-400 mb-2">
                                {stat.number}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default About;
