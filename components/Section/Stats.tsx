import { getTranslations } from "next-intl/server";
import CountUp from "../CountUp";

export default async function Stats() {
    const t = await getTranslations("Index");
    const stats = t.raw("About.data.statuses") as { number: string; label: string }[];

    return (
        <div className="mx-auto grid max-w-6xl grid-cols-2 px-5 sm:px-8 lg:grid-cols-4">
            {stats.map((s, i) => (
                <div
                    key={s.label}
                    data-reveal
                    style={{ ["--reveal-delay" as string]: `${i * 90}ms` }}
                    className="border-zinc-200 py-8 pr-4 [&:nth-child(-n+2)]:border-b lg:[&:nth-child(-n+2)]:border-b-0 lg:border-l lg:pl-6 lg:first:border-l-0 lg:first:pl-0"
                >
                    <CountUp value={s.number} className="block text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl" />
                    <p className="mt-1 text-sm text-zinc-600 sm:text-base">{s.label}</p>
                </div>
            ))}
        </div>
    );
}
