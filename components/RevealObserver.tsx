"use client";

import { useEffect } from "react";

/**
 * Scroll-reveal for any element marked with `data-reveal`.
 * Elements already on screen at mount are shown immediately (no flash),
 * so the class that hides content is only added after JS is running.
 */
export default function RevealObserver() {
    // Looping decorations: start once the page is idle, pause when their section is off screen.
    useEffect(() => {
        const root = document.documentElement;
        const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
        let timer: ReturnType<typeof setTimeout> | undefined;
        const start = () => root.classList.add("motion-ready");
        const onLoad = () => {
            if (w.requestIdleCallback) w.requestIdleCallback(start, { timeout: 2500 });
            else timer = setTimeout(start, 1200);
        };
        if (document.readyState === "complete") onLoad();
        else window.addEventListener("load", onLoad, { once: true });

        const sections = document.querySelectorAll("main > section");
        const io = new IntersectionObserver((entries) => {
            for (const e of entries) {
                if (e.isIntersecting) e.target.removeAttribute("data-offscreen");
                else e.target.setAttribute("data-offscreen", "");
            }
        });
        sections.forEach((el) => io.observe(el));

        return () => {
            window.removeEventListener("load", onLoad);
            if (timer) clearTimeout(timer);
            io.disconnect();
        };
    }, []);

    useEffect(() => {
        const root = document.documentElement;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

        const seen = new WeakSet<Element>();
        const io = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        io.unobserve(entry.target);
                    }
                }
            },
            { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
        );

        const track = (el: Element) => {
            if (seen.has(el)) return;
            seen.add(el);
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0 && !root.classList.contains("reveal-ready")) {
                el.classList.add("is-visible");
                return;
            }
            io.observe(el);
        };

        document.querySelectorAll("[data-reveal]").forEach(track);
        root.classList.add("reveal-ready");

        const mo = new MutationObserver((mutations) => {
            for (const m of mutations) {
                m.addedNodes.forEach((node) => {
                    if (!(node instanceof Element)) return;
                    if (node.matches("[data-reveal]")) track(node);
                    node.querySelectorAll?.("[data-reveal]").forEach(track);
                });
            }
        });
        mo.observe(document.body, { childList: true, subtree: true });

        return () => {
            io.disconnect();
            mo.disconnect();
        };
    }, []);

    return null;
}
