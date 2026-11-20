import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Navbar from "@/components/Layout/Navbar";
import Footer from "@/components/Layout/Footer";
import Home from "@/components/Section/Home";
import Stats from "@/components/Section/Stats";
import About from "@/components/Section/About";
import Skills from "@/components/Section/Skills";
import Achievement from "@/components/Section/Achievement";
import Contact from "@/components/Section/Contact";
import { getAchievements } from "@/lib/achievements";
import { getAwardTier } from "@/lib/award-tier";
import { SITE_URL, SOCIAL_LINKS, NAV_SECTIONS, type NavSection } from "@/lib/site";

// Static page, refreshed in the background every hour and on every admin change.
export const revalidate = 3600;

type Params = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
    const { locale } = await params;
    const isTH = locale === "th";
    const url = `${SITE_URL}/${locale}`;
    const image = `${SITE_URL}/og/og-${isTH ? "th" : "en"}.jpg`;

    // Title & description are English on both language versions; keywords stay bilingual.
    const title = "Phakphumi Thidindam | Portfolio, Projects & Awards";
    const description =
        "Portfolio of Phakphumi Thidindam — full-stack developer, student and innovator from Thailand. Real-world systems used by 15,000+ people, national competitions, hackathons and awards.";

    return {
        title,
        description,
        keywords: [
            "Phakphumi Thidindam",
            "ภาคภูมิ ทีดินดำ",
            "Portfolio",
            "พอร์ตฟอลิโอ",
            "แฟ้มสะสมผลงาน",
            "Full-stack developer",
            "นักพัฒนาเว็บ",
            "Hackathon",
            "แฮกกาธอน",
            "Awards",
            "ผลงาน รางวัล",
            "TCAS",
            "Digital Science and Technology",
            "ICT Mahidol",
            "Thailand",
        ],
        authors: [{ name: "Phakphumi Thidindam", url: SITE_URL }],
        creator: "Phakphumi Thidindam",
        alternates: {
            canonical: url,
            languages: { th: `${SITE_URL}/th`, en: `${SITE_URL}/en`, "x-default": `${SITE_URL}/th` },
        },
        robots: {
            index: true,
            follow: true,
            googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
        },
        openGraph: {
            type: "profile",
            url,
            title,
            description,
            siteName: "Phakphumi Portfolio",
            locale: isTH ? "th_TH" : "en_US",
            alternateLocale: isTH ? ["en_US"] : ["th_TH"],
            firstName: "Phakphumi",
            lastName: "Thidindam",
            images: [{ url: image, width: 1200, height: 630, alt: title }],
        },
        twitter: { card: "summary_large_image", title, description, images: [image] },
    };
}

export default async function IndexPage({ params }: Params) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations("Index");
    const isTH = locale === "th";

    const { achievements } = await getAchievements({ offset: 0, limit: 60 });
    const awards = achievements
        .filter((a) => ["gold", "silver", "finalist", "impact"].includes(getAwardTier(a.awardLevel_th, a.awardLevel_en)))
        .map((a) => `${isTH ? a.awardLevel_th : a.awardLevel_en || a.awardLevel_th} — ${isTH ? a.title_th : a.title_en || a.title_th}`)
        .slice(0, 25);
    const skills = (t.raw("Skill.Expertise") as { Skills: { name: string }[] }[]).flatMap((g) => g.Skills.map((s) => s.name));

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "ProfilePage",
        "@id": `${SITE_URL}/${locale}#profile`,
        url: `${SITE_URL}/${locale}`,
        inLanguage: locale,
        dateModified: new Date().toISOString(),
        mainEntity: {
            "@type": "Person",
            "@id": `${SITE_URL}/#person`,
            name: t("Home.Name"),
            alternateName: isTH ? ["Phakphumi Thidindam", "เบส"] : ["ภาคภูมิ ทีดินดำ", "Base"],
            url: SITE_URL,
            image: `${SITE_URL}/profiles/me.png`,
            jobTitle: isTH ? "นักพัฒนาเว็บ Full-stack" : "Full-stack Developer",
            description: t("Home.Description").replace(/"/g, ""),
            email: "mailto:pakpoom.td@gmail.com",
            nationality: { "@type": "Country", name: "Thailand" },
            affiliation: { "@type": "EducationalOrganization", name: isTH ? "โรงเรียนภูเขียว" : "Phukhieo School" },
            knowsAbout: skills,
            award: awards,
            sameAs: SOCIAL_LINKS,
        },
    };

    const navLabels = Object.fromEntries(NAV_SECTIONS.map((id) => [id, t(`Nav.${id}`)])) as Record<NavSection, string>;

    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
            <a
                href="#main"
                className="sr-only z-[100] rounded-xl bg-zinc-900 px-4 py-3 font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
            >
                {t("Nav.SkipToContent")}
            </a>
            <div aria-hidden="true" className="scroll-progress fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-rose-500 via-accent to-indigo-500" />
            <Navbar labels={navLabels} brand="Phakphumi Portfolio" menuLabel={t("Nav.Menu")} languageLabel={t("Nav.Language")} />

            <main id="main" className="overflow-x-clip">
                <section id="Home" aria-label={t("Home.Name")} className="relative isolate overflow-hidden">
                    {/* soft animated colour fields behind the hero */}
                    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
                        <div className="anim-blob absolute -right-40 -top-10 h-[640px] w-[640px] rounded-full bg-[radial-gradient(closest-side,rgba(254,205,211,0.75),rgba(254,205,211,0))]" />
                        <div className="anim-blob absolute -bottom-24 -left-48 h-[560px] w-[560px] rounded-full bg-[radial-gradient(closest-side,rgba(186,230,253,0.6),rgba(186,230,253,0))] [animation-delay:-6s]" />
                    </div>
                    <Home />
                </section>

                <section aria-label={isTH ? "ตัวเลขสำคัญ" : "Highlights"} className="relative border-y border-zinc-200 bg-white">
                    <Stats />
                </section>

                <section id="About" className="relative scroll-mt-24 bg-white">
                    <About />
                </section>

                <section id="Skills" className="sd-expand scroll-mt-24 bg-zinc-100/70">
                    <Skills />
                </section>

                <section id="Achievements" className="scroll-mt-24">
                    <Achievement />
                </section>

                <section id="Contact" className="sd-expand relative isolate scroll-mt-24 overflow-hidden bg-zinc-950">
                    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
                        <div className="anim-blob absolute -right-48 -top-32 h-[680px] w-[680px] rounded-full bg-[radial-gradient(closest-side,rgba(225,29,72,0.32),rgba(225,29,72,0))]" />
                        <div className="anim-blob absolute -bottom-40 -left-40 h-[620px] w-[620px] rounded-full bg-[radial-gradient(closest-side,rgba(99,102,241,0.28),rgba(99,102,241,0))] [animation-delay:-8s]" />
                    </div>
                    <Contact />
                </section>
            </main>

            <Footer />
        </>
    );
}
