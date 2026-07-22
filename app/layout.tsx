import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "react-hot-toast";
import NextTopLoader from 'nextjs-toploader';
import { SessionProvider } from "./contexts/SessionContext";
import { auth } from "@/auth";
import { headers } from "next/headers";
import type { Metadata } from "next";

export const metadata: Metadata = {
    metadataBase: new URL("https://portfolio.basehappy19.site"),
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    
    return (
        <html suppressHydrationWarning className="light">
            <body className="bg-slate-50 text-slate-900 antialiased">
                <SessionProvider initialSession={session}>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="light"
                        forcedTheme="light"
                        disableTransitionOnChange
                    >
                        <NextTopLoader color={`#ed4a4a`} />
                        {children}
                        <Toaster position="top-right" />
                    </ThemeProvider>
                </SessionProvider>
            </body>
        </html>
    );
}
