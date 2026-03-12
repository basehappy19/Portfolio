"use client";

import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";

type AchievementImage = {
    id: string;
    url: string;
    alt?: string | null;
};

type Props = {
    images: AchievementImage[];
    locale?: string;
};

export default function AchievementCarousel({
    images,
    locale = "th",
}: Props) {
    const [emblaRef] = useEmblaCarousel(
        {
            loop: true,
            align: "start",
            dragFree: false,
            watchDrag: false,
        },
        [
            AutoScroll({
                speed: 1.7,
                stopOnInteraction: false,
                stopOnMouseEnter: false, 
                playOnInit: true,
            }),
        ]
    );

    if (!images?.length) return null;

    return (
        <section className="w-full">
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex gap-3">
                    {images.map((image, index) => (
                        <div
                            key={image.id}
                            className="relative min-w-[62%] sm:min-w-[38%] lg:min-w-[24%] xl:min-w-[18%]"
                        >
                            <div className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
                                <div className="relative aspect-4/3">
                                    <Image
                                        src={image.url}
                                        alt={
                                            image.alt ||
                                            (locale === "th"
                                                ? `ผลงานภาพที่ ${index + 1}`
                                                : `Portfolio image ${index + 1}`)
                                        }
                                        fill
                                        sizes="(max-width: 640px) 62vw, (max-width: 1024px) 38vw, (max-width: 1280px) 24vw, 18vw"
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        priority={index === 0}
                                    />
                                    <div className="absolute inset-0 bg-linear-to-t from-black/25 via-transparent to-transparent" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}