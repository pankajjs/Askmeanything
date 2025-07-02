import { BadRequestError, ForbiddenError, handleError } from "@/lib/errors";
import { User } from "@/lib/types";
import { withAuthentication } from "@/lib/middleware/with-auth";
import { NextRequest, NextResponse } from "next/server";
import { findRepliesByUserId } from "@/lib/dao/replies";

async function getReplies(req: NextRequest, userData: User) {
    try{
        const userId = req.nextUrl.pathname.split("/")[3];

        if(!userId){
            throw new BadRequestError("User Id is required");
        }

        if(userId !== userData.id){
            throw new ForbiddenError();
        }

        const createdAt = req.nextUrl.searchParams.get("createdBy") ?? Date.now();

        const replies = await findRepliesByUserId({
            userId,
            createdAt: Number(createdAt),
        })

        return NextResponse.json(replies, {status: 200})
    }catch(error){
        console.error("(getReplies): Error while fetching replies by user", error)
        return handleError(error as Error)
    }
}

export const GET = withAuthentication(getReplies)