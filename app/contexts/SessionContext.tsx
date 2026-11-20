"use client";

import { createContext, useContext, useEffect, useState } from "react";

type SessionContextType = {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    initialSession: any | null;
}) {
    const [session, setSession] = useState(initialSession);
    const [loading, setLoading] = useState(!initialSession);

    useEffect(() => {
        if (initialSession) return;
        let cancelled = false;

        const loadSession = async () => {
            try {
                // loaded on demand so the auth client is not part of the first-load bundle
                const { authClient } = await import("@/lib/auth-client");
                const { data } = await authClient.getSession();
                if (!cancelled) setSession(data ?? null);
            } catch {
                if (!cancelled) setSession(null);
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        // The public pages are static; check the admin session only once the
        // browser is idle so it never competes with first paint.
        const w = window as Window & {
            requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
            cancelIdleCallback?: (id: number) => void;
        };
        let idleId: number | undefined;
        let timeoutId: ReturnType<typeof setTimeout> | undefined;
        if (w.requestIdleCallback) {
            idleId = w.requestIdleCallback(loadSession, { timeout: 3000 });
        } else {
            timeoutId = setTimeout(loadSession, 1200);
        }

        return () => {
            cancelled = true;
            if (idleId !== undefined) w.cancelIdleCallback?.(idleId);
            if (timeoutId) clearTimeout(timeoutId);
        };
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
