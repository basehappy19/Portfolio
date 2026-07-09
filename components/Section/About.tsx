import { getMessages, getTranslations } from 'next-intl/server';
import SectionHeader from '../SectionHeader';
import WarpToAchievement from '../Button/WarpToAchievement';
import WarpToContact from '../Button/WarpToContact';

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
      <div className="w-full">
        {/* Header */}
        <SectionHeader text={t('About.Heading')} />

        {/* Content Grid */}
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Text Section */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-4">
              <p className="text-base sm:text-lg md:text-xl leading-relaxed text-slate-900 font-semibold">
                {t('About.Introduce_1')}
              </p>
              <p className="text-sm sm:text-base md:text-lg leading-relaxed text-slate-600">
                {t('About.Introduce_2')}
              </p>
            </div>

            {/* Call to Action Buttons */}
            <div className="flex flex-wrap gap-3.5 pt-2">
              <WarpToContact text={t('About.Buttons.Contact')} />
              <WarpToAchievement text={t('About.Buttons.Achievements')} />
            </div>
          </div>

          {/* Status Cards Section */}
          <div className="lg:col-span-5">
            <div className="grid grid-cols-2 gap-4 sm:gap-5">
              {statuses.map((stat, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center justify-center text-center p-6 sm:p-7 rounded-xl bg-white border border-slate-200 shadow-2xs hover:shadow-md hover:border-rose-500/50 transition-all duration-200 group"
                >
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 mb-2 group-hover:text-rose-600 transition-colors">
                    {stat.number}
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
