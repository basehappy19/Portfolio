import { Mail, Phone, MapPin, Facebook, Github, Instagram, ArrowUpRight, type LucideIcon } from "lucide-react";
import { getTranslations } from "next-intl/server";
import FormContact from "../FormContact";
import SectionLabel from "../SectionLabel";

const ICONS: Record<string, LucideIcon> = { Mail, Phone, MapPin, Facebook, Github, Instagram };

type Info = { icon: string; label: string; value: string; href: string | null };
type Social = { name: string; icon: string; href: string };

export default async function Contact() {
    const t = await getTranslations("Index.Contact");
    const infos = t.raw("ContactInfos") as Info[];
    const socials = t.raw("SocialLinks") as Social[];

    return (
        <div className="relative mx-auto grid max-w-6xl gap-14 px-5 py-20 sm:px-8 md:py-28 lg:grid-cols-12">
            <div className="lg:col-span-6">
                <SectionLabel dark>{t("Eyebrow")}</SectionLabel>
                <h2 data-reveal className="sd-title mt-3 text-4xl font-bold tracking-tight text-white sm:text-6xl">
                    {t("Heading")}
                </h2>
                <p data-reveal className="mt-5 max-w-md text-lg leading-relaxed text-zinc-300">
                    {t("Description")}
                </p>

                <ul data-reveal className="mt-10 space-y-3">
                    {infos.map((info) => {
                        const Icon = ICONS[info.icon] ?? Mail;
                        const body = (
                            <>
                                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-rose-300">
                                    <Icon aria-hidden="true" className="h-5 w-5" />
                                </span>
                                <span className="min-w-0">
                                    <span className="block text-xs text-zinc-400">{info.label}</span>
                                    <span className="block break-all text-lg font-semibold text-white">{info.value}</span>
                                </span>
                            </>
                        );
                        return (
                            <li key={info.label}>
                                {info.href ? (
                                    <a href={info.href} className="group flex items-center gap-4 rounded-2xl p-1 transition-transform duration-300 hover:translate-x-1">
                                        {body}
                                    </a>
                                ) : (
                                    <div className="flex items-center gap-4 p-1">{body}</div>
                                )}
                            </li>
                        );
                    })}
                </ul>

                <h3 className="sr-only">{t("SocialLink")}</h3>
                <ul data-reveal className="mt-8 flex flex-wrap gap-2">
                    {socials.map((s) => {
                        const Icon = ICONS[s.icon] ?? ArrowUpRight;
                        return (
                            <li key={s.name}>
                                <a
                                    href={s.href}
                                    target="_blank"
                                    rel="noopener noreferrer me"
                                    className="inline-flex min-h-12 items-center gap-2 rounded-full border border-white/20 px-5 font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-white/50 hover:bg-white/5"
                                >
                                    <Icon aria-hidden="true" className="h-4 w-4" />
                                    {s.name}
                                </a>
                            </li>
                        );
                    })}
                </ul>
            </div>

            <div data-reveal="scale" className="lg:col-span-6">
                <FormContact />
            </div>
        </div>
    );
}
