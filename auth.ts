import { betterAuth } from "better-auth";
import { APIError } from "better-auth/api";
import prisma from "@/lib/prisma";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    baseURL: process.env.NODE_ENV === "development"
        ? "http://localhost:3000"
        : (process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "https://portfolio.basehappy19.site"),
    trustedOrigins: ["https://portfolio.basehappy19.site", "http://localhost:3000"],
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            getUserInfo: async (token) => {
                const response = await fetch(
                    "https://www.googleapis.com/oauth2/v2/userinfo",
                    {
                        headers: {
                            Authorization: `Bearer ${token.accessToken}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new APIError("UNAUTHORIZED", {
                        message: "Failed to fetch user info from Google.",
                    });
                }

                const profile = await response.json();
                const email = profile.email?.toLowerCase();

                if (!email) {
                    throw new APIError("UNAUTHORIZED", {
                        message: "No email provided.",
                    });
                }

                const allowedUser = await prisma.allowedEmail.findUnique({
                    where: { email },
                });

                if (!allowedUser) {
                    throw new APIError("UNAUTHORIZED", {
                        message: "This email is not allowed to sign in.",
                    });
                }

                return {
                    user: {
                        id: profile.id,
                        name: profile.name,
                        email,
                        image: profile.picture,
                        emailVerified: profile.verified_email,
                    },
                    data: profile,
                };
            },
        },
    },
    plugins: [
        nextCookies(),
    ],
    session: {
        expiresIn: 60 * 60 * 24 * 365, // 1 year (safely under 400-day Max-Age limit)
        updateAge: 60 * 60 * 24, // refresh daily automatically
        cookieCache: {
            enabled: false
        }
    },
    rateLimit: {
        window: 60,
        max: 1000,
        customRules: {
            "/sign-in/social": {
                window: 60,
                max: 1000,
            },
            "/sign-in/*": {
                window: 60,
                max: 1000,
            },
        },
    },
    advanced: {
        trustedProxyHeaders: true,
        ipAddress: {
            ipAddressHeaders: ["cf-connecting-ip", "x-real-ip", "x-forwarded-for"],
            trustedProxies: [
                "10.0.0.0/8",
                "172.16.0.0/12",
                "192.168.0.0/16",
                "127.0.0.0/8",
                "fc00::/7",
                "::1/128"
            ],
        },
    },
});

