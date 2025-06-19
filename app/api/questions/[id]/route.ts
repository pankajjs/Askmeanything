import { API_ERROR } from "@/lib/api-error";
import { prisma } from "@/lib/prisma";
import { withAuthentication } from "@/lib/with-auth";
import { NextRequest, NextResponse } from "next/server";

async function deleteQuestion(req: NextRequest) {
    try{
        const id = req.nextUrl.pathname.split("/")[3];
        const question = await prisma.question.findUnique({
            where: {
                id
            }
        })
        
        if(!question){
            return NextResponse.json({
                error: API_ERROR.NOT_FOUND.error,
                message: "Question not found",
            }, {
                status: API_ERROR.NOT_FOUND.status,
            })
        }

        await prisma.question.delete({
            where: {id},
        })

        return NextResponse.json({
            message: "Successfully deleted a question",
        }, {status: 200});
    }catch(error){
        console.error("Error while deleting question", error)
        return NextResponse.json({
            error: API_ERROR.INTERNAL_SERVER_ERROR.error,
            message: API_ERROR.INTERNAL_SERVER_ERROR.message
        }, {status: API_ERROR.INTERNAL_SERVER_ERROR.status})
    }
}

export const DELETE = withAuthentication(deleteQuestion)