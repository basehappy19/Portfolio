"use client";

import { Check, ChevronDown } from "lucide-react";
import { useEffect, useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";

export type SelectOption = {
    value: string;
    label: string;
    /** small colour dot in front of the label */
    color?: string;
    /** optional extra text on the right, e.g. a count */
    hint?: ReactNode;
};

type Props = {
    value: string;
    options: SelectOption[];
    onChange: (value: string) => void;
    /** shown on the left of the button, e.g. "หมวดหมู่" */
    label?: string;
    icon?: ReactNode;
    ariaLabel?: string;
};

/** Custom dropdown (listbox) used instead of the browser's native <select>. */
export default function Select({ value, options, onChange, label, icon, ariaLabel }: Props) {
    const [open, setOpen] = useState(false);
    const [active, setActive] = useState(0);
    const rootRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const listRef = useRef<HTMLUListElement>(null);
    const typed = useRef({ text: "", at: 0 });
    const id = useId();

    const selectedIndex = Math.max(0, options.findIndex((o) => o.value === value));
    const selected = options[selectedIndex];

    const openList = (index = selectedIndex) => {
        setActive(index);
        setOpen(true);
    };
    const close = (focusButton = true) => {
        setOpen(false);
        if (focusButton) buttonRef.current?.focus();
    };
    const choose = (i: number) => {
        const o = options[i];
        if (o && o.value !== value) onChange(o.value);
        close();
    };

    // close when clicking outside
    useEffect(() => {
        if (!open) return;
        const onDown = (e: PointerEvent) => {
            if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("pointerdown", onDown);
        listRef.current?.focus();
        return () => document.removeEventListener("pointerdown", onDown);
    }, [open]);

    // keep the highlighted option in view
    useEffect(() => {
        if (!open) return;
        listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
    }, [active, open]);

    const typeAhead = (key: string, now: number) => {
        typed.current.text = now - typed.current.at > 700 ? key : typed.current.text + key;
        typed.current.at = now;
        const q = typed.current.text.toLowerCase();
        const i = options.findIndex((o) => o.label.toLowerCase().startsWith(q));
        if (i >= 0) setActive(i);
    };

    const onButtonKey = (e: KeyboardEvent) => {
        if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
            e.preventDefault();
            openList(e.key === "ArrowUp" ? Math.max(0, selectedIndex - 1) : selectedIndex);
        }
    };

    const onListKey = (e: KeyboardEvent) => {
        const last = options.length - 1;
        switch (e.key) {
            case "ArrowDown": e.preventDefault(); setActive((a) => Math.min(last, a + 1)); break;
            case "ArrowUp": e.preventDefault(); setActive((a) => Math.max(0, a - 1)); break;
            case "Home": e.preventDefault(); setActive(0); break;
            case "End": e.preventDefault(); setActive(last); break;
            case "Enter": case " ": e.preventDefault(); choose(active); break;
            case "Escape": e.preventDefault(); close(); break;
            case "Tab": setOpen(false); break;
            default:
                if (e.key.length === 1) typeAhead(e.key, e.timeStamp);
        }
    };

    return (
        <div ref={rootRef} className="relative">
            <button
                ref={buttonRef}
                type="button"
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-controls={`${id}-list`}
                aria-label={ariaLabel}
                onClick={() => (open ? close(false) : openList())}
                onKeyDown={onButtonKey}
                className={`group flex w-full items-center gap-2.5 rounded-xl border bg-white px-3.5 py-2.5 text-left text-xs shadow-2xs transition-all sm:text-sm dark:bg-zinc-800/70 ${
                    open
                        ? "border-rose-500 ring-4 ring-rose-500/15"
                        : "border-gray-200 hover:border-gray-300 dark:border-zinc-700 dark:hover:border-zinc-600"
                }`}
            >
                {icon && <span className="flex-none text-gray-400 group-hover:text-rose-500">{icon}</span>}
                {label && <span className="flex-none text-gray-400 dark:text-zinc-500">{label}</span>}
                <span className="flex min-w-0 flex-1 items-center gap-2 font-semibold text-gray-900 dark:text-white">
                    {selected?.color && <span aria-hidden className="h-2.5 w-2.5 flex-none rounded-full" style={{ background: selected.color }} />}
                    <span className="truncate">{selected?.label}</span>
                </span>
                <ChevronDown
                    aria-hidden
                    className={`h-4 w-4 flex-none text-gray-400 transition-transform duration-300 ${open ? "rotate-180 text-rose-500" : ""}`}
                />
            </button>

            {open && (
                <ul
                    ref={listRef}
                    id={`${id}-list`}
                    role="listbox"
                    tabIndex={-1}
                    aria-activedescendant={`${id}-opt-${active}`}
                    onKeyDown={onListKey}
                    className="select-pop absolute left-0 right-0 top-[calc(100%+6px)] z-50 max-h-72 overflow-y-auto overscroll-contain rounded-2xl border border-gray-200 bg-white p-1.5 shadow-[0_18px_50px_-12px_rgba(0,0,0,0.3)] outline-none focus:outline-none focus-visible:outline-none dark:border-zinc-700 dark:bg-zinc-900"
                >
                    {options.map((o, i) => {
                        const isSel = o.value === value;
                        return (
                            <li
                                key={o.value || "__all"}
                                id={`${id}-opt-${i}`}
                                data-index={i}
                                role="option"
                                aria-selected={isSel}
                                onPointerEnter={() => setActive(i)}
                                onClick={() => choose(i)}
                                className={`flex cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                                    i === active ? "bg-rose-50 dark:bg-rose-500/10" : ""
                                } ${isSel ? "font-semibold text-rose-700 dark:text-rose-300" : "text-gray-700 dark:text-zinc-200"}`}
                            >
                                {o.color !== undefined && (
                                    <span aria-hidden className="h-2.5 w-2.5 flex-none rounded-full" style={{ background: o.color || "transparent", boxShadow: o.color ? undefined : "inset 0 0 0 1.5px #d4d4d8" }} />
                                )}
                                <span className="min-w-0 flex-1 truncate">{o.label}</span>
                                {o.hint != null && <span className="flex-none text-xs text-gray-400">{o.hint}</span>}
                                <Check aria-hidden className={`h-4 w-4 flex-none ${isSel ? "text-rose-600" : "invisible"}`} />
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}
