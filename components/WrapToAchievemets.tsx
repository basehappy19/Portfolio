"use client"
import { ArrowDown } from 'lucide-react'
import { scrollToSection } from './Layout/Navbar'

const WrapToAchievemets = ({ text }: { text: string }) => {
    return (
        <button onClick={() => scrollToSection("Achievements")}
            className="cursor-pointer group px-8 py-4 bg-red-500 rounded-full text-white font-semibold hover:shadow-2xl hover:shadow-red-500/50 transition-all duration-300">
            <span className="flex items-center gap-2">
                {text}
                <ArrowDown className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
            </span>
        </button>
    )
}

export default WrapToAchievemets