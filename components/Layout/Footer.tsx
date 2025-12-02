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
    });
    const t = await getTranslations("Index.Footer");

    return (
        <footer
            className="
                relative
                bg-gray-100 text-gray-900
                dark:bg-gray-900 dark:text-white
            "
        >
            {/* Decorative top border */}
            <div className="h-1 bg-linear-to-r from-transparent via-red-600 to-transparent"></div>

            <div className="w-full max-w-2xl md:max-w-6xl mx-auto px-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="md:col-span-2 text-center md:text-left flex flex-col items-center md:items-start">
                        <h3
                            className="
                                text-2xl font-bold mb-4
                                bg-linear-to-r from-red-500 to-red-700
                                dark:from-red-400 dark:to-red-600
                                bg-clip-text text-transparent
                            "
                        >
                            {t("Heading")}
                        </h3>

                        {session ? (
                            <div
                                className="
                                    flex flex-col md:flex-row items-center gap-4 px-4 py-2 rounded-lg
                                    bg-gray-100/80 border border-gray-200
                                    dark:bg-gray-800/60 dark:border-gray-700 dark:backdrop-blur-sm
                                "
                            >
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2">
                                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-lg shadow-green-500/30"></span>

                                        <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                            {session.user.email}
                                        </span>
                                    </div>

                                    <Link
                                        href="/admin"
                                        className="
                                            text-xs px-3 py-1 rounded-full font-medium border transition
                                            bg-blue-600/10 text-blue-700 border-blue-500/30 hover:bg-blue-600/20
                                            dark:bg-blue-600/20 dark:text-blue-300 dark:hover:bg-blue-600/30
                                        "
                                    >
                                        หน้าแอดมิน
                                    </Link>
                                </div>

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
                <div
                    className="
                        border-t flex flex-col md:flex-row items-center gap-4
                        border-gray-200
                        dark:border-gray-800
                    "
                >
                    <Copyright copyright_text={t("copyright")} />
                </div>
            </div>

            {/* Decorative linear orb */}
            <div className="hidden md:block absolute bottom-0 right-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none"></div>
        </footer>
    );
}
