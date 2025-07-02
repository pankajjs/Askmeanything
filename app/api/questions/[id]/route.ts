import { BadRequestError, handleError, NotFoundError } from "@/lib/errors";
import { withAuthentication } from "@/lib/middleware/with-auth";
import { NextRequest, NextResponse } from "next/server";
import { deleteQuestionById, findQuestionById } from "@/lib/dao/questions";
import { deleteReplyByQuestionId } from "@/lib/dao/replies";

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

        await deleteReplyByQuestionId(question.id).catch(e=>{
            console.error(e);
        });

        await deleteQuestionById(id);

        return NextResponse.json(null, {status: 204});
    }catch(error){
        console.error("(deleteQuestion): Error while deleting question", error)
        return handleError(error as Error);
    }
}

export const DELETE = withAuthentication(deleteQuestion)