import { handleError } from "@/lib/errors";
import { config } from "@/lib/config/config";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(_req: NextRequest) {
    try{
        const cookieStore = await cookies()
        cookieStore.delete(config.userToken.cookieName)
        return NextResponse.json({message: "Logged out successfully"}, {status: 200})
    }catch(error){
        console.error("Error while logging out", error)
        return handleError();
    }
}