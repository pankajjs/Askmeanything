import { BadRequestError, handleError, NotFoundError } from "@/lib/errors";
import { prisma } from "@/lib/config/prisma";
import { withAuthentication } from "@/lib/middleware/with-auth";
import { NextRequest, NextResponse } from "next/server";

async function deleteQuestion(req: NextRequest) {
    try{
        const id = req.nextUrl.pathname.split("/")[3];
        
        if(!id){
            return handleError(new BadRequestError("Id is required"));
        }

        const question = await prisma.question.findUnique({
            where: {
                id
            }
        })
        
        if(!question){
            return handleError(new NotFoundError("Question not found"));
        }

        await prisma.reply.delete({
            where: {
                qId: question.id,
            }
        }).catch((reason)=>{
            console.error(`Reply does not exist ${reason}`);
        })

        await prisma.question.delete({
            where: {id},
        })

        return NextResponse.json({
            message: "Successfully deleted a question",
        }, {status: 200});
    }catch(error){
        console.error("Error while deleting question", error)
        return handleError();
    }
}

export const DELETE = withAuthentication(deleteQuestion)