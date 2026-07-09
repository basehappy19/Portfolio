import Image from 'next/image';
import { getMessages, getTranslations } from 'next-intl/server';
import SectionHeader from '../SectionHeader';
import WarpToAchievement from '../Button/WarpToAchievement';
import WarpToContact from '../Button/WarpToContact';

type Skill = {
  name: string;
  src: string;
};

type Status = {
  number: string;
  label: string;
};

type IndexMessages = {
  Index: {
    About: {
      data: {
        statuses: Status[];
      };
    };
    Skill: {
      Heading: string;
      Expertise: {
        Heading: string;
        Skills: Skill[];
      }[];
    };
  };
};

const About = async () => {
  const t = await getTranslations('Index');
  const messages = (await getMessages()) as unknown as IndexMessages;

  const statuses = messages.Index.About.data.statuses;
  const expertise = messages.Index.Skill.Expertise;

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

        {/* Compact Tech Stack & Skills Strip */}
        <div id="Skills" className="mt-14 pt-10 border-t border-slate-200/80 scroll-mt-24">
          <div className="flex items-center gap-2.5 mb-6">
            <span className="w-2 h-2 rounded-full bg-rose-600" />
            <h3 className="text-sm md:text-base font-bold text-slate-800 uppercase tracking-wider">
              {t('Skill.Heading')}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {expertise.map((cat, idx) => (
              <div key={idx} className="space-y-3">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wide flex items-center gap-1.5">
                  <span>{cat.Heading}</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {cat.Skills.map((skill, sIdx) => (
                    <div
                      key={sIdx}
                      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200/80 text-slate-800 text-xs md:text-sm font-semibold hover:border-rose-400 hover:bg-rose-50/40 transition-all shadow-2xs"
                    >
                      <div className="relative w-4 h-4 shrink-0">
                        <Image
                          src={skill.src}
                          alt={skill.name}
                          fill
                          sizes="16px"
                          className="object-contain"
                        />
                      </div>
                      <span>{skill.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
