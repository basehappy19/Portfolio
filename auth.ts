import { betterAuth } from "better-auth";
import { APIError } from "better-auth/api";

const ALLOWED_EMAILS = (process.env.ALLOWED_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL,
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.Google_CLIENT_SECRET as string,
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

                if (!email || !ALLOWED_EMAILS.includes(email)) {
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
    session: {
        expiresIn: 60 * 60 * 24 * 7,
        updateAge: 60 * 60 * 24,
        cookieCache: {
            enabled: true,
            maxAge: 60 * 60 * 24 * 7
        }
    },
    
});
