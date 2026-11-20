"use client";

import { CalendarDays, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";

const MONTHS = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
const DAYS = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];

const pad = (n: number) => String(n).padStart(2, "0");
const toIso = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`;
const parse = (iso?: string | null) => {
    const m = iso?.match(/^(\d{4})-(\d{2})-(\d{2})/);
    return m ? { y: +m[1], m: +m[2] - 1, d: +m[3] } : null;
};
const todayIso = () => {
    const t = new Date();
    return toIso(t.getFullYear(), t.getMonth(), t.getDate());
};

type Props = { value: string | null | undefined; onChange: (iso: string) => void; className?: string };

/** Date field with a Thai (Buddhist year) calendar popover instead of the browser's date input. */
export default function DatePicker({ value, onChange, className = "" }: Props) {
    const sel = parse(value);
    const [open, setOpen] = useState(false);
    const [view, setView] = useState(() => {
        const base = sel ?? parse(todayIso())!;
        return { y: base.y, m: base.m };
    });
    const [yearMode, setYearMode] = useState(false);
    const rootRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;
        const onDown = (e: PointerEvent) => {
            if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener("pointerdown", onDown);
        return () => document.removeEventListener("pointerdown", onDown);
    }, [open]);

    const openPicker = () => {
        const base = sel ?? parse(todayIso())!;
        setView({ y: base.y, m: base.m });
        setYearMode(false);
        setOpen((o) => !o);
    };
    const shift = (n: number) =>
        setView((v) => {
            const t = v.m + n;
            return { y: v.y + Math.floor(t / 12), m: ((t % 12) + 12) % 12 };
        });
    const choose = (d: number) => {
        onChange(toIso(view.y, view.m, d));
        setOpen(false);
    };

    const first = new Date(view.y, view.m, 1).getDay();
    const days = new Date(view.y, view.m + 1, 0).getDate();
    const cells: (number | null)[] = [...Array(first).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
    const today = todayIso();
    const thisYear = new Date().getFullYear();
    const years = Array.from({ length: 16 }, (_, i) => thisYear + 1 - i);

    const label = sel ? `${sel.d} ${MONTHS[sel.m]} ${sel.y + 543}` : "";

    const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape" && open) {
            e.preventDefault();
            setOpen(false);
        }
    };

    return (
        <div ref={rootRef} className="relative" onKeyDown={onKey}>
            <button
                type="button"
                onClick={openPicker}
                aria-haspopup="dialog"
                aria-expanded={open}
                className={`${className} flex w-full cursor-pointer items-center gap-2.5 text-left ${open ? "border-rose-500 ring-4 ring-rose-500/15" : ""}`}
            >
                <CalendarDays aria-hidden className="h-4 w-4 flex-none text-zinc-400" />
                <span className={`flex-1 truncate ${label ? "text-zinc-900" : "text-zinc-400"}`}>{label || "เลือกวันที่"}</span>
                {label && (
                    <span
                        role="button"
                        tabIndex={0}
                        aria-label="ล้างวันที่"
                        onClick={(e) => {
                            e.stopPropagation();
                            onChange("");
                        }}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                e.stopPropagation();
                                onChange("");
                            }
                        }}
                        className="rounded-md p-0.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
                    >
                        <X className="h-4 w-4" />
                    </span>
                )}
            </button>

            {open && (
                <div role="dialog" aria-label="เลือกวันที่" className="select-pop absolute left-0 top-[calc(100%+6px)] z-50 w-[300px] max-w-[calc(100vw-2rem)] rounded-2xl border border-zinc-200 bg-white p-3 shadow-[0_18px_50px_-12px_rgba(0,0,0,0.3)]">
                    <div className="mb-2 flex items-center justify-between">
                        <button type="button" onClick={() => shift(-1)} className="cursor-pointer rounded-lg p-2 text-zinc-500 hover:bg-zinc-100" aria-label="เดือนก่อน">
                            <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button type="button" onClick={() => setYearMode((y) => !y)} className="cursor-pointer rounded-lg px-3 py-1.5 text-sm font-semibold hover:bg-zinc-100">
                            {MONTHS[view.m]} {view.y + 543}
                        </button>
                        <button type="button" onClick={() => shift(1)} className="cursor-pointer rounded-lg p-2 text-zinc-500 hover:bg-zinc-100" aria-label="เดือนถัดไป">
                            <ChevronRight className="h-4 w-4" />
                        </button>
                    </div>

                    {yearMode ? (
                        <div className="grid grid-cols-4 gap-1.5">
                            {years.map((y) => (
                                <button
                                    key={y}
                                    type="button"
                                    onClick={() => {
                                        setView((v) => ({ ...v, y }));
                                        setYearMode(false);
                                    }}
                                    className={`cursor-pointer rounded-lg py-2 text-sm ${y === view.y ? "bg-zinc-900 font-semibold text-white" : "hover:bg-zinc-100"}`}
                                >
                                    {y + 543}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-7 text-center text-xs font-semibold text-zinc-400">
                                {DAYS.map((d) => (
                                    <span key={d} className="py-1.5">{d}</span>
                                ))}
                            </div>
                            <div className="grid grid-cols-7 gap-0.5">
                                {cells.map((d, i) => {
                                    if (!d) return <span key={`e${i}`} />;
                                    const iso = toIso(view.y, view.m, d);
                                    const isSel = iso === value?.slice(0, 10);
                                    return (
                                        <button
                                            key={iso}
                                            type="button"
                                            onClick={() => choose(d)}
                                            className={`h-9 cursor-pointer rounded-lg text-sm tabular-nums transition ${
                                                isSel ? "bg-rose-600 font-semibold text-white" : iso === today ? "font-semibold text-rose-600 ring-1 ring-inset ring-rose-200 hover:bg-rose-50" : "text-zinc-700 hover:bg-zinc-100"
                                            }`}
                                        >
                                            {d}
                                        </button>
                                    );
                                })}
                            </div>
                        </>
                    )}

                    <div className="mt-2 flex justify-between border-t border-zinc-100 pt-2">
                        <button type="button" onClick={() => { onChange(""); setOpen(false); }} className="cursor-pointer rounded-lg px-3 py-1.5 text-sm text-zinc-500 hover:bg-zinc-100">
                            ล้าง
                        </button>
                        <button type="button" onClick={() => { onChange(today); setOpen(false); }} className="cursor-pointer rounded-lg px-3 py-1.5 text-sm font-semibold text-rose-600 hover:bg-rose-50">
                            วันนี้
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
