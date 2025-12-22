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

  return (
    <>
      <ScrollToAnchor />
      {/* GLOBAL BACKGROUND */}
      <div className="min-h-screen font-sans bg-rose-50 dark:bg-[#181b22]">

        {/* SECTION 1 */}
        <section id='Home' className="w-full bg-rose-50 dark:bg-[#20232b]">
          <div className="max-w-6xl mx-auto px-4 md:px-6 md:pt-8">

            <div className="md:hidden fixed top-0 left-0 w-full z-50 flex items-center justify-center pt-6 pointer-events-none">
              <div className="pointer-events-auto">
                <LanguageSwitcher />
              </div>
            </div>
            <Home />
            <Navbar />
          </div>
        </section>

        {/* SECTION 2 */}
        <section id='About' className="w-full bg-white dark:bg-[#181b22] scroll-mt-20">
          <div className="max-w-6xl mx-auto px-4 md:px-6 py-16">
            <About />
          </div>
        </section>

        {/* SECTION 3 */}
        <section id='Skills' className="w-full bg-slate-50 dark:bg-[#20232b] scroll-mt-20">
          <div className="max-w-6xl mx-auto px-4 md:px-6 py-16">
            <Skills />
          </div>
        </section>

        {/* SECTION 4 */}
        <section id="Achievements" className="w-full bg-white dark:bg-[#181b22] scroll-mt-20">
          <div className="max-w-6xl mx-auto px-4 md:px-6 py-16">
            <Achievement slug={categorySlug} />
          </div>
        </section>

        {/* SECTION 5 */}
        <section id='Contact' className="w-full bg-slate-50 dark:bg-[#20232b] scroll-mt-20">
          <div className="max-w-6xl mx-auto px-4 md:px-6 py-16">
            <Contact />
          </div>
        </section>

      </div>

      <Footer />
    </>
  );
}

