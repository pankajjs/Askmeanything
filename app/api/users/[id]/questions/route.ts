import { BadRequestError, ForbiddenError, handleError } from "@/lib/errors";
import { User } from "@/lib/types";
import { withAuthentication } from "@/lib/middleware/with-auth";
import { NextRequest, NextResponse } from "next/server";
import { findQuestionsByUserName } from "@/lib/dao/questions";

async function getQuestionsByUser(req: NextRequest, userData: User) {
    try{
        const userId = req.nextUrl.pathname.split("/")[3];

        if(!userId){
            throw new BadRequestError("User Id is required");
        }

        if(userId !== userData.id){
            throw new ForbiddenError();
        }

        const answered = req.nextUrl.searchParams.get("answered") == "true";
        const createdAt = req.nextUrl.searchParams.get("createdAt") ?? Date.now();
        
        const questions = await findQuestionsByUserName({
            createdFor: userData.username,
            createdAt: Number(createdAt),
            answered,
        })

        return NextResponse.json(questions, {status: 200})
    }catch(error){
        console.error("(getQuestionsByUser): Error while fetching questions by user", error)
        return handleError(error as Error);
    }
}

export const GET = withAuthentication(getQuestionsByUser)
