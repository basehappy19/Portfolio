import Image from 'next/image'
import { Skill } from './Skills'

const SkillGrid = ({ skill }: { skill: Skill }) => {
    return (
        <div
            className="group relative"
        >
            {/* Skill Card */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:border-red-400 transition-all duration-300 hover:shadow-xl hover:shadow-red-500/30 cursor-pointer">
                {/* Icon Container */}
                <div className="w-16 h-16 mx-auto mb-3 relative">
                    <Image
                        className="object-contain drop-shadow-lg group-hover:drop-shadow-2xl transition-all duration-300"
                        fill
                        src={skill.src}
                        alt={skill.name}
                    ></Image>
                </div>

                {/* Skill Name */}
                <p className="text-white text-center text-sm font-medium group-hover:text-red-300 transition-colors">
                    {skill.name}
                </p>
            </div>

            {/* Glow Effect on Hover */}
            <div className="absolute inset-0 bg-linear-to-r from-red-600/0 via-red-600/20 to-red-600/0 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
        </div>
    )
}

export default SkillGrid