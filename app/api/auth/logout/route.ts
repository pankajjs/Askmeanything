import { config } from "@/lib/config";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(_req: NextRequest) {
    const cookieStore = await cookies()
    cookieStore.delete(config.userToken.cookieName)
    return NextResponse.json({message: "Logged out successfully"})
}