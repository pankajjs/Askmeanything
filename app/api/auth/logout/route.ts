import { API_ERROR } from "@/lib/api-error";
import { config } from "@/lib/config";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(_req: NextRequest) {
    try{
        const cookieStore = await cookies()
        cookieStore.delete(config.userToken.cookieName)
        return NextResponse.json({message: "Logged out successfully"}, {status: 200})
    }catch(error){
        console.error("Error while logging out", error)
        return NextResponse.json({
            error: API_ERROR.INTERNAL_SERVER_ERROR.error,
            message: API_ERROR.INTERNAL_SERVER_ERROR.message
        }, {status: API_ERROR.INTERNAL_SERVER_ERROR.status})
    }
}