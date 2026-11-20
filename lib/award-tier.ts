export type AwardTier = "gold" | "silver" | "finalist" | "impact" | "other" | "none";

const IMPACT = /ผู้ใช้|ผู้เล่น|ผู้สมัคร|users?\b|players?\b|applicants?\b/i;
const SILVER = /รองชนะเลิศ|เหรียญเงิน|อันดับ(ที่)?\s*2|runner[- ]?up|silver|second place/i;
const FINALIST = /ทีมสุดท้าย|รอบชิง|ผ่าน(เข้า)?รอบ|\d+\s*ทีม|finalist|final round|top\s*\d+|shortlist/i;
const BRONZE = /ทองแดง|bronze|third place|อันดับ(ที่)?\s*3/i;
const GOLD_STRONG = /เหรียญทอง|best\b|award|winner|gold|first place/i;
const GOLD = /ชนะเลิศ|อันดับ(ที่)?\s*1\b/i;

export function getAwardTier(...levels: Array<string | null | undefined>): AwardTier {
    const text = levels.filter(Boolean).join(" ").trim();
    if (!text) return "none";
    if (IMPACT.test(text)) return "impact";
    if (SILVER.test(text)) return "silver";
    if (GOLD_STRONG.test(text)) return "gold";
    if (FINALIST.test(text)) return "finalist";
    if (BRONZE.test(text)) return "finalist";
    if (GOLD.test(text)) return "gold";
    return "other";
}

export const TIER_STYLE: Record<AwardTier, { bg: string; ring: string; label: { th: string; en: string } }> = {
    gold: { bg: "#a16207", ring: "rgba(250, 204, 21, 0.55)", label: { th: "รางวัล", en: "Award" } },
    silver: { bg: "#52525b", ring: "rgba(212, 212, 216, 0.7)", label: { th: "รองชนะเลิศ", en: "Runner-up" } },
    finalist: { bg: "#9a3412", ring: "rgba(251, 146, 60, 0.45)", label: { th: "เข้ารอบ", en: "Finalist" } },
    impact: { bg: "#0f766e", ring: "rgba(45, 212, 191, 0.45)", label: { th: "ใช้งานจริง", en: "Real impact" } },
    other: { bg: "#be123c", ring: "rgba(251, 113, 133, 0.45)", label: { th: "ผลงาน", en: "Work" } },
    none: { bg: "#3f3f46", ring: "rgba(161, 161, 170, 0.45)", label: { th: "ผลงาน", en: "Work" } },
};
