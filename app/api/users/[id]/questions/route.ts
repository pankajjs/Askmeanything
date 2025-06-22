import { BadRequestError, ForbiddenError, handleError, NotFoundError } from "@/lib/errors";
import { User } from "@/lib/context";
import { prisma } from "@/lib/prisma";
import { withAuthentication } from "@/lib/with-auth";
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

        const page = Number(req.nextUrl.searchParams.get("page")) || 1;
        const limit = Number(req.nextUrl.searchParams.get("limit")) || 10;
        const currentDate = Date.now()
        const date = Number(req.nextUrl.searchParams.get("date") || currentDate);
        const answered = req.nextUrl.searchParams.get("answered") == "true";

        if(isNaN(date)){
            return handleError(new BadRequestError("Invalid date format"));
        }

        if (date > Date.now()){
            return handleError(new BadRequestError("Date can't be in the future"));
        }

        if (date < (userData.createdAt - 24 * 60 * 60 * 1000)){
            return handleError(new NotFoundError("No question found"));
        }

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
            skip: (page - 1) * limit,
            take: Math.min(limit, 100),
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
