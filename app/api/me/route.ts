import { API_ERROR } from "@/lib/api-error";
import { User } from "@/lib/context";
import { prisma } from "@/lib/prisma";
import { withAuthentication } from "@/lib/with-auth";
import { NextRequest, NextResponse } from "next/server";

async function getUser(_req: NextRequest, userData: User){
    try{
        const user = await prisma.user.findUnique({
            where: { 
                id: userData.id,
            },
        })

        if(!user){
            return NextResponse.json({
                error: API_ERROR.NOT_FOUND.error,
                message: "User not found"
            }, {status: API_ERROR.NOT_FOUND.status})
        }

        return NextResponse.json({
            message: "User fetched successfully",
            data: user
        })
    }catch(error){
        console.error("Error while fetching user", error)
        return NextResponse.json({
            error: API_ERROR.INTERNAL_SERVER_ERROR.error,
            message: API_ERROR.INTERNAL_SERVER_ERROR.message
        }, {status: API_ERROR.INTERNAL_SERVER_ERROR.status})
    }
}

export const GET = withAuthentication(getUser);