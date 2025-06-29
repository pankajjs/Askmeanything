import { BadRequestError, handleError, NotFoundError } from "@/lib/errors";
import { prisma } from "@/lib/config/prisma";
import { withAuthentication } from "@/lib/middleware/with-auth";
import { NextRequest, NextResponse } from "next/server";
import { createSuccessResponse } from "@/lib/types";
import { deleteQuestionById, findQuestionById } from "@/lib/dao/questions";

async function deleteQuestion(req: NextRequest) {
    try{
        const id = req.nextUrl.pathname.split("/")[3];
        
        if(!id){
            throw new BadRequestError("Id is required");
        }

        const question = await findQuestionById(id);

        if(!question){
            throw new NotFoundError("Question not found");
        }

        // Todo: Replace with firestore query
        await prisma.reply.delete({
            where: {
                qId: question.id,
            }
        }).catch((reason)=>{
            console.error(`Reply does not exist ${reason}`);
        })


        await deleteQuestionById(id);

        return NextResponse.json(createSuccessResponse(
            "Successfully deleted a question")
        ,{status: 200});
    }catch(error){
        console.error("Error while deleting question", error)
        return handleError(error as unknown as Error);
    }
}

export const DELETE = withAuthentication(deleteQuestion)