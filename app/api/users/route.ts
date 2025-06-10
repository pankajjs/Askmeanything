import { API_ERROR } from "@/lib/api-error";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try{
        const username = req.nextUrl.searchParams.get("username");
        if(!username){
            return NextResponse.json({
                error: API_ERROR.BAD_REQUEST.error,
                message: "Username is required"
            }, {status: API_ERROR.BAD_REQUEST.status})
        }
        const user = await prisma.user.findFirst({
            where: {
                username: username,
            },
        })
        if(!user){
            return NextResponse.json({
                error: API_ERROR.NOT_FOUND.error,
                message: "User not found"
            }, {status: API_ERROR.NOT_FOUND.status})
        }
        return NextResponse.json({
            message: "User found",
            data:{
                username: user.username,
                roles: user.roles,
            }
        }, {status: 200})
    }catch(error){
        console.error("Error while fetching user", error)
        return NextResponse.json({
            error: API_ERROR.INTERNAL_SERVER_ERROR.error,
            message: API_ERROR.INTERNAL_SERVER_ERROR.message
        }, {status: API_ERROR.INTERNAL_SERVER_ERROR.status})
    }
}