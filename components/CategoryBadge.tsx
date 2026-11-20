import { categoryStyle } from "@/lib/category-style";

/** Solid, colour-coded category tag with its own icon. */
export default function CategoryBadge({ slug, name, size = "md" }: { slug: string; name: string; size?: "sm" | "md" }) {
    const { bg, icon: Icon } = categoryStyle(slug);
    return (
        <span
            className={`inline-flex items-center gap-1.5 rounded-full font-semibold leading-none text-white shadow-[0_6px_16px_-6px_rgba(0,0,0,0.55)] ring-1 ring-white/25 ${
                size === "sm" ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-[13px]"
            }`}
            style={{ background: bg }}
        >
            <Icon aria-hidden="true" className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} strokeWidth={2.4} />
            {name}
        </span>
    );
}
