"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";

type SessionContextType = {
    session: any | null;
    loading: boolean;
};

const SessionContext = createContext<SessionContextType>({
    session: null,
    loading: true,
});

export function SessionProvider({
    children,
    initialSession,
}: {
    children: React.ReactNode;
    initialSession: any | null;
}) {
    const [session, setSession] = useState(initialSession);
    const [loading, setLoading] = useState(!initialSession);

    useEffect(() => {
        if (initialSession) return;

        const loadSession = async () => {
            try {
                const { data } = await authClient.getSession();
                setSession(data ?? null);
            } finally {
                setLoading(false);
            }
        };

        loadSession();
    }, [initialSession]);

    return (
        <SessionContext.Provider value={{ session, loading }}>
            {children}
        </SessionContext.Provider>
    );
}

export function useSessionContext() {
    return useContext(SessionContext);
}