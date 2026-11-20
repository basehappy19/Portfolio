"use client";

import { Check } from "lucide-react";
import { useId, useRef, useState, type KeyboardEvent } from "react";

type Props = {
    value: string;
    onChange: (value: string) => void;
    /** previously used values shown as suggestions */
    options: string[];
    onBlur?: () => void;
    placeholder?: string;
    className?: string;
};

/** Text input with a custom suggestion list (replaces the browser's <datalist>). */
export default function Combobox({ value, onChange, options, onBlur, placeholder, className = "" }: Props) {
    const [open, setOpen] = useState(false);
    const [active, setActive] = useState(-1);
    const listRef = useRef<HTMLUListElement>(null);
    const id = useId();

    const q = value.trim().toLowerCase();
    const matches = options
        .filter((o) => o.toLowerCase() !== q && (!q || o.toLowerCase().includes(q)))
        .slice(0, 8);
    const show = open && matches.length > 0;

    const pick = (v: string) => {
        onChange(v);
        setOpen(false);
        setActive(-1);
    };

    const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
        if (!matches.length) return;
        if (e.key === "ArrowDown") {
            e.preventDefault();
            setOpen(true);
            setActive((a) => (a + 1) % matches.length);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setOpen(true);
            setActive((a) => (a <= 0 ? matches.length - 1 : a - 1));
        } else if (e.key === "Enter" && show && active >= 0) {
            e.preventDefault();
            pick(matches[active]);
        } else if (e.key === "Escape" && show) {
            e.preventDefault();
            setOpen(false);
        }
    };

    // highlight the part that matches what was typed
    const mark = (text: string) => {
        if (!q) return text;
        const i = text.toLowerCase().indexOf(q);
        if (i < 0) return text;
        return (
            <>
                {text.slice(0, i)}
                <mark className="rounded bg-rose-100 px-0.5 text-rose-800">{text.slice(i, i + q.length)}</mark>
                {text.slice(i + q.length)}
            </>
        );
    };

    return (
        <div className="relative">
            <input
                role="combobox"
                aria-expanded={show}
                aria-controls={`${id}-list`}
                aria-autocomplete="list"
                aria-activedescendant={show && active >= 0 ? `${id}-${active}` : undefined}
                autoComplete="off"
                className={className}
                value={value}
                placeholder={placeholder}
                onChange={(e) => {
                    onChange(e.target.value);
                    setOpen(true);
                    setActive(-1);
                }}
                onFocus={() => setOpen(true)}
                onBlur={(e) => {
                    // keep the list open while a suggestion is being clicked
                    if (listRef.current?.contains(e.relatedTarget as Node)) return;
                    setOpen(false);
                    onBlur?.();
                }}
                onKeyDown={onKey}
            />
            {show && (
                <ul
                    ref={listRef}
                    id={`${id}-list`}
                    role="listbox"
                    className="select-pop absolute left-0 right-0 top-[calc(100%+6px)] z-50 max-h-72 overflow-y-auto overscroll-contain rounded-2xl border border-zinc-200 bg-white p-1.5 shadow-[0_18px_50px_-12px_rgba(0,0,0,0.3)]"
                >
                    <li className="px-3 pb-1 pt-1.5 text-xs font-semibold text-zinc-400">เคยใช้</li>
                    {matches.map((o, i) => (
                        <li
                            key={o}
                            id={`${id}-${i}`}
                            role="option"
                            aria-selected={i === active}
                            tabIndex={-1}
                            onMouseDown={(e) => e.preventDefault()}
                            onPointerEnter={() => setActive(i)}
                            onClick={() => pick(o)}
                            className={`flex cursor-pointer items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-zinc-700 ${i === active ? "bg-rose-50" : ""}`}
                        >
                            <span className="min-w-0 flex-1">{mark(o)}</span>
                            {i === active && <Check aria-hidden className="h-4 w-4 flex-none text-rose-500" />}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
