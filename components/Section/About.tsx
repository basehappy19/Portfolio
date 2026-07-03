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

  const t = await getTranslations('Index');
  const messages = await getMessages();

  const statuses =
    (messages as unknown as AboutMessages).Index.About.data.statuses;

  return (
    <div className="w-full text-zinc-800 dark:text-zinc-100 py-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <SectionHeader text={t('About.Heading')} />

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Image Section */}
          <div className="flex justify-center">
            <ProfileImageSection />
          </div>

          {/* Text Section */}
          <div className="space-y-6">
            <div className="space-y-4">
              <p className="text-lg md:text-xl leading-relaxed text-zinc-700 dark:text-zinc-200">
                {t('About.Introduce_1')}
              </p>
              <p className="text-base md:text-lg leading-relaxed text-zinc-500 dark:text-zinc-400">
                {t('About.Introduce_2')}
              </p>
            </div>

            {/* Call to Action Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              <WarpToContact text={t('About.Buttons.Contact')} />
              <WarpToAchievement text={t('About.Buttons.Achievements')} />
            </div>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {statuses.map((stat, index) => (
            <div
              key={index}
              className="group flex flex-col items-center justify-center text-center p-6 rounded-2xl bg-white/90 dark:bg-zinc-800/60 border border-rose-100 dark:border-zinc-700/80 hover:border-rose-300 dark:hover:border-rose-500 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
            >
              <div className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-rose-600 to-amber-500 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform duration-300">
                {stat.number}
              </div>
              <div className="text-xs sm:text-sm font-medium text-zinc-600 dark:text-zinc-400">
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
