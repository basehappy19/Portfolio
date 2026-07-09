'use client'
import { scrollToSection } from '../Layout/Navbar'

const WarpToAchievement = ({ text }: { text: string }) => {
    return (
        <button
            onClick={() => scrollToSection("Achievements")}
            className="cursor-pointer flex-1 block text-center px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-800 font-medium rounded-lg border border-slate-300 shadow-2xs transition duration-200"
        >
            {text}
        </button>
    )
}

export default WarpToAchievement