import SectionHeader from '../SectionHeader'
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
                Heading: string,
                Skills: Skill[],
            }[];
        }
    };
};

const Skills = async () => {

    const t = await getTranslations("Index");
    const messages = await getMessages();

    const Expertise =
        (messages as unknown as ExpertiseMessage).Index.Skill.Expertise;

    return (
        <section
            id='Skills'
            className="
                min-h-screen w-full px-4 md:px-8 lg:px-16 py-16
                text-gray-900
                dark:text-white
            "
        >
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <SectionHeader text={t("Skill.Heading")} />

                <div className="space-y-8">
                    {Expertise.map((e, i) => (
                        <div
                            key={i}
                            className="
                                rounded-xl p-6 md:p-8 transition-all duration-300
                                bg-gray-50 border border-gray-200
                                hover:border-red-400/60 hover:shadow-2xl hover:shadow-red-500/15

                                dark:bg-white/5 dark:backdrop-blur-lg
                                dark:border-white/10 dark:hover:border-red-400/50
                                dark:hover:shadow-2xl dark:hover:shadow-red-500/20
                            "
                        >
                            {/* Category Heading */}
                            <h3 className="
                                text-lg md:text-2xl font-bold mb-6 flex items-center gap-3
                                text-gray-900 dark:text-white
                            ">
                                <span className="
                                    w-1.5 h-6 rounded-full
                                    bg-linear-to-b from-red-500 to-pink-500
                                    dark:from-red-400 dark:to-pink-400
                                "></span>
                                {e.Heading}
                            </h3>

                            {/* Skills Grid */}
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-4">
                                {e.Skills.map((skill, idx) => (
                                    <SkillGrid key={idx} skill={skill} />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Skills
