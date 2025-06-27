import { BadRequestError, ConflictError, handleError } from "@/lib/errors";
import { createSuccessResponse, User } from "@/lib/types";
import { prisma } from "@/lib/config/prisma";
import { withAuthentication } from "@/lib/middleware/with-auth";
import { NextRequest, NextResponse } from "next/server";

async function getUser(_req: NextRequest, userData: User){
    try{
        const user = await prisma.user.findUnique({
            where: { 
                id: userData.id,
            },
        })
        return NextResponse.json(createSuccessResponse(
            "User fetched successfully",
            user
        ), {status: 200})
    }catch(error){
        console.error("Error while fetching user", error)
        return handleError();
    }
}

async function updateUser(req: NextRequest, userData: User){
    try{
        const userDto = await req.json() as {username?: string, status?: string, active?: boolean};
        
        if(!userDto.username && !userDto.status && userData.active === undefined){
            return handleError(new BadRequestError("Invalid data"));
        }

        const user = await prisma.user.findUnique({
            where: {username: userDto.username}
        })

        // If user exists with same name, return conflict response
        if(user && userData.id !== user.id){
            return handleError(new ConflictError("Username already exists"));
        }

        const data = await prisma.user.update({
            where: {
                id: userData.id,
            },
            data: {
                status: userDto.status ?? userData.status,
                username: userDto.username ?? userData.username,
                active: userDto.active ?? false,
                updatedAt: Date.now(),
            },
            select: {
                active: true,
                status: true,
                username: true,
                updatedAt: true,
            }
        });

        return NextResponse.json(createSuccessResponse(
            "Successfully updated user details",
            data
        ), {status: 200})
    }catch(error){
        console.error("Error while updating username or status", error)
        return handleError();
    }
}

export const GET = withAuthentication(getUser);
export const PATCH = withAuthentication(updateUser);