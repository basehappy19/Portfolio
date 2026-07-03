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
    <div className="w-full text-zinc-800 dark:text-zinc-100 py-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <SectionHeader text={t('Skill.Heading')} />

        <div className="space-y-8">
          {Expertise.map((e, i) => (
            <div
              key={i}
              className="rounded-3xl p-6 md:p-8 transition-all duration-300 bg-white/90 dark:bg-zinc-800/60 border border-rose-100 dark:border-zinc-700/80 hover:border-rose-300 dark:hover:border-rose-500/80 shadow-sm hover:shadow-lg"
            >
              {/* Category Heading */}
              <h3 className="text-lg md:text-2xl font-bold mb-6 flex items-center gap-3 text-zinc-800 dark:text-zinc-100">
                <span className="w-2 h-7 rounded-full bg-gradient-to-b from-rose-500 via-amber-500 to-sky-500" />
                <span>{e.Heading}</span>
              </h3>

              {/* Responsive Skills Grid: 2 cols phone portrait, 3-4 cols tablet landscape, 5-6 cols desktop */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
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
