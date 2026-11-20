export const SITE_URL = "https://portfolio.basehappy19.site";
export const RESUME_URL =
    "https://drive.google.com/file/d/1OgnztJxGqy76u6Za3BI1nZAgVOe71vcP/view?usp=sharing";

export const SOCIAL_LINKS = [
    "https://github.com/basehappy19",
    "http://facebook.com/basehappy19",
    "https://www.instagram.com/base_happy19",
];

export const NAV_SECTIONS = ["Home", "About", "Skills", "Achievements", "Contact"] as const;
export type NavSection = (typeof NAV_SECTIONS)[number];
