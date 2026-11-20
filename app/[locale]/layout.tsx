import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { anuphan } from "@/lib/fonts";
import { SITE_URL } from "@/lib/site";
import Providers from "@/components/Providers";
import RevealObserver from "@/components/RevealObserver";

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    applicationName: "Phakphumi Portfolio",
    formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    viewportFit: "cover",
    themeColor: "#ffffff",
    colorScheme: "light",
};

export default async function LocaleLayout({
    children,
    params,
}: Readonly<{
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}>) {
    const { locale } = await params;
    if (!hasLocale(routing.locales, locale)) notFound();
    setRequestLocale(locale);

    return (
        <html lang={locale} className={anuphan.variable}>
            <body className="bg-white text-zinc-900 antialiased">
                {/* Client components here only need the locale, so no message bundle is shipped. */}
                <NextIntlClientProvider locale={locale} messages={{}}>
                    <Providers>
                        {children}
                        <RevealObserver />
                    </Providers>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
