import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import SectionLabel from "../SectionLabel";

export default async function About() {
    const t = await getTranslations("Index.About");
    const intro = t("Introduce_1").split("\n").filter(Boolean);

    return (
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 sm:px-8 md:py-28 lg:grid-cols-12">
            <div className="lg:col-span-4">
                <SectionLabel>{t("Eyebrow")}</SectionLabel>
                <h2 data-reveal className="sd-title mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
                    {t("Heading")}
                </h2>
            </div>
            <div className="lg:col-span-8">
                <div className="space-y-5">
                    {intro.map((p, i) => (
                        i === 0 ? (
                            // Apple-style: words light up one by one as you scroll
                            <p key={i} className="sd-words text-2xl font-semibold leading-[1.6] text-zinc-900 sm:text-[2rem] sm:leading-[1.55]">
                                {p.split(/(\s+)/).map((w, wi) => (w.trim() ? <span key={wi}>{w}</span> : w))}
                            </p>
                        ) : (
                            <p
                                key={i}
                                data-reveal
                                style={{ ["--reveal-delay" as string]: `${i * 80}ms` }}
                                className="text-lg leading-relaxed text-zinc-700"
                            >
                                {p}
                            </p>
                        )
                    ))}
                    <p data-reveal className="text-lg leading-relaxed text-zinc-600">
                        {t("Introduce_2")}
                    </p>
                </div>
                <div data-reveal className="mt-9 flex flex-wrap gap-3">
                    <a
                        href="#Contact"
                        className="group inline-flex min-h-12 items-center gap-2 rounded-2xl bg-zinc-900 px-6 font-semibold text-white transition-all duration-300 hover:-translate-y-0.5"
                    >
                        {t("Buttons.Contact")}
                        <ArrowRight aria-hidden="true" className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </a>
                    <a
                        href="#Achievements"
                        className="inline-flex min-h-12 items-center rounded-2xl border border-zinc-300 px-6 font-semibold text-zinc-900 transition-all duration-300 hover:-translate-y-0.5 hover:border-zinc-400"
                    >
                        {t("Buttons.Achievements")}
                    </a>
                </div>
            </div>
        </div>
    );
}
