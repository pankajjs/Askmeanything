import { oauth2Client } from "@/lib/config/auth-client";
import { NextRequest, NextResponse } from "next/server";
import { generateToken } from "@/lib/jwt";
import { cookies } from "next/headers";
import { config } from "@/lib/config/config";
import { createUser, findUserByEmail } from "@/lib/dao/users";
import { UnauthorizedError } from "@/lib/errors";

export async function GET(req: NextRequest) {
    try{
        const state = req.nextUrl.searchParams.get("state")
        
        if(!state){
            throw new UnauthorizedError("State not found");
        }

        const code = req.nextUrl.searchParams.get("code")
        
        if(!code){
            throw new UnauthorizedError("Code not found");
        }
        
        const token = await oauth2Client.getToken(code)
        
        if(!token || !token.tokens.access_token){
            throw new UnauthorizedError("Token not found");
        }

        const tokenInfo = await oauth2Client.getTokenInfo(token.tokens.access_token);

        if(!tokenInfo.email_verified || !tokenInfo.email){
            throw new UnauthorizedError("Email not verified");
        }
        
        let user = await findUserByEmail(tokenInfo.email);

        if(!user){
            user = await createUser(tokenInfo.email);
        }
        
        const accessToken = generateToken({
            id: user.id,
        })

        const cookieStore = await cookies()
        
        cookieStore.set(config.userToken.cookieName, accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: config.userToken.ttl
        })

        return NextResponse.redirect(state)
    }catch(error){
        console.error("Error while logging in", error)
        return NextResponse.redirect(new URL(`/?callback_error=${(error as Error).message}`, req.url))
    }
}