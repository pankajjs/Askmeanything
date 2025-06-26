import { BadRequestError, ForbiddenError, handleError } from "@/lib/errors";
import { User } from "@/lib/types";
import { prisma } from "@/lib/config/prisma";
import { withAuthentication } from "@/lib/middleware/with-auth";
import { NextRequest, NextResponse } from "next/server";

async function getQuestionsByUser(req: NextRequest, userData: User) {
    try{
        const userId = req.nextUrl.pathname.split("/")[3];

        if(!userId){
            return handleError(new BadRequestError("User Id is required"))
        }

        if(userId !== userData.id){
            return handleError(new ForbiddenError());
        }

        const answered = req.nextUrl.searchParams.get("answered") == "true";
        const date = Date.now()

        const questions = await prisma.question.findMany({
            where: {
                userId: userId,
                createdAt: {
                    gte: new Date(date).setHours(0, 0, 0, 0),
                    lte: new Date(date).setHours(23, 59, 59, 999),
                },
                answered: answered,
            },
            orderBy: {
                createdAt: "desc"
            },
            omit: {
                createdBy: true,
            }
        })

        return NextResponse.json({
            message: "Questions fetched successfully",
            data: questions
        }, {status: 200})
    }catch(error){
        console.error("Error while fetching questions by user", error)
        return handleError();
    }
}

export const GET = withAuthentication(getQuestionsByUser)
