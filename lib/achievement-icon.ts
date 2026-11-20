import type { Achievement } from "@/types/Achievements";
import type { AwardTier } from "./award-tier";

/**
 * Picks an icon tile (/public/icons/works/*.svg, glyphs from Lucide – ISC) that says
 * at a glance what the work was about. First matching rule wins; tweak freely.
 */
const RULES: Array<[RegExp, string]> = [
    [/ดาวเทียม|satellite/i, "satellite"],
    [/เลือกตั้ง|สภานักเรียน|election|student council/i, "ballot"],
    [/จิตอาสา|volunteer/i, "handshake"],
    [/ดาราศาสตร์|astronom/i, "telescope"],
    [/\bstem\b/i, "testtube"],
    [/open house/i, "building"],
    [/นโยบาย|policy/i, "microphone"],
    [/โรงพยาบาล|ผู้ป่วย|hospital|patient/i, "hospital"],
    [/คะแนนสอบ|exam score/i, "memo"],
    [/รับสมัคร|admission/i, "school"],
    [/findmylocation|ทายตัวตน/i, "pin"],
    [/จราจร|traffic/i, "traffic"],
    [/chatgpt|ปัญญาประดิษฐ์|\bai\b/i, "robot"],
    [/\bweb\b|เว็บ/i, "desktop"],
    [/python|เขียนโปรแกรม|programming/i, "laptop"],
    [/วิเคราะห์ข้อมูล|data analy/i, "chart"],
    [/คุณธรรม|จริยธรรม|ethic/i, "heart"],
    [/หลักสูตร|คอร์ส|course|mooc|อบรม|training/i, "graduation"],
    [/เกม|game|roblox/i, "game"],
    [/สุนัข|\bdog/i, "dog"],
    [/ไข่|\begg/i, "egg"],
    [/ร้านค้า|retail|store/i, "store"],
    [/häagen|haagen|ไอศกรีม|ice cream|การตลาด|marketing/i, "icecream"],
    [/เกษตร|agri|farmer/i, "rice"],
    [/ขยะ|recycl|waste|คาร์บอน|carbon|\beco/i, "recycle"],
    [/ชุมชน|community|mytown/i, "houses"],
    [/learn n|โอกาสการศึกษา|อาชีพ|career/i, "link"],
    [/cyber|ไซเบอร์|security/i, "shield"],
    [/ตอบปัญหา|quiz|ict challenge/i, "brain"],
    [/metaverse|time weaver|อยุธยา/i, "hourglass"],
    [/เธียเตอร์|theat(er|re)/i, "tv"],
    [/hackathon|แฮกกาธอน|sdg/i, "rocket"],
    [/ค่าย|camp/i, "camping"],
];

const BY_CATEGORY: Record<string, string> = {
    project: "laptop",
    competition: "bullseye",
    hackathon: "rocket",
    self_development: "graduation",
    activity: "star",
    leadership: "ballot",
};

/** Icons an admin can pick for a work (key = file name in /public/icons/works). */
export const ICON_OPTIONS: Array<{ key: string; label: string }> = [
    { key: "laptop", label: "เว็บ/ระบบ" },
    { key: "desktop", label: "เว็บไซต์" },
    { key: "code", label: "เขียนโค้ด" },
    { key: "game", label: "เกม" },
    { key: "robot", label: "AI" },
    { key: "cpu", label: "IoT/ฮาร์ดแวร์" },
    { key: "satellite", label: "ดาวเทียม" },
    { key: "rocket", label: "แฮกกาธอน" },
    { key: "bulb", label: "ไอเดีย" },
    { key: "bullseye", label: "แข่งขัน" },
    { key: "trophy", label: "ถ้วยรางวัล" },
    { key: "brain", label: "ตอบปัญหา" },
    { key: "shield", label: "ไซเบอร์" },
    { key: "chart", label: "ข้อมูล" },
    { key: "presentation", label: "นำเสนอ" },
    { key: "microphone", label: "นโยบาย/พูด" },
    { key: "icecream", label: "การตลาด" },
    { key: "utensils", label: "ร้านอาหาร" },
    { key: "store", label: "ร้านค้า" },
    { key: "cart", label: "อีคอมเมิร์ซ" },
    { key: "rice", label: "เกษตร" },
    { key: "egg", label: "โรงงาน" },
    { key: "leaf", label: "ยั่งยืน" },
    { key: "recycle", label: "ขยะ/รีไซเคิล" },
    { key: "houses", label: "ชุมชน" },
    { key: "train", label: "คมนาคม" },
    { key: "traffic", label: "จราจร" },
    { key: "hospital", label: "สุขภาพ" },
    { key: "dog", label: "สัตว์" },
    { key: "testtube", label: "วิทยาศาสตร์" },
    { key: "telescope", label: "ดาราศาสตร์" },
    { key: "hourglass", label: "ประวัติศาสตร์" },
    { key: "tv", label: "ออกแบบ/สื่อ" },
    { key: "palette", label: "ศิลปะ" },
    { key: "video", label: "วิดีโอ" },
    { key: "memo", label: "เอกสาร/สอบ" },
    { key: "school", label: "โรงเรียน" },
    { key: "graduation", label: "หลักสูตร" },
    { key: "book", label: "เรียนรู้" },
    { key: "link", label: "แพลตฟอร์ม" },
    { key: "pin", label: "สถานที่" },
    { key: "users", label: "ทีม/สังคม" },
    { key: "handshake", label: "จิตอาสา" },
    { key: "heart", label: "คุณธรรม" },
    { key: "ballot", label: "เลือกตั้ง" },
    { key: "flag", label: "CTF/ธง" },
    { key: "building", label: "มหาวิทยาลัย" },
    { key: "camping", label: "ค่าย" },
    { key: "star", label: "ทั่วไป" },
];

const VALID = new Set(ICON_OPTIONS.map((o) => o.key));

export function getAchievementIcon(a: Achievement): string {
    if (a.icon && VALID.has(a.icon)) return a.icon;
    const text = `${a.title_th} ${a.title_en}`;
    for (const [re, icon] of RULES) if (re.test(text)) return icon;
    for (const c of a.categories) {
        const icon = BY_CATEGORY[c.category.slug];
        if (icon) return icon;
    }
    return "bulb";
}

/** Small award icon shown next to the award text, only for actual placings. */
export function getAwardIcon(tier: AwardTier, level: string): string | null {
    if (tier === "gold") return /เหรียญทอง|gold medal/i.test(level) ? "medal-1" : "trophy";
    if (tier === "silver") return "medal-2";
    if (/ทองแดง|bronze|อันดับ(ที่)?\s*3|third/i.test(level)) return "medal-3";
    return null;
}

export const iconSrc = (name: string) => `/icons/works/${name}.svg`;
