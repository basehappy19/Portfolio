import { BadgeCheck, Briefcase, Flag, GraduationCap, HeartHandshake, Monitor, Tag, Trophy, Zap, type LucideIcon } from "lucide-react";

/** Each category gets its own colour + icon so badges are easy to tell apart. */
const STYLES: Record<string, { bg: string; icon: LucideIcon }> = {
    real_world: { bg: "#0f766e", icon: BadgeCheck },
    project: { bg: "#0369a1", icon: Monitor },
    competition: { bg: "#b45309", icon: Trophy },
    hackathon: { bg: "#6d28d9", icon: Zap },
    business: { bg: "#c2410c", icon: Briefcase },
    self_development: { bg: "#047857", icon: GraduationCap },
    activity: { bg: "#be123c", icon: HeartHandshake },
    leadership: { bg: "#334155", icon: Flag },
};

/** Display order of the filter chips. */
const ORDER = ["real_world", "project", "competition", "hackathon", "business", "leadership", "activity", "self_development"];

export function categoryRank(slug: string) {
    const i = ORDER.indexOf(slug);
    return i === -1 ? ORDER.length : i;
}

export function categoryStyle(slug: string) {
    return STYLES[slug] ?? { bg: "#3f3f46", icon: Tag };
}
