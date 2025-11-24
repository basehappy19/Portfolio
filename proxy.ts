import createMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";

export default async function proxy(request: NextRequest) {
    const headerLocale = request.headers.get("th"); // ตรงนี้ชื่อ header แอบแปลกนะ ปกติจะใช้ 'accept-language' หรือ header custom เช่น 'x-locale'

    // แปลง string → union type แบบชัดเจน
    const defaultLocale: "th" | "en" = headerLocale === "th" ? "th" : "en";

    const handleI18nRouting = createMiddleware({
        locales: ["th", "en"],
        defaultLocale,
    });

    const response = handleI18nRouting(request);

    response.headers.set("x-locale", defaultLocale); // ตั้งชื่อ header ใหม่จะชัดกว่า 'th'

    return response;
}

export const config = {
    matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
