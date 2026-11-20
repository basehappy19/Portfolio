export type Pair = { th: string; en: string };

export const AWARD_PRESETS: Pair[] = [
    { th: "ชนะเลิศ", en: "Winner" },
    { th: "รองชนะเลิศอันดับ 1", en: "1st Runner-up" },
    { th: "รองชนะเลิศอันดับ 2", en: "2nd Runner-up" },
    { th: "เหรียญทอง", en: "Gold Medal" },
    { th: "เหรียญเงิน", en: "Silver Medal" },
    { th: "เหรียญทองแดง", en: "Bronze Medal" },
    { th: "รางวัลชมเชย", en: "Honorable Mention" },
    { th: "ผ่านเข้ารอบชิงชนะเลิศ", en: "Finalist" },
    { th: "เข้าร่วมการแข่งขัน", en: "Participant" },
];

export const LEVEL_SUFFIXES: Pair[] = [
    { th: "ระดับนานาชาติ", en: "International Level" },
    { th: "ระดับประเทศ", en: "National Level" },
    { th: "ระดับภาค", en: "Regional Level" },
    { th: "ระดับจังหวัด", en: "Provincial Level" },
    { th: "ระดับโรงเรียน", en: "School Level" },
];

/** Suggest a friendly button label from a pasted URL. */
export function labelFromUrl(url: string): Pair | null {
    let host = "";
    try {
        host = new URL(url.trim()).hostname.replace(/^www\./, "");
    } catch {
        return null;
    }
    const rules: Array<[RegExp, Pair]> = [
        [/facebook\.com|fb\.watch/, { th: "โพสต์ Facebook", en: "Facebook post" }],
        [/youtube\.com|youtu\.be/, { th: "ดูวิดีโอ", en: "Watch video" }],
        [/tiktok\.com/, { th: "วิดีโอ TikTok", en: "TikTok video" }],
        [/instagram\.com/, { th: "โพสต์ Instagram", en: "Instagram post" }],
        [/github\.com/, { th: "ซอร์สโค้ด GitHub", en: "Source code" }],
        [/drive\.google\.com|docs\.google\.com/, { th: "เอกสาร / เกียรติบัตร", en: "Document / Certificate" }],
        [/canva\.com/, { th: "สไลด์นำเสนอ", en: "Presentation" }],
        [/figma\.com/, { th: "งานออกแบบ Figma", en: "Figma design" }],
        [/roblox\.com/, { th: "เล่นเกม", en: "Play the game" }],
        [/x\.com|twitter\.com/, { th: "โพสต์", en: "Post" }],
    ];
    for (const [re, pair] of rules) if (re.test(host)) return pair;
    return { th: "เว็บไซต์ที่เกี่ยวข้อง", en: "Related website" };
}

/** Thai Buddhist-era date for display next to the date input. */
export const thaiDate = (iso: string) => {
    if (!iso) return "";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    return new Intl.DateTimeFormat("th-TH-u-ca-buddhist", { day: "numeric", month: "long", year: "numeric" }).format(d);
};

export const stripHtml = (html: string) =>
    html.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();

/** Calls the existing /api/translate route. Returns null when translation is unavailable. */
export async function translateText(text: string, isRichText = false): Promise<string | null> {
    if (!text.trim()) return "";
    try {
        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), 20000);
        const res = await fetch("/api/translate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text, isRichText }),
            signal: ctrl.signal,
        });
        clearTimeout(timer);
        if (!res.ok) return null;
        const data = await res.json();
        return typeof data.translated === "string" && data.translated.trim() ? data.translated.trim() : null;
    } catch {
        return null;
    }
}
