'use client';

import { authClient } from '@/lib/auth-client';
import { useState } from 'react';
import { useLocale } from 'next-intl';

export const SignInButton = () => {
    const locale = useLocale();
    const [isLoading, setIsLoading] = useState(false);

    const text = locale === 'th'
        ? { signIn: 'เข้าสู่ระบบด้วย Google', loading: 'กำลังเข้าสู่ระบบ...' }
        : { signIn: 'Sign in with Google', loading: 'Signing in...' };

    const handleLoginWithGoogle = async () => {
        setIsLoading(true);

        try {
            await authClient.signIn.social({
                provider: 'google',
                callbackURL: '/admin',
            });
        } catch (e) {
            console.error(e);
        }

        setIsLoading(false);
    };

    return (
        <button
            onClick={handleLoginWithGoogle}
            disabled={isLoading}
            className="cursor-pointer group relative overflow-hidden rounded-lg bg-linear-to-r from-red-600 to-red-700 px-8 py-3 text-white font-medium shadow-lg hover:shadow-red-500/50 transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
            <span className="relative z-10">
                {isLoading ? text.loading : text.signIn}
            </span>
            <div className="absolute inset-0 bg-linear-to-r from-red-500 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </button>
    );
};
