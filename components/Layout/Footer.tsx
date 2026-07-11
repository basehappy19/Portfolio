import { auth } from "@/auth";
import { headers } from "next/headers";
import { SignOutButton } from "../Button/SignOutButton";
import { SignInButton } from "../Button/SignInButton";
import { getTranslations } from "next-intl/server";
import Copyright from "./Copyright";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default async function Footer() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
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
            {session ? (
              <div className="flex flex-col sm:flex-row items-center gap-3 px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 shadow-2xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                  <span className="text-xs font-medium text-slate-700">
                    {session.user.email}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href="/admin"
                    className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md font-semibold transition bg-rose-600 text-white shadow-2xs hover:bg-rose-700"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>หน้าแอดมิน</span>
                  </Link>
                  <SignOutButton />
                </div>
              </div>
            ) : (
              <SignInButton />
            )}
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
