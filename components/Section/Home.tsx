import { getTranslations } from 'next-intl/server';
import { Sparkles, FileText } from 'lucide-react';
import AnimatedRole from '../AnimatedRole';
import WrapToAchievement from '../WrapToAchievement';

const Home = async () => {
  const t = await getTranslations('Index');

  const viewAchievementsText = await t('Home.Buttons.ViewAchievements');
  const roles = t.raw('Home.Roles') as string[];

  return (
    <div className="w-full flex flex-col items-center justify-center relative py-8 md:py-12">
      <div className="max-w-3xl mx-auto px-4 text-center relative z-10 flex flex-col items-center">
        
        {/* Subtle Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-100 rounded-full border border-slate-200 text-slate-700 shadow-2xs mb-5">
          <Sparkles className="w-3.5 h-3.5 text-rose-600" />
          <span className="text-xs md:text-sm font-semibold tracking-wide">
            {t('Home.Welcome')}
          </span>
        </div>

        {/* Greeting */}
        <h2 className="text-lg sm:text-xl font-medium text-slate-500 mb-1.5">
          {t('Home.Greeting')}
        </h2>

        {/* Name */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4 text-slate-900">
          {t('Home.Name')}
        </h1>

        {/* Animated Role Component */}
        <div className="mb-5 w-full flex justify-center text-slate-700 font-bold">
          <AnimatedRole roles={roles} />
        </div>

        {/* Description */}
        <p className="text-sm sm:text-base text-slate-600 max-w-xl leading-relaxed mb-2">
          {t('Home.Description')}
        </p>

        <p className="text-xs sm:text-sm text-slate-500 max-w-lg leading-relaxed mb-8">
          {t('Home.Description_2')}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md">
          <div className="w-full sm:w-auto">
            <WrapToAchievement text={viewAchievementsText} />
          </div>

          <a
            href="https://drive.google.com/file/d/1OgnztJxGqy76u6Za3BI1nZAgVOe71vcP/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 shadow-2xs transition-all duration-200"
          >
            <FileText className="w-4 h-4 text-rose-600" />
            <span>{t('Home.Buttons.Resume')}</span>
          </a>
        </div>

      </div>
    </div>
  );
};

export default Home;
