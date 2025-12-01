'use client';

import { Link } from '@/i18n/navigation';
import { useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';

const LanguageSwitcher = () => {
    const locale = useLocale();
    const pathname = usePathname();

    const pathWithoutLocale = pathname.replace(/^\/(th|en)(?=\/|$)/, '');

    const normalizedPath = pathWithoutLocale === '' ? '/' : pathWithoutLocale;

    return (
        <div className="inline-flex items-center rounded-full bg-white/10 p-1 border border-white/15">
            <Link
                href={normalizedPath}
                locale="th"
                scroll={false}
                className={`px-3 py-1 text-xs font-medium rounded-full transition ${locale === 'th'
                        ? 'bg-white text-black'
                        : 'text-gray-300 hover:text-white'
                    }`}
            >
                ไทย
            </Link>

            <Link
                href={normalizedPath}
                locale="en"
                scroll={false}
                className={`px-3 py-1 text-xs font-medium rounded-full transition ${locale === 'en'
                        ? 'bg-white text-black'
                        : 'text-gray-300 hover:text-white'
                    }`}
            >
                EN
            </Link>
        </div>
    );
};

export default LanguageSwitcher;
