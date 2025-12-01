import LanguageSwitcher from '@/components/LanguageSwitcher';
import Footer from '@/components/Layout/Footer';
import Navbar from '@/components/Layout/Navbar';
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
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-[#282c33]">
        <main className="flex w-full max-w-2xl md:max-w-6xl flex-col items-center justify-between py-8 md:px-0 bg-white dark:bg-[#282c33] sm:items-start space-y-16">
          {/* <ThemeSwitch /> */}
          <div className='md:hidden block'>
            <LanguageSwitcher />
          </div>
          <Home />
          <Navbar />
          <About />
          <Skills />
          <Achievement slug={categorySlug} />
          <Contact />
        </main>
      </div>
      <Footer />
    </>
  );
}
