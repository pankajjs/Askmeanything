const loadEnv = (key: string): string => {
    const value = process.env[key]
    if(!value){
        throw new Error(`Environment variable ${key} is not set`)
    }
    return value
}

export const config = {
    NODE_ENV: loadEnv("NODE_ENV") ?? "development",
    AUTH_GOOGLE_ID: loadEnv("AUTH_GOOGLE_ID"),
    AUTH_GOOGLE_SECRET: loadEnv("AUTH_GOOGLE_SECRET"),
    DATABASE_URL: loadEnv("DATABASE_URL"),
    CALLBACK_URL: loadEnv("CALLBACK_URL"),
    userToken :{
        privateKey: loadEnv("AUTH_PRIVATE_KEY"),
        publicKey: loadEnv("AUTH_PUBLIC_KEY"),
        ttl: 30 * 24 * 60 * 60, // in second
        refreshTtl: 45 * 24 * 60 * 60, // in second
        cookieName: "access-token",
    }
}


