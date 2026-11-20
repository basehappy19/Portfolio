"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

/**
 * next/image that shows a soft shimmer until the photo has arrived, then fades it in.
 * Avoids the "empty grey box, then pop" feeling on slow connections.
 */
export default function FadeImage({ className = "", onLoad, alt, ...props }: ImageProps) {
    const [loaded, setLoaded] = useState(false);
    return (
        <>
            {!loaded && <span aria-hidden="true" className="img-skeleton absolute inset-0" />}
            <Image
                {...props}
                alt={alt}
                onLoad={(e) => {
                    setLoaded(true);
                    onLoad?.(e);
                }}
                className={`${className} transition-[opacity,filter,transform] duration-700 ease-out ${
                    loaded ? "opacity-100 blur-0" : "opacity-0 blur-md"
                }`}
            />
        </>
    );
}
