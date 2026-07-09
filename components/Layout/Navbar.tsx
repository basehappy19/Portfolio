'use client';
import React, { useState, useEffect } from 'react';
import { Home, User, Star, Briefcase, Mail, LucideIcon } from 'lucide-react';
import { useLocale } from 'next-intl';
import LanguageSwitcher from '../LanguageSwitcher';

type NavItem = {
  id: string;
  label_en: string;
  label_th: string;
  icon: LucideIcon;
};

const navItems: NavItem[] = [
  { id: 'Home', label_en: 'Home', label_th: 'หน้าหลัก', icon: Home },
  { id: 'About', label_en: 'About', label_th: 'เกี่ยวกับผม', icon: User },
  { id: 'Skills', label_en: 'Skills', label_th: 'ทักษะ', icon: Star },
  { id: 'Achievements', label_en: 'Achievements', label_th: 'ผลงาน', icon: Briefcase },
  { id: 'Contact', label_en: 'Contact', label_th: 'ติดต่อ', icon: Mail }
];

export const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    window.history.pushState(null, '', `#${sectionId}`);
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

const Navbar = () => {
  const [activeSection, setActiveSection] = useState('Home');
  const [isScrolled, setIsScrolled] = useState(false);
  const locale = useLocale();
  const isThai = locale === 'th';

  useEffect(() => {
    const ACTIVATION_OFFSET = 350;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const sections = navItems.map(item => document.getElementById(item.id));
      const scrollPosition = window.scrollY + ACTIVATION_OFFSET;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(navItems[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* DESKTOP & LARGE SCREEN NAVIGATION */}
      <header
        role="navigation"
        aria-label="Main navigation"
        className="hidden md:flex fixed top-4 left-0 right-0 z-50 justify-center px-4 transition-all duration-300 pointer-events-none"
      >
        <div
          className={`
            pointer-events-auto flex items-center justify-between gap-3 px-5 py-2 rounded-2xl border transition-all duration-300
            ${isScrolled
              ? 'bg-white/50 border-white/70 backdrop-blur-2xl shadow-lg shadow-slate-900/5'
              : 'bg-white/30 border-white/50 backdrop-blur-xl shadow-sm'
            }
          `}
        >
          {/* Navigation Links */}
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    scrollToSection(item.id);
                    setActiveSection(item.id);
                  }}
                  aria-current={isActive ? 'page' : undefined}
                  className={`
                    group relative px-3.5 py-1.5 text-sm font-bold rounded-xl flex items-center gap-2 transition-all duration-200 cursor-pointer
                    ${isActive
                      ? 'bg-rose-600 text-white shadow-md shadow-rose-500/25 scale-102'
                      : 'text-slate-700 hover:text-slate-950 hover:bg-white/60'
                    }
                  `}
                >
                  <Icon className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
                  <span>{isThai ? item.label_th : item.label_en}</span>
                </button>
              );
            })}
          </div>

          <div className="h-5 w-px bg-slate-300/60 mx-1.5" />

          {/* Language Control */}
          <div className="flex items-center gap-2">
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      {/* MOBILE & TABLET FLOATING BOTTOM NAVIGATION */}
      <div className="md:hidden fixed bottom-4 left-0 right-0 z-50 flex flex-col items-center gap-2 px-3 pointer-events-none">
        <div className="pointer-events-auto flex items-center justify-between w-full max-w-sm px-4 py-2.5 bg-white/55 backdrop-blur-2xl border border-white/70 rounded-2xl shadow-xl shadow-slate-900/10">
          <div className="flex items-center justify-around flex-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    scrollToSection(item.id);
                    setActiveSection(item.id);
                  }}
                  aria-label={isThai ? item.label_th : item.label_en}
                  title={isThai ? item.label_th : item.label_en}
                  className={`
                    p-2.5 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer
                    ${isActive
                      ? 'bg-rose-600 text-white shadow-md shadow-rose-500/25 scale-105'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-white/60'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;