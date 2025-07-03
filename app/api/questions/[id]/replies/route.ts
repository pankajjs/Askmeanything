import { BadRequestError, ConflictError, handleError, NotFoundError } from "@/lib/errors";
import { User } from "@/lib/types";
import { withAuthentication } from "@/lib/middleware/with-auth";
import { NextRequest, NextResponse } from "next/server";
import { findQuestionById, updateQuestionById } from "@/lib/dao/questions";
import { createReply } from "@/lib/dao/replies";

async function createReplies(req: NextRequest, userData: User) {
    try{
        const questionId = req.nextUrl.pathname.split("/")[3];
        
        if(!questionId){
            throw new BadRequestError("Question Id is required");
        }

        const createRepliesDto = await req.json() as {data: string};
        
        if(!createRepliesDto.data){
            throw new BadRequestError("Data is required");
        }

        if(createRepliesDto.data.length > 200){
            throw new BadRequestError("Replies is too long");
        }

        const question = await findQuestionById(questionId);

        if(!question){
            throw new NotFoundError("Question not found");
        }

        if(question.answered){
            throw new ConflictError("Question already answered");
        }

        await updateQuestionById(questionId, {
            answered: true, 
        })
        
        const reply = await createReply({
                data: createRepliesDto.data,
                createdFor: question.createdBy!,
                createdBy: userData.username,
                questionId: question.id,
            })

        return NextResponse.json(reply, {status: 201});
    }catch(error){
        console.error("(createReplies): Error while creating reply", error)
        return handleError(error as Error);
    }
}

export const POST = withAuthentication(createReplies)