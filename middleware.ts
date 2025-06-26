import { NextRequest, NextResponse } from "next/server";
import { RateLimiterMemory } from "rate-limiter-flexible";

// 5 Request Per IP in 1 second and block for 5 seconds on spam
const rateLimiter = new RateLimiterMemory({
    points: 6,
    duration: 1,
    blockDuration: 5
})

export default async function middleware(req: NextRequest) {
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || (process.env.NODE_ENV === "development" ? "127.0.0.1": "");
    
    if(!ip){
        return NextResponse.json({
            msg: "IP not found"
        }, {status: 400});
    }

    try{
        await rateLimiter.consume(ip, Number(process.env.RATE_LIMIT ?? 2))
        return NextResponse.next();
    }catch(error){
        console.error("Too many request", error)
        return NextResponse.json({
            msg: "Too many request, Go touch some grass",
        }, {status: 429, headers: {
            "X-RateLimit-Reset" : "5",
            "X-RateLimit-Limit": "6"
        }})
    }
}

export const config = {
    matcher: "/api/:path*"
}