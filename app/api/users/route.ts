import { BadRequestError, handleError, NotFoundError } from "@/lib/errors";
import { NextRequest, NextResponse } from "next/server";
import { findUserByUserName } from "@/lib/dao/users";

export async function POST(req: NextRequest) {
    try{
        const username = req.nextUrl.searchParams.get("username");
        
        if(!username){
            new BadRequestError("Username is required");
        }
        
        const user = await findUserByUserName(username!);
        
        if(!user){
            throw new NotFoundError("User not found");
        }

        return NextResponse.json({
            username: user.username,
            roles: user.roles,
            status: user.status,
            active: user.active,
        }, {status: 200})
    }catch(error){
        console.error(`(POST): `, error);
        return handleError(error as Error);
    }
}