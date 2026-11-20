import FadeImage from "./FadeImage";

type Img = { id: string; url: string; alt?: string };

/** Pure-CSS infinite strip of achievement photos (no JS). */
export default function AchievementMarquee({ images }: { images: Img[] }) {
    if (!images.length) return null;
    const loop = [...images, ...images];
    const duration = Math.max(40, images.length * 4);

    return (
        <div className="marquee marquee-mask overflow-hidden py-2" role="presentation">
            <ul
                className="marquee-track gap-4"
                style={{ ["--marquee-duration" as string]: `${duration}s` }}
            >
                {loop.map((img, i) => (
                    <li
                        key={`${img.id}-${i}`}
                        aria-hidden={i >= images.length}
                        className="relative h-40 w-60 shrink-0 overflow-hidden rounded-2xl bg-zinc-100 sm:h-48 sm:w-72"
                    >
                        <FadeImage
                            src={img.url}
                            alt={i < images.length ? img.alt ?? "" : ""}
                            fill
                            sizes="288px"
                            quality={60}
                            fetchPriority="low"
                            className="object-cover transition-transform duration-700 hover:scale-105"
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
}
