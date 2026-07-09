'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Award, CheckCircle2 } from 'lucide-react';

const HeroProfileSection = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(1);
  const totalImages = 3;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev >= totalImages ? 1 : prev + 1));
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative group w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-[380px] lg:h-[380px] xl:w-[430px] xl:h-[430px] shrink-0 mx-auto lg:mx-0">
      
      {/* 1. Geometric Decorative Backing Frame */}
      <div className="absolute -top-4 -right-4 sm:-top-5 sm:-right-5 w-full h-full rounded-3xl bg-linear-to-tr from-rose-500/15 via-amber-500/10 to-transparent border border-rose-500/25 -z-10 transition-transform duration-500 ease-out group-hover:translate-x-2 group-hover:-translate-y-2" />
      
      {/* 2. Soft Dot Grid Matrix Accent Behind Bottom-Left */}
      <div 
        className="absolute -bottom-6 -left-6 w-36 h-36 -z-20 opacity-30 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#e11d48 1.5px, transparent 1.5px)',
          backgroundSize: '14px 14px'
        }}
      />

      {/* 3. Main Profile Image Frame with Smooth Crossfade */}
      <div className="relative w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden border-4 border-white shadow-2xl shadow-slate-900/10 bg-slate-100">
        {[1, 2, 3].map((num) => (
          <Image
            key={num}
            fill
            priority={num === 1}
            sizes="(max-width: 640px) 256px, (max-width: 1024px) 320px, 430px"
            className={`w-full h-full object-cover transition-all duration-700 ease-in-out group-hover:scale-105 ${
              currentImageIndex === num ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
            src={`/profiles/${num}.jpg`}
            alt={`Profile portrait ${num}`}
          />
        ))}
        
        {/* Subtle interior gradient overlay for depth */}
        <div className="absolute inset-0 bg-linear-to-t from-slate-900/20 via-transparent to-transparent z-15 pointer-events-none opacity-60 group-hover:opacity-40 transition-opacity" />
      </div>

      {/* 4. Floating Interactive Glass Pill (Bottom Left - Live Status) */}
      <div className="absolute -bottom-5 left-3 sm:-left-6 z-20 px-4 sm:px-5 py-2.5 sm:py-3 rounded-2xl bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-xl shadow-slate-900/5 flex items-center gap-3 transition-all duration-300 hover:scale-105 hover:-translate-y-1 cursor-default">
        <span className="relative flex h-3 sm:h-3.5 w-3 sm:w-3.5 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 sm:h-3.5 w-3 sm:w-3.5 bg-emerald-500" />
        </span>
        <div className="text-left">
          <p className="text-[10px] sm:text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Status</p>
          <p className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1">
            <span>Available for Projects</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 inline" />
          </p>
        </div>
      </div>

      {/* 5. Floating Interactive Tech/Experience Pill (Top Right - Specialization) */}
      <div className="absolute -top-4 right-3 sm:-right-5 z-20 px-3.5 sm:px-4 py-2 rounded-xl bg-slate-900 text-white shadow-xl shadow-slate-900/15 flex items-center gap-2 transition-all duration-300 hover:scale-105 cursor-default border border-slate-700/60">
        <Award className="w-4 h-4 text-amber-400 shrink-0" />
        <span className="text-xs sm:text-sm font-semibold tracking-wide">Enterprise Quality</span>
      </div>

    </div>
  );
};

export default HeroProfileSection;
