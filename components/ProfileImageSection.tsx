'use client'
import Image from 'next/image'
import { useEffect, useState } from 'react'

const ProfileImageSection = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(1);
    const totalImages = 5;

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev >= totalImages ? 1 : prev + 1));
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative group">
            <div className="absolute -inset-1 bg-linear-to-r from-red-400 via-pink-500 to-purple-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
            <div className="relative">
                <div className="aspect-square rounded-2xl overflow-hidden bg-linear-to-br from-gray-800 to-gray-900 shadow-2xl">
                    <Image
                        fill
                        className="w-full h-full object-cover transition-all duration-700 ease-in-out transform group-hover:scale-105"
                        src={`/profiles/${currentImageIndex}.png`}
                        alt="profile"
                        key={currentImageIndex}
                    />
                </div>
                {/* Decorative Elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-red-400/10 rounded-full blur-2xl transition-all duration-700"></div>
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-400/10 rounded-full blur-2xl transition-all duration-700"></div>
            </div>
        </div>
    )
}

export default ProfileImageSection