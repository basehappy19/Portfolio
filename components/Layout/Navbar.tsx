'use client'
import React, { useState, useEffect } from 'react';
import { Home, User, Briefcase, Mail, Star, LucideIcon } from 'lucide-react';
import { useLocale } from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher';

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
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
};

const Navbar = () => {
    const [activeSection, setActiveSection] = useState('home');
    const [isScrolled, setIsScrolled] = useState(false);
    const locale = useLocale();
    const isThai = locale === 'th';
    useEffect(() => {
        const ACTIVATION_OFFSET = 450;

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
        <nav
            className={`hidden md:block fixed top-12 left-0 right-0 z-50 transition-all duration-300`}
        >
            <div className={`max-w-3xl mx-auto px-6 rounded-4xl transition-all duration-300 ${isScrolled
                ? 'bg-none backdrop-blur-lg shadow-lg'
                : 'bg-white/30 backdrop-blur-md'
                }`}>
                <div className="flex items-center justify-center h-16">

                    {/* Nav Items */}
                    <div className="flex items-center gap-2">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeSection === item.id;

                            return (
                                <button
                                    key={item.id}
                                    onClick={() => scrollToSection(item.id)}
                                    className={`relative px-4 py-2 text-nowrap rounded-full flex items-center gap-2 transition-all duration-300 ${isActive
                                        ? 'bg-linear-to-r from-yellow-500/20 to-orange-500/20'
                                        : 'text-gray-700 hover:bg-gray-200/50'
                                        }`}
                                >
                                    <Icon className={`w-4 h-4 ${isActive ? "text-red-600" : "text-white"}`} />
                                    <span className="font-medium text-white">{isThai ? item.label_th : item.label_en}</span>

                                    {/* Active Indicator */}
                                    {isActive && (
                                        <div className="absolute inset-0 rounded-full border-2 border-red-500/30 animate-pulse" />
                                    )}
                                </button>
                            );
                        })}
                        <LanguageSwitcher />
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;