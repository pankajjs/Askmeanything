import { handleError } from "@/lib/errors";
import { oauth2Client } from "@/lib/config/auth-client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try{
        const redirectUrl = req.nextUrl.searchParams.get("redirectUrl") ?? "/";
        const oauthUrl = oauth2Client.generateAuthUrl({
            access_type: "offline",
            scope: ["https://www.googleapis.com/auth/userinfo.email"],
            state: redirectUrl
        })

        return NextResponse.redirect(oauthUrl)
    }catch(error){
        console.error("Error while logging in", error)
        return handleError();
    }
}