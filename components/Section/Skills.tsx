import Image from "next/image";
import { getTranslations } from "next-intl/server";
import SectionLabel from "../SectionLabel";

type Skill = { name: string; src: string };
type Group = { Heading: string; Skills: Skill[] };

export default async function Skills() {
    const t = await getTranslations("Index.Skill");
    const groups = t.raw("Expertise") as Group[];

    return (
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 sm:px-8 md:py-28 lg:grid-cols-12">
            <div className="lg:col-span-4">
                <SectionLabel>{t("Eyebrow")}</SectionLabel>
                <h2 data-reveal className="sd-title mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
                    {t("Heading")}
                </h2>
            </div>
            <div className="grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:col-span-8">
                {groups.map((g, gi) => (
                    <div key={g.Heading} data-reveal style={{ ["--reveal-delay" as string]: `${gi * 90}ms` }}>
                        <h3 className="text-lg font-bold text-zinc-900">{g.Heading}</h3>
                        <ul className="mt-4 flex flex-wrap gap-2">
                            {g.Skills.map((s) => (
                                <li
                                    key={s.name}
                                    className="group inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-[15px] font-medium text-zinc-800 transition-all duration-300 hover:-translate-y-0.5 hover:border-rose-300 hover:shadow-[0_10px_24px_-14px_rgba(190,18,60,0.55)]"
                                >
                                    <Image
                                        src={s.src}
                                        alt=""
                                        width={20}
                                        height={20}
                                        className="h-5 w-5 rounded object-contain transition-transform duration-500 ease-[var(--ease-spring)] group-hover:rotate-[-8deg] group-hover:scale-110"
                                    />
                                    {s.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>
        </div>
    );
}
