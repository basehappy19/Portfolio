import AboutMe from '@/components/AboutMe';
import Achievement from '@/components/Achievement';
import Skills from '@/components/Skills';

export default async function IndexPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const searchParams = await props.searchParams;
  const categorySlug = typeof searchParams.category === "string"
    ? searchParams.category
    : undefined;

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-[#282c33]">
      <main className="flex min-h-screen w-full max-w-2xl md:max-w-6xl flex-col items-center justify-between py-32 md:px-0 bg-white dark:bg-[#282c33] sm:items-start space-y-16">
        <AboutMe />
        <Skills />
        <Achievement slug={categorySlug} />
      </main>
    </div>
  );
}
