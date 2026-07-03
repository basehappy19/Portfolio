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
    <footer className="relative bg-white/90 dark:bg-[#12141c]/90 text-zinc-800 dark:text-zinc-100 border-t border-rose-200/60 dark:border-zinc-800 pb-24 md:pb-8 pt-12 transition-colors duration-500">
      {/* Decorative vibrant top border */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-rose-500 to-amber-500 opacity-80" />

      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-10">
          <div className="text-center md:text-left flex flex-col items-center md:items-start">
            <h3 className="text-2xl sm:text-3xl font-bold mb-3 bg-gradient-to-r from-rose-600 via-amber-500 to-rose-500 dark:from-rose-400 dark:to-amber-300 bg-clip-text text-transparent">
              {t("Heading")}
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 max-w-sm">
              Creative portfolio built with modern enterprise standards, responsive design, and bright aesthetics.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            {session ? (
              <div className="flex flex-col sm:flex-row items-center gap-3 px-5 py-3 rounded-2xl bg-rose-50/80 dark:bg-zinc-800/80 border border-rose-200/80 dark:border-zinc-700 shadow-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-sm shadow-emerald-500/50" />
                  <span className="text-xs sm:text-sm font-medium text-zinc-800 dark:text-zinc-200">
                    {session.user.email}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href="/admin"
                    className="inline-flex items-center gap-1.5 text-xs px-3.5 py-1.5 rounded-full font-semibold transition bg-rose-600 text-white shadow-sm hover:bg-rose-700 hover:shadow"
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
        <div className="pt-6 border-t border-rose-100 dark:border-zinc-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
          <Copyright copyright_text={t("copyright")} />
        </div>
      </div>

      {/* Subtle bright ambient orb */}
      <div className="absolute bottom-0 right-10 w-72 h-72 bg-amber-400/10 dark:bg-rose-500/5 rounded-full blur-3xl pointer-events-none -z-10" />
    </footer>
  );
}
