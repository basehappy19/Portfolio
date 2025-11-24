import { getTranslations } from 'next-intl/server';

export default async function IndexPage() {
  const t = await getTranslations('IndexPage');

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <section className="min-h-screen">1</section>
        <section className="min-h-screen">
          <h1>{t("title")}</h1>
        </section>
      </main>
    </div>
  );
}
