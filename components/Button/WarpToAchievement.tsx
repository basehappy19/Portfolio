'use client'
import { scrollToSection } from '../Layout/Navbar'

const WarpToAchievement = ({ text }: { text: string }) => {
    return (
        <button
            onClick={() => scrollToSection("Achievements")}
            className="cursor-pointer flex-1 block text-center px-6 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white font-medium rounded-lg border border-gray-700 hover:border-gray-600 transition duration-300"
        >
            {text}
        </button>
    )
}

export default WarpToAchievement