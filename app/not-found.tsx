import Link from "next/link";
import { anuphan } from "@/lib/fonts";

export default function GlobalNotFound() {
    return (
        <html lang="th" className={anuphan.variable}>
            <body className="bg-white text-zinc-900 antialiased">
                <main className="min-h-dvh flex flex-col items-center justify-center gap-6 px-6 text-center">
                    <p className="text-sm font-semibold text-accent">404</p>
                    <h1 className="text-4xl font-bold">ไม่พบหน้านี้ · Page not found</h1>
                    <Link href="/" className="inline-flex min-h-12 items-center rounded-xl bg-zinc-900 px-6 font-semibold text-white">
                        กลับหน้าหลัก · Back home
                    </Link>
                </main>
            </body>
        </html>
    );
}
