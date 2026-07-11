import AchievementCarousel from '@/components/AchievementCarousel';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import Footer from '@/components/Layout/Footer';
import Navbar from '@/components/Layout/Navbar';
import ScrollToAnchor from '@/components/ScrollToAnchor';
import About from '@/components/Section/About';
import Achievement from '@/components/Section/Achievement';
import Contact from '@/components/Section/Contact';
import Home from '@/components/Section/Home';
import { getAchievementFirstImages } from '@/lib/achievement-carousel';
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
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const locale = await getLocale();

  const categorySlug =
    typeof searchParams.category === "string"
      ? searchParams.category
      : undefined;

  const images = await getAchievementFirstImages();
  function shuffleArray<T>(array: T[]): T[] {
    const arr = [...array];

    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    return arr;
  }

  const mappedImages = shuffleArray(images).map((image) => ({
    id: image.id,
    url: image.url,
    alt:
      locale === "th"
        ? image.alt_th || undefined
        : image.alt_en || undefined,
  }));

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
      
      {/* WRAPPER WITH CLEAN MINIMALIST LIGHT THEME */}
      <main className="min-h-screen font-sans bg-slate-50/60 text-slate-800 selection:bg-rose-600 selection:text-white">

        {/* SECTION 1: HOME & HERO */}
        <section id="Home" className="w-full relative bg-white border-b border-slate-200/80 pt-6 pb-14 md:py-16 transition-colors">
          <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-8 lg:px-14 xl:px-20">
            <div className="md:hidden fixed top-0 left-0 w-full z-50 flex items-center justify-center pt-4 pointer-events-none">
              <div className="pointer-events-auto shadow-sm">
                <LanguageSwitcher />
              </div>
            </div>
            <Home />
            <Navbar />
          </div>
        </section>

        {/* SECTION 2: ABOUT */}
        <section id="About" className="w-full bg-slate-50/60 scroll-mt-20 border-b border-slate-200/80 transition-colors">
          <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-8 lg:px-14 xl:px-20 py-12 md:py-16">
            <About />
          </div>
        </section>


        {/* SECTION 4: ACHIEVEMENTS */}
        <section id="Achievements" className="w-full relative overflow-hidden bg-gradient-to-b from-slate-50/90 via-white to-slate-50/90 dark:from-zinc-950 dark:via-zinc-900/60 dark:to-zinc-950 scroll-mt-20 border-b border-slate-200/80 dark:border-zinc-800 transition-colors">
          {/* Decorative Background Elements & Glowing Blobs (z-0 so clearly visible above section background) */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            {/* Top Right Glowing Rose Blob */}
            <div className="absolute -top-[10%] -right-[5%] w-[600px] h-[600px] rounded-full bg-radial from-rose-500/25 via-pink-500/10 to-transparent blur-3xl opacity-100" />
            {/* Bottom Left Glowing Amber/Indigo Blob */}
            <div className="absolute -bottom-[10%] -left-[5%] w-[600px] h-[600px] rounded-full bg-radial from-blue-500/25 via-indigo-500/10 to-transparent blur-3xl opacity-100" />
            {/* Modern Subtle Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808018_1px,transparent_1px),linear-gradient(to_bottom,#80808018_1px,transparent_1px)] bg-[size:36px_36px] [mask-image:radial-gradient(ellipse_90%_90%_at_50%_50%,#000_70%,transparent_100%)]" />
          </div>

          <div className="relative z-10">
            <AchievementCarousel
              images={mappedImages}
              locale={locale}
            />
          </div>
          <div className="max-w-[1536px] w-full mx-auto px-4 sm:px-6 lg:px-10 xl:px-14 py-14 md:py-20 relative z-10">
            <Achievement slug={categorySlug} />
          </div>
        </section>

        {/* SECTION 5: CONTACT */}
        <section id="Contact" className="w-full bg-white scroll-mt-20 transition-colors">
          <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-8 lg:px-14 xl:px-20 py-12 md:py-16">
            <Contact />
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}

