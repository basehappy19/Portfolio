import { getTranslations } from 'next-intl/server';

export default async function IndexPage() {
  const t = await getTranslations('Index');

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-4xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <section className="min-h-screen border w-full">
          <div>
            <span className='text-4xl font-bold mr-2 text-red-400'>/</span>
            <span>{t("AboutMe.Heading_1")}</span>
          </div>
        </section>
        <section className="min-h-screen border w-full">
          <div>
            <span className='text-4xl font-bold mr-2 text-red-400'>/</span>
            <span>{t("Skills.Heading_1")}</span>
          </div>
        </section>
      </main>
    </div>
  );
}
