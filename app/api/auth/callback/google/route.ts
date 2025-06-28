import { oauth2Client } from "@/lib/config/auth-client";
import { NextRequest, NextResponse } from "next/server";
import { generateToken } from "@/lib/jwt";
import { cookies } from "next/headers";
import { config } from "@/lib/config/config";
import { createUser, findUserByEmail } from "@/lib/dao/users";

export async function GET(req: NextRequest) {
    try{
        const state = req.nextUrl.searchParams.get("state")
        if(!state){
            console.error("Failed to get state from google auth");
            return NextResponse.redirect(new URL("/", req.url))
        }

        const code = req.nextUrl.searchParams.get("code")
        if(!code){
            console.error("Failed to get code from google auth");
            return NextResponse.redirect(new URL("/", req.url))
        }
        
        const token = await oauth2Client.getToken(code)
        if(!token || !token.tokens.access_token){
            console.error("Failed to get token from google auth");
            return NextResponse.redirect(new URL("/", req.url))
        }

        const tokenInfo = await oauth2Client.getTokenInfo(token.tokens.access_token);

        if(!tokenInfo.email_verified || !tokenInfo.email){
            console.error("Email not verified");
            return NextResponse.redirect(new URL("/", req.url))
        }
        
        let user = await findUserByEmail(tokenInfo.email);
        console.log(user)
        if(!user){
            user = await createUser(tokenInfo.email);
        }
        
        console.log(user)
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
        console.error("Error while logging in", error)
        return NextResponse.redirect(new URL("/", req.url))
    }
}