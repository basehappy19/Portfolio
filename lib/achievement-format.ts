export const pick = (th: string | null | undefined, en: string | null | undefined, locale: string) =>
    (locale === "th" ? th || en : en || th) ?? "";

export const formatDate = (date: Date | string | null | undefined, locale: string) => {
    if (!date) return "";
    return new Intl.DateTimeFormat(locale === "th" ? "th-TH-u-ca-buddhist" : "en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "Asia/Bangkok",
    }).format(new Date(date));
};

export const formatYear = (date: Date | string | null | undefined, locale: string) => {
    if (!date) return "";
    return new Intl.DateTimeFormat(locale === "th" ? "th-TH-u-ca-buddhist" : "en-US", {
        year: "numeric",
        timeZone: "Asia/Bangkok",
    }).format(new Date(date));
};
