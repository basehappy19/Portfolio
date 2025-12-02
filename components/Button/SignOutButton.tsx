'use client'
import { authClient } from "@/lib/auth-client";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";

export const SignOutButton = () => {
    const locale = useLocale();
    const router = useRouter();

    const handleSignOut = async () => {
        await authClient.signOut();
        router.refresh();
    };

    return (
        <button
            onClick={handleSignOut}
            className="
                cursor-pointer font-medium transition-all duration-300 hover:underline underline-offset-4
                text-red-600 hover:text-red-500
                dark:text-red-300 dark:hover:text-red-200
            "
        >
            {locale === "th" ? "ออกจากระบบ" : "Sign Out"}
        </button>
    );
};
