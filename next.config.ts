import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
    poweredByHeader: false,
    images: {
        // WebP only: AVIF is much slower to encode on first request, which made photos arrive late.
        formats: ["image/webp"],
        qualities: [60, 70, 75],
        deviceSizes: [640, 828, 1080, 1280, 1920],
        imageSizes: [32, 64, 128, 256, 384],
        minimumCacheTTL: 60 * 60 * 24 * 30,
        remotePatterns: [
            {
                protocol: "https",
                hostname: "hitwpxgophbhkmfyijht.supabase.co",
                port: "",
                pathname: "/storage/v1/object/public/achievements/**",
            },
        ],
    },
    async headers() {
        const longCache = [{ key: "Cache-Control", value: "public, max-age=604800, stale-while-revalidate=86400" }];
        return [
            { source: "/icons/:path*", headers: longCache },
            { source: "/profiles/:path*", headers: longCache },
            { source: "/og/:path*", headers: longCache },
            {
                source: "/:path*",
                headers: [
                    { key: "X-Content-Type-Options", value: "nosniff" },
                    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
                    { key: "X-Frame-Options", value: "SAMEORIGIN" },
                ],
            },
        ];
    },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
