import { getTranslations } from "next-intl/server";
import Copyright from "./Copyright";
import FooterAuth from "./FooterAuth";

export default async function Footer() {
  const t = await getTranslations("Index.Footer");

  return (
    <footer className="relative bg-white text-slate-800 border-t border-slate-200/80 pb-24 md:pb-8 pt-10">
      <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-8 lg:px-14 xl:px-20">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          <div className="text-center md:text-left flex flex-col items-center md:items-start">
            <h3 className="text-xl sm:text-2xl font-bold mb-1.5 text-slate-900 tracking-tight">
              {t("Heading")}
            </h3>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <FooterAuth />
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-5 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <Copyright copyright_text={t("copyright")} />
        </div>
      </div>
    </footer>
  );
}
