"use client";
import { ArrowDown } from 'lucide-react';
import { scrollToSection } from './Layout/Navbar';

const WrapToAchievement = ({ text }: { text: string }) => {
  return (
    <button
      onClick={() => scrollToSection("Achievements")}
      className="cursor-pointer group w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 rounded-full text-white font-semibold shadow-md hover:shadow-lg hover:shadow-rose-500/30 hover:-translate-y-0.5 transition-all duration-300"
    >
      <span className="flex items-center justify-center gap-2">
        <span>{text}</span>
        <ArrowDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
      </span>
    </button>
  );
};

export default WrapToAchievement;