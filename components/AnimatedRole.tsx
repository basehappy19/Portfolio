"use client";

import { useEffect, useState } from "react";

export default function AnimatedRole({ roles, prefix = "" }: { roles: string[]; prefix?: string }) {
    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (roles.length <= 1) return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const id = setInterval(() => setIndex((i) => (i + 1) % roles.length), 2600);
        return () => clearInterval(id);
    }, [roles.length]);

    const longest = roles.reduce((a, b) => (b.length > a.length ? b : a), "");

    return (
        <p className="flex flex-wrap items-baseline gap-x-3 text-2xl font-semibold text-zinc-700 sm:text-3xl">
            {prefix && <span>{prefix}</span>}
            <span className="relative inline-grid overflow-hidden align-bottom text-accent" aria-live="polite">
                {/* invisible sizer keeps the width stable (no layout shift) */}
                <span aria-hidden="true" className="invisible col-start-1 row-start-1 whitespace-nowrap">
                    {longest}
                </span>
                {roles.map((role, i) => (
                    <span
                        key={role}
                        aria-hidden={i !== index}
                        className="col-start-1 row-start-1 whitespace-nowrap transition-all duration-700 ease-[var(--ease-out-expo)]"
                        style={{
                            transform: i === index ? "translateY(0)" : i < index ? "translateY(-110%)" : "translateY(110%)",
                            opacity: i === index ? 1 : 0,
                        }}
                    >
                        {role}
                    </span>
                ))}
            </span>
        </p>
    );
}
