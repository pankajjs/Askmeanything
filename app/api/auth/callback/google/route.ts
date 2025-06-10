import { oauth2Client } from "@/lib/auth-client";
import { Prisma, prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { generateToken } from "@/lib/jwt";
import { cookies } from "next/headers";
import { config } from "@/lib/config";

export async function GET(req: NextRequest) {
    try{
        const state = req.nextUrl.searchParams.get("state")
        if(!state){
            console.log("Failed to get state from google auth");
            return NextResponse.redirect(new URL("/", req.url))
        }

        const code = req.nextUrl.searchParams.get("code")
        if(!code){
            console.log("Failed to get code from google auth");
            return NextResponse.redirect(new URL("/", req.url))
        }
        
        const token = await oauth2Client.getToken(code)
        if(!token || !token.tokens.access_token){
            console.log("Failed to get token from google auth");
            return
        }

        const tokenInfo = await oauth2Client.getTokenInfo(token.tokens.access_token);

        if(!tokenInfo.email_verified || !tokenInfo.email){
            console.log("Email not verified");
            return NextResponse.redirect(new URL("/", req.url))
        }

        let user = await prisma.user.findUnique({
            where: {
                email: tokenInfo.email
            }
        });

        if(!user){
            user = await prisma.user.create({
                data: {
                    email: tokenInfo.email,
                    username: tokenInfo.email.split("@")[0],
                    roles: {
                        "admin": false,
                        "user": true,
                    } as Prisma.JsonObject,
                    createdAt: Date.now(),
                    updatedAt: Date.now(),
                }
            })
        }

        const accessToken = generateToken({
            id: user.id,
        })

        const cookieStore = await cookies()
        
        cookieStore.set(config.userToken.cookieName, accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: parseInt(process.env.USER_TOKEN_TTL!)
        })

        return NextResponse.redirect(state)
    }catch(error){
        console.error(error)
        return NextResponse.redirect(new URL("/", req.url))
    }
}