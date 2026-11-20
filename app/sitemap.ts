import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export const revalidate = 86400;

export default function sitemap(): MetadataRoute.Sitemap {
    const languages = { th: `${SITE_URL}/th`, en: `${SITE_URL}/en` };
    return [
        { url: `${SITE_URL}/th`, lastModified: new Date(), changeFrequency: "weekly", priority: 1, alternates: { languages } },
        { url: `${SITE_URL}/en`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9, alternates: { languages } },
    ];
}
