import { getTranslations } from 'next-intl/server';
import { Sparkles } from 'lucide-react';
import AnimatedRole from '../AnimatedRole';
import WrapToAchievement from '../WrapToAchievement';

const Home = async () => {
    const t = await getTranslations("Index");

    const viewAchievementsText = await t("Home.Buttons.ViewAchievements")
    const roles = t.raw("Home.Roles") as string[];

    return (
        <section
            className="
                min-h-screen w-full relative
            "
        >
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex flex-col items-center justify-center min-h-screen text-center">

                    {/* Main Container */}
                    <div className="transition-all duration-1000 opacity-100 translate-y-0">

                        {/* Badge */}
                        <div className="
                            inline-flex items-center gap-2 px-4 py-2
                            bg-white backdrop-blur-md rounded-full border border-black/10
                            text-gray-700
                            dark:bg-white/10 dark:border-white/20 dark:text-white/90
                            mb-8 animate-fade-in
                        ">
                            <Sparkles className="w-4 h-4 text-yellow-500 dark:text-yellow-300" />
                            <span className="text-sm md:text-xl font-medium">
                                {t("Home.Welcome")}
                            </span>
                        </div>

                        {/* Greeting */}
                        <h2 className="
                            text-xl md:text-6xl mb-4 font-light
                            text-red-500 dark:text-red-300
                        ">
                            {t("Home.Greeting")}
                        </h2>

                        {/* Name */}
                        <h1 className="
                            text-3xl md:text-7xl lg:text-8xl font-bold mb-6
                            bg-linear-to-r from-red-600 to-orange-500
                            dark:from-white dark:via-orange-200 dark:to-red-200
                            bg-clip-text text-transparent
                        ">
                            {t("Home.Name")}
                        </h1>

                        {/* Animated Role */}
                        <AnimatedRole roles={roles} />

                        {/* Description */}
                        <p className="text-lg md:text-xl text-gray-700 dark:text-white/80 max-w-2xl mx-auto leading-relaxed">
                            {t("Home.Description")}
                        </p>

                        <p className="text-lg md:text-xl text-gray-500 dark:text-white/60 max-w-2xl mx-auto mb-12 leading-relaxed">
                            {t("Home.Description_2")}
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-wrap gap-4 justify-center mb-12">

                            <WrapToAchievement text={viewAchievementsText} />

                            <a
                                href="https://drive.google.com/file/d/1OgnztJxGqy76u6Za3BI1nZAgVOe71vcP/view?usp=sharing"
                                target='_blank'
                                className="
                                    cursor-pointer px-8 py-4 rounded-full font-semibold
                                    bg-black/5 border border-black/20 text-gray-900
                                    hover:bg-black/10
                                    dark:bg-white/10 dark:border-white/20 dark:text-white
                                    dark:hover:bg-white/20
                                    backdrop-blur-md transition-all duration-300
                                "
                            >
                                {t("Home.Buttons.Resume")}
                            </a>
                        </div>

                        {/* Scroll Indicator */}
                        <button className="mt-6 animate-bounce">
                            <div className="
                                w-6 h-10 border-2 rounded-full flex items-start justify-center p-2
                                border-gray-400 dark:border-white/30
                            ">
                                <div className="
                                    w-1 h-2 rounded-full animate-scroll
                                    bg-gray-500 dark:bg-white/50
                                " />
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Home;
