import Image from 'next/image';
import { Skill } from './Section/Skills';

const SkillGrid = ({ skill }: { skill: Skill }) => {
  return (
    <div className="group relative">
      {/* Skill Card */}
      <div className="rounded-2xl p-4 border transition-all duration-300 bg-white dark:bg-zinc-800/80 border-zinc-200/80 dark:border-zinc-700 hover:border-rose-400 dark:hover:border-rose-400 hover:shadow-md hover:-translate-y-1 flex flex-col items-center justify-center">
        {/* Icon Container */}
        <div className="w-14 h-14 mx-auto mb-2 relative flex items-center justify-center">
          <Image
            className="object-contain drop-shadow-sm group-hover:drop-shadow-md group-hover:scale-110 transition-all duration-300"
            fill
            sizes="56px"
            src={skill.src}
            alt={skill.name}
          />
        </div>

        {/* Skill Name */}
        <p className="text-center text-xs sm:text-sm font-medium text-zinc-700 dark:text-zinc-200 group-hover:text-rose-600 dark:group-hover:text-amber-400 transition-colors truncate w-full">
          {skill.name}
        </p>
      </div>

      {/* Glow Effect on Hover */}
      <div className="absolute inset-0 rounded-2xl blur-xl opacity-0 bg-gradient-to-r from-rose-500/10 via-amber-500/15 to-sky-500/10 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
    </div>
  );
};

export default SkillGrid;
