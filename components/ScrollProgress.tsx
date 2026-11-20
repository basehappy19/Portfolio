"use client";

import { useEffect, useRef } from "react";

/**
 * Reading-progress bar driven by scroll events instead of a CSS scroll timeline.
 * Safari on iPad recomputed the timeline when the toolbar collapsed or a tap
 * interrupted momentum scrolling, so the bar jumped back and forth.
 */
export default function ScrollProgress() {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        let frame = 0;
        let max = 1;

        const measure = () => {
            // use the largest viewport height so the toolbar showing/hiding doesn't move the bar
            const vh = Math.max(window.innerHeight, document.documentElement.clientHeight);
            max = Math.max(1, document.documentElement.scrollHeight - vh);
        };
        const paint = () => {
            frame = 0;
            const p = Math.min(1, Math.max(0, window.scrollY / max));
            el.style.transform = `scaleX(${p})`;
        };
        const onScroll = () => {
            if (!frame) frame = requestAnimationFrame(paint);
        };
        const onResize = () => {
            measure();
            onScroll();
        };

        measure();
        paint();
        const ro = new ResizeObserver(onResize);
        ro.observe(document.body);
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onResize, { passive: true });
        return () => {
            cancelAnimationFrame(frame);
            ro.disconnect();
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onResize);
        };
    }, []);

    return (
        <div
            ref={ref}
            aria-hidden="true"
            className="scroll-progress pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-rose-500 via-accent to-indigo-500 will-change-transform"
        />
    );
}
