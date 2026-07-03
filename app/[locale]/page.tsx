import LanguageSwitcher from '@/components/LanguageSwitcher';
import Footer from '@/components/Layout/Footer';
import Navbar from '@/components/Layout/Navbar';
import ScrollToAnchor from '@/components/ScrollToAnchor';
import About from '@/components/Section/About';
import Achievement from '@/components/Section/Achievement';
import Contact from '@/components/Section/Contact';
import Home from '@/components/Section/Home';
import Skills from '@/components/Section/Skills';
import type { Metadata } from "next";

import { getLocale } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();

  const isTH = locale === "th";

  const title = isTH
    ? "ผลงาน & โปรไฟล์ | พอร์ตฟอลิโอของผม"
    : "Portfolio & Works | My Personal Profile";

  const description = isTH
    ? "พอร์ตฟอลิโอแสดงทักษะ ความสามารถ ผลงานรางวัล และประสบการณ์ในการทำงานของผม"
    : "A personal portfolio showcasing my skills, achievements, projects, awards, and professional experience";

  const url = process.env.NEXT_PUBLIC_APP_URL;
  const image = process.env.NEXT_PUBLIC_OG_IMAGE_URL ?? "";

  return {
    title,
    description,
    keywords: isTH
      ? [
        "พอร์ตฟอลิโอ",
        "Portfolio",
        "ผลงาน",
        "นักพัฒนา",
        "เว็บ",
        "นักออกแบบ",
        "เรซูเม่",
        "สมัครงาน"
      ]
      : [
        "Portfolio",
        "Developer",
        "Designer",
        "Projects",
        "Resume",
        "Software Engineer"
      ],

    openGraph: {
      title,
      description,
      url,
      siteName: isTH ? "พอร์ตฟอลิโอของผม" : "My Portfolio",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: isTH ? "พอร์ตฟอลิโอ" : "Portfolio"
        }
      ],
      locale: locale,
      type: "website",
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },

    alternates: {
      canonical: url,
      languages: {
        en: `${url}/en`,
        th: `${url}/th`,
      },
    },
  };
}

export default async function IndexPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const searchParams = await props.searchParams;
  const categorySlug = typeof searchParams.category === "string"
    ? searchParams.category
    : undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "mainEntity": {
      "@type": "Person",
      "name": "Full Stack Developer Portfolio",
      "description": "Professional Software Engineer & Designer Portfolio showcasing creative achievements and modern web development skills.",
      "url": process.env.NEXT_PUBLIC_APP_URL || "https://portfolio.com",
      "sameAs": []
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ScrollToAnchor />
      
      {/* GLOBAL WRAPPER WITH BRIGHT, LIVELY GRADIENT */}
      <main className="min-h-screen font-sans bg-gradient-to-b from-rose-50/90 via-amber-50/30 to-sky-50/50 dark:from-[#111318] dark:via-[#161821] dark:to-[#1b1e29] text-slate-800 dark:text-slate-100 selection:bg-rose-500 selection:text-white">

        {/* SECTION 1: HOME & HERO */}
        <section id="Home" className="w-full relative overflow-hidden bg-gradient-to-b from-rose-100/60 via-white/80 to-transparent dark:from-[#1b1f2b] dark:via-[#161821] dark:to-transparent pt-4 md:pt-10 transition-colors duration-500">
          {/* Subtle lively ambient glow shapes */}
          <div className="absolute top-10 left-1/4 w-72 h-72 bg-amber-300/20 dark:bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
          <div className="absolute top-20 right-10 w-80 h-80 bg-rose-300/20 dark:bg-rose-500/10 rounded-full blur-3xl pointer-events-none -z-10" />
          
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="md:hidden fixed top-0 left-0 w-full z-50 flex items-center justify-center pt-4 pointer-events-none">
              <div className="pointer-events-auto drop-shadow-md">
                <LanguageSwitcher />
              </div>
            </div>
            <Home />
            <Navbar />
          </div>
        </section>

        {/* SECTION 2: ABOUT */}
        <section id="About" className="w-full bg-white/70 dark:bg-[#181b22]/70 backdrop-blur-sm scroll-mt-24 border-y border-rose-100/50 dark:border-zinc-800/60 transition-colors duration-500">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
            <About />
          </div>
        </section>

        {/* SECTION 3: SKILLS */}
        <section id="Skills" className="w-full bg-gradient-to-r from-amber-50/60 via-rose-50/40 to-sky-50/60 dark:from-[#1a1d26] dark:via-[#1c1f2b] dark:to-[#1a1d26] scroll-mt-24 transition-colors duration-500">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
            <Skills />
          </div>
        </section>

        {/* SECTION 4: ACHIEVEMENTS */}
        <section id="Achievements" className="w-full bg-white/80 dark:bg-[#161821]/80 backdrop-blur-sm scroll-mt-24 border-y border-rose-100/60 dark:border-zinc-800/60 transition-colors duration-500">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
            <Achievement slug={categorySlug} />
          </div>
        </section>

        {/* SECTION 5: CONTACT */}
        <section id="Contact" className="w-full bg-gradient-to-b from-transparent via-rose-50/60 to-amber-50/70 dark:from-transparent dark:via-[#181b22] dark:to-[#14161d] scroll-mt-24 transition-colors duration-500">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
            <Contact />
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}

