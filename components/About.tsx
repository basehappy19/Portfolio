import { getMessages, getTranslations } from 'next-intl/server';
import Image from 'next/image';
import SectionHeader from './SectionHeader';

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
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-linear-to-r from-red-400 via-pink-500 to-purple-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                        <div className="relative">
                            <div className="aspect-square rounded-2xl overflow-hidden bg-linear-to-br from-gray-800 to-gray-900 shadow-2xl">
                                <Image
                                    fill
                                    className="w-full h-full object-cover"
                                    src="/profiles/1.png"
                                    alt="profile"
                                />
                            </div>
                            {/* Decorative Elements */}
                            <div className="absolute -top-4 -right-4 w-24 h-24 bg-red-400/10 rounded-full blur-2xl"></div>
                            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-400/10 rounded-full blur-2xl"></div>
                        </div>
                    </div>

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
                            <a href='#ContactMe' className="items-center justify-center px-6 py-3 bg-red-400 hover:bg-red-500 text-white font-medium rounded-lg transition duration-300 shadow-lg hover:shadow-red-400/50 transform hover:-translate-y-0.5">
                                {t("About.Buttons.ContactMe")}
                            </a>
                            <a href='#Achievements' className="items-center justify-center px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white font-medium rounded-lg border border-gray-700 hover:border-gray-600 transition duration-300">
                                {t("About.Buttons.Achievements")}
                            </a>
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