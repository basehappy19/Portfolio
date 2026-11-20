import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { ArrowDown, FileText } from "lucide-react";
import AnimatedRole from "../AnimatedRole";
import { RESUME_URL } from "@/lib/site";

export default async function Home() {
    const t = await getTranslations("Index");
    const roles = t.raw("Home.Roles") as string[];
    const rolePrefix = t.has("Home.RolePrefix") ? t("Home.RolePrefix") : "";
    const [firstName, ...rest] = t("Home.Name").split(" ");
    const lastName = rest.join(" ");
    const firstStat = (t.raw("About.data.statuses") as { number: string; label: string }[])[0];

    return (
        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-5 pb-16 pt-24 sm:px-8 md:pt-32 lg:grid-cols-12 lg:gap-10 lg:pb-24">
            <div className="sd-hero-out lg:col-span-7">
                <p className="anim-fade-rise inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/70 px-4 py-1.5 text-sm font-semibold text-accent">
                    <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                    </span>
                    {t("Home.Welcome")}
                </p>

                <p className="anim-fade-rise delay-1 mt-6 text-lg font-medium text-zinc-600 sm:text-xl">{t("Home.Greeting")}</p>
                <h1 className="anim-rise delay-1 mt-1 text-[clamp(3.25rem,10vw,7rem)] font-bold leading-[1.02] tracking-tight text-zinc-900">
                    {firstName}
                    {/* surname kept for screen readers and search engines, hidden visually */}
                    {lastName && <span className="sr-only"> {lastName}</span>}
                </h1>

                <div className="anim-fade-rise delay-2 mt-5">
                    <AnimatedRole roles={roles} prefix={rolePrefix} />
                </div>

                <p className="anim-fade-rise delay-3 mt-6 max-w-xl text-lg leading-relaxed text-zinc-700 sm:text-xl">
                    {t("Home.Description")}
                </p>
                <p className="anim-fade-rise delay-3 mt-2 max-w-xl text-base leading-relaxed text-zinc-600">
                    {t("Home.Description_2")}
                </p>

                <div className="anim-fade-rise delay-4 mt-9 flex flex-col gap-3 sm:flex-row">
                    <a
                        href="#Achievements"
                        className="group inline-flex min-h-13 items-center justify-center gap-2 rounded-2xl bg-zinc-900 px-7 font-semibold text-white shadow-[0_14px_30px_-12px_rgba(24,24,27,0.7)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-zinc-800"
                    >
                        {t("Home.Buttons.ViewAchievements")}
                        <ArrowDown aria-hidden="true" className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
                    </a>
                    <a
                        href={RESUME_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-13 items-center justify-center gap-2 rounded-2xl border border-zinc-300 bg-white/70 px-7 font-semibold text-zinc-900 transition-all duration-300 hover:-translate-y-0.5 hover:border-zinc-400"
                    >
                        <FileText aria-hidden="true" className="h-4 w-4 text-accent" />
                        {t("Home.Buttons.Resume")}
                    </a>
                </div>
            </div>

            <div className="sd-hero-photo relative mx-auto w-full max-w-[420px] lg:col-span-5 lg:max-w-none">
                <div aria-hidden="true" className="anim-spin-slow absolute -inset-6 rounded-full border-2 border-dashed border-rose-300/60" />
                <div className="anim-rise-scale relative aspect-[4/5] overflow-hidden rounded-[36px] bg-gradient-to-b from-zinc-100 to-rose-50">
                    <Image
                        src="/profiles/me.png"
                        alt={t("Home.Name")}
                        fill
                        preload
                        fetchPriority="high"
                        sizes="(max-width: 480px) 92vw, 440px"
                        quality={70}
                        className="object-cover object-top"
                    />
                </div>
                <div className="glass anim-float absolute -left-4 bottom-10 rounded-2xl px-4 py-3 sm:-left-8">
                    <p className="text-xl font-bold text-zinc-900">{firstStat.number}</p>
                    <p className="text-xs font-medium text-zinc-600">{firstStat.label}</p>
                </div>
            </div>

            <a
                href="#About"
                aria-label={t("About.Heading")}
                className="absolute bottom-4 left-1/2 hidden -translate-x-1/2 lg:flex"
            >
                <span className="flex h-11 w-7 items-start justify-center rounded-full border-2 border-zinc-300 p-1.5">
                    <span className="h-2 w-1 animate-bounce rounded-full bg-zinc-500" />
                </span>
            </a>
        </div>
    );
}
