"use client";

import { Link } from "@/i18n/navigation";
import { useLocale } from "next-intl";
import { usePathname, useSearchParams } from "next/navigation";

const LanguageSwitcher = () => {
    const locale = useLocale();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const queryString = searchParams.toString();
    const query = queryString ? `?${queryString}` : "";

    const pathWithoutLocale = pathname.replace(/^\/(th|en)(?=\/|$)/, "");
    const normalizedPath = pathWithoutLocale === "" ? "/" : pathWithoutLocale;

    return (
        <div
            className="
                inline-flex items-center rounded-full border p-1 transition
                bg-gray-200/60 border-gray-400/40
                dark:bg-white/10 dark:border-white/15
            "
        >
            {/* TH Button */}
            <Link
                href={`${normalizedPath}${query}`}
                locale="th"
                scroll={false}
                className={`
                    px-3 py-1 text-xs font-medium rounded-full transition
                    ${locale === "th"
                        ? `
                            bg-gray-900 text-white
                            dark:bg-white dark:text-black
                          `
                        : `
                            text-gray-700 hover:text-black
                            dark:text-gray-300 dark:hover:text-white
                          `
                    }
                `}
            >
                ไทย
            </Link>

            {/* EN Button */}
            <Link
                href={`${normalizedPath}${query}`}
                locale="en"
                scroll={false}
                className={`
                    px-3 py-1 text-xs font-medium rounded-full transition
                    ${locale === "en"
                        ? `
                            bg-gray-900 text-white
                            dark:bg-white dark:text-black
                          `
                        : `
                            text-gray-700 hover:text-black
                            dark:text-gray-300 dark:hover:text-white
                          `
                    }
                `}
            >
                EN
            </Link>
        </div>
    );
};

export default LanguageSwitcher;
