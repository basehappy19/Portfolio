import { getTranslations } from 'next-intl/server';
import AnimatedRole from './AnimatedRole';
import WrapToAchievemets from './WrapToAchievemets';
import { Sparkles } from 'lucide-react';
import ViewCV from './ViewCV';

const Home = async () => {
    const t = await getTranslations("Index");
                
    const viewAchievementsText = await t("Home.Buttons.ViewAchievements")
    const viewCVText = await t("Home.Buttons.CV")
    const roles = t.raw("Home.Roles") as string[];

    return (
        <section id='Home' className="min-h-screen w-full px-4 md:px-8 lg:px-16 pt-[-4] relative">
            <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex flex-col items-center justify-center min-h-screen text-center">
                    {/* Main Content */}
                    <div className={`transition-all duration-1000 opacity-100 translate-y-0`}>
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-8 animate-fade-in">
                            <Sparkles className="w-4 h-4 text-yellow-300" />
                            <span className="text-sm text-white/90 font-medium">{t("Home.Welcome")}
                            </span>
                        </div>

                        {/* Greeting */}
                        <h2 className="text-xl md:text-2xl text-red-300 mb-4 font-light">
                            {t("Home.Greeting")}
                        </h2>

                        {/* Name */}
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 bg-linear-to-r from-white via-orange-200 to-red-200 bg-clip-text text-transparent">
                            {t("Home.Name")}
                        </h1>

                        {/* Animated Role */}
                        <AnimatedRole roles={roles} />

                        {/* Description */}
                        <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-12 leading-relaxed">
                            {t("Home.Description")}
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-wrap gap-4 justify-center mb-12">
                            <WrapToAchievemets text={viewAchievementsText} />
                            <ViewCV text={viewCVText} />
                        </div>
                    </div>

                    {/* Scroll Indicator */}
                    <button
                        className="mt-6 animate-bounce cursor-pointer"
                    >
                        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
                            <div className="w-1 h-2 bg-white/50 rounded-full animate-scroll" />
                        </div>
                    </button>
                </div>
            </div>
        </section>
    );
};

export default Home;