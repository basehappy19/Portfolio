// proxy.ts
import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const locales = ["th", "en"] as const;
type Locale = (typeof locales)[number];

// type guard ช่วยเช็คว่า string ที่เข้ามาเป็น Locale จริง ๆ
function isLocale(value: string | undefined): value is Locale {
    return !!value && (locales as readonly string[]).includes(value);
}

export default async function proxy(request: NextRequest) {
    const headerLocale = request.headers.get("th");
    const defaultLocale: Locale = headerLocale === "th" ? "th" : "en";

    const handleI18nRouting = createMiddleware({
        locales,
        defaultLocale,
    });

    const { pathname } = request.nextUrl;
    const segments = pathname.split("/").filter(Boolean);
    const maybeLocale = segments[0];

    const hasSession = !!getSessionCookie(request);

    const pathWithoutLocale = isLocale(maybeLocale)
        ? "/" + segments.slice(1).join("/")
        : pathname;

    if (pathWithoutLocale.startsWith("/admin") && !hasSession) {

        const url = new URL("/", request.url);
        return NextResponse.redirect(url);
    }

    const response = handleI18nRouting(request);
    response.headers.set("x-locale", defaultLocale);

    return response;
}

export const config = {
    matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
