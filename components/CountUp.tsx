"use client";

import { useEffect, useRef, useState } from "react";

/** Renders the final value on the server; counts up when scrolled into view. */
export default function CountUp({ value, className }: { value: string; className?: string }) {
    const match = value.match(/^([\d,.]+)(.*)$/);
    const target = match ? Number(match[1].replace(/,/g, "")) : NaN;
    const suffix = match ? match[2] : "";
    const ref = useRef<HTMLSpanElement>(null);
    const [display, setDisplay] = useState<string>(value);

    useEffect(() => {
        const el = ref.current;
        if (!el || !Number.isFinite(target)) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight) return; // already visible: keep the final value

        let raf = 0;
        const fmt = (n: number) => Math.round(n).toLocaleString("en-US") + suffix;
        setDisplay(fmt(0));
        const io = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return;
                io.disconnect();
                const start = performance.now();
                const duration = 1400;
                const tick = (now: number) => {
                    const p = Math.min(1, (now - start) / duration);
                    const eased = 1 - Math.pow(1 - p, 4);
                    setDisplay(fmt(target * eased));
                    if (p < 1) raf = requestAnimationFrame(tick);
                };
                raf = requestAnimationFrame(tick);
            },
            { threshold: 0.6 }
        );
        io.observe(el);
        return () => {
            io.disconnect();
            cancelAnimationFrame(raf);
        };
    }, [target, suffix]);

    return (
        <span ref={ref} className={className}>
            {display}
        </span>
    );
}
