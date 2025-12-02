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
                data:
                {
                    statuses: Status[];
                }
                ,
            };
        };
    };

    const t = await getTranslations("Index");
    const messages = await getMessages();

    const statuses =
        (messages as unknown as AboutMessages).Index.About.data.statuses;


    return (
        <section id='About' className="min-h-screen w-full px-4 md:px-8 lg:px-16">
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
                            <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
                                {t("About.Introduce_1")}
                            </p>
                            <p className="text-lg md:text-xl text-gray-400 leading-relaxed">
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

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
                    {statuses.map((stat, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center justify-center text-center p-6 rounded-xl bg-linear-to-br from-gray-800/50 to-gray-900/50 border border-gray-800 hover:border-red-400/30 transition duration-300"
                        >
                            <div className="text-3xl font-bold text-red-400 mb-2">{stat.number}</div>
                            <div className="text-sm text-gray-400">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>


        </section>
    )
}

export default About