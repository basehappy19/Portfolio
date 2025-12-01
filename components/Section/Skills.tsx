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
        <section id='Skills' className="min-h-screen w-full px-4 md:px-8 lg:px-16 py-16">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <SectionHeader text={t("Skill.Heading")} />

                <div className="space-y-8">
                    {Expertise.map((e, i) => (
                        <div
                            key={i}
                            className="bg-white/5 backdrop-blur-lg rounded-xl p-6 md:p-8 border border-white/10 hover:border-red-400/50 transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/20"
                        >
                            {/* Category Heading */}
                            <h3 className="text-lg md:text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                <span className="w-1.5 h-6 bg-linear-to-b from-red-400 to-pink-400 rounded-full"></span>
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