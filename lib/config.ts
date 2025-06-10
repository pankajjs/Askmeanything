export const config = {
    NODE_ENV: process.env.ENV ?? "development",
    AUTH_GOOGLE_ID: process.env.AUTH_GOOGLE_ID,
    AUTH_GOOGLE_SECRET: process.env.AUTH_GOOGLE_SECRET,
    DATABASE_URL: process.env.DATABASE_URL,
    CALLBACK_URL: process.env.CALLBACK_URL,
    userToken :{
        privateKey: process.env.AUTH_PRIVATE_KEY,
        publicKey: process.env.AUTH_PUBLIC_KEY,
        ttl: 30 * 24 * 60 * 60, // in second
        refreshTtl: 45 * 24 * 60 * 60, // in second
        cookieName: "access-token",
    },
    DOMAIN: process.env.NEXT_PUBLIC_DOMAIN,
}

