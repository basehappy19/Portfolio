import { auth } from "@/auth";
import { headers } from "next/headers";
import { SignOutButton } from "../Button/SignOutButton";
import { SignInButton } from "../Button/SignInButton";
import { getTranslations } from "next-intl/server";
import Copyright from "./Copyright";
import Link from "next/link";

export default async function Footer() {
    const session = await auth.api.getSession({
        headers: await headers(),
    })
    const t = await getTranslations("Index.Footer");
    return (
        <footer className="relative bg-gray-800 text-white">
            {/* Decorative top border */}
            <div className="h-1 bg-linear-to-r from-transparent via-red-600 to-transparent"></div>

            <div className="max-w-7xl mx-auto px-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* About Section */}
                    <div className="md:col-span-2">
                        <h3 className="text-2xl font-bold mb-4 bg-linear-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
                            {t("Heading")}
                        </h3>
                        {session ? (
                            <div className="flex items-center gap-4 px-4 py-2 bg-gray-800/60 rounded-lg backdrop-blur-sm">
                                {/* Left: Online + Email + Link */}
                                <div className="flex items-center gap-3">
                                    {/* Online Dot */}
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-500/30"></span>

                                        {/* User Email */}
                                        <span className="text-gray-200 text-sm font-medium">
                                            {session.user.email}
                                        </span>
                                    </div>

                                    {/* Admin Link */}
                                    <Link
                                        href="/admin"
                                        className="text-xs px-3 py-1 rounded-full bg-blue-600/20 text-blue-300 font-medium border border-blue-500/30 hover:bg-blue-600/30 transition"
                                    >
                                        หน้าแอดมิน
                                    </Link>
                                </div>

                                {/* Right: Logout */}
                                <div>
                                    <SignOutButton />
                                </div>
                            </div>
                        ) : (
                            <SignInButton />
                        )}
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
                    <Copyright copyright_text={t("copyright")} />
                    <div className="flex gap-6 text-sm">
                        <a href="#" className="text-gray-500 hover:text-red-400 transition-colors duration-300">
                            {t("privacy")}
                        </a>
                        <a href="#" className="text-gray-500 hover:text-red-400 transition-colors duration-300">
                            {t("terms")}
                        </a>
                    </div>
                </div>
            </div>

            {/* Decorative linear orb */}
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>
        </footer>
    );
}