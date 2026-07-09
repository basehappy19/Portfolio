"use client";
import { ArrowDown } from 'lucide-react';
import { scrollToSection } from './Layout/Navbar';

const WrapToAchievement = ({ text }: { text: string }) => {
  return (
    <button
      onClick={() => scrollToSection("Achievements")}
      className="cursor-pointer group w-full sm:w-auto px-7 py-3 bg-rose-600 hover:bg-rose-700 rounded-lg text-white font-semibold shadow-xs hover:shadow-sm transition-all duration-200"
    >
      <span className="flex items-center justify-center gap-2">
        <span>{text}</span>
        <ArrowDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
      </span>
    </button>
  );
};

export default WrapToAchievement;