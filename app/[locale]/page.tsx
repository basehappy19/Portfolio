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

  const baseUrl = "https://portfolio.basehappy19.site";
  const url = `${baseUrl}/${locale}`;
  const image = `${baseUrl}/profiles/me.png`;

  const title = isTH
    ? "ผลงาน & โปรไฟล์ | พอร์ตฟอลิโอของผม (Portfolio & Achievements)"
    : "Portfolio & Works | Professional Developer & Innovator Profile";

  const description = isTH
    ? "ยินดีต้อนรับสู่พอร์ตฟอลิโออย่างเป็นทางการ แสดงผลงาน รางวัลนวัตกรรม ทักษะการพัฒนาซอฟต์แวร์ และประสบการณ์การทำงานระดับมืออาชีพ"
    : "Welcome to my official portfolio showcasing innovative projects, prestigious awards, software engineering skills, and professional achievements.";

  return {
    title,
    description,
    keywords: isTH
      ? [
        "พอร์ตฟอลิโอ",
        "Portfolio",
        "ผลงาน",
        "นักพัฒนา",
        "เว็บแอปพลิเคชัน",
        "นวัตกร",
        "ซอฟต์แวร์",
        "เรซูเม่",
        "สมัครงาน"
      ]
      : [
        "Portfolio",
        "Full-Stack Developer",
        "Software Engineer",
        "Web Development",
        "Projects",
        "Awards",
        "Innovator",
        "Resume"
      ],
    authors: [{ name: "Pakpoom TD", url: baseUrl }],
    creator: "Pakpoom TD",
    publisher: "Pakpoom TD",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },

    openGraph: {
      title,
      description,
      url,
      siteName: isTH ? "พอร์ตฟอลิโอของผม" : "My Professional Portfolio",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: isTH ? "ภาพโปรไฟล์และผลงานของผม" : "Personal Portfolio & Achievements Profile Image"
        }
      ],
      locale: isTH ? "th_TH" : "en_US",
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
        en: `${baseUrl}/en`,
        th: `${baseUrl}/th`,
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
      "name": locale === "th" ? "พอร์ตฟอลิโอของผม (Pakpoom TD)" : "Pakpoom TD - Full Stack Developer Portfolio",
      "description": locale === "th" ? "พอร์ตฟอลิโอแสดงทักษะ ความสามารถ ผลงานรางวัลนวัตกรรม และประสบการณ์ในการทำงานของผม" : "Professional Software Engineer & Innovator Portfolio showcasing creative achievements and modern web development skills.",
      "url": "https://portfolio.basehappy19.site",
      "image": "https://portfolio.basehappy19.site/profiles/me.png",
      "jobTitle": "Full Stack Developer",
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
        <section id="Achievements" className="w-full bg-slate-50/60 scroll-mt-20 border-b border-slate-200/80 transition-colors">
          <AchievementCarousel
            images={mappedImages}
            locale={locale}
          />
          <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-8 lg:px-14 xl:px-20 py-12 md:py-16">
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

