import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "alprnjtaiosjbutpepeo.supabase.co",
                port: "",
                pathname: "/storage/v1/object/public/achievements/**",
            },
        ],
    },
    experimental: {
        serverActions: {
            bodySizeLimit: "20mb",
        },
    },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
