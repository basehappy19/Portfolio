'use client'
import { useEffect, useState } from 'react'

const AnimatedRole = ({ roles }: { roles: string[] }) => {
    const [currentRole, setCurrentRole] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentRole((prev) => (prev + 1) % roles.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);
    return (
        <div className="h-16 md:h-20">
            <p className="text-2xl md:text-4xl text-white/80 font-medium transition-all duration-500">
                {roles[currentRole]}
            </p>
            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                }
                @keyframes scroll {
                    0% { transform: translateY(0); opacity: 1; }
                    100% { transform: translateY(10px); opacity: 0; }
                }
                @keyframes fade-in {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-float {
                    animation: float ease-in-out infinite;
                }
                .animate-scroll {
                    animation: scroll 1.5s ease-in-out infinite;
                }
                .animate-fade-in {
                    animation: fade-in 0.6s ease-out;
                }
            `}</style>
        </div>
    )
}

export default AnimatedRole