import { getTranslations } from 'next-intl/server';
import { Sparkles, ArrowRight, FileText } from 'lucide-react';
import AnimatedRole from '../AnimatedRole';
import WrapToAchievement from '../WrapToAchievement';

const Home = async () => {
  const t = await getTranslations('Index');

  const viewAchievementsText = await t('Home.Buttons.ViewAchievements');
  const roles = t.raw('Home.Roles') as string[];

  return (
    <div className="min-h-[90vh] w-full flex flex-col items-center justify-center relative py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-4 text-center relative z-10 flex flex-col items-center">
        
        {/* Lively Sparkle Badge */}
        <div className="inline-flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-sky-500/10 dark:from-amber-400/15 dark:to-rose-400/15 backdrop-blur-md rounded-full border border-rose-200/80 dark:border-zinc-700/80 text-rose-600 dark:text-rose-300 shadow-sm mb-6 animate-pulse">
          <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
          <span className="text-sm md:text-base font-semibold tracking-wide">
            {t('Home.Welcome')}
          </span>
        </div>

        {/* Greeting */}
        <h2 className="text-xl sm:text-2xl md:text-3xl font-medium text-zinc-600 dark:text-zinc-300 mb-2">
          {t('Home.Greeting')}
        </h2>

        {/* Name */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-rose-600 via-amber-500 to-rose-500 dark:from-rose-400 dark:via-amber-300 dark:to-sky-400 bg-clip-text text-transparent drop-shadow-sm">
          {t('Home.Name')}
        </h1>

        {/* Animated Role Component */}
        <div className="mb-6 w-full flex justify-center">
          <AnimatedRole roles={roles} />
        </div>

        {/* Description */}
        <p className="text-base sm:text-lg md:text-xl text-zinc-700 dark:text-zinc-300 max-w-2xl leading-relaxed mb-3">
          {t('Home.Description')}
        </p>

        <p className="text-sm sm:text-base md:text-lg text-zinc-500 dark:text-zinc-400 max-w-xl leading-relaxed mb-10">
          {t('Home.Description_2')}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md">
          <div className="w-full sm:w-auto">
            <WrapToAchievement text={viewAchievementsText} />
          </div>

          <a
            href="https://drive.google.com/file/d/1OgnztJxGqy76u6Za3BI1nZAgVOe71vcP/view?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-full font-semibold text-zinc-800 dark:text-zinc-100 bg-white dark:bg-zinc-800/80 hover:bg-rose-50 dark:hover:bg-zinc-700 border border-rose-200 dark:border-zinc-700 shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
          >
            <FileText className="w-4 h-4 text-rose-500" />
            <span>{t('Home.Buttons.Resume')}</span>
          </a>
        </div>

      </div>
    </div>
  );
};

export default Home;
