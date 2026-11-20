'use client';

import { authClient } from '@/lib/auth-client';
import { useState } from 'react';
import { useLocale } from 'next-intl';
import toast from 'react-hot-toast';

export const SignInButton = () => {
    const locale = useLocale();
    const [isLoading, setIsLoading] = useState(false);

    const text = locale === 'th'
        ? { signIn: 'เข้าสู่ระบบด้วย Google', loading: 'กำลังเข้าสู่ระบบ...' }
        : { signIn: 'Sign in with Google', loading: 'Signing in...' };

    const handleLoginWithGoogle = async () => {
        setIsLoading(true);

        try {
            const res = await authClient.signIn.social({
                provider: 'google',
                callbackURL: '/admin',
            });
            if (res.error) {
                toast.error(res.error.message || (locale === 'th' ? 'เข้าสู่ระบบไม่สำเร็จ หรือถูกจำกัดจำนวนครั้ง กรุณาลองใหม่ในอีกสักครู่' : 'Sign in failed or rate limited. Please try again soon.'));
            }
        } catch (e: unknown) {
            console.error(e);
            toast.error((e instanceof Error && e.message) || (locale === 'th' ? 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ' : 'An error occurred while signing in.'));
        }

        setIsLoading(false);
    };

    return (
        <button
            onClick={handleLoginWithGoogle}
            disabled={isLoading}
            className="inline-flex min-h-11 cursor-pointer items-center rounded-full border border-white/15 px-4 text-sm font-medium text-zinc-300 transition-colors hover:border-white/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
            {isLoading ? text.loading : text.signIn}
        </button>
    );
};
