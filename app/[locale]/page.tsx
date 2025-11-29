import LanguageSwitcher from '@/components/LanguageSwitcher';
import Footer from '@/components/Layout/Footer';
import Navbar from '@/components/Layout/Navbar';
import About from '@/components/Section/About';
import Achievement from '@/components/Section/Achievement';
import Contact from '@/components/Section/Contact';
import Home from '@/components/Section/Home';
import Skills from '@/components/Section/Skills';

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
