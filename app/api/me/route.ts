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

async function updateUser(req: NextRequest, userData: User){
    try{
        const userDto = await req.json() as {username?: string, status?: string};
        
        if(!userDto.username && !userDto.status){
            return NextResponse.json({
                message: "Invalid data",
                error: API_ERROR.BAD_REQUEST.error,
            }, {status: API_ERROR.BAD_REQUEST.status})
        }
        
        const data = await prisma.user.update({
            where: {
                id: userData.id,
            },
            data: {
                status: userDto.status ?? userData.status,
                username: userDto.username ?? userData.username,
                updatedAt: Date.now(),
            },
        });

        return NextResponse.json({
            message: "Successfully updated user details",
            data,
        })
    }catch(error){
        console.error("Error while updating username or status", error)
        return NextResponse.json({
            error: API_ERROR.INTERNAL_SERVER_ERROR.error,
            message: API_ERROR.INTERNAL_SERVER_ERROR.message,
        }, {status: API_ERROR.INTERNAL_SERVER_ERROR.status})
    }
}

export const GET = withAuthentication(getUser);
export const PATCH = withAuthentication(updateUser);