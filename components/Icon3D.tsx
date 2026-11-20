import Image from "next/image";
import { iconSrc } from "@/lib/achievement-icon";

export default function Icon3D({ name, size = 56, className = "" }: { name: string; size?: number; className?: string }) {
    return (
        <Image
            src={iconSrc(name)}
            alt=""
            aria-hidden="true"
            width={size}
            height={size}
            unoptimized
            className={`select-none drop-shadow-[0_10px_16px_rgba(24,24,27,0.28)] ${className}`}
            draggable={false}
        />
    );
}
