import { BadRequestError, handleError } from "@/lib/errors";
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
        return NextResponse.json({
            message: "User fetched successfully",
            data: user
        })
    }catch(error){
        console.error("Error while fetching user", error)
        return handleError();
    }
}

async function updateUser(req: NextRequest, userData: User){
    try{
        const userDto = await req.json() as {username?: string, status?: string};
        
        if(!userDto.username && !userDto.status){
            return handleError(new BadRequestError("Invalid data"));
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
        return handleError();
    }
}

export const GET = withAuthentication(getUser);
export const PATCH = withAuthentication(updateUser);