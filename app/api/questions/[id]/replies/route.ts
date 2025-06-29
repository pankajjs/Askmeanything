import { BadRequestError, ConflictError, handleError, NotFoundError } from "@/lib/errors";
import { createSuccessResponse, User } from "@/lib/types";
import { withAuthentication } from "@/lib/middleware/with-auth";
import { NextRequest, NextResponse } from "next/server";
import { findQuestionById, updateQuestionById } from "@/lib/dao/questions";
import { createReply } from "@/lib/dao/replies";

async function CreateReplies(req: NextRequest, _userData: User) {
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
                createdBy: question.username,
                questionId: question.id,
            })

        return NextResponse.json(createSuccessResponse("Reply created successfully", reply), {status: 201});
    }catch(error){
        console.error("Error while creating reply", error)
        return handleError(error as unknown as Error);
    }
}

export const POST = withAuthentication(CreateReplies)