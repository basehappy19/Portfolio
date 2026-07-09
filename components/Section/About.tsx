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
    <div className="w-full text-slate-800 py-2">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <SectionHeader text={t('About.Heading')} />

        {/* Content Grid */}
        <div className="grid md:grid-cols-12 gap-8 items-center mb-8">
          {/* Image Section */}
          <div className="md:col-span-4 flex justify-center">
            <ProfileImageSection />
          </div>

          {/* Text Section */}
          <div className="md:col-span-8 space-y-4">
            <div className="space-y-3">
              <p className="text-base md:text-lg leading-relaxed text-slate-800 font-medium">
                {t('About.Introduce_1')}
              </p>
              <p className="text-sm md:text-base leading-relaxed text-slate-600">
                {t('About.Introduce_2')}
              </p>
            </div>

            {/* Call to Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              <WarpToContact text={t('About.Buttons.Contact')} />
              <WarpToAchievement text={t('About.Buttons.Achievements')} />
            </div>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statuses.map((stat, index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-center text-center p-4 rounded-lg bg-white border border-slate-200 shadow-2xs transition-all duration-200"
            >
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-1">
                {stat.number}
              </div>
              <div className="text-xs sm:text-sm font-medium text-slate-500">
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
