import { getImageProps } from "next/image";

const done = new Set<string>();

/** Warm the browser cache for a few images (e.g. when the user hovers a card). */
export function preloadImages(urls: string[], sizes: string) {
    if (typeof document === "undefined") return;
    for (const url of urls) {
        if (!url || done.has(url)) continue;
        done.add(url);
        const { props } = getImageProps({ src: url, alt: "", fill: true, sizes });
        const link = document.createElement("link");
        link.rel = "preload";
        link.as = "image";
        if (props.srcSet) link.setAttribute("imagesrcset", props.srcSet);
        link.setAttribute("imagesizes", sizes);
        link.href = props.src;
        document.head.appendChild(link);
    }
}

export const SHEET_IMAGE_SIZES = "(max-width: 768px) 88vw, 720px";
