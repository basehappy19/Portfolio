"use client";

import React from "react";
import { useSessionContext } from "@/app/contexts/SessionContext";
import { SignOutButton } from "../Button/SignOutButton";
import { SignInButton } from "../Button/SignInButton";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export default function FooterAuth() {
    const { session } = useSessionContext();

    if (!session) {
        return <SignInButton />;
    }

    return (
        <div className="flex flex-col sm:flex-row items-center gap-3 px-4 py-2.5 rounded-lg bg-slate-50 border border-slate-200 shadow-2xs">
            <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                <span className="text-xs font-medium text-slate-700">
                    {session.user?.email || "User"}
                </span>
            </div>

            <div className="flex items-center gap-2">
                <Link
                    href="/admin"
                    className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md font-semibold transition bg-rose-600 text-white shadow-2xs hover:bg-rose-700"
                >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>หน้าแอดมิน</span>
                </Link>
                <SignOutButton />
            </div>
        </div>
    );
}
