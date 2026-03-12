import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "react-hot-toast";
import NextTopLoader from 'nextjs-toploader';
import { SessionProvider } from "./contexts/SessionContext";
import { auth } from "@/auth";
import { headers } from "next/headers";

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });
    
    return (
        <html suppressHydrationWarning>
            <body>
                <SessionProvider initialSession={session}>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
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
