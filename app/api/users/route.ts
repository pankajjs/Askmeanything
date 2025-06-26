import { BadRequestError, handleError, NotFoundError } from "@/lib/errors";
import { prisma } from "@/lib/config/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try{
        const username = req.nextUrl.searchParams.get("username");
        
        if(!username){
            return handleError(new BadRequestError("Username is required"))
        }
        
        const user = await prisma.user.findFirst({
            where: {
                username: username,
            },
        })
        
        if(!user){
            return handleError(new NotFoundError("User not found"))
        }

        return NextResponse.json({
            message: "Successfully fetched user",
            data:{
                username: user.username,
                roles: user.roles,
                status: user.status,
                active: user.active
            }
        }, {status: 200})
    }catch(error){
        console.error("Error while fetching user", error)
        return handleError();
    }
}