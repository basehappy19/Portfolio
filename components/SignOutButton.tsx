'use client'
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export const SignOutButton = () => {
    const router = useRouter()

    const handleSignOut = async () => {
        await authClient.signOut()
        router.refresh()
    }
    return (
        <button
            onClick={handleSignOut}
            className="text-red-300 hover:text-red-200 transition-all duration-300 font-medium hover:underline underline-offset-4"
        >
            Sign Out
        </button>
    );
};

