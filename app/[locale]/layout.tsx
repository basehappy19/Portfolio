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

/**
 * Low-power detection. Glass blur, scroll-linked effects and animated colour fields
 * are expensive without a capable GPU, so they switch off when:
 *  - the URL has ?lite=1 (and never with ?lite=0, remembered for the session),
 *  - the device has 4 or fewer CPU threads or 4 GB RAM or less, or asks to save data,
 *  - the browser renders WebGL in software (no GPU acceleration), checked when idle.
 */
const LITE_SCRIPT = `(function(){try{var d=document.documentElement,n=navigator,s=sessionStorage,q=location.search,f=null;
if(q.indexOf('lite=1')>-1)f='1';else if(q.indexOf('lite=0')>-1)f='0';
if(f)s.setItem('lite',f);else f=s.getItem('lite');
if(f==='0')return;
var lite=f==='1'||(n.hardwareConcurrency||8)<=4||(n.deviceMemory&&n.deviceMemory<=4)||(n.connection&&n.connection.saveData);
if(lite){d.classList.add('lite');return;}
var gpu=function(){try{var g=document.createElement('canvas').getContext('webgl');var r='';if(g){var e=g.getExtension('WEBGL_debug_renderer_info');r=e?g.getParameter(e.UNMASKED_RENDERER_WEBGL):'';}
if(!g||/swiftshader|llvmpipe|software|basic render|microsoft basic/i.test(r))d.classList.add('lite');}catch(e){}};
(window.requestIdleCallback||setTimeout)(gpu,{timeout:2000});}catch(e){}})();`;

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
        <html lang={locale} className={anuphan.variable} suppressHydrationWarning>
            <head>
                {/* Runs before first paint: turn on "lite" visuals on low-power machines. */}
                <script dangerouslySetInnerHTML={{ __html: LITE_SCRIPT }} />
            </head>
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
