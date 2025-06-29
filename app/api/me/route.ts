import { BadRequestError, ConflictError, handleError, NotFoundError } from "@/lib/errors";
import { createSuccessResponse, User } from "@/lib/types";
import { withAuthentication } from "@/lib/middleware/with-auth";
import { NextRequest, NextResponse } from "next/server";
import { findUserById, findUserByUserName, updateUserById } from "@/lib/dao/users";

async function getUser(_req: NextRequest, userData: User){
    try{
        const user = await findUserById(userData.id);

        if(!user){
            throw new NotFoundError("User not found");
        }

        return NextResponse.json(createSuccessResponse(
            "User fetched successfully",
            user
        ), {status: 200})
    }catch(error){
        console.error(error)
        return handleError(error as unknown as Error);
    }
}

async function updateUser(req: NextRequest, userData: User){
    try{
        const userDto = await req.json() as {username?: string, status?: string, active?: boolean};
        
        if(!userDto.username && !userDto.status && userData.active === undefined){
            throw new BadRequestError("Invalid data");
        }

        const user = await findUserByUserName(userDto.username!);

        // If user exists with same name, return conflict response
        if(user && userData.id !== user.id){
            throw new ConflictError("Username already exists");
        }
        const data = await updateUserById(userData.id, {
            active: userDto.active ?? userData.active,
            status: userDto.status ?? userData.status,
            username: userDto.username ?? userData.username,
        })

        return NextResponse.json(createSuccessResponse(
            "Successfully updated user details",
            data
        ), {status: 200})
    }catch(error){
        console.error(error)
        return handleError(error as unknown as Error);
    }
}

export const GET = withAuthentication(getUser);
export const PATCH = withAuthentication(updateUser);