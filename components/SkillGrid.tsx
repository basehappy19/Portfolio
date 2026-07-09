import Image from 'next/image';
import { Skill } from './Section/Skills';

const SkillGrid = ({ skill }: { skill: Skill }) => {
  return (
    <div className="group relative">
      {/* Skill Card */}
      <div className="rounded-lg p-3 border transition-all duration-200 bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 flex flex-col items-center justify-center">
        {/* Icon Container */}
        <div className="w-12 h-12 mx-auto mb-1.5 relative flex items-center justify-center">
          <Image
            className="object-contain transition-transform duration-200 group-hover:scale-105"
            fill
            sizes="48px"
            src={skill.src}
            alt={skill.name}
          />
        </div>

        {/* Skill Name */}
        <p className="text-center text-xs font-medium text-slate-700 group-hover:text-slate-900 transition-colors truncate w-full">
          {skill.name}
        </p>
      </div>
    </div>
  );
};

export default SkillGrid;
