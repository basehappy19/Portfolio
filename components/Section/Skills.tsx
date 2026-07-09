import SectionHeader from '../SectionHeader';
import { getMessages, getTranslations } from 'next-intl/server';
import SkillGrid from '../SkillGrid';

export type Skill = {
  name: string;
  src: string;
};

type ExpertiseMessage = {
  Index: {
    Skill: {
      Expertise: {
        Heading: string;
        Skills: Skill[];
      }[];
    };
  };
};

const Skills = async () => {
  const t = await getTranslations('Index');
  const messages = await getMessages();

  const Expertise =
    (messages as unknown as ExpertiseMessage).Index.Skill.Expertise;

  return (
    <div className="w-full text-slate-800 py-2">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <SectionHeader text={t('Skill.Heading')} />

        <div className="space-y-5">
          {Expertise.map((e, i) => (
            <div
              key={i}
              className="rounded-lg p-5 md:p-6 transition-all duration-200 bg-white border border-slate-200 shadow-2xs"
            >
              {/* Category Heading */}
              <h3 className="text-base md:text-xl font-bold mb-4 flex items-center gap-2.5 text-slate-900">
                <span className="w-1 h-5 rounded-xs bg-rose-600" />
                <span>{e.Heading}</span>
              </h3>

              {/* Responsive Skills Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {e.Skills.map((skill, idx) => (
                  <SkillGrid key={idx} skill={skill} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Skills;
