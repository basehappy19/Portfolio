'use client';

import Image from 'next/image';

const HeroProfileSection = () => {
  return (
    <div className="relative group w-72 h-80 sm:w-80 sm:h-96 md:w-96 md:h-[420px] lg:w-[430px] lg:h-[510px] xl:w-[490px] xl:h-[580px] shrink-0 mx-auto lg:mx-0">
      
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

      {/* 3. Main Prominent Profile Image (me.png) */}
      <div className="relative w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden border-4 border-white shadow-2xl shadow-slate-900/10 bg-linear-to-b from-slate-100 via-rose-50/20 to-slate-200/80">
        <Image
          fill
          priority
          sizes="(max-width: 640px) 288px, (max-width: 1024px) 384px, 490px"
          className="w-full h-full object-cover object-[center_15%] transition-transform duration-700 ease-out group-hover:scale-105"
          src="/profiles/me.png"
          alt="Profile portrait"
        />
        
        {/* Subtle interior gradient overlay for depth */}
        <div className="absolute inset-0 bg-linear-to-t from-slate-900/15 via-transparent to-transparent z-10 pointer-events-none opacity-50 group-hover:opacity-30 transition-opacity" />
      </div>
    </div>
  );
};

export default HeroProfileSection;
