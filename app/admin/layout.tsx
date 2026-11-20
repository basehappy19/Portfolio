import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import { NextIntlClientProvider } from "next-intl";
import { anuphan } from "@/lib/fonts";
import { SITE_URL } from "@/lib/site";
import Providers from "@/components/Providers";

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="th" className={anuphan.variable}>
            <body className="bg-slate-50 text-slate-900 antialiased">
                <NextIntlClientProvider locale="th" messages={{}}>
                    <Providers>
                        <NextTopLoader color="#be123c" showSpinner={false} />
                        {children}
                    </Providers>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
