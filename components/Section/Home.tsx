import { getTranslations } from 'next-intl/server';
import { Sparkles, FileText } from 'lucide-react';
import AnimatedRole from '../AnimatedRole';
import WrapToAchievement from '../WrapToAchievement';
import HeroProfileSection from '../HeroProfileSection';

const Home = async () => {
  const t = await getTranslations('Index');

  const viewAchievementsText = await t('Home.Buttons.ViewAchievements');
  const roles = t.raw('Home.Roles') as string[];

  return (
    <div className="w-full relative py-8 md:py-16">
      <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* Left Column: Name & Info */}
        <div className="lg:col-span-7 flex flex-col items-start text-left relative z-10 order-2 lg:order-1">
          
          {/* Subtle Welcome Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-100 rounded-full border border-slate-200 text-slate-700 shadow-2xs mb-6">
            <Sparkles className="w-4 h-4 text-rose-600" />
            <span className="text-xs md:text-sm font-semibold tracking-wide">
              {t('Home.Welcome')}
            </span>
          </div>

          {/* Greeting */}
          <h2 className="text-lg sm:text-xl font-medium text-slate-500 mb-2">
            {t('Home.Greeting')}
          </h2>

          {/* Name */}
          <h1 className="text-4xl sm:text-6xl xl:text-7xl font-extrabold tracking-tight mb-4 text-slate-900 leading-tight sm:leading-none">
            {t('Home.Name')}
          </h1>

          {/* Animated Role Component */}
          <div className="mb-6 text-slate-700 font-bold w-full flex justify-start text-lg sm:text-2xl">
            <AnimatedRole roles={roles} />
          </div>

          {/* Description */}
          <p className="text-sm sm:text-base lg:text-lg text-slate-600 max-w-2xl leading-relaxed mb-3">
            {t('Home.Description')}
          </p>

          <p className="text-xs sm:text-sm lg:text-base text-slate-500 max-w-xl leading-relaxed mb-8">
            {t('Home.Description_2')}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto">
            <div>
              <WrapToAchievement text={viewAchievementsText} />
            </div>

            <a
              href="https://drive.google.com/file/d/1OgnztJxGqy76u6Za3BI1nZAgVOe71vcP/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-lg font-semibold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 shadow-2xs transition-all duration-200 hover:border-slate-400"
            >
              <FileText className="w-4 h-4 text-rose-600" />
              <span>{t('Home.Buttons.Resume')}</span>
            </a>
          </div>

        </div>

        {/* Right Column: Prominent Interactive Profile Photo */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end relative z-10 order-1 lg:order-2 pb-6 lg:pb-0">
          <HeroProfileSection />
        </div>

      </div>
    </div>
  );
};

export default Home;
