export const config = {
    userToken :{
        ttl: 30 * 24 * 60 * 60, // in second
        refreshTtl: 45 * 24 * 60 * 60, // in second
        cookieName: "access-token",
    }
}
