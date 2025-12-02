import Image from 'next/image'
import { Skill } from './Section/Skills'

const SkillGrid = ({ skill }: { skill: Skill }) => {
    return (
        <div className="group relative">
            {/* Skill Card */}
            <div
                className="
                    rounded-lg p-4 border transition-all duration-300
                    bg-white border-gray-200
                    hover:border-red-400 hover:shadow-xl hover:shadow-red-500/20

                    dark:bg-white/10 dark:border-white/20
                    dark:hover:border-red-400 dark:hover:shadow-xl dark:hover:shadow-red-500/30
                    dark:backdrop-blur-sm
                "
            >
                {/* Icon Container */}
                <div className="w-12 h-12 mx-auto mb-2 relative flex items-center justify-center">
                    <div className="w-16 h-16 mx-auto mb-3 relative">
                        <Image
                            className="
                                object-contain drop-shadow-md
                                group-hover:drop-shadow-xl
                                transition-all duration-300
                            "
                            fill
                            src={skill.src}
                            alt={skill.name}
                        />
                    </div>
                </div>

                {/* Skill Name */}
                <p
                    className="
                        text-center text-xs md:text-sm font-medium
                        text-gray-800 group-hover:text-red-500
                        dark:text-white dark:group-hover:text-red-300
                        transition-colors
                    "
                >
                    {skill.name}
                </p>
            </div>

            {/* Glow Effect on Hover */}
            <div
                className="
                    absolute inset-0 rounded-lg blur-xl opacity-0
                    bg-linear-to-r from-red-500/0 via-red-500/15 to-red-500/0
                    group-hover:opacity-100 transition-opacity duration-300 -z-10

                    dark:from-red-600/0 dark:via-red-600/20 dark:to-red-600/0
                "
            ></div>
        </div>
    )
}

export default SkillGrid
