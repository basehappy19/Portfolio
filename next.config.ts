import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
    images: {
        domains: ["via.placeholder.com"],
    },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
