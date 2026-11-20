"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Home, User, Sparkles, Trophy, Mail, type LucideIcon } from "lucide-react";
import LanguageSwitcher from "../LanguageSwitcher";
import { NAV_SECTIONS, type NavSection } from "@/lib/site";

const ICONS: Record<NavSection, LucideIcon> = {
    Home,
    About: User,
    Skills: Sparkles,
    Achievements: Trophy,
    Contact: Mail,
};

type Props = {
    labels: Record<NavSection, string>;
    brand: string;
    menuLabel: string;
    languageLabel: string;
};

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function Navbar({ labels, brand, menuLabel, languageLabel }: Props) {
    const brandWords = brand.split(" ");
    const [active, setActive] = useState<NavSection>("Home");
    const [scrolled, setScrolled] = useState(false);
    const desktopRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
    const [pill, setPill] = useState<{ left: number; width: number } | null>(null);

    // Which section is in the middle of the screen
    useEffect(() => {
        const sections = NAV_SECTIONS.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
        const io = new IntersectionObserver(
            (entries) => {
                const visible = entries.filter((e) => e.isIntersecting);
                if (visible.length) setActive(visible[0].target.id as NavSection);
            },
            { rootMargin: "-45% 0px -50% 0px" }
        );
        sections.forEach((s) => io.observe(s));

        const onScroll = () => setScrolled(window.scrollY > 24);
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => {
            io.disconnect();
            window.removeEventListener("scroll", onScroll);
        };
    }, []);

    // Sliding "liquid" indicator on desktop
    useIsoLayoutEffect(() => {
        const update = () => {
            const el = desktopRefs.current[active];
            if (el) setPill({ left: el.offsetLeft, width: el.offsetWidth });
        };
        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, [active]);

    const activeIndex = NAV_SECTIONS.indexOf(active);

    return (
        <>
            {/* Desktop / iPad landscape: floating glass pill */}
            <header className="pointer-events-none fixed inset-x-0 top-0 z-50 hidden justify-center px-4 pt-4 md:flex">
                <nav
                    aria-label={menuLabel}
                    className={`pointer-events-auto flex items-center gap-2 rounded-full py-1.5 pl-5 pr-1.5 transition-all duration-500 ${
                        scrolled ? "glass-strong" : "glass"
                    }`}
                >
                    <a href="#Home" className="mr-2 text-[17px] font-bold tracking-tight text-zinc-900">
                        {brandWords[0]} <span className="text-accent">{brandWords.slice(1).join(" ")}</span>
                    </a>
                    <div className="relative flex items-center">
                        {pill && (
                            <span
                                aria-hidden="true"
                                className="absolute top-0 h-full rounded-full bg-zinc-900 shadow-[0_6px_20px_-6px_rgba(24,24,27,0.6)] transition-all duration-500 ease-[var(--ease-spring)]"
                                style={{ left: pill.left, width: pill.width }}
                            />
                        )}
                        {NAV_SECTIONS.map((id) => (
                            <a
                                key={id}
                                ref={(el) => {
                                    desktopRefs.current[id] = el;
                                }}
                                href={`#${id}`}
                                aria-current={active === id ? "true" : undefined}
                                className={`relative z-10 inline-flex min-h-10 items-center rounded-full px-4 text-[15px] font-medium transition-colors duration-300 ${
                                    active === id ? "text-white" : "text-zinc-700 hover:text-zinc-950"
                                }`}
                            >
                                {labels[id]}
                            </a>
                        ))}
                    </div>
                    <span aria-hidden="true" className="mx-1 h-6 w-px bg-zinc-900/10" />
                    <LanguageSwitcher label={languageLabel} />
                </nav>
            </header>

            {/* Mobile: sticky glass top bar */}
            <header
                className={`fixed inset-x-0 top-0 z-50 flex items-center justify-between px-4 pb-2 pt-[max(0.5rem,env(safe-area-inset-top))] transition-all duration-500 md:hidden ${
                    scrolled ? "glass-strong rounded-b-3xl border-t-0" : "bg-transparent"
                }`}
            >
                <a href="#Home" className="inline-flex min-h-11 items-center gap-1.5 text-[17px] font-bold tracking-tight text-zinc-900">
                    {brandWords[0]} <span className="text-accent">{brandWords.slice(1).join(" ")}</span>
                </a>
                <LanguageSwitcher label={languageLabel} />
            </header>

            {/* Mobile: fixed glass tab bar */}
            <nav
                aria-label={menuLabel}
                className="fixed inset-x-0 bottom-0 z-50 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden"
            >
                <div className="glass-strong relative mx-auto grid max-w-md grid-cols-5 rounded-[26px] p-1.5">
                    <span
                        aria-hidden="true"
                        className="absolute inset-y-1.5 left-1.5 w-[calc((100%-12px)/5)] rounded-[20px] bg-zinc-900 transition-transform duration-500 ease-[var(--ease-spring)]"
                        style={{ transform: `translateX(${activeIndex * 100}%)` }}
                    />
                    {NAV_SECTIONS.map((id) => {
                        const Icon = ICONS[id];
                        const isActive = active === id;
                        return (
                            <a
                                key={id}
                                href={`#${id}`}
                                aria-current={isActive ? "true" : undefined}
                                className={`relative z-10 flex min-h-14 flex-col items-center justify-center gap-0.5 rounded-[20px] text-[11px] font-medium transition-colors duration-300 ${
                                    isActive ? "text-white" : "text-zinc-700"
                                }`}
                            >
                                <Icon
                                    aria-hidden="true"
                                    className={`h-5 w-5 transition-transform duration-500 ease-[var(--ease-spring)] ${isActive ? "-translate-y-0.5 scale-110" : ""}`}
                                />
                                <span className="leading-none">{labels[id]}</span>
                            </a>
                        );
                    })}
                </div>
            </nav>
        </>
    );
}
