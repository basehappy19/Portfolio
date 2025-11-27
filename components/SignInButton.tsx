'use client';

import { authClient } from '@/lib/auth-client';
import { useState } from 'react';

export const SignInButton = () => {
    const [isLoading, setIsLoading] = useState(false);


    const handleLoginWithGoogle = async () => {
        setIsLoading(true);

        try {
            await authClient.signIn.social({
                provider: 'google',
                callbackURL: '/',
            });
        } catch (e) {
            console.error(e)
        }

        setIsLoading(false);
    };

    return (
        <button
            onClick={handleLoginWithGoogle}
            disabled={isLoading}
            className="group relative overflow-hidden rounded-lg bg-linear-to-r from-red-600 to-red-700 px-8 py-3 text-white font-medium shadow-lg hover:shadow-red-500/50 transition-all duration-300 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
        >
            <span className="relative z-10">
                {isLoading ? 'กำลังเข้าสู่ระบบ...' : 'Sign in with Google'}
            </span>
            <div className="absolute inset-0 bg-linear-to-r from-red-500 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </button>
    );
};