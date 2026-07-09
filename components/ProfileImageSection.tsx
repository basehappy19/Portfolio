'use client'
import Image from 'next/image'
import { useEffect, useState } from 'react'

const ProfileImageSection = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(1);
    const totalImages = 3;

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev >= totalImages ? 1 : prev + 1));
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative group w-52 h-52 sm:w-60 sm:h-60 shrink-0">
            <div className="relative w-full h-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shadow-xs">
                {[1, 2, 3].map((num) => (
                    <Image
                        key={num}
                        fill
                        priority={num === 1}
                        sizes="(max-width: 640px) 208px, 240px"
                        className={`w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
                            currentImageIndex === num ? 'opacity-100 z-10' : 'opacity-0 z-0'
                        }`}
                        src={`/profiles/${num}.jpg`}
                        alt={`Profile photo ${num}`}
                    />
                ))}
            </div>
        </div>
    );
}

export default ProfileImageSection