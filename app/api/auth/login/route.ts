import { API_ERROR } from "@/lib/api-error";
import { oauth2Client } from "@/lib/auth-client";
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
        return NextResponse.json({
            error: API_ERROR.INTERNAL_SERVER_ERROR.error,
            message: API_ERROR.INTERNAL_SERVER_ERROR.message
        }, {status: API_ERROR.INTERNAL_SERVER_ERROR.status})
    }
}