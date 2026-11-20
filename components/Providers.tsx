"use client";

import { Toaster } from "react-hot-toast";
import { SessionProvider } from "@/app/contexts/SessionContext";

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider initialSession={null}>
            {children}
            <Toaster
                position="top-center"
                containerStyle={{ zIndex: 99999 }}
                toastOptions={{ style: { borderRadius: "14px", fontFamily: "inherit" } }}
            />
        </SessionProvider>
    );
}
