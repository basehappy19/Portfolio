'use client';
import React, { useState, useEffect } from 'react';
import { Home, User, Star, Briefcase, Mail, LucideIcon } from 'lucide-react';
import { useLocale } from 'next-intl';
import LanguageSwitcher from '../LanguageSwitcher';
import ThemeSwitch from '../ThemeSwitch';

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
        className="hidden md:flex fixed top-6 left-0 right-0 z-50 justify-center px-4 transition-all duration-300 pointer-events-none"
      >
        <div
          className={`
            pointer-events-auto flex items-center justify-between gap-3 px-6 py-2.5 rounded-full border transition-all duration-300 shadow-xl
            ${isScrolled
              ? 'bg-white/90 dark:bg-zinc-900/90 border-rose-200/80 dark:border-zinc-700 backdrop-blur-xl shadow-rose-500/10 dark:shadow-black/50'
              : 'bg-white/70 dark:bg-zinc-900/70 border-rose-100 dark:border-zinc-800 backdrop-blur-md'
            }
          `}
        >
          {/* Navigation Links */}
          <div className="flex items-center gap-1 lg:gap-2">
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
                    group relative px-4 py-2 text-sm font-medium rounded-full flex items-center gap-2 transition-all duration-300
                    ${isActive
                      ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-md shadow-rose-500/20 scale-105'
                      : 'text-zinc-700 dark:text-zinc-300 hover:text-rose-600 dark:hover:text-amber-400 hover:bg-rose-50 dark:hover:bg-zinc-800/60'
                    }
                  `}
                >
                  <Icon className={`w-4 h-4 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-white animate-bounce' : ''}`} />
                  <span>{isThai ? item.label_th : item.label_en}</span>
                </button>
              );
            })}
          </div>

          <div className="h-6 w-px bg-rose-200 dark:bg-zinc-700 mx-1" />

          {/* Theme & Language Controls */}
          <div className="flex items-center gap-2">
            <ThemeSwitch />
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      {/* MOBILE & TABLET PORTRAIT / LANDSCAPE FLOATING BOTTOM NAVIGATION */}
      <div className="md:hidden fixed bottom-4 left-0 right-0 z-50 flex flex-col items-center gap-2 px-3 pointer-events-none">
        <div className="pointer-events-auto flex items-center justify-between w-full max-w-sm px-4 py-2.5 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border border-rose-200/80 dark:border-zinc-700 rounded-full shadow-2xl shadow-rose-500/20">
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
                    p-2.5 rounded-full flex items-center justify-center transition-all duration-300
                    ${isActive
                      ? 'bg-gradient-to-tr from-rose-500 to-amber-500 text-white shadow-md scale-110 -translate-y-1'
                      : 'text-zinc-600 dark:text-zinc-400 hover:text-rose-500'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                </button>
              );
            })}
          </div>
          <div className="h-6 w-px bg-rose-200 dark:bg-zinc-700 mx-2" />
          <ThemeSwitch />
        </div>
      </div>
    </>
  );
};

export default Navbar;